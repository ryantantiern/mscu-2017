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

.controller('FriendsCtrl', function($scope, $state) {
  $scope.rawFriends = [{'firstName':'John' , 'lastName': 'Smith', 'phone':'07935682465'},
                    {'firstName':'Ryan' , 'lastName': 'Alexander', 'phone':'07956324589'},
                    {'firstName':'Maya' , 'lastName': 'Morgenstein', 'phone':'07945652401'},
                    {'firstName':'Arthur' , 'lastName': 'Pendragon', 'phone':'07923690222'}];
  $scope.friends = [];
  $scope.filteredFriends = [];
  $scope.searchQuery = "";
  for (var i in $scope.rawFriends)
  {
    $scope.friends.push({'name': $scope.rawFriends[i].firstName+' '+$scope.rawFriends[i].lastName});
  }

  $scope.goBack = function(){
      $state.go('dashboard');
        }
  $scope.goAddFriend = function(){
          $state.go('add_friend');
      };



})

.controller('CreateRouteCtrl', function($scope, $state) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
})
.controller('ProfileCtrl', function($scope, $state, loginData) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
  $scope.user_data = loginData.getForm();

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

.controller('AddFriendCtrl', function($scope, $state) {
  $scope.goBack = function(){
      $state.go('dashboard');
  };
  $scope.rawPeople = [{'id': 0,'firstName':'John' , 'lastName': 'Smith', 'phone':'07935682465', 'request_sent': false},
                      {'id': 1,'firstName':'Ryan' , 'lastName': 'Alexander', 'phone':'07956324589', 'request_sent': false},
                      {'id': 2,'firstName':'Maya' , 'lastName': 'Morgenstein', 'phone':'07945652401', 'request_sent': false},
                      {'id': 3,'firstName':'Arthur' , 'lastName': 'Pendragon', 'phone':'07923690222', 'request_sent': false}];
  $scope.show = [];
  $scope.filteredPeople = $scope.rawPeople;
  $scope.searchQuery = "";

  $scope.updateList = function(searchQuery){
    $scope.filteredPeople = $scope.rawPeople;
    if (searchQuery && searchQuery.trim()!='') {
      $scope.filteredPeople = $scope.filteredPeople.filter((friend) => {
              return (friend.phone.indexOf(searchQuery) > -1);
            })

    }
  };

  $scope.sendFriendRequest = function(id) {
    for (var i in $scope.filteredPeople)
        if ($scope.filteredPeople[i].id== id) $scope.filteredPeople[i].request_sent = true;

  };
  $scope.cancelFriendRequest = function(id) {
     for (var i in $scope.filteredPeople)
         if ($scope.filteredPeople[i].id== id) $scope.filteredPeople[i].request_sent = false;

  };
})
