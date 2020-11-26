init(null,null,null,null, update=false)
document.getElementById("button-forms").addEventListener("click", function(){
  updateMap(update=true);
}); 

var tooltip = d3.select("div.tooltip");

function updateMap(update = false){
  // retrieving values from index.html
  var e = localStorage.getItem("education");
  var v = localStorage.getItem("variable");
  var c = localStorage.getItem("countries");
  var y = localStorage.getItem("years");

  if (c.includes(",")){
    c = c.replace('[', '');
    c = c.replace(']', '');
    c = c.split(',');
    for (let i = 0; i < c.length; ++i){
      c[i] = c[i].replace('"', '');
      c[i] = c[i].replace('"', '');
    }
  }

  if (y.includes(",")){
    y = y.replace('[', '');
    y = y.replace(']', '');
    y = y.split(',');
    for (let i = 0; i < y.length; ++i){
      y[i] = y[i].replace('"', '');
      y[i] = y[i].replace('"', '');
      y[i] = parseInt(y[i])
    }
  }

  init(e,v,c,y, update);
}

function init(e,v,c,y, update) {
  if (update) {
    d3.select("#map-svg").remove();
    console.log()
    d3.json("csv/map.json").then(function (data) {
       
      switch(v){
        case "GDP":
          filePath = "csv/CholoplethMap/gdp.json";
          mapGDP(data, filePath, c, y);   
          break;
        case "Employment":
          filePath = ""; // TODO
          mapEmployment(data, filePath, c, y, e);  
          break;
        case "Income":
          filePath = "csv/CholoplethMap/Q4.json";
          mapIncome(data, filePath, c, y, e);  
          break;
        case "Education":
          filePath = "csv/CholoplethMap/Q2_b.json"; // TODO
          mapEducation(data, filePath, c, y, e);  
          break;
        case "Women-high-pos":
          filePath = "csv/CholoplethMap/Q6.json";
          mapWHP(data, filePath, c, y);  
          break;
        case "Poverty":
          filePath = "csv/CholoplethMap/Q1.json";
          mapPoverty(data, filePath, c, y, e);
          break;
        case "GWG":
          filePath = "csv/CholoplethMap/Q4_b.json";
          mapGWG(data, filePath, c, y, e);  
          break;
      }
  
    });
  } else {
    d3.json("csv/map.json").then(function (data) {   // loading the JSON files
      var projection = d3.geoMercator()     // creates the mercator projection
                          .center([75, 50])  // projection center [longitude, latitude]
                          .scale(300)        // scale factor of the projection
                          
      var path = d3.geoPath().projection(projection);
      
      d3.select("#map-holder").append("svg")
        .attr("id", "map-svg")
        .attr("width", 960)
        .attr("height", 500)
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .style("fill", "#1A1C1F")
        .style('stroke', '#515151')
        .style('stroke-width', 1)
        .on("mouseover", mouseOver)

        .on("mouseleave", mouseLeave)
      addZoom();
    });
  }
}

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Hover effects - missing: countries' names appearing (and maybe variable value) 
function mouseOver() {
  this.parentNode.appendChild(this);
  d3.selectAll(".country")
    .transition()
    .duration(200)
    .style("opacity", .5)
  d3.select(this)
    .transition()
    .duration(200)
    .style("opacity", 1)
    .style("stroke", "white")
  //d3.select(this).attr("fill","grey").attr("stroke-width",2);
  //return tooltip.style("hidden", false).html(this.Country);
}

function mouseLeave() {
  d3.selectAll(".country")
    .transition()
    .duration(200)
    .style("opacity", .8)
  d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "#515151")
  d3.select(this).attr("fill","white").attr("stroke-width",1);
  tooltip.classed("hidden", true);

}

function addZoom() {
  d3.select("#map-svg").call(
    d3.zoom()
      .extent([[-300,-300],[300, 300],])
      .extent([[0,0],[960, 500],])
      .scaleExtent([1,8])
      .on("zoom", zoomed)
  );
}

function zoomed({ transform }) {
  d3.selectAll("#map-svg").attr("transform", transform);
}
 

