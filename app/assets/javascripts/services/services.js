app.factory('contactFactory', ['$resource', 'baseURL', function($resource,baseURL) {
    var contact={}
    var resource=$resource(baseURL + "contacts.json/")
    contact.getContact=function(){
        return resource;
    }
    return contact
}]);