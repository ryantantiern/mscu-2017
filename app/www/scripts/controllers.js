angular.module('starter.controllers',['starter.services'])

/**
 * LOGIN CONTROLLER
 */
.controller('LoginCtrl', function($scope, $state, $http,  Auth) {

   $scope.data = {};
   $scope.default_text = "Please login";
   $scope.recognizedText = '';


        $scope.speak = function(string) {
    window.TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           

       }, function (reason) {
           // Handle the error case
       });
  };

$scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
            $scope.$apply()
             document.getElementById("myNav").style.width = "100%";
        }
    };
    recognition.start();
  };



  
   $scope.login = function(user_data) {

       if ($scope.data.username && $scope.data.password)
       {
          // Ryan - Login
          // Login then set token to access token.
         var request = {
           method : 'POST',
           url : Auth.getApiUrl() + "/oauth/token",
           data : {
             grant_type: "password",
             client_id: "2",
             client_secret: "aWp7UktCBl9TULyr6iYOreKXtkfYz6NJDnLUOe5P",
             // Development: m1YfbxAkR1nKsoXX3YmwTr47seXlc06o80ypUoTJ
             // Production: aWp7UktCBl9TULyr6iYOreKXtkfYz6NJDnLUOe5P
             username : $scope.data.username,
             password : $scope.data.password,
             scope : "*"
           },
           headers :  {
             'Content-Type' : 'application/json',
             Accept: 'application/json'
           }
         }
         $http(request).then(function(result) {
           if (result.data.access_token) {
            $http({
              method: "GET",
              url : Auth.getApiUrl() + "/api/user",
              headers: {
                Authorization : 'Bearer ' +  result.data.access_token
              }
            }).then(function(user) {
              user.data.access_token = result.data.access_token;
              Auth.setUser(user.data);
              $state.go('dashboard');
            });
           }
           // console.log(result);
       }, function(e) {
            console.log(e);
            alert(e.data.error + ': ' + e.data.message);
          });

         // Ryan - end
       }
       else
        // Validation Errors
       {
        if ($scope.data.username) alert("Please input the password");
        else alert("Please fill out the fields before submitting");
       }
    };
   $scope.goToRegister = function(){
        $state.go('register');
   };
  })

/**
 * REGISTER CONTROLLER
 */

.controller('RegisterCtrl', function($scope, $state, $http, Auth, $filter) {

  $scope.goToLogin = function(){
    $state.go('login');
  };

  $scope.register = function() {

    if ($scope.register.firstName && $scope.register.lastName && $scope.register.email &&
        $scope.register.password && $scope.register.password_confirm){
        if ($scope.register.password == $scope.register.password_confirm)
        {
          // Ryan - register
          // register username and password then send post request then handle response
          var request = {
            method : 'POST',
            url : Auth.getApiUrl() + "/api/register",
            data : {
              firstname : $scope.register.firstName,
              lastname : $scope.register.lastName,
              email : $scope.register.email,
              password : $scope.register.password,
              phone: $scope.register.phone,
              dob : ($scope.register.birth_date)? $filter('date')($scope.register.birth_date, 'dd-MM-yyyy') : null,

            },
            headers :  {
              'Content-Type' : 'application/json',
              Accept: 'application/json'
            }
          }

        $http(request).then(function(result) {
          if (result.data) {
            alert("You have successfuly created an account");
            $scope.goToLogin();
          }
          else {
            // console.log(result);
            alert("Something went wrong");
          }
        });

      // END Ryan - register

        }else {
          alert("Warning! The password do not match. Please try again.");
        }
    } else alert("Please fill out the fields before submitting");
  };
})

/**
 * DASHBOARD CONTROLLER
 */

.controller('DashboardCtrl', function($scope, $state, $ionicPopover, Auth, GeoLocation) {
  // Assign user_data to autheticated user

   $scope.recognizedText = '';
 
  $scope.speakText = function(string) {
    window.TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           // Do Something after success
       }, function (reason) {
           // Handle the error case
       });
  };
 
  $scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
            $scope.$apply()
            if ($scope.recognizedText == 'One') {
              $state.go('friends');
            } if ($scope.recognizedText == ('Two' || 'To' || 'Too')) {
              $state.go('friend_requests');
            } if ($scope.recognizedText == 'Three') {
              $state.go('add_friend');
            } if ($scope.recognizedText == ('For' | 'Four')) {
              $state.go('create_route');
            } if ($scope.recognizedText == 'Five') {
              $state.go('my_routes');
            } if ($scope.recognizedText == 'Six') {
              $state.go('profile');
            }
        }
    };
    recognition.start();
  };

  // Ryan - end
  $scope.user_data = Auth.getUser();

  $scope.goViewFriends = function (){
      $state.go('friends');
  };
  $scope.goAddFriend = function () {
        $state.go('add_friend');
    };
  $scope.goCreateRoute = function () {
          $state.go('create_route');
    };
  $scope.goProfile = function () {
        $state.go('profile');
    };
  $scope.goViewFrRequests = function () {
        $state.go('friend_requests')
  };
  $scope.goMyRoutes = function () {
          $state.go('my_routes')
  };
  $scope.logout = function () {
          $state.go('login');
  };

  // TODO ryan : pull the notifications as the shared routes with me with the
  // TODO:  'seen' attribute firstly being false
  $scope.notifications = [{routeId:1, senderName: "John Doe"},
                          {routeId:2, senderName: "John Smith"},
                          {routeId:3, senderName: "Redhat Doe"},
                          {routeId:3, senderName: "Redhat Doe"},
                          {routeId:3, senderName: "Redhat Doe"},
                          {routeId:3, senderName: "Redhat Doe"}]

  var template = '<ion-popover-view><ion-header-bar>\
  <h2 class="title">New routes from:</h1> </ion-header-bar>\
   <ion-content><ul class="list"><li ng-click="seeRoute(ntf.routeId)"\
    ng-repeat="ntf in notifications" class="item">{{ntf.senderName}}</li></ul> \
    </ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
    });

     $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // Execute action on hidden popover
      $scope.$on('popover.hidden', function() {
        $scope.notifications = [];
        // TODO ryan : mark new routes as seen in the database
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        // Execute action
      });

  $scope.seeRoute = function(routeId)
  {
    alert(routeId);
  }
})

