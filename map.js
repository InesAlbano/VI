/* simple map: https://bl.ocks.org/d3noob/f052595e2f92c0da677c67d5cf6f98a1 */

var width = 960,
    height = 500;

var color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

var projection = d3.geoMercator()
    .center([65, 50])
    .scale(300)
    .rotate([0,0]);

var svg = d3.select("#map-holder").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("csv/map.json").then(function(data) {

  d3.json("csv/Q1.json").then(function(data2) {

    const country_value = {};
    data2.forEach(d => { 
      if (d.Year == "2005")
        if (d.ISCED11 === '0-2'){
          country_value[d.code] = d.AVG;
          }
    });
    console.log(country_value);

    console.log(data);
    g.selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path);
  });
});
