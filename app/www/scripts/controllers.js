angular.module('starter.controllers',['starter.services'])

.controller('LoginCtrl', function($scope, $state, loginData) {

   $scope.data = {
      client_id : 2, 
      client_secret: 'Bz49wi5uKhFW6c2993W6FnOYxsJ60FPMSgqx0m1H',
      scope : '*'
   };

   $scope.default_text = "Please login";
   $scope.login = function(user_data) {
       if ($scope.data.username && $scope.data.password)
       {  
          // Ryan - Login
          // Login then set token to access token.
          Auth.login($scope, function(result) {
            $scope.credentials = {
              token : result.access_token
            }
          });

          loginData.updateForm(user_data);
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

.controller('RegisterCtrl', function($scope, $state, Auth) {
  $scope.goToLogin = function(){
    $state.go('login');
  };

  $scope.register = function() {

    if ($scope.register.firstName && $scope.register.lastName && $scope.register.email &&
        $scope.register.password && $scope.register.password_confirm){
        if ($scope.register.password == $scope.register.password_confirm)
        {
          // Ryan
          // Register a user with email and password
          var auth = {
            email : $scope.register.email,
            password : $scope.register.password
          };
          Auth.save(auth, function (result) {
              alert("You have successfuly created an account");
              $scope.goToLogin();            
          });          

        }else {
          alert("Warning! The password do not match. Please try again.");
        }
    } else alert("Please fill out the fields before submitting");
  };
})

.controller('DashboardCtrl', function($scope, $state, loginData) {
  $scope.user_data = loginData.getForm();
  $scope.goViewFriends = function(){
      $state.go('friends');
  };
  $scope.goCreateRoute = function(){
      $state.go('create_route');
  };
})

.controller('FriendsCtrl', function($scope, $state) {
  $scope.rawFriends = [{'firstName':'John' , 'lastName': 'Smith'},
                    {'firstName':'Ryan' , 'lastName': 'Alexander'},
                    {'firstName':'Maya' , 'lastName': 'Morgenstein'},
                    {'firstName':'Arthur' , 'lastName': 'Pendragon'}];
  $scope.friends = [];
  for (var i in $scope.rawFriends)
  {
    $scope.friends.push({'name': $scope.rawFriends[i].firstName+' '+$scope.rawFriends[i].lastName});
  }
  $scope.goBack = function(){
      $state.go('dashboard');
        }
})

.controller('CreateRouteCtrl', function($scope, $state) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
})