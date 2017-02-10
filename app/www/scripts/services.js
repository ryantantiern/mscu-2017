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
		var baseurl;
		 return {
		 	setUser : function(newUser) {
		 		user = newUser;
		 	},
		 	getUser : function() {
		 		return(user)? user : false;
		 	},
		 	setBaseUrl : function(url) {
		 		baseurl = url;
		 	},
		 	getBaseUrl : function() {
		 		return(baseurl)? baseurl : false;
		 	}
		 }
	})
