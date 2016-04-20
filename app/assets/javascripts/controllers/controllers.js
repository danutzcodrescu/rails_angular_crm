app.controller('PageController', ['$scope', '$window', function($scope, $window) {
  page=this;
  page.size=$window.innerWidth;
  page.message = false;
  
  //determine the width of the menu and the other container depending whether it is open or not, but this does not apply to mobiles
  page.menu_width = function() {
    return {width: page.message ? ( page.size>=768 ? '160px' : '' ) : ( page.size>=768 ? '80px' : '')}
  };
  page.container_width = function() {
    return {width: page.message ? (page.size>=768 ? size-160+'px' : '') : (page.size>=768 ? page.size-80+'px' : '')}
  }; 
  
  // remove this function after implementation - just for testing purposes                       
  $window.onresize = function () {
      page.size=$window.innerWidth;
      $scope.$apply();
  };
}]);    

app.controller('ContactsController', ['$scope', 'contactFactory', 'contacts', '$state', '$timeout', '$rootScope', function($scope, contactFactory, contacts, $state, $timeout, $rootScope) {
  var contact=this;
  contact.contacts=contacts;
  
  // declare the offset counter
  var offset=10;
  
  // infinite-scroll function
  contact.loadMore=function() {
    contactFactory.getContact().query({limit: 10, offset: offset}, 
      function(response){
        var array=response;
        /*concatenate the array resulted from query factory with the existing array
          in order to generate the infinite list of contcts; without concatenation
          the existing array will be replaced with the new data
        */
        contact.contacts=contact.contacts.concat(array);
      })
      offset+=10;
  };
  
  contact.go=function(id) {
     $state.go('contacts.contact-detail', {id:id});
     $timeout(function(){
          //boardcast will available to every listener
        $rootScope.$broadcast('myCustomEvent', {
  someProp: 'Sending you an Object!' // send whatever you want
});
        });
     
  }

}]);

app.controller('ContactController', ['$scope', 'one_contact', function($scope, one_contact) {
  var contact=this;
  contact.contact=one_contact;
  
     

   $scope.$on('myCustomEvent', function (event, data) {
  alert(data.someProp); // 'Data to send'
});
}]);

