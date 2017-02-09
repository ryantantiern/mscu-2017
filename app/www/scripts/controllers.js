angular.module('starter.controllers',[])

/**
 * LOGIN CONTROLLER
 */

.controller('LoginCtrl', function($scope, $state, $http, loginData, Auth) {
   $scope.data = {};
   $scope.default_text = "Please login";
   $scope.login = function(user_data) {
       if ($scope.data.username && $scope.data.password)
       {
          // Ryan - Login - get oauth token        
          var request = {
            method : 'POST',
            url : "http://localhost:8000/oauth/token",
            data : {
              grant_type: "password",
              client_id: "2",
              client_secret: "Bz49wi5uKhFW6c2993W6FnOYxsJ60FPMSgqx0m1H",
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
              var user = {
                access_token : result.data.access_token,
                username : $scope.data.username
              };

              // get current user's data and save them locally
              Auth.setUser(user);

 /*             $http.get(request.url).then(function(user) {
                // get current user's data and save them locally
                  var newUser = {

                  }
              });*/
              console.log("Success");

              loginData.updateForm(user);
              $state.go('dashboard');
            }
            else {
              alert("Something went wrong");                
            }
          }, function(e) {
              alert(e.data.error + ': ' + e.data.message);
          });

          // END Ryan - Login

       }
       else
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

.controller('RegisterCtrl', function($scope, $state, $http) {
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
            url : "http://localhost:8000/api/register",
            data : {
              firstname : $scope.register.firstName,
              lastname : $scope.register.lastName,
              email : $scope.register.email,
              password : $scope.register.password
            },
            headers :  {
              'Content-Type' : 'application/json',
              Accept: 'application/json'
            }
          }

        $http(request).then(function(result) {
          if (result.data.status == 'all ok!') {
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

.controller('DashboardCtrl', function($scope, $state, loginData, Auth) {
  //$scope.user_data = loginData.getForm();
  // Ryan 
  // Assign user_data to autheticated user
  $scope.user_data = Auth.getUser();

  // Ryan - end
  
  $scope.goViewFriends = function(){
      $state.go('friends');
  };
  $scope.goCreateRoute = function(){
      $state.go('create_route');
  };
})

/**
 * FRIENDS CONTROLLER
 */

.controller('FriendsCtrl', function($scope, $state, $http, Auth) {
  // Ryan - List friends
  // 
  $scope.rawFriends = [];
  console.log($scope.rawFriends);

  $scope.$on('$ionicView.beforeEnter', function () {
    var request = {
      method : 'GET',
      url : "http://localhost:8000/api/friends",
      headers : {
        Authorization : 'Bearer ' + Auth.getUser().access_token
      }
    }

    $http(request).then(function(result) {
      // flush rawFriends and friends if callaback is successful
      console.log(result);

      for (var i in result.data.response) {
        var friend = {
          "firstName" : result.data.response[i].email,
          "lastName" : result.data.response[i].id,
        };

        // TODO: FIX THIS
        var j = 0;
        while(j < $scope.rawFriends.length) {
          if ($scope.rawFriends[j].firstName == friend.firstName && $scope.rawFriends[j].lastName == friend.lastName) {
            break;
          }
          j++;
        }
        if (j == $scope.rawFriends.length){
          $scope.rawFriends.push(friend);
         }

      }

      console.log($scope.rawFriends);


    });

  }, function () {
    alert("Error: Could not update friends list");
  });

// Ryan - End
  


  $scope.goBack = function(){
      $state.go('dashboard');
  }
})

/**
 * CREATE ROUTE CONTROLLER
 */

.controller('CreateRouteCtrl', function($scope, $state) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
})