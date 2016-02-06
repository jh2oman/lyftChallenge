if (Meteor.isClient) {

  //Global App Variable
  var app = {};

//Initiate Google Maps variables and Event listeners
initMap = function() {
    var sanfran = {lat:37.759995,lng: -122.429118};
    app.markerCount = 0;
    app.dS = new google.maps.DirectionsService;
    app.dD = new google.maps.DirectionsRenderer;

  // Set up the map.
  app.map = new google.maps.Map(document.getElementById('map'), {
    center: sanfran,
    zoom: 12,
    streetViewControl: false
  });
  app.dD.setMap(app.map);
  //document.getElementById("changeButton").addEventListener("click", randomGenerate);
  app.map.addListener('click',dropPin);
  $('#reset').on("click", resetMap);
  $('#calculate').on("click", calculate);
}

//Event listener for dropping pin on the map
function dropPin(event) {
  var icon;
  var marker;
  switch(app.markerCount)
  {
    case 0:
    icon = 'http://maps.google.com/mapfiles/kml/paddle/A-lv.png';
    app.pointA = {};
    app.pointA.lat = event.latLng.lat();
    app.pointA.lng = event.latLng.lng();
    break;
    case 1:
    icon = 'http://maps.google.com/mapfiles/kml/paddle/B-lv.png';
    app.pointB = {};
    app.pointB.lat = event.latLng.lat();
    app.pointB.lng = event.latLng.lng();
    break;
    case 2:
    icon = 'http://maps.google.com/mapfiles/kml/paddle/C-lv.png';
    app.pointC = {};
    app.pointC.lat = event.latLng.lat();
    app.pointC.lng = event.latLng.lng();
    break;
    case 3:
    icon = 'http://maps.google.com/mapfiles/kml/paddle/D-lv.png';
    app.pointD = {};
    app.pointD.lat = event.latLng.lat();
    app.pointD.lng = event.latLng.lng();
    $('#calculate').prop('disabled', false);
    break;
    default:
    return;
    break;
  }
  app.marker = new google.maps.Marker({
    position: event.latLng,
    icon: icon,
    animation: google.maps.Animation.DROP,
    map: app.map
  });
  app.markerCount++;
}

//Resets the app
function resetMap(){
  app = {};
  initMap();
  $('#dist1').parent().css({"border": "none"});
  $('#dist2').parent().css({"border": "none"});
}

//Calculates the distance of the two routes
function calculate(){
  var wayPtsACDB = [{location:app.pointA, stopover:true},
  {location:app.pointC, stopover:true},
  {location:app.pointD, stopover:true},
  {location:app.pointB, stopover:true}];

  var wayPtsCABD = [{location:app.pointC, stopover:true},
  {location:app.pointA, stopover:true},
  {location:app.pointB, stopover:true},
  {location:app.pointD, stopover:true}];



  console.log(wayPtsACDB);
  calculateRoutes(wayPtsACDB,wayPtsCABD, app.dS,app.dD);

  //drawRoute(winner, app.dS,app.dD);

}

//Taps into the Google Maps API to calculate routes
function calculateRoutes(route1,route2, directionsService, directionsDisplay)
{
  directionsService.route({
    origin: route1[0].location,
    destination: route1[3].location,
    waypoints: route1.splice(1,2),
    optimizeWaypoints: false,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response1, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsService.route({
        origin: route2[0].location,
        destination: route2[3].location,
        waypoints: route2.splice(1,2),
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.DRIVING
      }, function(response2, status) {
        if (status === google.maps.DirectionsStatus.OK) {

          var shorter = calculateDistance(response1,response2);
          directionsDisplay.setDirections(shorter);
          distancesDisplay();

        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

//Helper function to calculate the distance of the two routes.
function calculateDistance(response1,response2){
  app.distance1=0;
  app.distance2=0;

  for(var i =0;i<response1.routes[0].legs.length;i++)
  {
    app.distance1 = app.distance1 + response1.routes[0].legs[i].distance.value;
    app.distance2 = app.distance2 + response2.routes[0].legs[i].distance.value;
  }
  if(app.distance1 < app.distance2)
    return response1;
  else
    return response2;
}

//Helper function to display the calculated distances
function distancesDisplay(){
  $('#dist1').html(app.distance1/1000 + " km");
  $('#dist2').html(app.distance2/1000 + " km");
  if(app.distance1<app.distance2)
    $('#dist1').parent().css({"border": "2px solid #0077CC"});
  else
    $('#dist2').parent().css({"border": "2px solid #0077CC"});
}


}

if (Meteor.isServer) {
  
}
