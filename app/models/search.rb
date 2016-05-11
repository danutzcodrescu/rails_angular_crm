class Search
    attr_reader :result
    
    def initialize(values)
        criteria=search_terms(values)
        #criteria[0] is the prepared sql, while criteria[1] is the placeholders hash
        case (values['type'])
            when "extended"
               #we do a select with a subselect where are the criteria are parsed
               #example: SELECT  "contacts".* FROM "contacts" WHERE "contacts"."id" IN (SELECT "contacts"."id" FROM "contacts" WHERE (first_name = 'Mark' OR first_name = 'Jack')) LIMIT 10
               @result=Object.const_get(model(values["controller"]))
                        .where(id:Object.const_get(model(values["controller"])).select("id")
                        .where(criteria[0], criteria[1])).limit(values["limit"]).offset(values["offset"]);
            when "constrained"
                ids=Object.const_get(model(values["controller"])).select("id") .where(criteria[0], criteria[1])
                array=[]
                ids.to_a.map {|value| array << value["id"]}
                strings=array.join(',')
                @result=Object.const_get(model(values["controller"]))
                        .where(criteria[0], criteria[1]).limit(values["limit"]).offset(values["offset"]);
            else
               @result=Object.const_get(model(values["controller"])).where(criteria[0], criteria[1]).limit(values["limit"]).offset(values["offset"])
        end         
       
=begin
    in order to create the constraint we have to first do the var1=Contact.select("id").where(criteria, placeholder)
    then: b=[]; var1.to_a.map {|value| b <<value["id"]}; var2=b.join(',')
    then: Contact.where("id IN (#{var2}) ...criteria'", placeholder)
=end
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
        criteria=""
        placeholder={}
        where=[]
        #x is used to create the unique placeholders
        x=0
        case (values["type"])
            when "extended"
                values['keywords'].each do |value|
                    #transform the string into an object
                    object=JSON.parse(value, {:symbolize_names=>true})
                    criteria+=" OR "
                    #iterate over the hash properties and skip over limit
                    object.except(:limit).each do |keys, values|
                        criteria+= "#{keys} = :#{keys}#{x} AND "
                        # key and x one close to each other are used to define unique placeholders
                        placeholder[:"#{keys}#{x}"]= "#{values}"
                    end
                    x+=1
                    #slice the final AND
                    criteria=criteria.slice(0, criteria.length-5)
                end
                #slice the initial OR
                criteria=criteria.slice(4, criteria.length-1)
            when "constrained"
                values['keywords'].each do |value|
                    #transform the string into an object
                    object=JSON.parse(value, {:symbolize_names=>true})
                    criteria+=" OR "
                    #iterate over the hash properties and skip over limit
                    object.except(:limit).each do |keys, values|
                        criteria+= "#{keys} = :#{keys}#{x} AND "
                        # key and x one close to each other are used to define unique placeholders
                        placeholder[:"#{keys}#{x}"]= "#{values}"
                    end
                    x+=1
                    #slice the final AND
                    criteria=criteria.slice(0, criteria.length-5)
                end
                #slice the initial OR
                criteria=criteria.slice(4, criteria.length-1)
            else 
                values.each do |key, value|
                    #skip over no-properties keys like limit, offset; the rest are keys provided for syncronous calls with rails
                    keys=["utf8", "commit", "action", "controller", "limit", "offset", "format"]
                    if (keys.include?(key) or value=="")
                        next
                    end
                    # the correct way to pass parameters as array is parameter[], however the value will be an array
                    # in order to decide if it the placeholder is equal to a single value or an array it has to be checked if value is an array 
                    criteria+= value.kind_of?(Array) ?  "#{key} IN (:#{key}) AND " :  "#{key} = :#{key} AND "
                    
                    # For Postman query in order to provide an array the parameter will be an array of lenght 1 with all the values stuffed inside index 0. 
                    # As a result, the string array[0] has to transformed into an array
                    # placeholder[:"#{key}"]= value.kind_of?(Array) ? value[0].split(",") : "#{value}"
                    
                    # for angular no need for spliting because we are creating and array based on existing keywords and pushing to it other elements
                    placeholder[:"#{key}"]= value.kind_of?(Array) ? value : "#{value}"
                end
                #slice the final AND
                criteria=criteria.slice(0, criteria.length-5)
        end
        where[0]=criteria
        where[1]=placeholder
        where
    end
    
end