
window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'

    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {

            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);
            console.log( countries[0] )

            // console.log( countryLocal )
        }
    }
    request.send();
};

var main = function (countries) {

    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    } 
    var center = { lat: selected.latlng[0], lng: selected.latlng[1] } 
    var map = new Map( center, 4);
    populateSelect(countries, map);
    updateDisplay(selected, map);
    document.querySelector('#info').style.display = 'block';

    var button = document.getElementById( "find-me" );
    button.onclick = function( event ) {
        find( map )
    }
}
var find = function( map ){
    var location = new GeoLocator( map ) 
    location.setCenter( map ) 
    // updateDisplay( pos, map )  
}

var updateMap = function( selected, map ) {
    var center = { lat: selected.latlng[0], lng: selected.latlng[1] } 
    map.googleMap.panTo( center )
}

var populateSelect = function (countries, map) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country, map);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function ( selected, map ) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = selected.name;
    tags[1].innerText = selected.population;
    tags[2].innerText = selected.capital;
    if(map){
        updateMap( selected, map )
    }
    var center = { lat: selected.latlng[0], lng: selected.latlng[1] }
    var country = "<h5>Name: </h5>" + selected.name + "<h5>Capital: </h5>" + selected.capital + "<h5>Population: </h5>" + selected.population
    map.addInfoWindow( center, country )
}

var GeoLocator = function( map ) {
  this.map = map
  this.setCenter = function( map ){
    navigator.geolocation.getCurrentPosition(  function( position ) { 
      pos = { lat: position.coords.latitude, lng: position.coords.longitude }
      this.map.googleMap.panTo( pos )
      this.map.addMarker( pos, "!" ); 
      geoFind( pos )
    }.bind( this ))
  }
}

var geoFind = function( latLng ) {
    console.log( latLng.lat )
    var geo = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latLng.lat+","+latLng.lng+"&sensor=false"
    console.log( geo )
    var request2 = new XMLHttpRequest();
    request2.open( "GET", geo )
    request2.send();
    var countryString = request2.responseText;
    console.log( countryString )
    var countryLocal = JSON.parse( countryString );
}

var Map = function( latLng, zoom ) {
  this.googleMap = new google.maps.Map( document.getElementById( "map" ), {
    center: latLng,
    zoom: zoom
    });

  this.addMarker = function( latLng, title ) {
    var marker = new google.maps.Marker( { 
      position: latLng,
      map: this.googleMap,
      title: title
  }); 
    return marker;
    }

    this.addInfoWindow = function( latLng, title ) {
      var marker = this.addMarker( latLng, title );
      marker.addListener( 'click', function() {
        var infoWindow = new google.maps.InfoWindow( {
          content: this.title
        });
        infoWindow.open( this.map, marker ) 
      });
    }
}