/**
 * FRIENDS CONTROLLER
 */

.controller('FriendsCtrl', function($scope, $state, $http, Auth) {
  /**
   * @hashmap friend_list := update friends list only if friend is not already in list
   * TODO: Allow update on deletion too
   */
  $scope.friend_list = {};

  $scope.rawFriends = [];

  $scope.stringOfFriends = " ";
$scope.c = 1;

  $scope.$on('$ionicView.beforeEnter', function () {
    var request = {
      method : 'GET',
      url : Auth.getApiUrl() + "/api/friends",
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }

    $http(request).then(function(result) {
      for (var i in result.data.friends) {
        if (!$scope.friend_list[result.data.friends[i].id]) {
          var friend = {
            "id" : result.data.friends[i].id,
            "firstName" : result.data.friends[i].firstname,
            "lastName" : result.data.friends[i].lastname,
            "phone" : result.data.friends[i].phone
          };

          // Should be written better
          //
          $scope.rawFriends.push(friend);
          $scope.friend_list[result.data.friends[i].id] = friend;
          // END - Should be written better
          //
        $scope.stringOfFriends =  $scope.stringOfFriends + 'friend ' + $scope.c + ' ' + result.data.friends[i].firstname + " " + result.data.friends[i].lastname + " ";
$scope.c = $scope.c  + 1;
        }
      }
      $scope.speakText = function() {
    TTS.speak({
           text: 'You have ' + $scope.rawFriends.length+ ' friends',
           locale: 'en-GB',
           rate: 1.5
       }, function () {
        //what to do after text to speech
        $scope.speakText1(" " + $scope.stringOfFriends)
       }, function (reason) {
           // Handle the error case
       });
  };
 $scope.speakText1 = function(string) {
    TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           // Do Something after success
       }, function (reason) {
           // Handle the error case
       });
  };

    },function () {
      alert("Error: Could not update friends list");
    });


  });


  
 

  $scope.goBack = function(){
      $state.go('dashboard');
        }
  $scope.goAddFriend = function(){
          $state.go('add_friend');
      };
})

/**
 * CREATE ROUTE CONTROLLER
 */

.controller('CreateRouteCtrl', function($scope, $state, GeoLocation, BingLocationService, RouteCreator, RouteData ) {

 $scope.startAddress = {address : ""};
 $scope.endAddress = {address : ""};
 $scope.wpAddresses = [];
 $scope.suggestions = [];
 $scope.suggestionFlag = null;

  $scope.goBack = function(){ $state.go('dashboard'); };
  $scope.addWpInput = function () {
    var wpInput = {address : ""}
    $scope.wpAddresses.push(wpInput)
  }
  $scope.removeWpInput = function () { $scope.wpAddresses.pop() }

  $scope.getSuggestions = function (addr, inputType, wpIndex=null) {
    var suggestions = null;
    if (inputType === "s") {
      BingLocationService.convertToPoint(addr, inputType);
      var interval = setInterval(function () {
        suggestions = RouteCreator.getStart();
        if (suggestions) {
         // $scope.suggestions.splice(0, $scope.suggestions.length);
          $scope.suggestions = suggestions;

          // TODO: change this
          $scope.startAddress = $scope.suggestions[0];

          clearInterval(interval);
        }
      }, 50);
      $scope.suggestionFlag = "s";
    }
    else if (inputType === "e") {
      BingLocationService.convertToPoint(addr, inputType);
      var interval = setInterval(function () {
        suggestions = RouteCreator.getEnd();  
        if (suggestions) {
          $scope.suggestions = suggestions;

          // TODO: change this
          $scope.endAddress = $scope.suggestions[0];

          clearInterval(interval);
        }
      }, 50);
      $scope.suggestionFlag = "e";
    }
    else if (inputType === "wp") {
      BingLocationService.convertToPoint(addr, inputType);
      var interval = setInterval(function () {
        suggestions = RouteCreator.getWaypoints();
        if (suggestions) {
          $scope.suggestions = suggestions;

          // TODO: change this
          $scope.wpAddresses[wpIndex] = $scope.suggestions[0];
          clearInterval(interval);
        }
      }, 50);
     $scope.suggestionFlag = wpIndex;

    }
  }

  $scope.selectSuggest = function (suggestion) {
    // TODO: allow sellection of suggested places
    // console.log(suggestion)
  }

  $scope.next = function () {
    // make a check to see if start, end and waypoints are valid coordinates
    if (!$scope.startAddress.address || !$scope.endAddress.address) {
      alert("Start and end must be filled");
      return;
    }
    var route = {
      start: $scope.startAddress,
      end: $scope.endAddress,
      wps : $scope.wpAddresses
    }
    RouteData.set(route);
    $state.go("customize_route");

  }

})

