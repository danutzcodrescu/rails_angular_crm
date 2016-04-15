class Search
    attr_reader :result
    
    def initialize(values)
        criteria=search_terms(values)
        @result=Object.const_get(model(values["controller"])).where(criteria[0], criteria[1]).limit(values["limit"]).offset(values["offset"])
    end
    
    def query
        array=[]
        @result.to_a.map do |row|
            array << row
        end
        array
    end
    
    def model (param)
        model=param.slice(0,param.length-1)
        model.capitalize
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
            criteria+="#{key} = :#{key} AND "
            placeholder[:"#{key}"]= "#{value}"
            x+=1
        end
        where[0]=criteria.slice(0, criteria.length-5)
        where[1]=placeholder
        return where
    end
    
end