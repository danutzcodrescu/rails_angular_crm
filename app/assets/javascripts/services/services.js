app.factory('contactFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    var contact={}
    var resource=$resource(baseURL + "contacts.json/")
    contact.getContact=function(parameter){
        return resource;
    }
    return contact
}]);