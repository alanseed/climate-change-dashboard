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
var activeStation

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
    make_fdi_fig(this);
    make_temp_fig(this);
    avg_temp_bar(this);
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

    activeStation = {
        id: data[0].station_id,
        lat: data[0].coord.lat,
        lon: data[0].coord.lon,
        name: data[0].station_name_short
    }
    make_temp_fig(activeStation);
    make_fdi_fig(activeStation);
    avg_temp_bar(activeStation);
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
                title: {
                    text: station.name,
                    font: { size: 14 }
                },
                xaxis: {
                    tickfont: { size: 10 }
                },
                yaxis: {
                    title: {
                        text: 'High fire danger days per year',
                        font: { size: 10 }
                    },
                    tickfont: { size: 10 }
                },
                legend: { font: { size: 10 } },
                width: 250,
                height: 200,
                margin: {
                    l: 40,
                    r: 5,
                    b: 40,
                    t: 25,
                    pad: 1
                },
                barmode: 'group'
            };

            // set up the popup to view the graph    
            var div = '<div id="' + station.name + '" style="width: 250px; height:200px;"></div>';

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
                console.log(data.results[i][month]);
                for (let imonth = 0; imonth < 12; imonth++) {
                    historical[imonth] = parseFloat(data.results[i][month]);
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

        // TO DO - find out why there are no historical data from the api 

        // We are now ready to make the figure for a selected rcp 
        var e = document.getElementById("scenarioSelect");
        var rcp = e.value
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
            title: {
                text: station.name + ': ' + rcp,
                font: { size: 14 }
            },
            xaxis: {
                tickfont: { size: 10 }
            },
            yaxis: {
                title: {
                    text: 'Mean monthly temp \xB0C',
                    font: { size: 12 }
                },
                tickfont: { size: 10 }
            },
            legend: { font: { size: 10 } },

            autosize: false,
            paper_bgcolor: "rgb(127, 199, 244)",
            plot_bgcolor: "rgb(127, 199, 244)",
            width: 600,
            height: 300,
            margin: {
                l: 50,
                r: 50,
                b: 75,
                t: 50,
                pad: 4
            }
        };
        var data = [year_1, year_2, year_3, year_4];
        Plotly.newPlot("tempid", data, layout);
    });
}

function avg_temp_bar(station) {
    // Perform an API call to the Avg Temp information 
    url = 'http://localhost:5000/avg_temp?station_id=';
    if (station)
        url += station.id;
    else
        url += '32040';

    d3.json(url).then(function (data) {
        var x_RCP26 = [];
        var y_RCP26 = [];
        var x_RCP45 = [];
        var y_RCP45 = [];
        var x_RCP60 = [];
        var y_RCP60 = [];
        var x_RCP85 = [];
        var y_RCP85 = [];
        var station_name;
        var max_temp = 0;
        var min_temp = 1000;

        for (let i = 0; i < data.results.length; i++) {
            if (data.results[i].avg_temp > max_temp) {
                max_temp = data.results[i].avg_temp;
            }
            if (data.results[i].avg_temp < min_temp) {
                min_temp = data.results[i].avg_temp;
            }

            var year_range;
            if (data.results[i].climatology_year == 2020)
                year_range = '2020-39';
            if (data.results[i].climatology_year == 2040)
                year_range = '2040-59';
            if (data.results[i].climatology_year == 2060)
                year_range = '2060-79';
            if (data.results[i].climatology_year == 2080)
                year_range = '2080-99';

            if (data.results[i].rcp_id == 'RCP26') {
                x_RCP26.push(year_range);
                y_RCP26.push(parseFloat(data.results[i].avg_temp));
            }

            if (data.results[i].rcp_id == 'RCP45') {
                x_RCP45.push(year_range)
                y_RCP45.push(parseFloat(data.results[i].avg_temp))
            }

            if (data.results[i].rcp_id == 'RCP60') {
                x_RCP60.push(year_range)
                y_RCP60.push(parseFloat(data.results[i].avg_temp))
            }

            if (data.results[i].rcp_id == 'RCP85') {
                x_RCP85.push(year_range);
                y_RCP85.push(parseFloat(data.results[i].avg_temp));
            }

            station_name = data.results[i].station;
        }

        var trace_RCP26 = {
            x: x_RCP26,
            y: y_RCP26,
            name: 'RCP26',
            type: 'bar'
        };

        var trace_RCP45 = {
            x: x_RCP45,
            y: y_RCP45,
            name: 'RCP45',
            type: 'bar'
        };
        var trace_RCP60 = {
            x: x_RCP60,
            y: y_RCP60,
            name: 'RCP60',
            type: 'bar'
        };
        var trace_RCP85 = {
            x: x_RCP85,
            y: y_RCP85,
            name: 'RCP85',
            type: 'bar'
        };

        var bar_data = [trace_RCP26, trace_RCP45, trace_RCP60, trace_RCP85];

        var layout = {
            title: {
                text: station.name,
                font: { size: 14 }
            },
            xaxis: {
                font: { size: 10 }
            },
            yaxis: {
                range: [min_temp, max_temp],
                title: {
                    text: 'Mean annual temp \xB0C',
                    font: { size: 12 }
                },
                tickfont:{size:12}
            },
            legend: { font: { size: 10 } },
            barmode: 'group',
            width: 600,
            height: 300,
            margin: {
                l: 60,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
            }
        };
        Plotly.newPlot('myBar', bar_data, layout);
    });
}

// event listener for the scenario selector 
var scenarioSelector = document.getElementById("scenarioSelect");
scenarioSelector.addEventListener("change", function () {
    make_temp_fig(activeStation);
})