/**
/**CONTROLLER
 */

  .controller('CustomizeRouteCtrl', function($scope,$ionicPopup, $state, RouteData, Auth, $http, GeoLocation, Waypoint) {
    var directionsManager;
    var originalWps = [];
    var routeLen;
    $scope.data = {};
    $scope.map = {};
    $scope.wp = {description : ""};


    $scope.goBack = function () {
      $state.go('create_route');
      directionsManager.clearDisplay();
      directionsManager.clearAll();        
      $scope.map.layers.clear();        


    }
    function save() {
      // get waypoints coordinates
      // call rest api
      $scope.data.wps = [];

      var currentRoute = directionsManager.getCurrentRoute();
      var count = 0;
      var waypointsPayload = {};


      // push actualStart : (lat,lon) & startDescription
      // If StartAddress or EndAddress, use Start/EndAddress as startDescription instead
      for (var i = 0; i < currentRoute.routeLegs.length; i++) {
        for (var j = 0; j < currentRoute.routeLegs[i].subLegs.length; j++ ) {
          if (j == 0) {
            waypointsPayload[count] = originalWps[i].toLean();
          }
          else {
            waypointsPayload[count] = Waypoint.LeanWp(
              count,
              currentRoute.routeLegs[i].subLegs[j].actualStart.latitude,
              currentRoute.routeLegs[i].subLegs[j].actualStart.longitude
              );
          }
          count++;
        }
      }

     waypointsPayload[count] = originalWps[currentRoute.routeLegs.length].toLean();
     // console.log(waypointsPayload);
      var request = {
        method : 'POST',
        url : Auth.getApiUrl() + "/api/routes/create",
        data : {
          waypoints: waypointsPayload, // now called waypoints
          title: ($scope.data.title) ? $scope.data.title : "",
          description: ($scope.data.description) ? $scope.data.description: "",
          start_address:  ($scope.data.startAddress) ? $scope.data.startAddress : "",
          end_address:  ($scope.data.endAddress) ? $scope.data.endAddress : "",
        },
        headers :  {
          'Content-Type' : 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + Auth.getUser().access_token
        }
      }
      $http(request).then(function(result) {
        alert("Route Saved!");
        $state.go('my_routes');
        // console.log(result);
      }, function (e) {
        console.log(e);
        alert(e);
      });



    }

    $scope.saveRoute = function() {
      var waypoints = RouteData.get();
      $scope.data.title = "";
      $scope.data.description = "";
      $scope.data.startAddress =  waypoints.start.address.split(",")[0];
      $scope.data.endAddress = waypoints.end.address.split(",")[0];

      var myPopup = $ionicPopup.show({
                  template: ' Title<textarea ng-model="data.title"></textarea>Short Description<textarea ng-model="data.description"></textarea>',
                  title: 'Save Route',
                  subTitle: '',
                  scope: $scope,
                  buttons: [{
                     text: 'Cancel'
                  }, {
                     text: '<b>Save</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                        save();

                     }
                  }, ]
               });

    }

    $scope.mapCreated = function (map) {
      $scope.map = map;
    }

    $scope.$on("$ionicView.afterEnter" ,function(event, data) {
      // Create route
      Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
             var data = RouteData.get();
             var waypoints = [];

             // start, end and via waypoints
             data.start.waypoints = [new Microsoft.Maps.Directions.Waypoint({
               address: data.start.address,
               isViapoint: false
             })];

             data.end.waypoints = [new Microsoft.Maps.Directions.Waypoint({
               address: data.end.address,
               isViapoint: false
             })];

             for (var i = 0; i < data.wps.length; i++) {
                data.wps[i].waypoints =  new Microsoft.Maps.Directions.Waypoint({
                 address: data.wps[i].address,
                 isViapoint: true,

                });
             }

             var waypoints = data.start.waypoints;
             for (var i = 0; i < data.wps.length; i++) {
               waypoints = waypoints.concat(data.wps[i].waypoints);
             }
             waypoints = waypoints.concat(data.end.waypoints);

             // Used in directionsUpdated
             routeLen = waypoints.length;

             // console.log(waypoints);
              //Create an instance of the directions manager.
              directionsManager = new Microsoft.Maps.Directions.DirectionsManager($scope.map);

              //Set Route Mode to transit.
              directionsManager.setRequestOptions({
                  routeMode: Microsoft.Maps.Directions.RouteMode.walking,
                  distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
                  routeDraggable: true
              });

              //Add waypoints.
              for(var i = 0; i <waypoints.length; i++) {
               directionsManager.addWaypoint(waypoints[i]);
              }

              //Calculate directions.
              directionsManager.calculateDirections();
              Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', directionsUpdated);



         });
    });

    function saveWaypointMetadata (i) {
      originalWps[i].setDesc($scope.wp.description);
    }

    function pushpinPopup (address, description, i) { 
      $scope.wp.description = description;
      $ionicPopup.show({
          template: 'Description<textarea ng-model="wp.description"></textarea>',
          title: address,
          subTitle: '',
          scope: $scope,
          buttons: [{
             text: 'Cancel'
          }, 
          {
             text: '<b>Save</b>',
             type: 'button-positive',
             onTap: function() {
                saveWaypointMetadata(i);
             }
          }]
       });
    }


    function directionsUpdated(e) {
      var currentRoute = directionsManager.getCurrentRoute();
      var layer = new Microsoft.Maps.Layer();
      var thisAddress;
      var selectedColour;

      var routeData = RouteData.get();

      for (var i = 0; i < currentRoute.routeLegs.length; i++) { 
        if (i == 0) { 
          thisAddress = routeData.start.address;
          selectedColour = "green"
        }
        else {
          thisAddress = routeData.wps[i-1].address
          selectedColour = "blue";
        }

        var coord = [currentRoute.routeLegs[i].startWaypointLocation.latitude, 
          currentRoute.routeLegs[i].startWaypointLocation.longitude];
        var loc = GeoLocation.Location(coord[0], coord[1]);
        var pin = new Microsoft.Maps.Pushpin(loc, {
          color: selectedColour,
          text: i+1 + ""
        })
        // Should only run once
        if (originalWps.length != routeLen) {
          // Create Waypoint objects
          var waypointObject = Waypoint.Wp(
              i, 
              coord[0],
              coord[1],
              thisAddress
            )
          originalWps.push(waypointObject);
        }
        var value = i;
        Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
          // e.target.entity.iconText must be an INT  
          pushpinPopup(
            originalWps[e.target.entity.iconText - 1].address.split(",")[0], 
            originalWps[e.target.entity.iconText - 1].description,
            e.target.entity.iconText - 1);

        });

        layer.add(pin);

        // Because #routeLegs = #waypoints - 1
        if (i == currentRoute.routeLegs.length - 1) {
          var coord = [currentRoute.routeLegs[i].endWaypointLocation.latitude, 
            currentRoute.routeLegs[i].endWaypointLocation.longitude];
          var loc = GeoLocation.Location(coord[0], coord[1]);
          var pin = new Microsoft.Maps.Pushpin(loc, {
            color: "red",
            text: i+2 + ""
          })

          if (originalWps.length != routeLen) {
            thisAddress = routeData.end.address;
            var waypointObject = Waypoint.Wp(
                i+1, 
                coord[0],
                coord[1],
                thisAddress
            )
            originalWps.push(waypointObject);
          }

          Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
            pushpinPopup(
              originalWps[routeLen - 1].address.split(",")[0], 
              originalWps[routeLen - 1].description,
              e.target.entity.iconText - 1);
          });

          layer.add(pin);

        }


      }
      $scope.map.layers.insert(layer);

    }

    // function wpPopup()

  })


