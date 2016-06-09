class Search
    attr_reader :result
    
    def initialize(values)
        criteria=[]
        criteria=search_terms(values) unless values['type']=="constrained" || values['type']=="constrainExtended"
        #criteria[0] is the prepared sql, while criteria[1] is the placeholders hash
        case (values['type'])
            when "extended"
               #we do a select with a subselect where are the criteria are parsed
               #example: SELECT  "contacts".* FROM "contacts" WHERE "contacts"."id" IN (SELECT "contacts"."id" FROM "contacts" WHERE (first_name = 'Mark' OR first_name = 'Jack')) LIMIT 10
               @result=Object.const_get(model(values["controller"]))
                        .where(id:Object.const_get(model(values["controller"])).select("id")
                        .where(criteria[0], criteria[1])).limit(values["limit"]).offset(values["offset"]);
            when "constrained"
               criteria=multipleSelects(values["controller"], values)
               @result=Object.const_get(model(values["controller"]))
                     .where(criteria[2], criteria[3]).limit(values["limit"]).offset(values["offset"]);
            when "constrainExtended" 
               criteria=multipleSelects(values["controller"], values)
               @result=Object.const_get(model(values["controller"]))
                     .where(criteria[2], criteria[3]).limit(values["limit"]).offset(values["offset"]);
            else
               @result=Object.const_get(model(values["controller"])).where(criteria[0], criteria[1]).limit(values["limit"]).offset(values["offset"])
        end         
       

    end
    
    def query
        array=[]
        #transform the active record object to an array that can be iterated
        @result.to_a.map do |row|
            array << row
        end
        array
    end
    
    def model (param)
        model=param.slice(0,param.length-1)
        model.capitalize
        #remove the final 's' from the model and capitalize it so that it can be used for further method chaining
    end
    
    def search_terms (values) 
        where=[]
        case (values["type"])
            when "extended"
                statement=createStatement(values['keywords'])
            when "constrained"
                statement=createStatement(values['keywords'], values["constraints"])
            when "constrainExtended"
                 statement=createStatement(values['keywords'], values["constraints"], nil, values["constrainKeywords"])   
            else
                statement=createStatement(nil, nil, values, nil)
        end
        where[0]=statement[0]
        where[1]=statement[1]
        if (values["type"]=="constrained" || values["type"]=="constrainExtended")
            where[2] = statement[2]
            where[3] = statement[3]
        end
        where
    end
    
    def createStatement (keywords=nil, constraints=nil, simple=nil, constrainKeywords=nil)
        returned=[]
        criteria=""
        placeholder={}
        #x is used to create the unique placeholders
        x=0
        if (simple!=nil)
            simple.each do |key, value|
                #skip over no-properties keys like limit, offset; the rest are keys provided for syncronous calls with rails
                keys=["utf8", "commit", "action", "controller", "limit", "offset", "format"]
                if (keys.include?(key) or value=="")
                    next
                end
                
                criteria+= "#{key} = :#{key} AND "
                
                placeholder[:"#{key}"]= "#{value}"
            end
            #slice the final AND
            criteria=criteria.slice(0, criteria.length-5)
        else
            # extended
          
            keywords.each do |value|
                #transform the string into an object
                
                object=JSON.parse(value, {:symbolize_names=>true})
                criteria+=" OR "
                y="a"
                #iterate over the hash properties and skip over limit
                object.except(:limit).each do |keys, values|
                    if keys==:keywords || keys==:constraint
                        criteria+="("
                        y.next!
                        if keys==:keywords
                            criteria+="("
                            values.except(:limit).each do |id, val|
                                criteria+="#{id} = :#{id}#{y} OR "
                                placeholder[:"#{id}#{y}"]= "#{val}"
                               
                                # y is instanciated as a, next will transform in b , c, d and so on
                            end
                            criteria=criteria.slice(0, criteria.length-4)
                            criteria+=") AND "
                        else
                            values.except(:limit).each do |id, val|
                                criteria+="#{id} = :#{id}#{y} AND "
                                placeholder[:"#{id}#{y}"]= "#{val}"
                                y.next!
                                # y is instanciated as a, next will transform in b , c, d and so on
                            end
                        end
                        criteria=criteria.slice(0, criteria.length-5)
                        criteria+=")"
                    else
                        criteria+= "#{keys} = :#{keys}#{x} AND "
                        # key and x one close to each other are used to define unique placeholders
                        placeholder[:"#{keys}#{x}"]= "#{values}"
                    end
                   
                end
                x+=1
                #slice the final AND
                criteria=criteria.slice(0, criteria.length-5)
            end
               
            criteria=criteria.slice(4, criteria.length-1)
            # constrained || extended constraint
            if (constraints!=nil)
                statementCreator={}
                if (constrainKeywords!=nil)
                     statementCreator[:constrainKeywords]=constrainKeywords
                end
                statementCreator[:constraints]=constraints
                constrained=""
                placeholderConstraint={}
                statementCreator.each do |key, value|
                    value.each do |value|
                        object=JSON.parse(value, {:symbolize_names=>true})
                        object.except(:limit).each do |keys, values|
                            constrained+= "#{keys} = :#{keys}#{x} AND "
                            # key and x one close to each other are used to define unique placeholders
                            placeholderConstraint[:"#{keys}#{x}"]= "#{values}"
                            x+=1
                        end
                    end
                    constrained=constrained.slice(0, constrained.length-5)
                    constrained+=" OR "

                end
                constrained=constrained.slice(0, constrained.length-4)
                constrained+=" AND "
            end
        end  
        returned = constraints==nil  ? [criteria, placeholder] : [criteria, placeholder, constrained, placeholderConstraint]
    end
    
    def multipleSelects(controller, values)
        criteria=search_terms(values)
        #first select the ids from the keywords
        #then convert them to an array and to a string in order to be inserted inside the IN statement
        ids=Object.const_get(model(controller)).select("id") .where(criteria[0], criteria[1])
        array=[]
        ids.to_a.map {|value| array << value["id"]}
        strings=array.join(',')
        criteria[2] += "ID IN (#{strings})"
        #execute the sql stament: SELECT  "contacts".* FROM "contacts" WHERE "contacts"."id" IN (1,22,54) AND first_name='Test' Limit 10"
        #it is not the safest solution, but if we use the placeholder it adds extra '' and the statement is not parsed
        criteria
    end
end