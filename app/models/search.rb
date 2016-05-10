class Search
    attr_reader :result
    
    def initialize(values)
        criteria=search_terms(values)
        #criteria[0] is the prepared sql, while criteria[1] is the placeholders hash
        @result=Object.const_get(model(values["controller"])).where(criteria[0], criteria[1]).limit(values["limit"]).offset(values["offset"])
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
        x=0
        values.each do |key, value|
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
            x+=1
        end
        where[0]=criteria.slice(0, criteria.length-5)
        where[1]=placeholder
        where
    end
    
end