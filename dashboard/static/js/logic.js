// Create map object
var myMap = L.map("map", {
	center: [-27, 132],
	zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
	attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
	accessToken: API_KEY
}).addTo(myMap);

// Grab data with d3
d3.json("data/aus_lga.geojson").then(function(data) {
    // Create a GeoJSON layer containing the features array
    // Each feature a popup describing the place and magnitude
    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create a circle marker
            return L.circleMarker(latlng, {
                //radius: getRadius(feature.properties.mag), // different radius for different magnitude
                //fillColor: chooseColor(feature.properties.mag), // different circle colors for different magnitude
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Name: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);
});
