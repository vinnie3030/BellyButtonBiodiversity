//Initial function that fills the dropdown menu and calls other function
//(optionChanged) for filling the page with first ID`s information
function init() {
    d3.json("samples.json").then((data) => {
            //Filling the dropdown menu
            data.names.forEach(name => {
                    d3.select("#selDataset").append("option").text(name);
            });
            //Calling the function that fills information and passing data to plot-building functions
            optionChanged("940");

    });
}

//Setting function for dropdown menu that handles changing data for dashboard
//and calls for function that operates on selected test subject ID and returns 
//data filtered by that ID
d3.selectAll("#selDataset").on("change", function () {
    var datasetID = d3.select(this).property("value");
    optionChanged(datasetID);
    }
);

// Function that operates on selected test subject ID and returns 
//data filtered by that ID. Made to avoid multiple openings of json document
//for building plots, charts and board.
function optionChanged(datasetID) {

    d3.json("samples.json").then((data) => {
            var filteredData = data.samples.filter(x => x.id === datasetID);
            var chosenMetadata = data.metadata.filter(x => x.id == datasetID)[0];
            //Calling for functions for each element of the dashboard
            buildBubble(filteredData);
            buildBar(filteredData);
            buildBoard(chosenMetadata);
            buildGauge(chosenMetadata);
    });
}
//Function for building a bubble chart
function buildBubble(filteredData) {

    var microbesID = filteredData.map(x => x.otu_ids)[0];
    var microbesSpiecies = filteredData.map(x => x.otu_labels)[0];
    var microbesValues = filteredData.map(x => x.sample_values)[0];
    //Using console.log for checking the data
    console.log(microbesValues);

    var dataBubble = [{
            x: microbesID,
            y: microbesValues,
            text: microbesSpiecies,
            mode: 'markers',
            marker: {
                    color: microbesID,
                    colorscale: [[0, 'rgb(239, 150, 40)'], [1, 'rgb(0, 0, 255)']],
                    size: microbesValues
            }
    }];

    var layoutBubble = {
            title: "Microorganisms found on the test subject",
            height: 1000,
            width: 1000
    };

    Plotly.newPlot("bubble", dataBubble, layoutBubble);
}

//Function for building a bar chart
function buildBar(filteredData) {

    var microbesIDtop10 = filteredData.map(x => x.otu_ids.slice(0, 10))[0];
    var microbesSpieciesTop10 = filteredData.map(x => x.otu_labels.slice(0, 10))[0];
    var microbesValuesTop10 = filteredData.map(x => x.sample_values.slice(0, 10))[0];
    //Using console.log for checking the data
    console.log(microbesValuesTop10);
    var microbesIDNames = [];
    microbesIDtop10.forEach(x => {
            microbesIDNames.push(`OTU ${x}`);
    })
    
    var dataBar = [{
            x: microbesValuesTop10,
            y: microbesIDNames,
            text: microbesSpieciesTop10,
            type: "bar",
            orientation: "h",
            marker: {
                    color: "rgb(142,124,195)"
            }
    }];

    var layoutBar = {
            title: "Top 10 OTUs found in that individual",

    };

    Plotly.newPlot("bar", dataBar, layoutBar);
}

//Function for filling a board with the demographic data
function buildBoard(chosenMetadata) {

    var board = d3.select("#sample-metadata");
    board.html("");

    Object.entries(chosenMetadata).forEach(([key, value]) => {
            board.append("h5").text(`${key}: ${value}`);
    });
}

//Function for building a gauge chart
function buildGauge(chosenMetadata) {

    var dataGauge = [
            {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: chosenMetadata.wfreq,
                    title: { text: "Frequency of Weekly Belly Button Washing" },
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                            axis: { range: [null, 9] },
                            bar: { color: "rgb(0, 142, 140)" },
                            steps: [
                                    { range: [0, 1], color: "rgb(239, 230, 100)" },
                                    { range: [1, 2], color: "rgb(239, 220, 100)" },
                                    { range: [2, 3], color: "rgb(239, 210, 100)" },
                                    { range: [3, 4], color: "rgb(239, 200, 100)" },
                                    { range: [4, 5], color: "rgb(239, 190, 100)" },
                                    { range: [5, 6], color: "rgb(239, 180, 100)" },
                                    { range: [6, 7], color: "rgb(239, 170, 100)" },
                                    { range: [7, 8], color: "rgb(239, 160, 100)" },
                                    { range: [8, 9], color: "rgb(239, 150, 100)" }
                            ],
                    }
            }
    ];
    var layoutGauge = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot("gauge", dataGauge, layoutGauge);
}

   
    // Initialize the dashboard
    init();