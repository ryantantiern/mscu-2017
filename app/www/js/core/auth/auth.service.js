// Create Authentication factory
angular.
	module('core.auth').
	factory('Auth', ['$resource', function($resource) {
		return new Authentication($resource);
	}]);

// Authentication service
function Authentication($resource) {
	var url = "http://second-year-project.azurewebsites.net/api/";
	return $resource(url + ':controller/:method', {}, { // url template
		'connection' : {
			method : 'GET',
			params : {
				controller : 'connection'
			},
		},
		'register' : {
			method : 'POST',
			params : {
				controller : 'register',
				email : '@email',
				password : '@password',

			},
			headers : {
				Accept : 'application/json',
				'Content-Type' : 'application/json'
			}
		},
		'login' : {
			method : 'POST',
			params : {
				controller : 'oauth',
				method : 'token',
				grant_type : 'password',
				client_id : '2',
				username : '@email',
				password : '@password',
				scope : '*'
			}
		}
	});
}