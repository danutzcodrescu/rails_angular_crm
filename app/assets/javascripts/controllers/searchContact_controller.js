angular.module('crm').controller('searchContactController', ['contacts_array', 'one_contact', 'origin', '$state', '$window', function(contacts_array, one_contact, origin, $state, $window){
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