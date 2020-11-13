//var available_countries = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK", "TR"]
//var selected_countries = [];

//var margin = { top: 50, right: 40, bottom: 40, left: 60 };

//https://www.d3-graph-gallery.com/graph/choropleth_basic.html

var w = 1250;
var h = 720;
var projection = d3.geoMercator().center([-55, 55]).scale([w * 1.8 / (1.2 * Math.PI)]).translate([(w / 72) - 100, h / 2]);

var countriesGroup;
var countries;

var path = d3.geoPath().projection(projection);

var colorScale = d3.scaleThreshold().domain([0, 2, 4, 6, 8, 10]).range(d3.schemeBlues[7]);

var svg;
var labels;
var legend;

var limit_selection = 0;
var limit_flag = 0;
var limit_colors = d3.scaleOrdinal().range(["#F40C05", "#FBE52B", "#fb9224"]);
var limit_colors_used = [];

var line_counter = -1;

// The svg
 svg = d3.select("svg"),
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
    .defer(d3.json, 'map.json')
    .defer(d3.json, 'csv/Q1.json')
    .await(ready);


function ready(error, data, c) { // c is the csv
    
  
  
  const c1 = {};
  c.forEach(d => { 
    if (d.Year == "2005")
      if (d.ISCED11 === '0-2'){
          c1[d.code] = d.AVG;
        }
      });
  data.features.forEach(d => { 
    d.AVG = c1[d.id];
    console.log(d.id + ' '+d.AVG); // correct NL in Q.json doesnt exist
  });
  //console.log(c1)

  countriesGroup = svg.append("g").attr("id", "map");
  countries = countriesGroup
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", function (d) {
        //console.log('AAA');
          var value;
          for (var i = 0; i < 27; i++) {
            if (d.id === c[i].code){
              value = c[i].AVG;
              console.log('CCC');
            }
          }
          return colorScale(value);
      })
      .attr("id", function (d) {
          return d.id;
      })
      .attr("class", "country")
      .style('stroke', '#515151')
      .style('stroke-width', 1)
}
