// Animation / interval Vars
var animLoop = false,
    animIndex = 0,
    planePath = false,
    trailPath = false,
    flightFinished = true;
//Team members and geolocations
var people = {
        "davidreyneke": [
            [41.0632, -74.1000],
            [41.1815, -73.2903],
            [40.7030630, -73.9904600]
        ],
        "biancacazares": [
            [37.3382,-121.8863],
            [40.73, -73.995],
            [40.7030630, -73.9904600]
        ],
        "mattvarghese": [
            [42.3833, -71.4167],
            [40.7030630, -73.9904600],
            [40.7030630, -73.9904600]
        ],
        "poojahoffman": [
            [41.0111000,-73.9133000],
            [42.2982, -71.2612],
            [40.7030630, -73.9904600]
        ],
        "sarahluvisi": [
            [38.2500000,-85.7667000],
            [36.135,-80.277],
            [40.7030630, -73.9904600]
        ],
        "johnmurch": [
            [40.6589910, -74.3473720],
            [44.4758820, -73.2120720],
            [40.7030630, -73.9904600]
        ],
        "joseramos": [
            [18.45,-66.1000],
            [18.2094, -67.1417],
            [40.7030630, -73.9904600]
        ],
        "jamesmcnally": [
            [42.3333, -72.6500],
            [42.367, -72.517],
            [40.7030630, -73.9904600]
        ],
        "john-davidbrown": [
            [37.7917, -120.9917],
            [42.4433, -76.5],
            [40.7030630, -73.9904600]
        ],
        "brianokpala": [
            [33.755, -84.39],
            [33.7528, -84.3861],
            [40.7030630, -73.9904600]
        ],
        "calebthill": [
            [39.0997, -94.5783],
            [39.0997, -94.5783],
            [40.7030630, -73.9904600]
        ]
    }
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
        zoom: 15,
        center: new google.maps.LatLng(40.7030630, -73.9904600),
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
    flightFinished=false;
    //Fix Zoom on Each Trip
    mapObject.setZoom(7);

    if(person!=undefined){
        var startPoint = people[person][0],
        midPoint = people[person][1],
        endPoint = people[person][2];

        //set first leg of trip (sp,mp) then second leg (mp,ep)
        var sP = new google.maps.LatLng(startPoint[0], startPoint[1]);
        var mP = new google.maps.LatLng(midPoint[0], midPoint[1]);
        var eP = new google.maps.LatLng(endPoint[0], endPoint[1]);

        //readjust map if first leg of trip
        if(connection){
            mapObject.panTo(sP);
        }

        // Create a polyline for the planes path
        // console.log("CONNECTION: " + connection)
        if (connection) {
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
        } else {
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
            flightPath(person, sP, mP, eP, connection);
        });
    }else{
        $("#toggle").show();        
    }
}

function addLine() {
    trailPath.setMap(map);
}

function overviewMap() {
    mapObject.setCenter(new google.maps.LatLng(39.5, -98.3))
    mapObject.setZoom(4);
}

function goHome() {
    // planePath.setMap(null);
    // trailPath.setMap(null);
    // window.location.reload()
    mapObject.setCenter(new google.maps.LatLng(40.7030630, -73.9904600))
    mapObject.setZoom(15);
}

function flightPath(person, startPoint, midPoint, endPoint, layover) {
    animIndex += 1;
    // Draw trail
    if (layover) {
        var nextPoint = google.maps.geometry.spherical.interpolate(startPoint, midPoint, animIndex / 100);
        trailPath.setPath([startPoint, nextPoint]);
    } else {
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
        if (layover) {
            trip(person, false);
        } else {
            $("#boardingpass").empty("");
            //if flightfinished? 
            $("#toggle").show();
            flightFinished=true;
            // console.log("DONE");
        }
    } else {
        animLoop = window.requestAnimationFrame(function() {
            flightPath(person, startPoint, midPoint, endPoint, layover);
        });
    }
}

function allAboard(){
    //hide overlay
    $( "#toggle" ).trigger( "click" );
    //hide p
    $("#toggle").hide();

    window.cancelAnimationFrame(animLoop);
    animIndex = 0;
    var prolificp = [
        "davidreyneke",
        "biancacazares",
        "mattvarghese",
        "poojahoffman",
        "sarahluvisi",
        "johnmurch",
        "joseramos",
        "jamesmcnally",
        "john-davidbrown",
        "brianokpala",
        "calebthill"
    ]
    var prolificpIndex = 0;
    //relative image path
    var tmpURL = "http://"+ location.hostname +window.location.pathname.replace("index.html","");
    //update with prolific image
    $("#boardingpass").empty().html('<img class="img-circle" src="'+tmpURL+'images/' + prolificp[prolificpIndex] + '.jpg">');
    trip(prolificp[prolificpIndex],true);
    setInterval(function(){
        if(flightFinished){
            if(prolificpIndex == prolificp.length){
                flightFinished=true;
                $("#toggle").show();
            } else {
                prolificpIndex++;
                //hide if shown
                $("#toggle").hide();
    
                if(prolificp[prolificpIndex] !=undefined){
                    $("#boardingpass").empty().html('<img class="img-circle" src="'+tmpURL+'images/' + prolificp[prolificpIndex] + '.jpg">');
                }
                trip(prolificp[prolificpIndex],true);
            }            
        }else{
            //keep the toggle hidden
            //$("#toggle").hide();
        }
    }, 100);
}

// Get values from select boxes, run the animation.
function go() {
    window.cancelAnimationFrame(animLoop);
    animIndex = 0;
    trip(document.getElementById('person').options[document.getElementById('person').selectedIndex].value, true);
}

function board(person) {
    //hide overlay
    $("#toggle" ).trigger("click");

    //Init Animation
    window.cancelAnimationFrame(animLoop);
    animIndex = 0;

    //relative image path
    var tmpURL = "http://"+ location.hostname +window.location.pathname.replace("index.html","");

    //update with prolific image
    if(person !=undefined){
        $("#boardingpass").empty().html('<img class="img-circle" src="'+tmpURL+'images/' + person + '.jpg">');
    }

    //hide the main P logo until finished
    $("#toggle").hide();

    trip(person, true);
}

loadMap();

$('#toggle').click(function() {
    $(this).toggleClass('active');
    $('#overlay').toggleClass('open');
});