/**
 * PROFILE CONTROLLER
 */

.controller('ProfileCtrl', function($scope, $ionicPopup, $state, $cordovaCamera, $ionicLoading, $localStorage, Auth) {

  $scope.goBack = function(){
      $state.go('dashboard');
  };
  $scope.changePhoto = function(){
      $scope.data = {};
            var myPopup = $ionicPopup.show({
                  template: ' ',
                  title: 'Change profile picture',
                  subTitle: '',
                  scope: $scope,
                  buttons: [ {
                     text: '<b>Take photo</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                           $scope.takePicture();
                        }
                     },

                   {
                      text: '<b>Choose from library</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                          $scope.selectPicture();
                       }
                   }
                   ]
               });


  };
  $scope.defaultPhoto ='img/avatar.jpg';
  $scope.user_data = Auth.getUser();
  $scope.editing = false;
  /* Delete this when grabbing from database */

  $scope.user_data['address']='Cuca macaii land';
  $scope.user_data['photo']=null;

  $scope.editProfile = function(){
    document.getElementById("changeButton").style.display='none';
    document.getElementById("editButton").style.display='none';
    document.getElementById("saveButton").style.display='block';
    $scope.editing = true;

  };

  $scope.saveChanges = function(){
      document.getElementById("changeButton").style.display='block';
      document.getElementById("editButton").style.display='block';
      document.getElementById("saveButton").style.display='none';
      $scope.editing = false;
      // TODO:
      // compare differences with user_data and Auth.getUser()
      // send api request to update differences
      // make local change on Auth.set(user_data)

    };

    $scope.changePassword = function()
    {
      $scope.data = {};
      var myPopup = $ionicPopup.show({
            template: ' Old Password<input type="password" ng-model="data.oldPassword">   <br> New Password  <input type="password" ng-model="data.newPassword" > <br> Confirm Password  <input type="password" ng-model="data.confirmPassword" >',
            title: 'Change Password',
            subTitle: '',
            scope: $scope,
            buttons: [{
               text: 'Cancel'
            }, {
               text: '<b>Save</b>',
               type: 'button-positive',
               onTap: function(e) {
                  if ($scope.data.newPassword != $scope.data.confirmPassword) {
                     //don't allow the user to continue if the 2 passwords do not match
                     alert("Passwords do not match. Please try again.");
                     e.preventDefault();
                  } else
                  if (!$scope.data.oldPassword || !$scope.data.newPassword || !$scope.data.confirmPassword)
                  {
                    alert("Please complete all the fields.");
                    e.preventDefault();
                  } else

                  {
                    // TODO:
                    // send api request to check if old password is same
                    // if so, update to new password
                    //
                    return $scope.data;
                  }
               }
            }, ]
         });
    };



    $scope.takePicture = function() {
      	  var options = {
              quality: 100,
              destinationType: Camera.DestinationType.FILE_URL,
              sourceType: Camera.PictureSourceType.CAMERA,
              saveToPhotoAlbum: true
            };
      	  $cordovaCamera.getPicture(options).then(
      		function(imageData) {
      			$scope.picData = imageData;
      			$scope.ftLoad = true;
      			$localstorage.set('photo', imageData);
      			$scope.user_data.photo = "data:image/jpeg;base64,"+imageData;
      			$ionicLoading.show({template: 'Getting photo...', duration:500});
      		},
      		function(err){
      			$ionicLoading.show({template: 'Errore di caricamento...', duration:500});
      			})
      	  };

     $scope.selectPicture = function() {
      		var options = {
              quality: 100,
      			destinationType: Camera.DestinationType.FILE_URI,
      			sourceType: Camera.PictureSourceType.PHOTOLIBRARY
      		};

      	  $cordovaCamera.getPicture(options).then(
      		function(imageURI) {
      			window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
      				$scope.picData = fileEntry.nativeURL;
      				$scope.ftLoad = true;
      				$scope.user_data.photo = fileEntry.nativeURL;
        			});
      			$ionicLoading.show({template: 'Foto acquisita...', duration:500});
      		},
      		function(err){
      			$ionicLoading.show({template: 'Errore di caricamento...', duration:500});
      		})
      	};
})

