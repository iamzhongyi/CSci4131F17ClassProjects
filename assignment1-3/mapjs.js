	var $ = function (id) {
		return document.getElementById(id);
	}
	var directionsService;
    var directionsDisplay;
	var map;
	var myLatLng = {lat: 44.9744963, lng:-93.2331373};

	function initMap() {
		  map = new google.maps.Map(document.getElementById('map'), {
		    center: myLatLng,
		    zoom: 14
		  });
		var Fordll = {lat: 44.9739592, lng:-93.2342405};
		var Molell = {lat: 44.973164, lng:-93.232423};
		var Fraserll = {lat: 44.9754906, lng:-93.2371038};
		var Tatell = {lat: 44.9752635, lng:-93.2347481};
		var Khll = {lat: 44.9742884, lng:-93.2323254};
		var Akll = {lat: 44.9751283, lng:-93.2323055};

		var markerFord = new google.maps.Marker({
		position: Fordll,
		map: map
		});
		markerFord.setAnimation(google.maps.Animation.BOUNCE);

		var markerMole = new google.maps.Marker({
		position: Molell,
		map: map
		});
		markerMole.setAnimation(google.maps.Animation.BOUNCE);

		var markerFraser = new google.maps.Marker({
		position: Fraserll,
		map: map,
		});
		markerFraser.setAnimation(google.maps.Animation.BOUNCE);

		var markerTate = new google.maps.Marker({
		position: Tatell,
		map: map,
		});
		markerTate.setAnimation(google.maps.Animation.BOUNCE);

		var markerKh = new google.maps.Marker({
		position: Khll,
		map: map,
		});
		markerKh.setAnimation(google.maps.Animation.BOUNCE);

		var markerAk = new google.maps.Marker({
		position: Akll,
		map: map,
		});
		markerAk.setAnimation(google.maps.Animation.BOUNCE);

		markerFord.addListener('click', function() { showEvent(map,markerFord,"Ford"); });
		markerMole.addListener('click', function() { showEvent(map,markerMole,"Mole"); });
		markerFraser.addListener('click', function() { showEvent(map,markerFraser,"Fraser"); });
		markerTate.addListener('click', function() { showEvent(map,markerTate,"Tate"); });
		markerKh.addListener('click', function() { showEvent(map,markerKh,"KH"); });
		markerAk.addListener('click', function() { showEvent(map,markerAk,"Akerman"); });

		directionsService = new google.maps.DirectionsService;
		directionsDisplay = new google.maps.DirectionsRenderer;
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel($('right-panel'));
	}

	function showEvent(map,marker,place){
		var eventList = document.getElementsByClassName(place);
		var eventStr = place + "Hall" + "<br>";
		var i;
		for(i = 0; i < eventList.length; i++){
			eventStr = eventStr + eventList[i].parentNode.id + " " + eventList[i].getElementsByTagName("p")[0].innerHTML.replace(/<br>/," ") + "<br>";
		}
		eventStr = eventStr + "<img style = \"width:70px;\" src=" + place +".jpg alt=" + place +"Hall>";
		var infowindow = new google.maps.InfoWindow({
		content: eventStr
		});
		infowindow.open(map,marker);
	}

	function findResturant(r){
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: myLatLng,
			radius: r,
			keyword: 'resturant'
		}, callback);
	}
	$("findr").addEventListener('click',function(){findResturant($("radius").value)});

	function callback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});
		var service = new google.maps.places.PlacesService(map);
		var address;
		
		service.getDetails({
          placeId: place.place_id
        }, function(place1, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
				address = place1.formatted_address;				
          }
		else address = 'Not listed';
        });

		google.maps.event.addListener(marker, 'click', function() {
			var infowindow = new google.maps.InfoWindow({
			content: "<b>" + place.name + "</b><br>" + address
			});
			infowindow.open(map, this);
		});
	}
	
	function calculateAndDisplayRoute(){
		var mode_list = document.getElementsByName('travel_mode');
		var mode;
		for (var i = 0, length = mode_list.length; i < length; i++) {
			if (mode_list[i].checked) {
			mode = mode_list[i].value;
			break;
			}
		}
		if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {        
            directionsService.route({
	          origin: {lat: position.coords.latitude, lng: position.coords.longitude},
	          destination: $('destination').value,
	          travelMode: mode,
	        }, function(response, status) {
	          if (status === 'OK') {
	            directionsDisplay.setDirections(response);
	            
	          } else {
	          	alert('Directions request failed due to ' + status);
	          }
	        });    
   			
          }, function() {
            alert('Error: The Geolocation service failed.');
          });
        } else {
          // Browser doesn't support Geolocation
          alert('Error: Your browser doesn\'t support geolocation.');
        }     
      }
	$("findd").addEventListener('click',function(){calculateAndDisplayRoute()});