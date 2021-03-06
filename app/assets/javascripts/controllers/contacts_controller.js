angular.module('crm').controller('ContactsController', ['contactFactory', 'contacts', 'index', '$timeout', '$window', '$state', 'keywords', 'constraints', 'type', function(contactFactory, contacts, index, $timeout, $window, $state, keywords, constraints, type) {
  var contact=this;
  contact.contacts=contacts;
  // declare the offset counter according to the length of what comes from the resolve
  // there might be variations of what comes from the resolve because of the infinite scrolling in the details page
  contact.keywords=keywords;
  contact.constraints=constraints;
  contact.type=type;
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
       keywords.offset=offset;
       if (keywords.constructor===Array) {
         contactFactory.getContact().query({'keywords[]':keywords, 'constraints[]':constraints, type:type, limit:10, offset:offset},
            function(response){
              var array=response;
              if (array.length==0) {
                infiniteStop = true;
                return false;
              }
              contact.contacts=contact.contacts.concat(array);
            })
       } else {
         keywords.limit=10;
         contactFactory.getContact().query(keywords, 
            function(response){
              var array=response;
              if (array.length==0) {
                infiniteStop = true;
                return false;
              }
              contact.contacts=contact.contacts.concat(array);
            })
       }
       offset+=10;
    }  
  };
  
  contact.showAll=function() {
    keywords=constraints=type=contact.keywords=contact.constraints=contact.type=null;
    var all={};
    all.limit=10;
    contactFactory.getContact().query(all, 
      function(response){
        var array=response;
        if (array.length==0) {
          infiniteStop = true;
          return false;
        }
        contact.contacts=array;
    })
  }
  
  $window.onkeydown=function(event) {
      if (event.keyCode==70 && event.ctrlKey || event.keyCode==70 && event.metaKey) {
        event.preventDefault();
         $state.go('contacts.search', {contacts_array:contact.contacts, source:'all', keywords: keywords, constraints: constraints});
      }
  }

}]);