.controller('AddFriendCtrl', function($scope, $state, Auth, $http) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };

  $scope.filteredPeople = [];
  $scope.searchQuery = "";

  // Search for user based on phone number or first/last (or both) name
  $scope.updateList = function(searchQuery){
    $scope.filteredPeople = new Array();
    if (searchQuery && searchQuery.trim()!='') {
        var request = {
          method : "GET",
          url : Auth.getApiUrl() + "/api/search/" + searchQuery,
          headers :  {
            Authorization: "Bearer " + Auth.getUser().access_token
          }
        }

      $http(request).then(function(result) {
        if (result.data) {
          for (var i = result.data.length - 1; i >= 0; i--) {
            $scope.filteredPeople.push(result.data[i]);
          }
        }
        else {
          $scope.filteredPeople = [];
        }

      });
    }
  };

  $scope.sendFriendRequest = function(id) {
    for (var i in $scope.filteredPeople)
        if ($scope.filteredPeople[i].id == id) {
          var request = {
            method : "GET",
            url : Auth.getApiUrl() + "/api/friends/add/" + id,
            headers :  {
              Authorization: "Bearer " + Auth.getUser().access_token
            }
          }
          $http(request).then(function(result) {
            if (result.data.message == 'success') {
              $scope.filteredPeople[i].request_sent = true;
            }
          });
          break;
        }
  };
  $scope.cancelFriendRequest = function(id) {
     for (var i in $scope.filteredPeople)
         if ($scope.filteredPeople[i].id== id) {
          var request = {
            method : "DELETE",
            url : Auth.getApiUrl() + "/api/friends/requests/cancel/" + id,
            headers :  {
              Authorization: "Bearer " + Auth.getUser().access_token
            }
          }
          $http(request).then(function(result) {
            if (result.data.message == 'success') {
              $scope.filteredPeople[i].request_sent = false;
            }
            else {
              alert(result.data.message);
            }
          });
          break;
        }

  };
})

