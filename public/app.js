var geoUrl = ""


window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'

    var geoUrl = "http://maps.googleapis.com/maps/api/geocode/json?latlng=55.704093,13.193582&sensor=false"
    console.log( geoUrl )
    var geoUrl2 = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+55.704093+","+13.193582+"&sensor=false"
    var geoUrl3 = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+55.943704+","+-3.2130941+"&sensor=false"


    console.log( geoUrl2 )


    var request = new XMLHttpRequest();
    var requestGeo = new XMLHttpRequest();
    var requestGeo2 = new XMLHttpRequest();
    var requestGeo3 = new XMLHttpRequest();
    request.open("GET", url);
    requestGeo.open( "GET", geoUrl )
    requestGeo2.open( "GET", geoUrl2 )
    requestGeo3.open( "GET", geoUrl3 )
    request.onload = function () {
        if (request.status === 200) {

            var jsonString = request.responseText;
            var geoString = requestGeo.responseText;
            var geoString2 = requestGeo2.responseText;
            var geoString3 = requestGeo3.responseText;
            var countries = JSON.parse(jsonString);
            var country = JSON.parse( geoString );
            var country2 = JSON.parse( geoString2 );
            var country3 = JSON.parse( geoString3 );
            console.log( country )
            console.log( country2.results[0].formatted_address )
            console.log( country3.results[0].formatted_address )
            main(countries);
            console.log( countries[0] )
        }
    }
    request.send();
    requestGeo.send()
    requestGeo2.send()
    requestGeo3.send()
};

var main = function (countries, country ) {

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
    button.onclick = function( event, country ) {
        find( map )
    }

}
var find = function( map, country ){
    var location = new GeoLocator( map ) 
    location.setCenter( map, country ) 
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

var displayAddress = function ( address ) {
    var you = document.querySelector( '#you' );
    var display = document.querySelector( 'h3' );
    var takeABreak = document.querySelector( '#break' );
    var text = "You are here: " + address
    var br = '<br>'
    display.innerHTML = text;
    takeABreak.innerHTML = br;

}

var GeoLocator = function( map, country ) {
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

var geoFind = function(latLng){
   var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng="+latLng.lat+"," +latLng.lng+ "&sensor=false"
   var request = new XMLHttpRequest();
   request.open("GET", url);
   request.onload = function () {
       console.log('loaded')
       if (request.status === 200) {
           var jsonString = request.responseText;
           var country = JSON.parse(jsonString);
           console.log(country.results[0].formatted_address)
           displayAddress( country.results[0].formatted_address )
       }
   }
   request.send();

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



