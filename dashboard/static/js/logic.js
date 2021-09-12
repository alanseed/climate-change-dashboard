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
var years = ["2020-2039", "2040-2059", "2060-2079", "2080-2099"];
var fdi_years = ["2030-2049", "2050-2069", "2070-2089", "2090-2109"];

// Create the tile layer that will be the background of our map
var mymap = L.map('mapid').setView([-28, 133.5], 4)

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

// popup for "no data" message 
var popup = L.popup();

// factory to make the figures 
function make_figs() {
    make_fdi_fig(this)
    make_temp_fig(this)
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
});

// make the fire danger figure 
function make_fdi_fig(station) {

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

            // load up the mean dpy high arrays for the bars
            // dpy starts at 2030 not 2020 
            var y45 = [];
            for (let iy = 1; iy < years.length; iy++) {
                let arr = fdi["RCP45"][fdi_years[iy]]["high"];
                let sum = 0;
                for (let i = 0; i < arr.length; i++) {
                    sum += parseFloat(arr[i]);
                }
                var avg = sum / arr.length;
                y45.push(avg);
            }

            var y85 = [];
            for (let iy = 1; iy < years.length; iy++) {
                let arr = fdi["RCP85"][fdi_years[iy]]["high"];
                let sum = 0;
                for (let i = 0; i < arr.length; i++) {
                    sum += parseFloat(arr[i]);
                }
                var avg = sum / arr.length;
                y85.push(avg);
            }


            // make the bar chart with error bars 
            var rcp45 = {
                x: years,
                y: y45,
                name: 'RCP45',
                type: 'bar'
            };
            var rcp85 = {
                x: years,
                y: y85,
                name: 'RCP85',
                type: 'bar'
            };
            var data = [rcp45, rcp85];
            var layout = {
                autosize: true,
                title: station.name,
                width: 300,
                height: 300,
                margin: {
                    l: 25,
                    r: 5,
                    b: 50,
                    t: 25,
                    pad: 4
                },
                barmode: 'group'
            };

            // set up the popup to view the graph    
            var div = '<div id="' + station.name + '" style="width: 300px; height:300px;"></div>';

            popup
                .setLatLng([station.lat, station.lon])
                .setContent(div)
                .openOn(mymap);

            Plotly.newPlot(station.name, data, layout);
        }
    });
}

// Function to read in the temperature data and generate the figure 
// Calculate the mean of the models at each rcp,year,month 
function make_temp_fig(station) {
    // we want the mean of all the models for each year, rcp, month 
    var temps = {};
    for (let ir = 0; ir < rcps.length; ir++) {
        // add an empty dictionary for each rcp (not the historical)
        if (rcps[ir] != "HISTORICAL") {
            let rcp = rcps[ir];
            temps[rcp] = {};
            for (let iy = 0; iy < years.length; iy++) {
                let year = years[iy]
                temps[rcp][year] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
        }
    }

    // need the counts so that we can calculate the mean 
    var counts = {};
    for (let ir = 0; ir < rcps.length; ir++) {
        // add an empty dictionary for each rcp (not the historical)
        if (rcps[ir] != "HISTORICAL") {
            let rcp = rcps[ir];
            counts[rcp] = {};
            for (let iy = 0; iy < years.length; iy++) {
                let year = years[iy]
                counts[rcp][year] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
        }
    }

    // need the historical monthly temps as well 
    var historical = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var months = [
        "january", "february", "march", "april", "may", "june",
        "july", "august", "september", "october", "november", "december"
    ];

    // OK, now read in the temp data and calculate the means 
    url = 'http://localhost:5000/temp?station_id=' + station.id;
    d3.json(url).then(function (data) {
        for (let i = 0; i < data.results.length; i++) {
            let rcp = data.results[i].rcp_id;
            let year = data.results[i].climatology_year_range;
            if (year != "HISTORICAL") {
                for (let imonth = 0; imonth < 12; imonth++) {
                    let month = months[imonth];
                    temps[rcp][year][imonth] += parseFloat(data.results[i][month]);
                    counts[rcp][year][imonth] += 1;
                }
            }
            else {
                for (let imonth = 0; imonth < 12; imonth++) {
                    historical[imonth] = data.results[i][months[imonth]];
                }

            }
        }
        // now calculate the mean if we have non-zero counts 
        for (let ir = 0; ir < rcps.length; ir++) {
            let rcp = rcps[ir];
            for (let iy = 0; iy < years.length; iy++) {
                let year = years[iy]
                if (rcp != "HISTORICAL") {
                    for (let im = 0; im < 12; im++) {
                        if (counts[rcp][year][im] != 0) {
                            temps[rcp][year][im] /= counts[rcp][year][im];
                        }
                    }
                }
            }
        }

        // We are now ready to make the figure for a selected rcp 
        // TO DO pick rcp up from the drop down on the nav bar 
        var rcp = rcps[0];
        var year_1 = {
            x: months,
            y: temps[rcp][years[0]],
            name: years[0],
            type: 'line'
        }
        var year_2 = {
            x: months,
            y: temps[rcp][years[1]],
            name: years[1],
            type: 'line'
        }
        var year_3 = {
            x: months,
            y: temps[rcp][years[2]],
            name: years[2],
            type: 'line'
        }
        var year_4 = {
            x: months,
            y: temps[rcp][years[3]],
            name: years[3],
            type: 'line'
        }
        var layout = {
            autosize: true,
            title: station.name + ': ' + rcp,
            width: 500,
            height: 300,
            margin: {
                l: 50,
                r: 50,
                b: 75,
                t: 50,
                pad: 4
            }
       };
       var data = [year_1, year_2, year_3, year_4 ] ; 
       Plotly.newPlot("tempid", data, layout);
    });
}
