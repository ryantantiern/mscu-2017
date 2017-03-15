// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('starter', ['ionic', 'ngCordova', 'ngStorage', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform, $localStorage, GeoLocation, $cordovaPush) {
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
    GeoLocation.getConstantLocation();
  });
})
.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider){

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
          controller: "DashboardCtrl",
    })
    .state('friends', {
          url: "/friends",
          templateUrl: "templates/friends.html",
          controller: "FriendsCtrl"
     })
	  .state('create_route', {
          url: "/create_route",
          templateUrl: "templates/create_route.html",
          controller: "CreateRouteCtrl"
	  })

    .state('customize_route', {
           url: "/customize_route",
           templateUrl: "templates/customize_route.html",
           controller: "CustomizeRouteCtrl"
    })

	  .state('add_friend', {
              url: "/add_friend",
              templateUrl: "templates/add_friend.html",
              controller: "AddFriendCtrl"
    })

    .state('profile', {
           url: "/profile",
           templateUrl: "templates/profile.html",
           controller: "ProfileCtrl"
    })

    .state('friend_requests', {
           url: "/friend_requests",
           templateUrl: "templates/friend_requests.html",
           controller: "FrRequestsCtrl"
    })

    .state('my_routes', {
               url: "/my_routes",
               templateUrl: "templates/my_routes.html",
               controller: "MyRoutesCtrl"
        })
  $urlRouterProvider.otherwise("/login");

  // Cache forward navigations
  $ionicConfigProvider.views.forwardCache(true);
})


.run(function($rootScope, $location,  $state, Auth) {
  $rootScope.$on('$stateChangeStart', function (event) {
      if (!Auth.getApiUrl()) Auth.setApiUrl("http://second-year-project.azurewebsites.net");

      // Prevent non authenticated user to access app
/*      if ($location.path() != '/create_route' && $location.path() != '/create_route') {

          if (!Auth.getUser()) {
            event.preventDefault();
            $location.path('/create_route'); // Set path to /login
            $state.go('create_route'); // Actually navigate to /login
          }
       }*/
   });
})