.controller('FrRequestsCtrl', function($scope, $state, Auth, $http) {
  var data = {};
  $scope.friend_requests = [];
  $scope.stringOfFriendRequests = " "
  $scope.c = 1;



 


  $scope.$on('$ionicView.beforeEnter', function () {
    var request = {
      method : 'GET',
      url : Auth.getApiUrl() + "/api/friends/requests/received",
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }

    $http(request).then(function(result) {
      for (var i in result.data.friends) {
        if (!data[result.data.friends[i].id]) {
          var user = {
            "id" : result.data.friends[i].id,
            "firstname" : result.data.friends[i].firstname,
            "lastname" : result.data.friends[i].lastname,
            "phone" : result.data.friends[i].phone
          };
          // Should be written better
          //
          $scope.friend_requests.push(user);
          data[result.data.friends[i].id] = user;
          // END - Should be written better
          //
          $scope.stringOfFriendRequests = $scope.stringOfFriendRequests + 'select ' + $scope.c + 'to accept a friend request from ' + result.data.friends[i].firstname + ' ' + result.data.friends[i].lastname + ' '
          $scope.c = $scope.c + 1
        }
      }
         $scope.speakText = function() {
    TTS.speak({
           text: 'You have ' + $scope.friend_requests.length+ ' friend requests',
           locale: 'en-GB',
           rate: 1.5
       }, function () {
        //what to do after text to speech
        $scope.speakText1(" " + $scope.stringOfFriendRequests)
       }, function (reason) {
           // Handle the error case
       });
  };
 $scope.speakText1 = function(string) {
    TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           // Do Something after success
       }, function (reason) {
           // Handle the error case
       });
  };

      $scope.recognizedText = '';
 
  $scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
            $scope.$apply()
            if ($scope.recognizedText == 'One') {
              $scope.accept($scope.friend_requests[0])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[0].firstname + ' ' + $scope.friend_requests[0].lastname)

            } if ($scope.recognizedText == ('Two' || 'To' || 'Too')) {
              $scope.accept($scope.friend_requests[1])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[1].firstname + ' ' + $scope.friend_requests[1].lastname)
            } if ($scope.recognizedText == 'Three') {
              $scope.accept($scope.friend_requests[2])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[2].firstname + ' ' + $scope.friend_requests[2].lastname)
            } if ($scope.recognizedText == ('For' | 'Four')) {
              $scope.accept($scope.friend_requests[3])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[3].firstname + ' ' + $scope.friend_requests[3].lastname)
            } if ($scope.recognizedText == 'Five') {
              $scope.accept($scope.friend_requests[4])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[4].firstname + ' ' + $scope.friend_requests[4].lastname)
            } if ($scope.recognizedText == 'Six') {
              $scope.accept($scope.friend_requests[5])
              $scope.speakText1('you have accepted your friend request with ' +  $scope.friend_requests[5].firstname + ' ' + $scope.friend_requests[5].lastname)
            }
        }
    };
    recognition.start();
  };

    });
  });

  $scope.accept = function (user) {

    var request = {
      method : 'GET',
      url : Auth.getApiUrl() + "/api/friends/accept/" + user.id,
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }

    $http(request).then(function(result) {
      var i = $scope.friend_requests.indexOf(user);
      $scope.friend_requests.splice(i,1);
      data[user.id] = null;
      });
  }

  $scope.decline = function (user) {

    var request = {
      method : 'GET',
      url : Auth.getApiUrl() + "/api/friends/decline/" + user.id,
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }

    $http(request).then(function(result) {
      var i = $scope.friend_requests.indexOf(user);
      $scope.friend_requests.splice(i,1);
      data[user.id] = null;
      });
  }

 

  $scope.goBack = function () {
    $state.go('dashboard');
  }
})


