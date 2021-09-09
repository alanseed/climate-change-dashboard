// Create the tile layer that will be the background of our map
var mymap = L.map('mapid').setView([-28, 133.5],4)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap); 

// Perform an API call to the station information 
d3.json("http://localhost:5000/list?table=stations").then(function (data) {
  for (let i = 0; i < data.length; i++) {
    let station = data[i];
    let marker = L.circle([station.coord.lat, station.coord.lon], {
      color:"red",
      fillColor:"#f03", 
      fillOpacity:50.0,
      radius: 10000.0
    })
    .bindTooltip(function (layer){ 
      console.log( station.station_id) 
      return station.station_name_short 
      })
    .addTo(mymap)
  }
});

