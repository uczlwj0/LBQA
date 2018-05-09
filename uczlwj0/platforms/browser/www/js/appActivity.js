//uczlwj0 - Code Source: the code is adapted from Claire's Web GIS practical

// load the map
var mymap = L.map('mapid').setView([51.505, -0.09], 13);
// load the tiles
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {maxZoom: 18,attribution: 'Map data &copy; <ahref="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +'<ahref="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>,' +'Imagery © <ahref="http://mapbox.com">Mapbox</a>',id: 'mapbox.streets'}).addTo(mymap);

// show where the users click
// create a custom popup
var popup = L.popup();
// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
function onMapClick(e) {
	 popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(mymap);
}
// now add the click event detector to the map
mymap.on('click', onMapClick);


// track user's location
function trackLocation() {
     if (navigator.geolocation) {
	     navigator.geolocation.watchPosition(showPosition);
    } 
     else {
	     document.getElementById('showLocation').innerHTML = "Geolocation is not supported by this browser.";
    }
     navigator.geolocation.watchPosition(calculateDistanceFromLocation);
}
function showPosition(position) {
	 document.getElementById('showLocation').innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
	 L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup(position.coords.latitude.toString()+","+position.coords.longitude.toString()+"<br />I am here.").openPopup();
}



// to see whether there is a location within 50m from the user
function calculateDistanceFromLocation(position) {
     // change the number from 302xx to 30275
     var geoJSONString = getWebData('http://developer.cege.ucl.ac.uk:30275/getGeoJSON/webgisquestion/geom');//find the coords 
     var geoJSON = JSON.parse(geoJSONString);
     for(var i = 0; i < geoJSON[0].features.length; i++) {
		 var feature = geoJSON[0].features[i];
         for (component in feature){
	         if (component =="geometry"){
		         for (geometry in feature[component]){
			         var lng = feature[component][geometry][0];
				     var lat = feature[component][geometry][1];
                     var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
                     document.getElementById('showDistance').innerHTML = "Distance: " + distance;
                     if (distance<5.0){// when the user is within 50m of the location, app will alert the question 
	                 L.marker([lat, lng]).addTo(mymap).bindPopup("<b>Within 50m</b>").openPopup();
					 showQuiz(i);
					 }
                }
            }
        }
    }
}

// get the data from website: http://developer.cege.ucl.ac.uk:30275/getGeoJSON/webgisquestion/geom
function getWebData(url) {
	 var webData;
     var xmlHttp ;
	 webData = '' ;
     xmlHttp = new XMLHttpRequest();
     if(xmlHttp != null){
         xmlHttp.open( "GET", url, false );
         xmlHttp.send( null );
         webData = xmlHttp.responseText;
       }
     return webData ;
}

// calculate the distance
// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	 var radlat1 = Math.PI * lat1/180;
     var radlat2 = Math.PI * lat2/180;
     var radlon1 = Math.PI * lon1/180;
     var radlon2 = Math.PI * lon2/180;
     var theta = lon1-lon2;
     var radtheta = Math.PI * theta/180;
     var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
     subAngle = Math.acos(subAngle);
     subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
     dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
     // where radius of the earth is 3956 miles
     if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
     if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
     return dist;
 }
 
// show the quiz
function showQuiz(i) {
     var geoJSONString = getWebData2('http://developer.cege.ucl.ac.uk:30275/getGeoJSON/webgisquestion/geom');
     var geoJSON = JSON.parse(geoJSONString);
     document.getElementById("question_id").innerHTML =geoJSON[0].features[i].properties.question_id;
     document.getElementById("question").innerHTML =geoJSON[0].features[i].properties.question;
     document.getElementById("answer_1").innerHTML =geoJSON[0].features[i].properties.answer_1;
     document.getElementById("answer_2").innerHTML =geoJSON[0].features[i].properties.answer_2;
     document.getElementById("answer_3").innerHTML =geoJSON[0].features[i].properties.answer_3;
     document.getElementById("answer_4").innerHTML =geoJSON[0].features[i].properties.answer_4;
}

function getWebData2(url) {
	 var webData2;
     var xmlHttp ;
	 webData2 = '' ;
     xmlHttp = new XMLHttpRequest();
     if(xmlHttp != null){
         xmlHttp.open( "GET", url, false );
         xmlHttp.send( null );
         webData2 = xmlHttp.responseText;
       }
     return webData2 ;
}


 