.controller('MyRoutesCtrl', function($scope, $state, Auth, $http, RouteData, $ionicActionSheet, $ionicModal, $ionicPopup, $timeout) {




  $scope.my_routes = [];
  $scope.shared_routes = [];
  $scope.friend_list = {};
  $scope.stringOfMyRoutes = " ";
  $scope.stringOfPendingRoutes= " ";
  $scope.c = 1;
  $scope.d = 1;
  $scope.show_mine = false;

  $scope.$on('$ionicView.beforeEnter', function () {
    // List routes
     var routesRequest = {
       method : 'GET',
       url : Auth.getApiUrl() + "/api/routes",
       headers : {
         Authorization : 'Bearer ' + Auth.getUser().access_token
       }
     }
     $scope.my_routes = [];
     $http(routesRequest).then(function(result) {
        for (var i = 0; i < result.data.count; i++) {
          $scope.my_routes.push({
            id: result.data.routes[i].id,
            body: result.data.routes[i].body, // Won't need this
            title:  result.data.routes[i].title, 
            description: result.data.routes[i].description,
            start_address: result.data.routes[i].start_address,
            end_address: result.data.routes[i].end_address,
            _created_at : result.data.routes[i].created_at,
            created_at : result.data.routes[i].created_at.date.split(" ")[0]
          });
          $scope.stringOfMyRoutes = $scope.stringOfMyRoutes + ' select ' + $scope.c + ' to view route ' +  result.data.routes[i].title + ' with description ' + result.data.routes[i].description
          $scope.c = $scope.c + 1;
        }

                 $scope.speakText = function() {
    TTS.speak({
           text: 'You have ' + $scope.my_routes.length+ ' routes. Select 0 to view pending routes.',
           locale: 'en-GB',
           rate: 1.5
       }, function () {
        //what to do after text to speech
        $scope.speakText1(" " + $scope.stringOfMyRoutes)
       }, function (reason) {
           // Handle the error case
       });
  };
 $scope.speakText1 = function(string) {
    TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           // Do Something after success
       }, function (reason) {
           // Handle the error case
       });
  };

      $scope.recognizedText = '';
 
  $scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
            $scope.$apply()
            if ($scope.recognizedText == 'Zero') {
              $scope.show_mine = true;
              $scope.seePendingRoutes()
            }
            if ($scope.recognizedText == 'One') {
              $scope.seeRoute($scope.my_routes[0])

            } if ($scope.recognizedText == ('Two' || 'To' || 'Too')) {
              $scope.seeRoute($scope.my_routes[1])

            } if ($scope.recognizedText == 'Three') {
              $scope.seeRoute($scope.my_routes[2])
             
            } if ($scope.recognizedText == ('For' | 'Four')) {
              $scope.seeRoute($scope.my_routes[3])

            } if ($scope.recognizedText == 'Five') {
              $scope.seeRoute($scope.my_routes[4])

            } if ($scope.recognizedText == 'Six') {
              $scope.seeRoute($scope.my_routes[5])
              
            }
        }
    };
    recognition.start();
  };

        $scope.my_routes.sort(function(a, b){
          return new Date(b.created_at) - new Date(a.created_at);
        });

       }, function(e) {
        console.log(e)
       }
     );



     // list pending received routes
     var pendingRoutes = routesRequest;
     pendingRoutes.url = Auth.getApiUrl() + "/api/routes/received";
     $scope.shared_routes = [];
     $http(pendingRoutes).then(function(result) {
        if (result.data.response.constructor == Array) {
          for (var i = 0; i < result.data.response.length; i++) {
            $scope.shared_routes.push({
              id: result.data.response[i].id,
              body: result.data.response[i].body,
              title:  result.data.response[i].title, 
              description: result.data.response[i].description,
              start_address: result.data.response[i].start_address,
              end_address: result.data.response[i].end_address,
              _created_at : result.data.routes[i].created_at,
              created_at : result.data.response[i].created_at.split(" ")[0]
            });
          }
        }

       }, function(e) {
        console.log(e)
       }
     );
     $scope.seePendingRoutes = function(){
          var pendingRoutes = routesRequest;
     pendingRoutes.url = Auth.getApiUrl() + "/api/routes/received";
     $scope.shared_routes = [];
     $http(pendingRoutes).then(function(result) {
        if (result.data.response.constructor == Array) {
          for (var i = 0; i < result.data.response.length; i++) {
            $scope.shared_routes.push({
              id: result.data.response[i].id,
              body: result.data.response[i].body,
              title:  result.data.response[i].title, 
              description: result.data.response[i].description,
              start_address: result.data.response[i].start_address,
              end_address: result.data.response[i].end_address,
              _created_at : result.data.routes[i].created_at,
              created_at : result.data.response[i].created_at.split(" ")[0]
            });

             $scope.stringOfPendingRoutes = $scope.stringOfPendingRoutes + ' select pending' + $scope.d + ' to accept route' + result.data.response[i].title + ' with description ' + result.data.response[i].description

             $scope.d = $scope.d + 1
          }
        }
        $scope.speakText1('you have ' + $scope.shared_routes.length + ' pending routes ' + $scope.stringOfPendingRoutes)

       }, function(e) {
        console.log(e)
       }
     );

   }

     // Load friends in the background in preparation to be shared
     var friendsRequest = {
       method : 'GET',
       url : Auth.getApiUrl() + "/api/friends",
       headers : {
         Authorization : 'Bearer ' + Auth.getUser().access_token
       }
     }

     $http(friendsRequest).then(function(result) {
       for (var i in result.data.friends) {
         if (!$scope.friend_list[result.data.friends[i].id]) {
           var friend = {
             "id" : result.data.friends[i].id,
             "firstName" : result.data.friends[i].firstname,
             "lastName" : result.data.friends[i].lastname,
             "phone" : result.data.friends[i].phone,
             "checked" : false
           };
           $scope.friend_list[result.data.friends[i].id] = friend;
         }
       }
     },function (e) {
       console.log(e);
     });


   });

  $scope.seeRoute = function(route)
  {
     // TODO (ryan) : here add the routing towards the map from my routes
     var waypointsRequest = {
          method : 'GET',
          url : Auth.getApiUrl() + "/api/routes/waypoints/" + route.id,
          headers : {
            Authorization : 'Bearer ' + Auth.getUser().access_token
          }
        }
      $http(waypointsRequest).then(function(result) {
        RouteData.set(result.data[0]);
        $state.go('view_route');
      }, function (e) {
        console.log(e);
        alert("An error has occured");
      })
  }


  $scope.goBack = function () {
    $state.go('dashboard');
  }

  $ionicModal.fromTemplateUrl('templates/modals/friend_selector.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.showActions = function (route_id) {
    for (var j = 0; j < $scope.friend_list.length; j++) {
      $scope.friend_list[j].checked = false;
    }
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'Share'}
      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      buttonClicked: function (i) {
        if (i == 0) {
          hideSheet(); 
          friendsSelector(route_id);
        }
        return false;
      }
    });
  }

  function friendsSelector(route_id) {
    $scope.selectedRouteId = route_id;

    $scope.modal.show();
  }

  $scope.share = function() {
    var requests = [];
    for (var i in $scope.friend_list) {
      if ($scope.friend_list[i].checked == true) {
        requests.push({
          method: 'GET',
          url: Auth.getApiUrl() + "/api/routes/share/" + $scope.friend_list[i].id + "/" +  $scope.selectedRouteId,
          headers : {
            Authorization : 'Bearer ' + Auth.getUser().access_token
          }
        });
      }
    }
    $scope.modal.hide();
  }

  $scope.hideModal = function () {
    $scope.modal.hide();
    for (var i in $scope.friend_list) {
      $scope.friend_list[i].checked = false;
    }
  }

  // TODO : Accept or decline pending route
  $scope.sharedRoutesAction = function (route) {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: 'View'},
        { text: 'Save'},
      ],
      destructiveText: 'Decline',
      cancelText: 'Cancel',
      buttonClicked: function (i) {
        switch(i) {
          case 0: 
            $scope.seeRoute(route);
            break;
          case 1: 
            accept(route.id);
            break;
          default:
            return false
        }
        hideSheet();
      
      },
      destructiveButtonClicked: function () {
        decline(route.id);
        return true;
      }
    });
  }

  function accept(route_id) {
    var request = {
      method: 'GET',
      url: Auth.getApiUrl() + "/api/routes/accept/" + route_id,
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }
      $http(request).then(function(result) {
        // console.log(result)
        var tick = $ionicPopup.show({
          title : '<img id="tick" src="../img/tick.png" style="height: 50px; width: 50px">',
          });
        var j = 0;
        while ($scope.shared_routes[j]) {
          if ($scope.shared_routes[j].id == route_id) {
            $scope.shared_routes.splice(j, 1);
            break;
          }
          j++;
        }

        $timeout(function() {
           tick.close(); 
        }, 1200);

      },function (e) {
        console.log(e)
      });

    }

    function decline (route_id) {
      var request = {
        method: 'GET',
        url: Auth.getApiUrl() + "/api/routes/decline/" + route_id,
        headers : {
          Authorization : 'Bearer ' + Auth.getUser().access_token
        }
      }

      $http(request).then(function(result) {
        // console.log(result)
        var feedback = $ionicPopup.show({
          title : 'Successful!',
          });
        var j = 0;
        while ($scope.shared_routes[j]) {
          if ($scope.shared_routes[j].id == route_id) {
            $scope.shared_routes.splice(j, 1);
            break;
          }
          j++;
        }

        $timeout(function() {
           feedback.close(); 
        }, 1200);

      },function (e) {
        console.log(e)
      });
    }
  })

