angular.module('starter.services',[])

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

	.factory('Auth', function() {
		var user;
		var apiurl;
		 return {
		 	setUser : function(newUser) {
		 		user = newUser;
		 	},
		 	getUser : function() {
		 		return(user)? user : false;
		 	},
		 	setApiUrl : function(url) {
		 		apiurl = url;
		 	},
		 	getApiUrl : function() {
		 		return (apiurl)? apiurl : false;
		 	}
		 }
	})
