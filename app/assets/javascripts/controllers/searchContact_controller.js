angular.module('crm').controller('searchContactController', ['contacts_array', 'one_contact', 'origin', '$state', '$window', 'keywords', 'constraints', function(contacts_array, one_contact, origin, $state, $window, keywords, constraints){
  var search=this;
  search.contacts=contacts_array;
  search.one=one_contact;
  search.origin=origin;
  search.keywords=keywords;
  search.back=function() {
    if (origin=="all") {
      $state.go("contacts", {contacts_array:contacts_array});
    }  else {
      $state.go("contacts.contact-detail", {contacts:contacts_array,index:one_contact.index, id:one_contact.id});
    }
  }
  search.search=function(extend=null) {
    var input=["first_name", "last_name", "organization", "email"];
    var searchterms={};
    for (i=0; i<input.length; i++) {
      if (search[input[i]]==undefined || search[input[i]]=="") {
        continue;
      } else {
        searchterms[input[i]]=search[input[i]];
      }  
    }
    if (extend!=null) {
      var array=[];
      //extended
      if (extend=="extended") {
        //extendended constraint
        if (constraints!=null) {
          keywords.constructor === Array ? keywords = keywords : keywords=new Array(keywords)
          // check if the keywords array has a property called keywords inside
          // after that the keywords and constrain have to be extracted from within keywords array and recreated
          if (keywords[0].hasOwnProperty("keywords")) {
            var keys=[];
            keys=keywords[0].keywords;
            keywords[0].keywords=keys;
            // add the rest of the keywords to the keywords property
            for (var i=1; i<keywords.length; i++) {
              var temp=keywords[i];
              keywords.splice(i,1);
              keywords[0].keywords.push(temp);
            }
            
            //extract the constrain and concatenate it with the other constraints
            var cons=[];
            cons=keywords[0].constraint;
            keywords[0].constraint= cons.concat(constraints);
            array=keywords
            array.push(searchterms);
          } else {
            var constrain={keywords:keywords, constraint: constraints};
            array=[constrain, searchterms];
          }
        } else {
           keywords.constructor === Array ? (array.push.apply(array, keywords), array.push(searchterms) ): array=[keywords,searchterms];
           
        }
        var type = "extended";
      //constrained  
      } else {
        array= keywords;
        if (constraints==null) {
          var constrain=[searchterms];
        } else {
          var constrain=[];
          constraints.constructor === Array ? (constrain.push.apply(constrain, constraints), constrain.push(searchterms) ): constrain=[constraints,searchterms];
        }
        var type="constrained";
      }
    } else {
      searchterms.limit=5;
    }
    $state.go("contacts", {keywords:extend==null ? searchterms : array, contacts_array: null, index: null, type: type, 
                           constraints: extend != null && extend!="extended" || type=="constrainExtended" & extend != null ? constrain : null,
                           constrainKeywords: type=="constrainExtended" ? extendKeywords : null});
  }
  
  /*extended previous search result with additional rows, useful for searching in arrays, replaced by the simple search with subselects
  search.extended=function() {
    var input=["first_name", "last_name", "organization", "email"];
    var searchterms={};
    searchterms.limit=5;
    for (i=0; i<input.length; i++) {
      switch (true) {
            //if the input and the keywords are empty skip it
            case (search[input[i]]==undefined && keywords[input[i]]==undefined && keywords[input[i]+'[]']==undefined) :
              continue;
              break;
            //if the keywords field is an array then we are pushing to the search terms array the keywords array as well as the input value
            case (keywords[input[i]+'[]']!=undefined && keywords[input[i]+'[]'].indexOf(search[input[i]])==-1) :
              searchterms[input[i]+'[]']=[];
              searchterms[input[i]+'[]'].push.apply(searchterms[input[i]+'[]'], keywords[input[i]+'[]']);
              searchterms[input[i]+'[]'].push(search[input[i]]);
              break;  
            //if the keywords field and the input value are the same then create an array (maybe it had a more specific criteria previously)  
            case (search[input[i]]==keywords[input[i]]) :
              searchterms[input[i]+'[]']=[search[input[i]]];
              break;
            case (search[input[i]]!=keywords[input[i]] && search[input[i]]!=undefined && keywords[input[i]]!=undefined) :
              searchterms[input[i]+'[]']=[keywords[input[i]],search[input[i]]];
              break;
            case (search[input[i]]!=keywords[input[i]] && search[input[i]]==undefined) :
              searchterms[input[i]]=keywords[input[i]];
              break;
            case (search[input[i]]!=keywords[input[i]] && keywords[input[i]]==undefined) :
              searchterms[input[i]]=search[input[i]];
              break;
            
      }
    }
    $state.go("contacts", {keywords:searchterms, contacts_array: null, index: null});
  }*/
  
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