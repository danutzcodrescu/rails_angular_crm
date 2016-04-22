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

app.controller('ContactsController', ['contactFactory', 'contacts', 'index', '$timeout', '$window', '$state', 'keywords', function(contactFactory, contacts, index, $timeout, $window, $state, keywords) {
  var contact=this;
  contact.contacts=contacts;
  
  // declare the offset counter according to the length of what comes from the resolve
  // there might be variations of what comes from the resolve because of the infinite scrolling in the details page
  contact.keywords=keywords;
  var offset=contacts.length;
  if (index!=null) {
    // it is required timeout otherwise it will not scroll because nothing is rendered yet. 
    // without minimum 10ms timeout the window seems too freeze for 1ms 
    $timeout(function() {
      $("html, body").scrollTop($("#"+index).offset().top-30)}
    , 100);
  }
  var infiniteStop=contacts.length < 5 ? true : false;
  // infinite-scroll function
  contact.loadMore=function() {
    
    // stop the function if there are no more additional records to be added
    if (infiniteStop) {
      return false;
    }
    if (keywords==null) {
      contactFactory.getContact().query({limit: 10, offset: offset}, 
        function(response){
          var array=response;
          
          // stop the infinite loop of empty queries with offset         
          if (array.length==0) {
            infiniteStop = true;
            return false;
          }
          
           /*concatenate the array resulted from query factory with the existing array
            in order to generate the infinite list of contcts; without concatenation
            the existing array will be replaced with the new data
          */
          contact.contacts=contact.contacts.concat(array);
      })
      offset+=10;
    } else {
       keywords.limit=10;
       keywords.offset=offset;
       contactFactory.getContact().query(keywords, 
        function(response){
          var array=response;
          if (array.length==0) {
            infiniteStop = true;
            return false;
          }
          contact.contacts=contact.contacts.concat(array);
        })
       offset+=10;
    }  
  };
console.log(keywords);
console.log(contacts);  
  $window.onkeydown=function(event) {
      if (event.keyCode==70 && event.ctrlKey || event.keyCode==70 && event.metaKey) {
        event.preventDefault();
         $state.go('contacts.search', {contacts_array:contact.contacts, source:'all'});
      }
  }

}]);

app.controller('ContactController', ['one_contact', 'contacts', 'contactFactory', '$window', '$state', 'keywords', function(one_contact, contacts, contactFactory, $window, $state, keywords) {
  var contact=this;
  contact.contact=one_contact;
  contact.all=null;
  contact.keywords=keywords;
  contact.check_array=false;
  if (contacts.contacts_array!=null && contacts.index!=null) {
    contact.check_array=true;
    contact.all=contacts.contacts_array;
    contact.index= contacts.index;
   
    //set previous to empty string when index 0, otherwise it will generate error because of undefined and the first element of the array will never be shown
    
    contact.previous=contacts.index==0 ? "" : contacts.contacts_array[contacts.index-1].id;
    
    //add to the queue more contacts
    if (contacts.index>=contacts.contacts_array.length-3) {
      var offset=contacts.contacts_array.length;
      if (keywords==null) {
        
        contactFactory.getContact().query({limit:5, offset:offset}, 
          function(response) {
            contact.all=contact.all.concat(response);
            contact.next = contacts.index==contact.all.length-1 ? 0 : contact.all[contacts.index+1].id;
          }, function(error) {
            console.log(error.responseText);
        })
      } else {
        keywords.offset=offset;
        contactFactory.getContact().query(keywords, 
          function(response) {
            contact.all=contact.all.concat(response);
            contact.next = contacts.index==contact.all.length-1 ? 0 : contact.all[contacts.index+1].id;
          }, function(error) {
            console.log(error.responseText);
        })
      }
    } else {
        contact.next = contacts.index==contacts.contacts_array.length-1 ? 0 : contacts.contacts_array[contacts.index+1].id;
    }
  }
  
  
  $window.onkeydown=function(event) {
      if (event.keyCode==70 && event.ctrlKey || event.keyCode==70 && event.metaKey) {
        event.preventDefault();
        $state.go('contacts.search', {contacts_array:contact.all, contact:{index:contact.index, id:contact.contact.id}, source:'one'});
      }
  }
}]);

app.controller('searchContactController', ['contacts_array', 'one_contact', 'origin', '$state', '$window', function(contacts_array, one_contact, origin, $state, $window){
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
  search.search=function() {
    var input=["first_name", "last_name", "organization", "email"];
    var keywords={};
    keywords.limit=5;
    for (i=0; i<input.length; i++) {
      if (search[input[i]]==undefined) {
          continue;
      } else {
        keywords[input[i]]=search[input[i]];
      }  
    }
    $state.go("contacts", {keywords:keywords, contacts_array: null, index: null});
  }
  
  $window.onkeydown=function(event) {
    // escape pressed
    if (event.keyCode==27) {
      search.back();
    }
    
    //enter/return pressed
    if (event.keyCode == 13) {
      search.search();
    }
  }
  
}])

