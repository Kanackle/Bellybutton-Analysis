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
    //console.log(result)
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
    console.log(data);
    console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var idArray = result.otu_ids;
    var labelsArray = result.otu_labels;
    var valuesArray = result.sample_values;
    var TopTenidArray = result.otu_ids.slice(0,10).reverse();
    var TopTenridArray = [];
    var TopTenlabelsArray = result.otu_labels.slice(0,10).reverse();
    var TopTenvaluesArray = result.sample_values.slice(0,10).reverse();
    for(var i = 0; i < 10; i ++){
        TopTenridArray.push("OTU: " + TopTenidArray[i]);
    }
    console.log(TopTenvaluesArray)
    //console.log(labelsArray)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    //var yticks = idArray.slice(0,10);
    //console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: TopTenvaluesArray,
      y: TopTenridArray,
      text: TopTenlabelsArray,
      type: "bar",
      orientation: 'h'
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Samples",
      xaxis: {title: "Sample Values"},
      yaxis: {title: "OTU ids"}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)

    // 1. Create the trace for the bubble chart.
    // otu_ids = x-axis, marker colors
    // sample values = y-axis, marker size
    //otu labels = hover text
    var bubbleData = [{
      x: idArray,
      y: valuesArray,
      text: labelsArray,
      mode: 'markers',
      marker: {
        color: idArray,
        size: valuesArray
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bubble chart",
      height: 600,
      width: 1000,
      showlegend: false
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    // 3. Create a variable that holds the washing frequency.
    var meta = data.metadata;
    var metaArray = meta.filter(sampleObj => sampleObj.id == sample);
    var metaResult = metaArray[0].wfreq;
    console.log(metaResult);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = [{ 
      domain:
      {
        x: [0,1],
        y: [0,1]
      },
      value: metaResult,
      title: 
      {
        text: "Washing Frequencies"
      },
      type: "indicator",
      mode: "gauge+number+delta",
      gauge:
      {
        axis: 
        {range: [null, 10]},
        steps:
        [
          {
            range: [0,2],color: "red"
          },
          {
            range: [2,4],color: "orange"
          },
          {
            range: [4,6],color: "yellow"
          },
          {
            range: [6,8],color: "lime"
          },
          {
            range:[8,10],color: "green"
          }
        ]
      }
    }];

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeLayout);
  });

  
  
  
}
