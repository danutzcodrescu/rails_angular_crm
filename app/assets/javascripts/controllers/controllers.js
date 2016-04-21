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

app.controller('ContactsController', ['$scope', 'contactFactory', 'contacts', 'index', '$timeout', function($scope, contactFactory, contacts, index, $timeout) {
  var contact=this;
  contact.contacts=contacts;
  
  // declare the offset counter according to the length of what comes from the resolve
  // there might be variations of what comes from the resolve because of the infinite scrolling in the details page
  
  var offset=contacts.length;
  if (index!=null) {
    // it is required timeout otherwise it will not scroll because nothing is rendered yet. 
    // without minimum 10ms timeout the window seems too freeze for 1ms 
    $timeout(function() {
      $("html, body").scrollTop($("#"+index).offset().top-30)}, 10);
  }
  
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
     $state.go('contacts.contact-detail', {id:id, contacts:contact.contacts});
  }

}]);

app.controller('ContactController', ['$scope', 'one_contact', 'contacts_array', 'index', 'contactFactory', function($scope, one_contact, contacts_array, index, contactFactory) {
  var contact=this;
  contact.contact=one_contact;
  contact.all=null;
  contact.check_array=false;
  if (contacts_array!=null && index!=null) {
    contact.check_array=true;
    contact.all=contacts_array;
    contact.index= index;
    
    //set previous to empty string when index 0, otherwise it will generate error because of undefined and the first element of the array will never be shown
    
    contact.previous=index==0 ? "" : contacts_array[index-1].id;
    
    //add to the queue more contacts
    if (index>=contacts_array.length-3) {
      var offset=contacts_array.length;
      contactFactory.getContact().query({limit:5, offset:offset}, 
        function(response) {
          contact.all=contact.all.concat(response);
          contact.next = index==contact.all.length-1 ? 0 : contact.all[index+1].id;
        }, function(error) {
          console.log(error.responseText);
        })
    } else {
        contact.next = index==contacts_array.length-1 ? 0 : contacts_array[index+1].id;
    }
  }
  
}]);

app.controller('searchContactController', ['contacts_array', 'one_contact', 'origin', '$state', function(contacts_array, one_contact, origin, $state){
  var search=this;
  search.contacts=contacts_array;
  search.one=one_contact;
  search.origin=origin;
  search.back=function() {
    if (origin=="all") {
      $state.go("contacts", {contacts_array:contacts_array});
    }  else {
      $state.go("contacts.contact-detail", {contacts:contacts_array,index:one_contact.index, id:one_contact.id});
    }
  }
  console.log(search.contacts);
  console.log(search.origin);
}])

