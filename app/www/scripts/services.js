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
		 		return (user)? user : false;
		 	},
		 	setApiUrl : function(url) {
		 		apiurl = url;
		 	},
		 	getApiUrl : function() {
		 		return (apiurl)? apiurl : false;
		 	}
		 }
	})

	.factory('Route', function () {
		var start, end, waypoints;
		return {
			getStart : function () {return start;},
			getEnd : function () {return end;},
			getWaypoints : function () {return waypoints;},
			addStart : function (start_args) {
				if (!start) start = [];
				if (start_args) {
					start.push(start_args);
					return true;
				}
				return false;
			},
			addEnd : function (end_args) {
				if (!end) end = [];
				if (end_args) {
					end.push(end_args);
					return true;
				}
				return false;
			},
			addWaypoints : function (wp) {
				if (!waypoints) waypoints = [];
				if (wp) {
					waypoints.push(wp);
					return true;
				}
				return false;
			},
			setWaypoints : function (wps) {
				if (wps && wps.isArray()) {
					waypoints = wps
					return true;
				}
				return false;
			},

			reset  : function (s=null, e=null, wp=null) {
				if (s) { start = null; }
				if (e) { end = null; }
				if (wp) { waypoints = []; }	
			}
		}
	})

	.factory('GeoLocation',[ '$cordovaGeolocation', '$ionicPopup' ,'BingLocationService', function( $cordovaGeolocation, $ionicPopup, BingLocationService) {
		var watch, frequency =700 ,
			latitude=0, longitude=0, 
			accuracy =0; 
		function getLatitude() { return latitude; }
		function getLongitude () { return longitude; }
		function getAccuracy() { return accuracy; }
		function setFrequency(freq) { frequency = freq; }
		function clearWatch(){ watch.clearWatch(); }
		function Location(lat, long) { return new Microsoft.Maps.Location(lat, long); }
		function getLocation() { return this.Location(latitude, longitude); }
		function getConstantLocation() {
		  
		var watchOptions = {
			frequency : frequency,
			enableHighAccuracy: false 
		};
		watch = $cordovaGeolocation.watchPosition(watchOptions);
		watch.then(
			null,
			function(err) {
				var alertPopup = $ionicPopup.alert({
					title: "GPS not enabled!!",
					template: "Please allow this application to use the devices current loaction," +
					" go to setting to accept this functionality"
				});
			},
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				accuracy = position.coords.accuracy; 
				altitude = position.coords.altitude;
			}
		);

		}
			
		return { 
			getLongitude: getLongitude,
			getLatitude: getLatitude,
			getAccuracy: getAccuracy,
			setFrequency: setFrequency,
			getConstantLocation: getConstantLocation,
			clearWatch: clearWatch,
			getLocation: getLocation,
			Location: Location,
		}
	}])

	.factory("BingLocationService", function($http, Route) {

		var credentials = "Av5wBqmsnnQASubvgnpJc-tfOm8-nSSCq3KteunuqY4s4lhtA3LuyupF5Xq1R8ng";
		var distance = 0.5

		function CallRestService(request) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", request);
			document.body.appendChild(script);
		}

	  	return {
			convertToPoint : function (address, inputType) {
				var baseURL = "http://dev.virtualearth.net/REST/v1/Locations/";
				var countryReg = ",GB";
				var addressLine = address + " " + countryReg;
				var geocodeRequest = baseURL + encodeURI(addressLine) + "?output=json";
				if (inputType === "s") {
					Route.reset(true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoStartCallback&key=" + credentials;
					revGeoStartCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							console.log(result);
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
								}
								Route.addStart(suggestion);
							}
				  		}
					}
				}
				else if (inputType === "e") {
					Route.reset(null, true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoEndCallback&key=" + credentials;
					revGeoEndCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							console.log(result);
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
								}
								Route.addEnd(suggestion);
							}
				  		}
					}

				}
				else if (inputType === "wp") {
					Route.reset(null, null, true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoWaypointsCallback&key=" + credentials;
					revGeoWaypointsCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							console.log(result);
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
								}
								Route.addWaypoints(suggestion);
							}
				  		}	
					}

				}
				else {
					alert("WTF ARE U GIVING ME?");
					return false;
				}

				CallRestService(geocodeRequest);
			}    
		}
	})


