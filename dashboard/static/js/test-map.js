// Create the tile layer that will be the background of our map
var mymap = L.map('mapid').setView([-28, 133.5], 4)

//mymap.on('click', (e) => {
 // });

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

// popup for "no data" message 
var popup = L.popup();

// factory to make the figures 
function make_figs() {
  make_fdi_fig(this)
}


// Perform an API call to the station information 
d3.json("http://localhost:5000/list?table=stations").then(function (data) {
  for (let i = 0; i < data.length; i++) {
    let station = data[i];
    let marker = L.circle([station.coord.lat, station.coord.lon], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 50.0,
      radius: 10000.0
    })
      .addTo(mymap)
      .bindTooltip(function () {
        return station.station_name_short
      }),
      options = {
        id: station.station_id,
        lat: station.coord.lat,
        lon: station.coord.lon,
        name: station.station_name_short
      };
    marker.on("click", make_figs, options)
  }

  avg_temp_bar()
});


function avg_temp_bar(station){
  // Perform an API call to the Avg Temp information 
  url = 'http://localhost:5000/avg_temp?station_id=';
  if(station)
    url+= station.id;     
  else
    url+= '32040'; 

  d3.json(url).then(function (data) {
    
    var x_RCP26 = []
    var y_RCP26 = []
    var x_RCP45 = []
    var y_RCP45 = []
    var x_RCP60 = []
    var y_RCP60 = []
    var x_RCP85 = []
    var y_RCP85 = []
    var station_name 
    for (let i = 0; i < data.results.length; i++) {
      
      var year_range
      if(data.results[i].climatology_year==2020)
        year_range = '2020-39'
      if(data.results[i].climatology_year==2040)   
        year_range = '2040-59'
      if(data.results[i].climatology_year==2060)   
        year_range = '2060-79'
      if(data.results[i].climatology_year==2080)   
        year_range = '2080-99'

      if(data.results[i].rcp_id=='RCP26')
        x_RCP26.push(year_range)  
        y_RCP26.push(data.results[i].avg_temp)
         
      if(data.results[i].rcp_id=='RCP45')
        x_RCP45.push(year_range)  
        y_RCP45.push(data.results[i].avg_temp)

      if(data.results[i].rcp_id=='RCP60')
        x_RCP60.push(year_range)  
        y_RCP60.push(data.results[i].avg_temp)

      if(data.results[i].rcp_id=='RCP85')
        x_RCP85.push(year_range)  
        y_RCP85.push(data.results[i].avg_temp)
        
      station_name = data.results[i].station  
    }  
 
    var trace_RCP26 = {
      x: x_RCP26,
      y: y_RCP26,
      name: 'RCP26',
      type: 'bar'
    }

    var trace_RCP45 = {
      x: x_RCP45,
      y: y_RCP45,
      name: 'RCP45',
      type: 'bar'
    }
    var trace_RCP60 = {
      x: x_RCP60,
      y: y_RCP60,
      name: 'RCP60',
      type: 'bar'
    }
    var trace_RCP85 = {
      x: x_RCP85,
      y: y_RCP85,
      name: 'RCP85',
      type: 'bar'
    }
    
    var bar_data = [trace_RCP26,trace_RCP45,trace_RCP60,trace_RCP85];
    
    var layout = {title:station_name,
                  barmode: 'group',
                  yaxis: {'title': 'avg temp', 'range':[28,31]}};
    
    Plotly.newPlot('myBar', bar_data, layout);

  });
}

// make the fire danger figure 
function make_fdi_fig(station) {

  // get the list of models rcps, years 
  var models = [];
  d3.json("http://localhost:5000/list?table=models").then(function (data) {
    for (let i = 0; i < data.length; i++) {
      models.push(data[i].model_id)
    }
  });
  var rcps = [];
  d3.json("http://localhost:5000/list?table=rcp").then(function (data) {
    for (let i = 0; i < data.length; i++) {
      rcps.push(data[i].rcp_id)
    }
  });
  var years = ["2030-2049", "2050-2069", "2070-2089", "2090-2109"];

  class dpy {
    high = [];
    very_high = [];
    severe = [];
    extreme = [];
    catastrophic = [];
  };

  var fdi = {
    "HISTORICAL": {
      "1995-2014": new dpy()
    },

    "RCP45": {
      "2030-2049": new dpy(),
      "2050-2069": new dpy(),
      "2070-2089": new dpy(),
      "2090-2109": new dpy()
    },

    "RCP85": {
      "2030-2049": new dpy(),
      "2050-2069": new dpy(),
      "2070-2089": new dpy(),
      "2090-2109": new dpy()
    }
  }

  // get the station fdi data 
  url = 'http://localhost:5000/fdi?station_id=' + station.id;
  d3.json(url).then(function (data) {
    if (data.results.length == 0) {
      popup
        .setLatLng([station.lat, station.lon])
        .setContent("No Fire danger index data found")
        .openOn(mymap);
    } else {
      // put the data into the data model 
      for (let i = 0; i < data.results.length; i++) {
        let rcp = data.results[i].rcp_id;
        let years = data.results[i].climatology_year_range;
        fdi[rcp][years].high.push(data.results[i].dpy_high);
        fdi[rcp][years].very_high.push(data.results[i].dpy_very_high); 
        fdi[rcp][years].severe.push(data.results[i].dpy_severe);
        fdi[rcp][years].extreme.push(data.results[i].dpy_extreme);
        fdi[rcp][years].catastrophic.push(data.results[i].dpy_catastrophic);
      }
      console.log(data);

      // load up the mean dpy high arrays for the bars
      var y45 = [];
      for ( let iy = 0; iy < years.length; iy++){
        let arr = fdi["RCP45"][years[iy]]["high"] ;
        let sum = 0;
        for ( let i = 0; i < arr.length; i++){
          sum += parseFloat(arr[i]); 
        }
        var avg = sum / arr.length;
        y45.push(avg);
      }

      var y85 = [];
      for ( let iy = 0; iy < years.length; iy++){
        let arr = fdi["RCP85"][years[iy]]["high"] ;
        let sum = 0;
        for ( let i = 0; i < arr.length; i++){
          sum += parseFloat(arr[i]); 
        }
        var avg = sum / arr.length;
        y85.push(avg);
      }


      // make the bar chart with error bars 
      var rcp45 = {
        x:years,
        y:y45 ,
        name:'RCP45',
        type:'bar'
      } ;
      var rcp85 = {
        x:years,
        y:y85 ,
        name:'RCP85',
        type:'bar'
      } ;
      var data = [rcp45,rcp85];
      var layout = {
        autosize:true,
        title: station.name,
        width:300,
        height:300,
        margin:{
          l:25,
          r:5,
          b:50,
          t:25,
          pad:4
        },
        barmode:'group'};

      // set up the popup to view the graph    
      var div = '<div id="' + station.name + '" style="width: 100px; height:100px;"></div>';

      popup
        .setLatLng([station.lat, station.lon])
        .setContent(div)
        .openOn(mymap);

      Plotly.newPlot(station.name,data,layout) ;
    }
  });
}

