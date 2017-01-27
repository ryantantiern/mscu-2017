// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngResource'])

.run(function($ionicPlatform, $resource) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    var host = 'http://second-year-project.azurewebsites.net';
    var test_conn = $resource('http://second-year-project.azurewebsites.net/api/connection');
    test_conn.get( function (response) {
      console.log(response.friends);
    });

  });
})


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginCtrl"
    })
    .state('register', {
      url: "/register",
      templateUrl: "templates/register.html",
      controller: "RegisterCtrl"
    })
    .state('dashboard', {
          url: "/dashboard",
          templateUrl: "templates/dashboard.html",
          controller: "DashboardCtrl"
    })
    .state('friends', {
              url: "/friends",
              templateUrl: "templates/friends.html",
              controller: "FriendsCtrl"
     })


  $urlRouterProvider.otherwise("/login");
})

.controller('LoginCtrl', function($scope, $state, loginData) {
   $scope.data = {};
   $scope.default_text = "Please login";
   $scope.login = function(user_data) {
       if ($scope.data.username && $scope.data.password)
       {
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
  $scope.viewFriends = function(){
      $state.go('friends');
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
  $scope.goToDashboard = function(){
      $state.go('dashboard');
        }
})

.service('loginData', function() {
 return {
   form: {},
   getForm: function() {
     return this.form;
   },
   updateForm: function(form) {
     this.form = form;
   }
 }
})
