var c = localStorage.getItem("countries");
var e = localStorage.getItem("education");
var y = localStorage.getItem("years");
var v = localStorage.getItem("variable");
console.log(c);
console.log(e);
console.log(y);
console.log(v);
//TODO these are all strings, if list, needs to be splitted

var width = 960,
    height = 500;

//TODO color needs to change 
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
          if (d2.Year == y){
            if (d2.ISCED11 === e){
              if (d2.code === d.id) { 
                // TODO need to correct NL because dataset of Q1 does not contain id NL
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
