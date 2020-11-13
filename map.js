//var available_countries = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK", "TR"]
//var selected_countries = [];

//var margin = { top: 50, right: 40, bottom: 40, left: 60 };

//https://www.d3-graph-gallery.com/graph/choropleth_basic.html

// The svg
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoMercator()
  .scale(570)
  .center([0,20])
  .translate([width / 2, height / 2]);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
d3.queue()
  .defer(d3.json, "map.json")
  /*.defer(d3.csv, "population.csv", function(d) { 
    data.set(d.code, +d.pop);*/
  /*/.defer(d3.csv, "csv/Q1.csv", function(d) { 
    for (var i = 0; i < d3.keys(d).length; i++) {  //[Year, Country, code, Education, AVG] for Q1
      if(d3.values(d)[3] === '0-2'){
        if(d3.values(d)[0] === '2005'){
          data.set(d3.values(d)[2],+d3.values(d)[4]);
        }
      }
    }*/
    
    
  .defer(d3.json, "csv/Q1.json", function(d) { 
    console.log('AAAA');
    for (var i in d){
      if(d[i].ISCED11 === '0-2'){
        if(d[i].Year == '2005'){        
          data.set(d[i]['Country'],+d[i]['AVG']);
        }
      }
    }
  }).await(ready);

function ready(error, topo) {
  console.log("BBBB");
  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.id) || 0;
        console.log(topo.features);
        return colorScale(d.total);
      });
    }
