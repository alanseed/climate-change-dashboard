/*
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
d3.json("http://127.0.0.1:5000/list?table=stations").then(function(data) {
    // Create a GeoJSON layer containing the features array
    // Each feature a popup describing the place and magnitude
    console.log(data)
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
*/
function createMap(stations) {
    
    // Create a layer group made from the bike markers array, pass it into the createMap function
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
    /*
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "dark-v10",
      accessToken: API_KEY
    });
    
    
      var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "satellite-v9",
      accessToken: API_KEY
    });
    var outmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "outdoors-v11",
      accessToken: API_KEY
    });

    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap ,
      "Dark Map": darkmap  ,
      
"Satellite Map":satmap,
"Outdoor Map": outmap
    };
  */
    var baseMaps = {
        "Light Map": lightmap
        
      };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Stations": stations
    };
  
    // Create the map object with options
    var map = L.map("map", {
        center: [-27, 132],
      zoom: 5,
      //layers: [lightmap, darkmap,satmap,outmap, epicenters]
      layers: [lightmap, stations]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    /*  
    // Setting the legend to appear in the bottom right of our chart 
    var legend = L.control({
        position: 'bottomright',
        title:"Test"
    });*/
    console.log("6");
    // Adding on the legend based off the color scheme we have 
    /*legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['<1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }   
    legend.addTo(map);  */
}

function createMarkers(response) {
    var stations = response.results;
    console.log(stations.length);
    /*Sets up our color scheme for earthquakes */
    var colors = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    }

    var markers = [];

    // Pull the "earthquakes" property off of response.data
    for (var i = 0; i < stations.length; i++) {
        var latitude = stations[i].coord["lat"];
        var longitude = stations[i].coord["lon"];
        var id = stations[i].station_id;
        var name_short = stations[i].station_name_short;
        var name_long = stations[i].station_name_long;

        //console.log(latitude)    
        //console.log(longitude)
        //console.log(id)
        console.log(name_short)
        //console.log(name_long)
        /*    
        var fillColor;
        if (magnitude > 5) {
            fillColor = colors.level6;
        } else if (magnitude > 4) {
            fillColor = colors.level5;
        } else if (magnitude > 3) {
            fillColor = colors.level4;
        } else if (magnitude > 2) {
            fillColor = colors.level3;
        } else if (magnitude > 1) {
            fillColor = colors.level2;
        } else {
            fillColor = colors.level1;
        }
        */
        var station = L.circleMarker([latitude, longitude], {
            radius: 1 ** 2,
            color: "black",
            fillColor: "red",
            fillOpacity: 1,
            weight: 1
        })
        station.bindPopup("<h4> Location: " + name_short + "</h4><br>");
        //console.log("name_short");
        markers.push(station);
    }    
    
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(markers)); 
}

// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("http://127.0.0.1:5000/list?table=stations").then(createMarkers);
