angular.module('starter.controllers',['starter.services'])

/**
 * LOGIN CONTROLLER
 */
.controller('LoginCtrl', function($scope, $state, $http, loginData, Auth) {

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
             client_secret: "BzaSA8Z4dmWrzxFI9fcaZ6pCP7ic8wNy9jz0l4iy", //"A30fXBkF5oIRFKXV61P4EmghpDjFlhTIzvqd6OtW",
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

.controller('DashboardCtrl', function($scope, $state, Auth, $rootScope) {
  // Ryan 
  // Assign user_data to autheticated user
  $scope.user_data = Auth.getUser();
  console.log($scope.user_data);


  // Ryan - end
  
  $scope.goViewFriends = function(){
      $state.go('friends');
  };
  $scope.goAddFriend = function(){
        $state.go('add_friend');
    };
  $scope.goCreateRoute = function(){
          $state.go('create_route');
    };
    $scope.goProfile = function(){
          $state.go('profile');
      };
})

/**
 * FRIENDS CONTROLLER
 */

.controller('FriendsCtrl', function($scope, $state, $http, Auth) {
 
/*
  Leave out for now - not in use

  $scope.friends = [];
  $scope.filteredFriends = [];
  $scope.searchQuery = "";

*/

  // Ryan - List friends
  
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

.controller('CreateRouteCtrl', function($scope, $state) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
})
.controller('ProfileCtrl', function($scope, $state, loginData, Auth) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
  $scope.user_data = Auth.getUser();

  /* Delete this when grabbing from database */
  $scope.user_data['firstName'] = [];
  $scope.user_data['lastName'] = [];
  $scope.user_data['phone'] = [];
  $scope.user_data['address'] = [];
  $scope.user_data['photo'] = [];
  $scope.user_data['firstName'].push('John');
  $scope.user_data['lastName'].push('Doe');
  $scope.user_data['phone'].push('07999999999');
  $scope.user_data['address'].push('');
  $scope.user_data['photo'].push('/img/'+'profile.jpg');
  /* until here */
  $scope.takePic = function() {
      var options =   {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
          encodingType: 0     // 0=JPG 1=PNG
      }
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onSuccess,onFail,options);
  }
  var onSuccess = function(imageData) {
      console.log("On Success! ");
      $scope.picData = "data:image/jpeg;base64," +imageData;
      $scope.$apply();
  };
})

.controller('AddFriendCtrl', function($scope, $state, Auth, $http) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };

/*  $scope.rawPeople = [{'id': 0,'firstName':'John' , 'lastName': 'Smith', 'phone':'07935682465', 'request_sent': false},
                      {'id': 1,'firstName':'Ryan' , 'lastName': 'Alexander', 'phone':'07956324589', 'request_sent': false},
                      {'id': 2,'firstName':'Maya' , 'lastName': 'Morgenstein', 'phone':'07945652401', 'request_sent': false},
                      {'id': 3,'firstName':'Arthur' , 'lastName': 'Pendragon', 'phone':'07923690222', 'request_sent': false}];*/
  $scope.rawPeople = [];
  $scope.show = [];
  $scope.filteredPeople = [];
  $scope.searchQuery = "";

  // Search for user based on phone number or first/last (or both) name
  $scope.updateList = function(searchQuery){
    //$scope.filteredPeople = $scope.rawPeople;
    $scope.filteredPeople = [];
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
/*      $scope.filteredPeople = $scope.filteredPeople.filter((friend) => {
              return (friend.phone.indexOf(searchQuery) > -1);
            })*/
    }
  };

  $scope.sendFriendRequest = function(id) {
    for (var i in $scope.filteredPeople)
      // TODO: Send API friend request
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
              console.log(result);
              $scope.filteredPeople[i].request_sent = true;
            }
          });
          break;
        }
  };
  $scope.cancelFriendRequest = function(id) {
     for (var i in $scope.filteredPeople)
      // TODO: Cancel API friend request
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
