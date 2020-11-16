/* simple map: https://bl.ocks.org/d3noob/f052595e2f92c0da677c67d5cf6f98a1 */

var width = 960,
    height = 500;

//var color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

var colorScale = d3.scaleThreshold()
  .domain([5, 10, 20, 30, 40, 50])
  .range(d3.schemeBlues[7]);

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
    var counter = 0;
    g.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val;
        data2.forEach(d2 => {
          if (d2.Year == '2005'){
            if (d2.ISCED11 === '0-2'){
              if (d2.code === d.id) { // TODO need to correct NL because dataset of Q1 does not contain id NL
                val = d2.AVG;
              }
            }
          } 
        });
        if (val){
            return colorScale(val);
          } else {
            return "#1A1C1F";
          }
      })
      .attr("id", function(d){
        return d.id;
      })
      .attr("class", "country")
      .style('stroke', '#515151')
      .style('stroke-width', 1)

    });

});
