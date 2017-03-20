angular.module('starter.controllers',['starter.services'])

/**
 * LOGIN CONTROLLER
 */
.controller('LoginCtrl', function($scope, $state, $http,  Auth) {

   $scope.data = {};
   $scope.default_text = "Please login";
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
             client_secret: "A30fXBkF5oIRFKXV61P4EmghpDjFlhTIzvqd6OtW",//"xg0cppwULnXjYpr5VexhsPj3IWEYKmjnHUtsJU6Y", //"A30fXBkF5oIRFKXV61P4EmghpDjFlhTIzvqd6OtW",
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
       }, function(e) {
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
            console.log(result);
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
  // Ryan
  // Assign user_data to autheticated user
  $scope.$on('$ionicView.beforeEnter', function() {
    //$scope.user_data = Auth.getUser();
    $scope.user_data = Auth.setUser({
      access_token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjlhN2U1MTExMGVmMDA0NjI2N2RmZTdhNTZhYWY0ODM2YTI1NDM0ZWMxYzliYTU3YjdkZDI2MDFlMzBhOGI0Yzk2YmRhNTI4NWJmYTM5ODBiIn0.eyJhdWQiOiIyIiwianRpIjoiOWE3ZTUxMTEwZWYwMDQ2MjY3ZGZlN2E1NmFhZjQ4MzZhMjU0MzRlYzFjOWJhNTdiN2RkMjYwMWUzMGE4YjRjOTZiZGE1Mjg1YmZhMzk4MGIiLCJpYXQiOjE0ODk4NzI3NTYsIm5iZiI6MTQ4OTg3Mjc1NiwiZXhwIjoxNTIxNDA4NzU2LCJzdWIiOiIxMSIsInNjb3BlcyI6WyIqIl19.oxIDaw7IQm4Bw3HeudL99xunZSfIOKzzeoTLxwyZGXAcylQlrK4WmnGfmYaPyOqPeG2-CV2CAEW92Ugo2r9xBPebN20qpqoySstdKb69T2907Sfz13Bqlz5Sa5-q0B-H78A47xzu3Mi3P-DabfnzQww5cIeBbqVNx8GIzQCoXCzYo7twQOKq6FqdmncNHoYGCwRbTGXq10M7bSjlXURDIZbCeUUyB-HSFKVtmw6jBxaee2jbVAsI0joYpC3JbdhSTFNRxaNyJ3bbtmyARyeKy0r3OV-CaJsza31-MoB2TXdx3-QuYcPczkoILtLuq1jQRU8JlumYST_lziiWxljNmwfwnTFZg__ZKSoH-V8__35VwE5Y8N-pF2lGDuz_djNDeut2AbsvMyqwCrJZytEUINb4tLW-5rrXvGDveKfY6Gm0mAO3eTlKwxlOzn3dOFbhT-wBOh7eF7Fah1UEr79mUroAatXDht3MBqMQnt9pVTx8NWFN8ewc94rdnj6iMNR9EHVX_6yXxm0e2fLh2_9gWyQYDgAzawfESwo7lMxDVaBofojUy75CQM8USkJr3FQih7wzS2ulSSkjdkWnU7Qaekgi1-7GlJswWAgYhDZLE1ELSHK8QrcRu-QfgFkuh5_ISZvXQn3QIPLolBDcWtfVrSqbYOmKY1MbuVtTCF8k4iM"
    })
  });

  // Ryan - end

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
  console.log($scope.rawFriends);

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
        }
      }
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
          console.log(suggestions)
          $scope.suggestions = suggestions;

          // TODO: change this
          $scope.wpAddresses[wpIndex] = $scope.suggestions[0];
          console.log($scope.wpAddresses)
          clearInterval(interval);
        }
      }, 50);
     $scope.suggestionFlag = wpIndex;

    }

    console.log($scope.suggestionFlag);
    console.log(wpIndex);
  }

  $scope.selectSuggest = function (suggestion) {
    console.log(suggestion)
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
    console.log(route);
    RouteData.set(route);
    $state.go("customize_route");
    console.log(RouteData.get())
  }

})

