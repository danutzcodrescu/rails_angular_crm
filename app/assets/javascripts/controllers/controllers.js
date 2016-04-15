app.controller('PageController', ['contactFactory','$scope', '$window', function(contactFactory,$scope, $window) {
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
app.controller('ContactController', ['contactFactory', '$stateParams', function(contactFactory, $stateParams) {
  contact=this;
  contactFactory.getContact().query(
       {limit:2, offset:0},
       function(response) {
         contact.contacts=response;
       }, 
       function(response) {
         console.log(response.statusText);
       });
}]);