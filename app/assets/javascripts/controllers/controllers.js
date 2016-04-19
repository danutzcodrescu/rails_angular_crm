app.controller('PageController', ['$scope', '$window', function($scope, $window) {
  var page=this;
  this.size=$window.innerWidth;
  this.message = false;
  this.menu_width = function() {
    return {width: this.message ? ( this.size>=768 ? '160px' : '' ) : ( this.size>=768 ? '80px' : '')}
  };
  this.container_width = function() {
    return {width: this.message ? (this.size>=768 ? size-160+'px' : '') : (this.size>=768 ? this.size-80+'px' : '')}
  }; 
                         
  // remove this function after implementation - just for testing purposes                       
  $window.onresize = function () {
      page.size=$window.innerWidth;
      $scope.$apply();
  };
}]);    
app.controller('ContactsController', ['contacts', '$scope', function(contacts, $scope) {
  contact=this;
  /*contactFactory.getContact().query({limit:3},
       function(response) {
         contact.contacts=response;
       }, 
       function(response) {
         console.log(response.statusText);
       });*/
  contact.contacts=contacts;
}]);

app.controller('ContactController', ['$scope', '$stateParams', function($scope, $stateParams) {
  contact=this;
/*parameter="show";
  contactFactory.getContact(parameter).get({id:parseInt($stateParams.id)},
       function(response) {
         contact.contact=response;
         console.log($state.current.name);
       }, 
       function(response) {
         console.log(response.statusText);
       });*/
    contact.contact=$scope.contact.contacts[$stateParams.id];
}]);