/* ---- Auxiliary functions based on the variable chosen ---- */
function mapGDP(data, filePath, c, y){
  var colorScale = d3.scaleThreshold() //this needs to change!!!!! TODO
  .domain([90000, 150000, 500000, 750000, 1000000, 2500000])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()
                       .center([75, 50])
                       .scale(300)
                       
    var path = d3.geoPath().projection(projection);
    d3.select("#map-holder").append("svg")
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + parseFloat(d2.GDP);
            //console.log(val)
            console.log("aaaaaaaaaaaaaaaaaaaaa")
          }
          localStorage.setItem(d2.Country, val);
          //console.log(localStorage.getItem(d2.Country))
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";
      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", function() {	
        console.log(this)
        this.parentNode.appendChild(this);
        d3.selectAll(".country")
          .transition()
          .duration(200)
          .style("opacity", .5)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)
          .style("stroke", "white")      
        div.transition()		
        .duration(200)		
        .style("opacity", .9);		
        console.log($(this).attr('name'))
        console.log(localStorage.getItem($(this).attr('name')))
        div	.html($(this).attr('name') + "<br/>"  + localStorage.getItem($(this).attr('name')))	
        .style("left", (event.pageX) + "px")		
        .style("top", (event.pageY - 28) + "px");	
    
        })			
      .on("mouseleave", mouseLeave)
      addZoom();  
    
    //d3.select('body').append('div').attr('id', 'tooltip').attr('style', 'position: absolute; opacity: 0;');
    //d3.select('svg').selectAll('path').data(data.features)
      //.join('path')
      //.attr('r', 3)
      //.attr('cy', 5)
      //.attr('cx', (d,i) => i*15+15)
      //.on('mouseover', function(d) {
      //d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.properties.name)
      //})
      //.on('mouseout', function() {
      //d3.select('#tooltip').style('opacity', 0)
      //})
      //.on('mousemove', function() {
      //d3.select('#tooltip').style('left', (d3.event.pageX+10) + 'px').style('top', (d3.event.pageY+10) + 'px')
      //})
     
      
  });
}

function mapEmployment(data, filePath, c, y, e){
  // TODO implement after extracting csv
}

function mapIncome(data, filePath, c, y, e){
  var colorScale = d3.scaleThreshold()
  .domain([10000, 20000, 30000, 40000, 50000, 60000])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([75, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var path = d3.geoPath().projection(projection);
    
    d3.select("#map-holder").append("svg") //this cannot be append
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.Country)) && 
              (y.includes(d2.Year)) && 
              (e.includes(d2.ISCED11)) && 
              (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.MoneyF == -1 || d2.MoneyH == -1){
              val = -1
            } else {
              val = val + (d2.MoneyF + d2.MoneyM);
            }
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}

function mapEducation(data, filePath, c, y, e){
  var colorScale = d3.scaleThreshold()
  .domain([10, 30, 50, 60, 70, 90])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([75, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var path = d3.geoPath().projection(projection);
    
    d3.select("#map-holder").append("svg") //this cannot be append
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.Country)) && 
              (y.includes(d2.Year)) && 
              (e.includes(d2.isced11)) && 
              (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.values == -1){
              val = -1
            } else {
              val = val + d2.value;
            }
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}

function mapWHP(data, filePath, c, y){
  var colorScale = d3.scaleThreshold() //this needs to change!!!!! TODO
  .domain([1, 3, 5, 10, 15, 20])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()
                       .center([75, 50])
                       .scale(300)
                       
    var path = d3.geoPath().projection(projection);
    d3.select("#map-holder").append("svg")
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.Country)) && 
              (y.includes(d2.Year)) &&
              (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + d2.femaleEmployeesHighPosition;
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}

function mapPoverty(data, filePath, c, y, e){
  var colorScale = d3.scaleThreshold()
  .domain([5, 10, 20, 30, 40, 50])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([75, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var path = d3.geoPath().projection(projection);
    
    d3.select("#map-holder").append("svg") //this cannot be append
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.code)) && 
              (y.includes(d2.Year)) && 
              (e.includes(d2.ISCED11)) && 
              (d2.code === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + d2.AVG;
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}

function mapGWG(data, filePath, c, y, e){
  var colorScale = d3.scaleThreshold()
  .domain([-1, 1, 3, 5, 10, 20])
  .range(d3.schemeBlues[7]);

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([75, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var path = d3.geoPath().projection(projection);
    
    d3.select("#map-holder").append("svg") //this cannot be append
      .attr("id", "map-svg")
      .attr("width", 960)
      .attr("height", 500)
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var val = 0;
        data2.forEach(d2 => {
          if ((c.includes(d2.Country)) && 
              (y.includes(d2.Year)) && 
              (e.includes(d2.ISCED11)) && 
              (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.MoneyF == -1 || d2.MoneyH == -1){
              val = -100
            } else {
              val = val + parseFloat(d2.GenderWageGap.replace(",", "."));
            }
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}
