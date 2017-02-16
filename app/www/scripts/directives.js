angular.module('starter.directives', [])


.directive('map', function() {
  return {
  	//E is element <map></map>  A is for attribute eg <div map></div>
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
      function initialize() {
         var mapOptions = {
        credentials: "AruHnkjZjBTd4ZwdQlT94tYjM5KfVi_tsADRx6cTQILhBymOpnD0MVJxuL0amUyz",
        mapTypeId: Microsoft.Maps.MapTypeId.road,
        center: new Microsoft.Maps.Location(53.688, -2.039),
        zoom: 5,
        showMapTypeSelector: false,
      disableTouchInput: true,
      disableUserInput: true,
      disableZooming: true,
      disablePanning: true,
      showDashboard: false,
      enableClickableLogo: false,
      enableSearchLogo: false
    };
    
    //var map = new Microsoft.Maps.Map(document.getElementById("map"), mapOptions);
     var map = new Microsoft.Maps.Map($element[0], mapOptions);
    $scope.onCreate({map: map});
      }

      if (document.readyState === "complete") {
        initialize();
      } else {
      	console.log("done the");
       //Microsoft.maps.event.addDomListener(window, 'load', initialize);
      }


    }
  }
});