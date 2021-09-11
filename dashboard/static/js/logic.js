function init(){
    //select the dropdown area for bar chart
    var cityInput = d3.select("#cityInput")
    console.log(cityInput);

    var stationNames = []; 
    //read the json file
    d3.json("http://localhost:5000/list?table=stations").then((data) => {  
        //render through the data set
        for (let i = 0; i < data.length; i++) {
            let station = data[i];

        }
        console.log(station)
       
    })

}
init();