/*
VIEW ROUTE CONTROLLER
 */

.controller('ViewRouteCtrl', function($state, $scope, BingLocationService, RouteData) {
  var route;
  var directionsManager;

  $scope.speak = function(string) {
    window.TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           

       }, function (reason) {
           // Handle the error case
       });
  };

$scope.record = function() {
    var recognition = new SpeechRecognition();
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $state.go('directions');
        }
    };
    recognition.start();
  };

  $scope.mapCreated = function (map) {
    $scope.map = map;
  }

  $scope.$on('$ionicView.afterEnter', function () {
    waypoints = RouteData.get();
    BingLocationService.renderRoute(waypoints, $scope.map);

  });

  $scope.viewDirections = function () {
    $state.go('directions');
  }

  $scope.goBack = function () {
    RouteData.reset();      
    $state.go('my_routes');
    $scope.map.layers.clear();
    BingLocationService.resetDirectionsManager();
  }
})

/**
 * DIRECTIONS CONTROLLER
 */
.controller('DirectionsCtrl', function($state, $scope, BingLocationService) {
  $scope.itineraryItems = [];
  $scope.$on('$ionicView.afterEnter', function () {
    $scope.itineraryItems = BingLocationService.getItineraryItems();
  });

  // TODO (Nadia): Text ot Speech on itinerary items list


  $scope.speak = function(string) {
    window.TTS.speak({
           text: string,
           locale: 'en-GB',
           rate: 1.5
       }, function () {
           

       }, function (reason) {
           // Handle the error case
       });
  };

  $scope.goBack = function () {
    $state.go('view_route');
  }
})
