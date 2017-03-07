angular.module('starter.controllers',['starter.services'])

/**
 * LOGIN CONTROLLER
 */
.controller('LoginCtrl', function($scope, $state, $http, loginData, Auth) {

   $scope.data = {};
   $scope.default_text = "Please login";
   $scope.login = function(user_data) {
/*    var user = {
      'firstname' : 'Ryan' ,
      'lastname' : 'Tan',
      'email' : 'ryan@test.com',
      'phone' : '012345678910' ,
      'access_token' : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjVjMTc5MTRmNmY3NGM4Mjg2ZTliMTZlODY1Y2I0MDkzMDU4ZTlhMmY2NzJlOGZiM2IyMjUzOWQzNzk0ZTE4OGZkMGQwYzYyN2E5ODZlOGMxIn0.eyJhdWQiOiIyIiwianRpIjoiNWMxNzkxNGY2Zjc0YzgyODZlOWIxNmU4NjVjYjQwOTMwNThlOWEyZjY3MmU4ZmIzYjIyNTM5ZDM3OTRlMTg4ZmQwZDBjNjI3YTk4NmU4YzEiLCJpYXQiOjE0ODcwMDE1MzQsIm5iZiI6MTQ4NzAwMTUzNCwiZXhwIjoxNTE4NTM3NTM0LCJzdWIiOiIxMCIsInNjb3BlcyI6WyIqIl19.iiJLez7V3nIUy9McYL39vEt5ir8kMq__M3BCpi7s5SCcnhQLBBvunb41sdd7Il-if54Xz2tQmBYcFXYN29zFaPrlRmKykZ-_qZNRLZMk0J8vWATpNcEI9JN-n0_BV5fye9D3inriM-XlQMnksAmC0BbyWUmLszZVr0ZAwBPZ6xs93i0A1wA3Zfsgx77xHS2p5tX3jgl978zTuuNgc2opI4h0z8s34HBuyz-0lxv4caoZKLc2zmL5UNwro97RWYO2gxV8m0KZz6QSglf_3h24XlJmufgrdqvySYM1WyXjopQKGuXBrnIVXr3pFMVRuSVC48F76GBs1T-qvMcSKYKnHqw2rv0PnRshaxbiCaiRye34wRUZZoNP-BvcaU3PEg2qzrzrK2Mi0RK_GebntUsvvGQeKgxQp3YzAZ-k4HKdYVCbxnxlnNjKNcziN2_pQV8g0IjBRNuXTPJCOn0enVlBEYAqn4z2re4XVpgF6nrbm_PdMDXw8QJtoKMFBIXbyHQ3hdlOXB1vOTbagt7LHQ855ne2CGOA6ODwERp4O5MzfLhQvg1juVQlC3B0Mo2uoD_dtozT1qlGDVttNW3AXd8rpidqUjxk4aLlN4SaTrllysyGDGekZUeKVyN3rdu7UbgInALqGLLn3Dj1PSQQkMW7lXQ_PAhuTVmQlSk9J4t82i4'
    }
    Auth.setUser(user);
    $state.go('dashboard');*/

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


              // loginData.updateForm(Auth.getUser());
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

.controller('DashboardCtrl', function($scope, $state, Auth, GeoLocation) {
  // Ryan 
  // Assign user_data to autheticated user
  $scope.$on('$ionicView.beforeEnter', function() {
    $scope.user_data = Auth.getUser();

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
      console.log(result);

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
          console.log(friend);
        }
      }
      console.log($scope.rawFriends);
    });

  }, function () {
    alert("Error: Could not update friends list");
  });

// Ryan - End

  /*
    REDUNDANT - BAD CODE?
    for (var i in $scope.rawFriends)
    {
      $scope.friends.push({'name': $scope.rawFriends[i].firstName+' '+$scope.rawFriends[i].lastName});
    }
  */

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
      }, 200);  
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
      }, 200);  
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
          console.log( $scope.wpAddresses)
          clearInterval(interval);
        }
      }, 200); 
     $scope.suggestionFlag = "wp" + wpIndex;

    }

    console.log($scope.suggestionFlag);
    console.log(wpIndex);
  }

  $scope.next = function () {
    // make a check to see if start, end and waypoints are valid coordinates
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

  .controller('CustomizeRouteCtrl', function($scope, $state, GeoLocation, BingLocationService, RouteData) {
    
    $scope.goBack = function () {
      $state.go('create_route')
    }

    $scope.mapCreated = function (map) {
      $scope.map = map;

      Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
          var data = RouteData.get();
          var waypoints = [];

          data.start.waypoints = [new Microsoft.Maps.Directions.Waypoint({ 
            address: data.start.address 
          })];

          data.end.waypoints = [new Microsoft.Maps.Directions.Waypoint({ 
            address: data.end.address
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
          console.log(waypoints);


           //Create an instance of the directions manager.
           var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

           //Set Route Mode to transit.
           directionsManager.setRequestOptions({
               routeMode: Microsoft.Maps.Directions.RouteMode.walking,
               distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,

           });

 
           //Add waypoints.
           for(var i = 0; i <waypoints.length; i++) {
            directionsManager.addWaypoint(waypoints[i]);
            console.log(waypoints[i])
           }

           //Calculate directions.
           directionsManager.calculateDirections(); 
           console.log(directionsManager);

      });
    }
  })


/**
 * PROFILE CONTROLLER
 */

.controller('ProfileCtrl', function($scope, $ionicPopup, $state, loginData, $cordovaCamera, $ionicLoading, $localStorage, Auth) {

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
          console.log(result);
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

