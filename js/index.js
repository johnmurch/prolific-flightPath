// Animation / interval Vars
var animLoop = false,
    animIndex = 0,
    planePath = false,
    trailPath = false;


// Reference of city lat / long points
var people = {
    "johnmurch": [{
        area: "Westfield, NJ",
        geo: [40.6589910, -74.3473720]
    }, {
        area: "Burlington, VT",
        geo: [44.4758820, -73.2120720]
    }, {
        area: "Brooklyn, NY",
        geo: [40.7030630, -73.9904600]
    }]
}
var places = {
    "westfield": [40.6589910, -74.3473720],
    "burlington": [44.4758820, -73.2120720],
    "brooklyn": [40.7030630, -73.9904600]
};
// Set up a google maps object with disabled user interaction (no zoom, no pan etc.)
function loadMap() {
    var options = {
        draggable: false,
        panControl: false,
        streetViewControl: false,
        scrollwheel: false,
        scaleControl: false,
        disableDefaultUI: true,
        disableDoubleClickZoom: true,
        zoom: 7,
        center: new google.maps.LatLng(41.850033, -87.6500523),
        styles: [{
            "featureType": "administrative",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "water",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "landscape",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.local",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "stylers": [{
                "color": "#84afa3"
            }, {
                "lightness": 52
            }]
        }, {
            "stylers": [{
                "saturation": -17
            }, {
                "gamma": 0.36
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "color": "#3f518c"
            }]
        }]
    };
    mapObject = new google.maps.Map(document.getElementById('mapCanvas'), options);
}
// Plane Symbol - uses an SVG path
var planeSymbol = {
    path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z',
    fillColor: '#000',
    fillOpacity: 1.5,
    scale: 0.8,
    anchor: new google.maps.Point(11, 11),
    strokeWeight: 0
};

function trip(person, connection) {
		console.log(person);
		//@todo - change out hardcoded
		startPoint = places["westfield"],
		midPoint = places["burlington"],
		endPoint = places["brooklyn"]
        // Convert the points arrays into Lat / Lng objects
    var sP = new google.maps.LatLng(startPoint[0], startPoint[1]);
    var mP = new google.maps.LatLng(midPoint[0], midPoint[1]);
    var eP = new google.maps.LatLng(endPoint[0], endPoint[1]);
    // Create a polyline for the planes path
    console.log("CONNECTION: "+connection)
    if(connection){
	    planePath = new google.maps.Polyline({
	        path: [sP, mP],
	        strokeColor: '#0f0',
	        strokeWeight: 0,
	        icons: [{
	            icon: planeSymbol,
	            offset: '0%'
	        }],
	        map: mapObject,
	        geodesic: true
	    });
	    trailPath = new google.maps.Polyline({
	        path: [sP, sP],
	        strokeColor: '#2eacd0',
	        strokeWeight: 2,
	        map: mapObject,
	        geodesic: true
	    });   
    }else{
  	    planePath = new google.maps.Polyline({
	        path: [mP, eP],
	        strokeColor: '#0f0',
	        strokeWeight: 0,
	        icons: [{
	            icon: planeSymbol,
	            offset: '0%'
	        }],
	        map: mapObject,
	        geodesic: true
	    });
	    trailPath = new google.maps.Polyline({
	        path: [mP, mP],
	        strokeColor: '#2eacd0',
	        strokeWeight: 2,
	        map: mapObject,
	        geodesic: true
	    }); 	
    }
    animLoop = window.requestAnimationFrame(function() {
        flightPath(sP, mP, eP, connection);
    });
}

function addLine() {
  trailPath.setMap(map);
}

function clearMap() {
	// mapObject.setCenter(new google.maps.LatLng(39.5, -98.3))
	// mapObject.setZoom(4);
	// planePath.setMap(null);
 	// trailPath.setMap(null);
	window.location.reload()
}

function flightPath(startPoint, midPoint, endPoint, layover) {
    animIndex += 1;
    // Draw trail

    if(layover){
	    var nextPoint = google.maps.geometry.spherical.interpolate(startPoint, midPoint, animIndex / 100);
	    trailPath.setPath([startPoint, nextPoint]);    	
    }else{
	    var nextPoint = google.maps.geometry.spherical.interpolate(midPoint, endPoint, animIndex / 100);
	    trailPath.setPath([midPoint, nextPoint]);
    }
    // Move the plane
    planePath.icons[0].offset = Math.min(animIndex, 100) + '%';
    planePath.setPath(planePath.getPath());
    // Ensure the plane is in the center of the screen
    mapObject.panTo(nextPoint);
    // We've reached the end, clear animLoop
    if (animIndex >= 100) {
        window.cancelAnimationFrame(animLoop);
        animIndex = 0;
        console.log("LAYOVER"+layover)
        if(layover){
	        trip("johnmurch", false);
        }else{
	        console.log("DONE");
        }
    } else {
        animLoop = window.requestAnimationFrame(function() {
            flightPath(startPoint, midPoint, endPoint, layover);
        });
    }
}


function flight(startPoint, midPoint, endPoint, status) {
    animIndex += 1;
    // Draw trail

    var nextPoint = google.maps.geometry.spherical.interpolate(startPoint, midPoint, animIndex / 100);
    trailPath.setPath([startPoint, nextPoint]);

    // Move the plane
    planePath.icons[0].offset = Math.min(animIndex, 100) + '%';
    planePath.setPath(planePath.getPath());
    // Ensure the plane is in the center of the screen
    mapObject.panTo(nextPoint);
    // We've reached the end, clear animLoop
    if (animIndex >= 100) {
        window.cancelAnimationFrame(animLoop);
        animIndex = 0;
        console.log("DONE");
        console.log(status);
        if(status!=1){
	        animate2("johnmurch");
        }
	    // window.cancelAnimationFrame(animLoop);
	    // animIndex = 0;
	    // animate(document.getElementById('person').options[document.getElementById('person').selectedIndex].value,1
	    //     // 		document.getElementById('s_from').options[document.getElementById('s_from').selectedIndex].value,
	    //     // 		document.getElementById('s_to').options[document.getElementById('s_to').selectedIndex].value
	    // );        
    } else {
        animLoop = window.requestAnimationFrame(function() {
            flight(startPoint, midPoint, endPoint, status);
        });
    }
}

// Get values from select boxes, run the animation.
function go() {
    window.cancelAnimationFrame(animLoop);
    animIndex = 0;
    trip(document.getElementById('person').options[document.getElementById('person').selectedIndex].value, true
        // 		document.getElementById('s_from').options[document.getElementById('s_from').selectedIndex].value,
        // 		document.getElementById('s_to').options[document.getElementById('s_to').selectedIndex].value
    );

    // animate(document.getElementById('person').options[document.getElementById('person').selectedIndex].value
    //     // 		document.getElementById('s_from').options[document.getElementById('s_from').selectedIndex].value,
    //     // 		document.getElementById('s_to').options[document.getElementById('s_to').selectedIndex].value
    // );
}



loadMap();
