function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    console.log(samplesArray)

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample)[0];

    //  5. Create a variable that holds the first sample in the array.
    var sampleResults = filteredSamples[0];



      //    Metadata for Bubble chart 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var meta = data.metadata

    // 2. Create a variable that holds the first sample in the metadata array.
    var resultsArray = meta.filter(sampleObj => sampleObj.id == sample);
    var results = resultsArray[0];   





    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuId = filteredSamples.otu_ids;
    var otuLabels = filteredSamples.otu_labels;
    var sampleValues = filteredSamples.sample_values;

    //console.log(otuId)
    //console.log(otuLabels)
    //console.log(sampleValues)


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var sortedOtuId = otuId.slice(0, 10).map(otuId => `OTU ${otuId}`);
    console.log(sortedOtuId);

    var yticks = sortedOtuId.reverse()
    //console.log(yticks)

    var xticks = sampleValues.slice(0, 10).map(sampleValues => ` ${sampleValues}`).reverse();
    //console.log(xticks)
    
    // 8. Create the trace for the bar chart. 
    var barData = {
      x: xticks,
      y: yticks,
      text: otuLabels,
      orientation: "h",
      type: "bar"
    };
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 OTU IDs"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', [barData], barLayout,)


        // 1. Create the trace for the bubble chart.
        var bubbleData = {
          x: otuId,
          y: sampleValues,
          text: otuLabels,
          mode: 'markers',
          marker: {
              size: sampleValues,
              color: otuId
            }
        };
    
        // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
          title: 'Bacteria per Sample',
          showlegend: false,
          xaxis: {title: "OTU IDs"},
        };
    
        // 3. Use Plotly to plot the data with the layout.
        Plotly.newPlot('bubble', [bubbleData], bubbleLayout); 



// 3. Create a variable that holds the washing frequency.
   var wFreq = results.wfreq
   console.log(wFreq)

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = 
      {
          domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: { text: "Wash Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: {range:[null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          borderwidth: 2,
          bordercolor: "black",
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lightgreen" },
            { range: [8, 10], color: "green" }
          ],
          threshold: {
            line: { color: "black", width: 4 },
            thickness: 0.75,
            value: 490
          }
        }
      }
    ;
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
       width: 600, height: 450, margin: { t: 0, b: 0 } 
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
  });
}
