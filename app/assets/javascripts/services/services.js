app.factory('contactFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    var contact={}
    contact.getContact=function(parameter){
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

app.service('scrollToElementService', ['$location', '$anchorScroll', '$timeout', function($location, $anchorScroll, $timeout) {
   this.scroll = function(index) { 
       return $timeout(function(index) {
          $location.hash(index);
          $anchorScroll();
        }, 10);
   }
}])