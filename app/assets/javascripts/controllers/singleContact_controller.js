angular.module('crm').controller('ContactController', ['one_contact', 'contacts', 'contactFactory', '$window', '$state', 'keywords', function(one_contact, contacts, contactFactory, $window, $state, keywords) {
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