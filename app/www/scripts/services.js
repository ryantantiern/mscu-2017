angular.module('starter.services', ['ngResource'])
	.factory("Auth", ['$resource', function ($resource) {
			var url = "http://localhost:8000/api/";
			return $resource(url + ':controller/:method', {}, { // url template
				'connection' : {
					method : 'GET',
					params : {
						controller : 'connection'
					},
				},
				'save' : {
					method : 'POST',
					params : {
						controller : 'register',
						email : '@email',
						password : '@password',

					},
					headers : {
						Accept : 'application/json',
						"Content-Type" : 'application/json'
					}
				},
				'login' : {
					method : 'POST',
					params : {
						controller : 'oauth',
						method : 'token',
						grant_type : '@password',
						client_id : '@client_id',
						client_secret: '@client_secret',
						username : '@email',
						password : '@password',
						scope : '@scope'
					}
				}
			}
		);
	}])

