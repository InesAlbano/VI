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
          filePath = "csv/CholoplethMap/Q2_total.json"; // TODO
          mapEmployment(data, filePath, c, y, e);  
          break;
        case "Income":
          filePath = "csv/CholoplethMap/Q4.json";
          mapIncome(data, filePath, c, y, e);  
          break;
        case "Education":
          filePath = "csv/CholoplethMap/Q3_total.json"; // TODO
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

// Hover effects
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
  div.transition()		
    .duration(500)		
    .style("opacity", 0);	
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
  var keys = [90000, 150000, 500000, 750000, 1000000, 2500000]
  var colorScale = d3.scaleThreshold() //this needs to change!!!!! TODO
    .domain(keys)
    .range(d3.schemeBlues[7]);

  // select the svg area
  var svg = d3.select("#legend")
    .style("margin-top", '5%')
    .style("margin-right", '0%')
    .style("position", "absolute")

  var bias = 20
  // Handmade legend
  for (i = 0; i < 6; i++) {
    svg.append("circle").attr("cx",200).attr("cy",100 + i*bias).attr("r", 6).style("fill", d3.schemeBlues[6][i])
    svg.append("text").attr("x", 220).attr("y", 100 + i*bias).text(keys[i]).style("font-size", "15px").attr("alignment-baseline","middle")
  }

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
          y1 = y;
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + parseFloat(d2.GDP);         
          }
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) { 
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";
      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	
          }
        })			
      .on("mouseleave", mouseLeave)
      addZoom();  
  });
}

function mapEmployment(data, filePath, c, y, e){
  var colorScale = d3.scaleThreshold() 
  .domain([15, 30, 45, 60, 75, 100])
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
          y1 = y;
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + parseFloat(d2.AverageEmployment.replace(",", "."));         
          }
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) { 
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";
      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	
          }
        })			
      .on("mouseleave", mouseLeave)
      addZoom();  
  });
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
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (e.includes(d2.ISCED11)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.MoneyF == -1 || d2.MoneyH == -1){
              val = -1
            } else {
              val = val + (d2.MoneyF + d2.MoneyM);
              localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
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
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	    
          }
        })			
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
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (e.includes(d2.ISCED11)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.values == -1){
              val = -1
            } else {
              console.log(d2.AveragePercentage)
              val = val + parseFloat(d2.AveragePercentage.replace(",", "."));
              localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
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
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	    
          }
        })			
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
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + d2.femaleEmployeesHighPosition;
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	
          }
        })			
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
          if ((c.includes(d2.code)) && (y.includes(d2.Year)) && (e.includes(d2.ISCED11)) && (d2.code === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + d2.AVG;
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .style('stroke', '#515151')
      .style('stroke-width', 1)
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	    
          }
        })			
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
          if ((c.includes(d2.Country)) && (y.includes(d2.Year)) && (e.includes(d2.ISCED11)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.MoneyF == -1 || d2.MoneyH == -1){
              val = -100
            } else {
              val = val + parseFloat(d2.GenderWageGap.replace(",", "."));
              localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
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
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
        if(c.includes($(this).attr('name'))) {
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

          if (localStorage.getItem($(this).attr('name')) == null){
            value = ''
          } else {
            value = localStorage.getItem($(this).attr('name'))
          }
          div	.html($(this).attr('name') + "<br/>"  + value)	
          .style("left", (event.pageX) + "px")		
          .style("top", (event.pageY - 28) + "px");	  
          }  
        })			
      .on("mouseleave", mouseLeave)
      addZoom();          
  });
}
