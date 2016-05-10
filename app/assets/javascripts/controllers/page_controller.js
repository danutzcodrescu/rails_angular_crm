angular.module('crm').controller('PageController', ['$scope', '$window', function($scope, $window) {
  var page=this;
  page.size=$window.innerWidth;
  page.message = false;
  //determine the width of the menu and the other container depending whether it is open or not, but this does not apply to mobiles
  page.menu_width = {width: page.message ? ( page.size>=768 ? '160px' : '' ) : ( page.size>=768 ? '80px' : ''), 
                    position: page.size>=768 ? "fixed" : ''};
  page.container_width = {width: page.message ? (page.size>=768 ? page.size-160+'px' : '') : (page.size>=768 ? page.size-80+'px' : ''), 
                          'margin-left': page.message ? (page.size>=768 ? '162px' : '') : (page.size>=768 ? '82px' : '')};
  page.menu_list={left: page.message ? "10px" : '', "z-index": page.message ? 99 : ''};
  
  //change the dimensions according to the message status
  $scope.$watch(function () {
    return page.message;
  }, function(current) {
    page.message = current;
    page.menu_list={left: page.message ? "10px" : '', "z-index": page.message ? 99 : ''};
    page.menu_width = {width: page.message ? ( page.size>=768 ? '160px' : '' ) : ( page.size>=768 ? '80px' : ''), 
                        position: page.size>=768 ? "fixed" : ''};
    page.container_width = {width: page.message ? (page.size>=768 ? page.size-160+'px' : '') : (page.size>=768 ? page.size-80+'px' : ''), 
                            'margin-left': page.message ? (page.size>=768 ? '162px' : '') : (page.size>=768 ? '82px' : '')};
  });
  
  
  // change dimensions according to window dimensions when the screen is resized
  $window.onresize = function () {
      page.size=$window.innerWidth;
      page.menu_width = {width: page.message ? ( page.size>=768 ? '160px' : '' ) : ( page.size>=768 ? '80px' : ''), 
                         position: page.size>=768 ? "fixed" : ''};
      page.container_width = {width: page.message ? (page.size>=768 ? page.size-160+'px' : '') : (page.size>=768 ? page.size-80+'px' : ''), 
                              'margin-left': page.message ? (page.size>=768 ? '162px' : '') : (page.size>=768 ? '82px' : '')};
      $scope.$apply();
  };
}]);    