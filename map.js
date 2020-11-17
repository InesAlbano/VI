// retrieving values from index.html
var e = localStorage.getItem("education");
var v = localStorage.getItem("variable");
var c = localStorage.getItem("countries");
var y = localStorage.getItem("years");

//TODO color needs to change
var colorScale = d3.scaleThreshold()
  .domain([5, 10, 20, 30, 40, 50])
  .range(d3.schemeBlues[7]);

init();

function init() {
  d3.json("csv/map.json").then(function (data) {   // loading the JSON files
    d3.json("csv/Q1.json").then(function (data2) {
      var counter = 0;

      var projection = d3.geoMercator()     // creates the mercator projection
                         .center([75, 50])  // projection center [longitude, latitude]
                         .scale(300)        // scale factor of the projection
                         
      var path = d3.geoPath().projection(projection);
      
      d3.select("#map-holder").append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", function(d) {
          var val;
          data2.forEach(d2 => {
            if ((c.includes(d2.code)) && 
                (y.includes(d2.Year)) && 
                (e.includes(d2.ISCED11)) && 
                (d2.code === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
              val = d2.AVG;
            }
          });

          return (val) ? colorScale(val) : "#1A1C1F";

        })
        .attr("id", function(d){
          return d.id;
        })
        .attr("class", "country")
        .style('stroke', '#515151')
        .style('stroke-width', 1)
    });
  });
}

// still not working
function addZoom() {
  d3.select("svg").call(
    d3.zoom()
      .extent([[0,0],[1000, 1000],])
      .scaleExtent([1,8])
      .on("zoom", zoomed)
  );
}

// still not working
function zoomed({ transform }) {
  d3.selectAll("path").attr("transform", transform);
}
  