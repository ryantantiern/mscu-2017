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
          credentials: "Av5wBqmsnnQASubvgnpJc-tfOm8-nSSCq3KteunuqY4s4lhtA3LuyupF5Xq1R8ng",
          mapTypeId: Microsoft.Maps.MapTypeId.road,
          center: new Microsoft.Maps.Location(53.688, -2.039),
          zoom: 5,
          maxZoom: 15,
          minZoom: 5,
          navigationBarOrientation:  Microsoft.Maps.NavigationBarOrientation.horizontal,
          showMapTypeSelector: false,
          disableTouchInput: false,
          disableUserInput: false,
          disableZooming: false,
          disablePanning: false,
          enableClickableLogo: false,
          enableSearchLogo: false, 
          enableInertia: false,
          showLocateMeButton: true,
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