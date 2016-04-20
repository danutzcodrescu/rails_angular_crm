app.factory('contactFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    var contact={}
    contact.getContact=function(){
        switch (true) {
            case parameter == undefined :
                var resource=$resource(baseURL + "contacts.json/");
                break;
            case parameter == "show" :
                var resource=$resource(baseURL + "contacts/:id.json");
                break;
        }
        return resource;
    }
    return contact
}]);