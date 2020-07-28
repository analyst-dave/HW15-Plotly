var data;

// happens only once every page load (this is the starting point)
d3.json("samples.json").then((importedData) => {

  data = importedData;

  // construct the drop down select menu
  initSelectBox();

  // refresh all components
  optionChanged();
});

//-------------------------------------------------------------

// happens only once every page load
function initSelectBox() {
  // init() for select box... d3 to map each key value to a option value
  // we want a select option for each data.names
  data.names.forEach((id) => {
    var option = d3.select("#selDataset").selectAll('option')
    .data(data.names).enter()
    .append('option')
    .attr('value', (d) => {return d;})
    .text((d) => {return d;});
  });
}

//-------------------------------------------------------------

// onchange event for drop down select box... 
// happens everytime user change select drop down menu
function optionChanged() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var dataId = dropdownMenu.property("value");
  console.log(dataId);
  updateInfo(dataId);
  updateBar(dataId);
  updateBubble(dataId);
  updateGauge(dataId);
}

//-------------------------------------------------------------

// update helper for demo info panel
function updateInfo(dataId) {
  var div = d3.select("#sample-metadata");
  data.metadata.forEach((meta) => {
    // find the match(id) and update
    if (dataId == meta.id) {
      var keys = d3.keys(meta);
      var hTags = "<table style='font-size:70%' border='0' class='table table-sm table-striped table-hover;'><thead class='thead-dark'>" +
                  "<tr><th><b>description</b></th><td><b>value</b></td></tr></thead><tbody>";
      keys.forEach((key) => { hTags = hTags + "<tr><th>" + key + ": </th><td>" + meta[key] + "</td></tr>" });
      hTags = hTags + "</tbody></table>";

      div.selectAll('h5').remove();
      var h5 = div.selectAll('h5')
                  .data([meta]).enter()
                  .append('h5')
                  .html((d) => {return hTags;});
    }
  });
}

//-------------------------------------------------------------

// update helper for bar chart
function updateBar(dataId) {
  var record;
  // loop thru entire samples to locate the sample with matching dataID
  data.samples.forEach((sample) => {
    // find the match(id) and update
    if (dataId == sample.id) {
      console.log('inside updateBar() matched!!! ' + sample.id);
      record = sample;
    }
  });
  console.log(record);
  //  Create the Traces
  var trace1 = {
    x: record.sample_values.slice(0,10).reverse(),
    y: record.otu_ids.slice(0,10).reverse().map(row => `OTU ${row}`),
    text: record.otu_labels.slice(0,10).reverse(),
    //y: data.samples.map(row => row.otu_ids),
    //text: data.samples.map(row => row.otu_labels),
    type: "bar",
    name: "bacteria",
    base: 0,
    opacity: 0.5,
    orientation: "h"
  };
  // Define the plot layout
  var layout = {
    title: `<b>Subject# ${dataId}</b> <br> Top 10 Microbes a.k.a. Operational Taxonomic Units (OTU)`,
    height: 350,
    width: 600
  };
  Plotly.newPlot("bar", [trace1], layout, {displayModeBar: true});
}

//-------------------------------------------------------------

// update helper for bubble chart
function updateBubble(dataId) {

  var record;
  // loop thru entire samples to locate the sample with matching dataID
  data.samples.forEach((sample) => {
    // find the match(id) and update
    if (dataId == sample.id) {
      console.log('### matched!!! inside updateBubble() matched!!! ' + sample.id);
      record = sample;
    }
  });

  console.log(record);
  
  var trace2 = {
    x: record.otu_ids,
    y: record.sample_values,
    text: record.otu_labels,
    mode: 'markers',
    marker: {
              size: record.sample_values,
              color: record.otu_ids
            }
  };
  
  var layout2 = {
    title: `<b>Biodiversity on Subject# ${dataId}</b> <br> Each color represents an unique Microbe (OTU)`,
    height: 450,
    width: 1000
  };
  
  Plotly.newPlot('bubble', [trace2], layout2, {displayModeBar: true});
}

//-------------------------------------------------------------
// update helper for Guage
function updateGauge(dataId) {

  //alert('inside updateGauge() ' + dataId);

  var freq;
  // loop thru entire samples to locate the sample with matching dataID
  data.metadata.forEach((meta) => {
    //console.log(sample.id);
    // find the match(id) and update
    if (dataId == meta.id) {
      console.log('### matched!!! inside updateGauge() matched!!! ' + meta.id);
      freq = meta.wfreq;
    }
  });

  console.log(freq);

  // var trace and var layout are for rendering the default guage
  var trace = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: freq,
      title: { text: "Wash Frequency" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [null, 8], tickwidth: 2, tickcolor: "grey" },
        bar: { color: "#0C2340", thickness: 0.2 },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "darkred" }, //#ECEFF1
          { range: [1, 2], color: "#CFD8DC" },
          { range: [2, 3], color: "#B0BEC5" },
          { range: [3, 4], color: "#90A4AE" },
          { range: [4, 5], color: "#78909C" },
          { range: [5, 6], color: "#607D8B" },
          //{ range: [6, 7], color: "#546E7A" },
          { range: [6, 7], color: "#455A64" },
          //{ range: [8, 9], color: "#37474F" },
          { range: [7, 8], color: "#263238" }
        ],
        threshold: {
          line: { color: "red", width: 3 },
          thickness: 1,
          value: 1
        }
      }
    }
  ];
  var layout = { width: 500, height: 400, margin: { t: 0, b: 0 } };

  // var guageData and var layout2 are for rendering the fancy guage
  var guageData = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: { size: 18, color: "850000" },
      showlegend: false,
      name: "scrub(s)",
      text: freq,
      hoverinfo: "text+name",
    },
    {
      values: [50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50 / 6, 50],
      rotation: 90,
      text: [
        "6-8",
        "5-6",
        "4-5",
        "3-4",
        "2-3",
        "0-2",
        "",
      ],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "#455A64",
          "#607D8B",
          "#78909C",
          "#90A4AE",
          "#B0BEC5",
          "#CFD8DC",
          "white",
        ],
      },
      labels: ["6-8", "5-6", "4-5", "3-4", "2-3", "0-2", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false,
    },
  ];

  var layout2 = {
    shapes:[{
        type: 'path',
        path: gaugePointer(freq*25),
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: '<b>Washing Frequency</b> <br> Scrubs per Week',
    autosize:true,
    height: 500,
    //width: 1000,
    xaxis: {zeroline:false, showticklabels:false,
         showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
         showgrid: false, range: [-1, 1]}
  };
  
  //Plotly.newPlot('gauge', trace, layout, {displayModeBar: true});  // the non-fancy version
  Plotly.newPlot('gauge', guageData, layout2, {displayModeBar: true});  // the fancy version
}

//-------------------------------------------------------------

// Trig to calc meter point
function gaugePointer(value) {
  var degrees = 180 - value, radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = "M -.0 -0.035 L .0 0.035 L ",
    pathX = String(x),
    space = " ",
    pathY = String(y),
    pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);
  //alert(path);
  return path;
}