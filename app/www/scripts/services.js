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

	.factory('GeoLocation',[ '$cordovaGeolocation', '$ionicPopup' ,'BingLocationService', function( $cordovaGeolocation, $ionicPopup, BingLocationService) {
		var watch;
		var frequency =700;
		var latitude=0;
		var longitude=0;
		var accuracy =0; 
		var altitude =0;
		var streetName=""
		  function getLatitude() {
		    return latitude;
		  }
		  function getLongitude () {
		    return longitude;
		  }
		  function getAltitude() {
		    return altitude;
		  }
		  function getAccuracy() {
		    return accuracy;
		  }
		  function setFrequency(freq) {
		    frequency = freq;
		  }
		  function clearWatch(){
		    watch.clearWatch();
		  }

		  function Location(lat, long) {
		  	return new Microsoft.Maps.Location(lat, long)
		  }
		  
		  function getLocation() {
		  	return this.Location(latitude, longitude)
		  }

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
		          //console.log("GPS coordinates");
		            latitude = position.coords.latitude;
		            longitude = position.coords.longitude;
		            accuracy = position.coords.accuracy; 
		           	altitude = position.coords.altitude;
		           	BingLocationService.setStreetName(latitude, longitude)
		         }
		      );
		    
		  }
		
		 return { 
		  getLongitude: getLongitude,
		  getLatitude: getLatitude,
		  getAltitude: getAltitude,
		  getAccuracy: getAccuracy,
		  setFrequency: setFrequency,
		  getConstantLocation: getConstantLocation,
		  clearWatch: clearWatch,
		  getLocation: getLocation,
		  Location: Location,
		  }
		}])

	  .factory("BingLocationService", [ '$http', function($http){

		var credentials = "Av5wBqmsnnQASubvgnpJc-tfOm8-nSSCq3KteunuqY4s4lhtA3LuyupF5Xq1R8ng";
		//var dataSourceName = "NavteqEU";
		//var entityTypeName = "NavteqPOIs";
		//var accessID ="c2ae584bbccc4916a0acf75d1e6947b4";
		var distance = 0.5
		var streetName = ""
		var address = {}
		var point = null
		var setPointFlag = false

		function CallRestService(request) {
			var script = document.createElement("script");
			script.setAttribute("type", "text/javascript");
			script.setAttribute("src", request);
			document.body.appendChild(script);
		}
	  	return {
	  		setStreetName: function(latitude ,longitude){	

				var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations/" + encodeURI(latitude + "," + longitude) + "?&output=json&jsonp=GeocodeCallback&key=" + credentials;
				//console.log(geocodeRequest)

				CallRestService(geocodeRequest);

	  			GeocodeCallback = function(result) {
		    		if (result &&
		      			result.resourceSets &&
		      			result.resourceSets.length > 0 &&
		      			result.resourceSets[0].resources &&
		      			result.resourceSets[0].resources.length > 0) {

		      			address = result.resourceSets[0].resources[0].address;
		      			streetName = address.addressLine
		      			/* streetName = {
							addressLine, adminDistrict, adminDistrict2, countryRegion, formattedAddress
							locality, postalCode
		      			}  			
		      			 */
		      			

		   		 		} else {
		     	 		console.log("error Bing can't find location, error: " + + JSON.stringify(result));
		 		   		}
		  			}  
			},
			getStreetName: function(){
				return streetName;
			},

			getLocationFromAddress: function (street) {
				var promise = new Promise(function (resolve, reject) {
					var geocodeRequest = "http://dev.virtualearth.net/REST/v1/Locations?countryRegion=United%20Kingdom&addressLine="+ encodeURI(street)+"&adminDistrict=England&output=json&jsonp=ReverseGeocodeCallback&key="+ credentials;
					CallRestService(geocodeRequest);
					ReverseGeocodeCallback = function (result) {
						if (result &&
				  			result.resourceSets &&
				  			result.resourceSets.length > 0 &&
				  			result.resourceSets[0].resources &&
				  			result.resourceSets[0].resources.length > 0) {
							point = result.resourceSets[0].resources[0].geocodePoints[0].coordinates
							setPointFlag = true
						}
					}
					if (point) {
						console.log()
						resolve(point)
					}
				})

				return promise
			},

			getPoint: function () {
				return point
			},

			resetPoint: function () {
				point = null
			}
/*	    getNearPin: function(latitude,longitude){
	      var url = "http://spatial.virtualearth.net/REST/v1/data/"+accessID+"/"+dataSourceName+"/"+entityTypeName+"?spatialFilter=nearby("+latitude+","+ longitude+","+distance+")&$select=EntityID,Name, AddressLine, DisplayName,__Distance,Latitude,Longitude,EntityTypeID&$format=json&key="+credentials;
	      return $http.get(url);
	    }*/

	  	}
	  }])


