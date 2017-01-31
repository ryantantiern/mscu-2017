angular.module('starter.controllers',[])

.controller('LoginCtrl', function($scope, $state, loginData) {
   $scope.data = {};
   $scope.default_text = "Please login";
   $scope.login = function(user_data) {
       if ($scope.data.username && $scope.data.password)
       {
          loginData.updateForm(user_data);
          $state.go('dashboard');
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

.controller('RegisterCtrl', function($scope, $state) {
  $scope.goToLogin = function(){
    $state.go('login');
  };
  $scope.register = function() {
    if ($scope.register.firstName && $scope.register.lastName && $scope.register.email &&
        $scope.register.password && $scope.register.password_confirm){
        if ($scope.register.password == $scope.register.password_confirm)
        {
          alert("You have successfuly created an account");
          $scope.goToLogin();
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