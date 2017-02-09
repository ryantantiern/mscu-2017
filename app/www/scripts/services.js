angular.module('services',[])
	.factory('Auth', function() {
		var user;
		 return {
		 	setUser : function(newUser) {
		 		user = newUser;
		 	},
		 	getUser : function() {
		 		return(user)? user : false;
		 	}


		 }
	})