/**
/**CONTROLLER
 */

  .controller('CustomizeRouteCtrl', function($scope,$ionicPopup, $state, RouteData, Auth, $http, GeoLocation) {
    var directionsManager;
    $scope.data = {};
    $scope.map = {};

    $scope.goBack = function () {
      $state.go('create_route');
      directionsManager.clearDisplay();
      directionsManager.clearAll();        
      $scope.map.layers.clear();        


    }
    function save() {
      // get waypoints coordinates
      // call rest api
      $scope.data.wps = directionsManager.getAllWaypoints();
      $scope.data.wps = $scope.data.wps.map(function (wp) {
        var coord = [wp._waypointOptions.location.latitude, wp._waypointOptions.location.longitude];
        return coord;
      });
      var request = {
        method : 'POST',
        url : Auth.getApiUrl() + "/api/routes/create",
        data : {
          coordinates: JSON.stringify($scope.data.wps),
          title: ($scope.data.title) ? $scope.data.title : "",
          comments: ($scope.data.comments) ? $scope.data.comments: ""
        },
        headers :  {
          'Content-Type' : 'application/json',
          Accept: 'application/json',
          Authorization: "Bearer " + Auth.getUser().access_token
        }
      }
      $http(request).then(function(result) {
        console.log(result);
        alert("Route Saved!")
      }, function (e) {
        console.log(e);
        alert("Error occured. check console log")
      });

    }

    $scope.saveRoute = function() {
      var waypoints = RouteData.get();
      $scope.data.title = "";
      $scope.data.comments = "";

      var myPopup = $ionicPopup.show({
                  template: ' Title<textarea ng-model="data.title"></textarea>Short Description<textarea ng-model="data.comments"></textarea>',
                  title: 'Save Route',
                  subTitle: '',
                  scope: $scope,
                  buttons: [{
                     text: 'Cancel'
                  }, {
                     text: '<b>Save</b>',
                     type: 'button-positive',
                     onTap: function(e) {
                        save()
                     }
                  }, ]
               });

    }

    $scope.mapCreated = function (map) {
      $scope.map = map;
    }

    $scope.$on("$ionicView.afterEnter" ,function(event, data) {
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
                 isViapoint: true
                });
             }

             var waypoints = data.start.waypoints;
             for (var i = 0; i < data.wps.length; i++) {
               waypoints = waypoints.concat(data.wps[i].waypoints);
             }
             waypoints = waypoints.concat(data.end.waypoints);

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
    })

    function directionsUpdated(e) {
     // console.log(directionsManager.getAllWaypoints());
      var currentRoute = directionsManager.getCurrentRoute();
      var layer = new Microsoft.Maps.Layer();
      for (var i = 0; i < currentRoute.routeLegs.length; i++) {

        var selectedColour = "blue";
        if (i == 0) {
          selectedColour = "green"
        }
        var coord = [currentRoute.routeLegs[i].startWaypointLocation.latitude, 
          currentRoute.routeLegs[i].startWaypointLocation.longitude];
        var loc = GeoLocation.Location(coord[0], coord[1]);
        var pin = new Microsoft.Maps.Pushpin(loc, {
          color: selectedColour,
          text: i+1 + ""
        })
        layer.add(pin);
        Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
          console.log("im here")
        });

        if (i == currentRoute.routeLegs.length - 1) {
          var coord = [currentRoute.routeLegs[i].endWaypointLocation.latitude, 
            currentRoute.routeLegs[i].endWaypointLocation.longitude];
          var loc = GeoLocation.Location(coord[0], coord[1]);
          var pin = new Microsoft.Maps.Pushpin(loc, {
            color: "red",
            text: i+2 + ""
          })
          layer.add(pin);
          Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
            console.log("im here")
          });

        }
      }
      $scope.map.layers.insert(layer);
    }

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
        console.log($scope.filteredPeople);
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
            console.log(result);
            if (result.data.message == 'success') {
              console.log(result);
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
              console.log(result);
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
        }
      }
      console.log(data);
      console.log($scope.friend_requests);
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
      console.log(result);
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
      console.log(result);
      });
  }

  $scope.goBack = function () {
    $state.go('dashboard');
  }
})


.controller('MyRoutesCtrl', function($scope, $state, Auth, $http, RouteData, $ionicActionSheet, $ionicModal) {

  $scope.my_routes = [];
  $scope.shared_routes = [];
  $scope.friend_list = {};

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
            body: result.data.routes[i].body,
            title: "Route number " + (i+1), 
            comments: "Really nice!"
          });
        }
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
              title: "London University, United Kingdom - King's Cross, United Kingdom", 
              comments: "Really bad!"
            });
          }
        }

       }, function(e) {
        console.log(e)
       }
     );

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
     RouteData.set(route.body);
     console.log(route);
     $state.go('view_route');
    
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
    if (requests) {
      for (var i = 0; i < requests.length; i++) {
        $http(requests[i]).then(function(result) {console.log(result)},function (e) {console.log(e)});
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
})

/*
VIEW ROUTE CONTROLLER
 */

.controller('ViewRouteCtrl', function($state, $scope, BingLocationService, RouteData) {
  var route;
  var directionsManager;

  $scope.mapCreated = function (map) {
    $scope.map = map;
  }

  $scope.$on('$ionicView.afterEnter', function () {
    route = RouteData.get();
    BingLocationService.createRoute(route, $scope.map);

  });

  $scope.goBack = function () {
    RouteData.reset();      
    $state.go('my_routes');
    $scope.map.layers.clear();
    BingLocationService.resetDirectionsManager();
  }
}) 

