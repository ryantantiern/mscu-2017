angular.module('starter.services',[])
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

	.factory('RouteCreator', function () {
		var start, end, waypoints;
		return {
			getStart : function () {
				if (start == null || (start.constructor == Array && start.length == 0) ) {
					// So that empty array is not returned
					return null;
				}
				return start;
			},
			getEnd : function () {
				if (end == null || (end.constructor == Array && end.length == 0) ) {
					return null;
				}
				return end;
			},
			getWaypoints : function () {
				if (waypoints == null || (waypoints.constructor == Array && waypoints.length == 0) ) {
					return null;
				}
				return waypoints;
			},
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
			addWaypoint : function (wp) {
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

	.factory('RouteData', function () {
		var route;
		return {
			set(data) {
				route = data;
			},
			get() {
				return (route)? route : false;
			},
			reset() {
				route = null;
			}
		}
	})



	.factory('GeoLocation',[ '$cordovaGeolocation', '$ionicPopup', function( $cordovaGeolocation, $ionicPopup) {
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

	.factory("BingLocationService", function($http, RouteCreator, GeoLocation) {

		var credentials = "Av5wBqmsnnQASubvgnpJc-tfOm8-nSSCq3KteunuqY4s4lhtA3LuyupF5Xq1R8ng";
		var distance = 0.5;
		var directionsManager;

		function CallRestService(request) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", request);
			document.body.appendChild(script);
		}

	  	return {
			convertToPoint : function (address, inputType) {
				if (address === "") {return;}
				var baseURL = "http://dev.virtualearth.net/REST/v1/Locations/";
				var countryReg = ",England";
				var addressLine = address + " " + countryReg;
				var geocodeRequest = baseURL + encodeURI(addressLine) + "?output=json";
				if (inputType === "s") {
					RouteCreator.reset(true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoStartCallback&key=" + credentials;
					revGeoStartCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
									entityType : result.resourceSets[0].resources[i].entityType,
								}
								console.log(result.resourceSets[0].resources[i]);
								RouteCreator.addStart(suggestion);
							}
				  		}
					}
				}
				else if (inputType === "e") {
					RouteCreator.reset(null, true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoEndCallback&key=" + credentials;
					revGeoEndCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
									entityType : result.resourceSets[0].resources[i].entityType,
								}
								console.log(result.resourceSets[0].resources[i]);
								RouteCreator.addEnd(suggestion);
							}
				  		}
					}

				}
				else if (inputType === "wp") {
					RouteCreator.reset(null, null, true);
					geocodeRequest = geocodeRequest +  "&jsonp=revGeoWaypointsCallback&key=" + credentials;
					revGeoWaypointsCallback = function (result) {
						if (result && result.resourceSets.length > 0 && result.resourceSets[0].resources) {
							for (var i = 0 ; i < result.resourceSets[0].resources.length; i++) {
								var suggestion = {
									address : result.resourceSets[0].resources[i].address.formattedAddress,
									coordinates :  result.resourceSets[0].resources[i].geocodePoints[0].coordinates,
									entityType : result.resourceSets[0].resources[i].entityType,
								}
								console.log(result.resourceSets[0].resources[i]);
								RouteCreator.addWaypoint(suggestion);
							}
				  		}	
					}

				}
				else {
					alert("WTF ARE U GIVING ME?");
					return false;
				}

				CallRestService(geocodeRequest);
			}, 

			createRoute : function (wps, mapScope) {

				var map = mapScope;
				// wps :: [[lat, lon], [lat, lon]]
				Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {

							 wps = JSON.parse(wps);
				       var waypoints = [], startWp, endWp, viaWps = [];
				       var lastIndex = wps.length - 1;

				       // start, end and via waypoints
				       startWp = [new Microsoft.Maps.Directions.Waypoint({
				         location: GeoLocation.Location(wps[0][0], wps[0][1]),
				         isViapoint: false
				       })];

				       endWp = [new Microsoft.Maps.Directions.Waypoint({
				         location: GeoLocation.Location(wps[lastIndex][0], wps[lastIndex][1]),
				         isViapoint: false
				       })];

				       for (var i = 1; i < lastIndex; i++) {
				           var tempWp =  new Microsoft.Maps.Directions.Waypoint({
				           location:  GeoLocation.Location(wps[i][0], wps[i][1]),
				           isViapoint: true
				          });
				           viaWps.push(tempWp);
				       }

				       waypoints = startWp;
				       for (var i = 0; i < viaWps.length; i++) {
				         waypoints = waypoints.concat(viaWps[i]);
				       }
				       waypoints = waypoints.concat(endWp);

				        //Create an instance of the directions manager.
				        directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

				        //Set Route Mode to transit.
				        directionsManager.setRequestOptions({
				            routeMode: Microsoft.Maps.Directions.RouteMode.walking,
				            distanceUnit: Microsoft.Maps.Directions.DistanceUnit.km,
				            routeDraggable: false
				        });

				        //Add waypoints.
				        for(var i = 0; i <waypoints.length; i++) {
				         directionsManager.addWaypoint(waypoints[i]);
				        }

				        //Calculate directions.
				        directionsManager.calculateDirections();
				        Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', directionsUpdated);
				   });

				function directionsUpdated(e) {
				  var currentRoute, layer, selectedColour, coord, loc, pin;

				  currentRoute = directionsManager.getCurrentRoute();
				  layer = new Microsoft.Maps.Layer();

				  for (var i = 0; i < currentRoute.routeLegs.length; i++) {
				    selectedColour = "blue";
				    if (i == 0) { selectedColour = "green" }

				  	coord = [currentRoute.routeLegs[i].startWaypointLocation.latitude, 
				  	  currentRoute.routeLegs[i].startWaypointLocation.longitude];
				  	loc = GeoLocation.Location(coord[0], coord[1]);
				  	pin = new Microsoft.Maps.Pushpin(loc, {
				  	  color: selectedColour,
				  	  text: i+1 + ""
				  	});
				  	Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
				  	  console.log("im here");
				  	});
				  	layer.add(pin);

				    if (i == currentRoute.routeLegs.length - 1) {
				      coord = [currentRoute.routeLegs[i].endWaypointLocation.latitude, 
				        currentRoute.routeLegs[i].endWaypointLocation.longitude];
				      loc = GeoLocation.Location(coord[0], coord[1]);
				      pin = new Microsoft.Maps.Pushpin(loc, {
				        color: "red",
				        text: i+2 + ""
				      });
				      Microsoft.Maps.Events.addHandler(pin, 'click', function(e) {
				        console.log("im here")
				      });
				      layer.add(pin);
				  	}
				  }
				 map.layers.insert(layer);
				}
			}, 
			resetDirectionsManager : function () {
				if (directionsManager) {
					directionsManager.clearAll();
					directionsManager.clearDisplay();
				}
			}
		}
	})


