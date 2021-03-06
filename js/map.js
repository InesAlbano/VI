// Initial State
init(null,null,null,null, update=false)

// Action: click on country
document.addEventListener('clickedCountryLine' , function(){
  changeBorder(localStorage.getItem("clickedItemCountry"));
}); 

document.addEventListener('clickedCountrySlope' , function(){
  changeBorder(localStorage.getItem("clickedItemCountry"));
}); 

document.addEventListener('clickedCountryClev' , function(){
  changeBorder(localStorage.getItem("clickedItemCountry"));
}); 


document.addEventListener('updateCharts' , function(){
  updateMap(update=true);
}); 

document.addEventListener('clickedCountryMap', function(){
  var vars = document.querySelectorAll("input[type=checkbox][name=country]");
  var clickedVar = localStorage.getItem("clickedItemCountry");
  vars.forEach(function(c) {
    if (clickedVar === c.attributes.id.value){
      if(c.checked) {
        c.checked = false;
      }
      else {
        c.checked = true;
      }
    }
  });
});



// Tooltip: hover in the coutries
var tooltip = d3.select("div.tooltip");

function updateMap(update = false){
  
  // retrieving values from index.html
  var e = localStorage.getItem("education");
  var v = localStorage.getItem("variable");
  var c = localStorage.getItem("countries");
  var y = localStorage.getItem("years");

  c= c.toString();
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
    d3.json("csv/map.json").then(function (data) {
       
      switch(v){
        case "GDP":
          filePath = "csv/gdp.json";
          mapGDP(data, filePath, c, y, update);  
          break;
        case "Employment":
          filePath = "csv/Q2_total.json"; 
          mapEmployment(data, filePath, c, y, e);  
          break;
        case "Income":
          filePath = "csv/Q4.json";
          mapIncome(data, filePath, c, y, e);  
          break;
        case "Education":
          filePath = "csv/Q3_total.json"; 
          mapEducation(data, filePath, c, y, e);  
          break;
        case "Women-high-pos":
          filePath = "csv/Q6.json";
          mapWHP(data, filePath, c, y);  
          break;
        case "Poverty":
          filePath = "csv/Q1.json";
          mapPoverty(data, filePath, c, y, e);
          break;
        case "GWG":
          filePath = "csv/Q4_b.json";
          mapGWG(data, filePath, c, y, e);  
          break;
      }
  
    });
  } else {
    d3.select("#map-svg").remove();
    d3.json("csv/map.json").then(function (data) {
      filePath = "csv/gdp.json";
      mapGDP(data, filePath, ["BE", "BG", "CZ", "PT"], [2010, 2011, 2012], update); 
    });
  }
}

// Define the div for the tooltip
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

// Hover effects
function mouseOver(obj) {
  d3.selectAll(".country")
  .transition()
  .duration(200)
  .style("opacity", .5)
  d3.select(obj)
  .transition()
  .duration(200)
  .style("opacity", 1)
  .style("stroke", "white")      
  div.transition()		
  .duration(200)		
  .style("opacity", .9);

  if (localStorage.getItem($(obj).attr('name')) == null){
    value = ''
  } else {
    value = localStorage.getItem($(obj).attr('name'))
  }
  div	.html($(obj).attr('name') + "<br/>"  + value)	
  .style("left", (event.pageX) + "px")		
  .style("top", (event.pageY - 28) + "px");	
}

function mouseLeave(obj) {
  d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .8)
  div.transition()		
      .duration(500)		
      .style("opacity", 0);	

  if (obj.attributes.is_clicked.value.toString() === 'false'){
    d3.select(obj)
      .transition()
      .duration(200)
      .style("stroke", '#515151')
      .style("stroke-width", 1)      
  } else {
    d3.select(obj)
      .transition()
      .duration(200)
      .style("stroke", '#E0C090')
      .style("stroke-width", 3)   
  } 
}

// Not working properly
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

function click(obj) {
  var cAux = localStorage.getItem('countries').split(',')

  if (obj.attributes.is_clicked.value.toString() === 'true'){
    obj.attributes.is_clicked.value = false;
    localStorage.setItem('countries', cAux.filter(item => item !== obj.attributes.id.value));
  
    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    div.transition()		
      .duration(200)		
      .style("opacity", 0);

  } else {
    obj.attributes.is_clicked.value = true;
    cAux.push(obj.attributes.id.value)
    localStorage.setItem('countries', cAux);

    d3.selectAll(".country")
      .transition()
      .duration(200)
      .style("opacity", .5)

    div.transition()		
      .duration(200)		
      .style("opacity", .9);
  }
  
  localStorage.setItem("clickedItemCountry", obj.attributes.name.value)

  const event = new Event('clickedCountryMap');
  document.dispatchEvent(event);
}

/* ---- Auxiliary functions based on the variable chosen ---- */
function mapGDP(data, filePath, c, y, update){
  var keys = [90000, 150000, 500000, 750000, 1000000, 2500000]
  if(update) { // Legend created for every update
    var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' €').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  
  }
  else { // Legend created for initial state
    var colorScale = d3.scaleThreshold() 
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
      svg.append("text").attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' €').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle")
      }  
  }
  
  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()
                       .center([55, 50])
                       .scale(300)

    var countries = c;
                       
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
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
              val = val + parseFloat(d2.GDP);         
          }
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) { 
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";
      })
      .attr("name", function(d){
        return d.id;
      })
      .attr("id", function(d){
        return d.id;
      })
      .attr("class", 'countries')
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 // permitir apenas fazer hover nos itens selecionados
         mouseOver(this)
        })			
      .on("mouseleave", function() {
        mouseLeave(this) 
      })
      addZoom();  
  });
}

function mapEmployment(data, filePath, c, y, e){
    keys = [15, 30, 45, 60, 75, 100]
    var colorScale = d3.scaleThreshold() 
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
      svg.selectAll("text").each(function(d,i) { 
        d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' %').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
        })
      }  

    d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()
                       .center([55, 50])
                       .scale(300)

    var countries = c;
                       
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
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + parseFloat(d2.AverageEmployment.replace(",", "."));         
          }
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";
      })
      .attr("name", function(d){
        return d.id;
      })
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();  
  });
}

function mapIncome(data, filePath, c, y, e){
  keys = [10000, 20000, 30000, 40000, 50000, 60000]
  var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' €').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([55, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection

    var countries = c;
                       
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
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
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
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();          
  });
}

function mapEducation(data, filePath, c, y, e){
  var keys = [10, 30, 50, 60, 70, 90]
  var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' %').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([55, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
    
    var countries = c;
                   
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
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            if(d2.values == -1){
              val = -1
            } else {
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
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();          
  });
}

function mapWHP(data, filePath, c, y){
  var keys = [1, 3, 5, 10, 15, 20]
  var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' %').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  

  var countries = c;

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()
                       .center([55, 50])
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
          if ((y.includes(d2.Year)) && (d2.Country === d.id)) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
            val = val + d2.femaleEmployeesHighPosition;
            localStorage.setItem(d2.Country, (val/y.length).toFixed(1));
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();          
  });
}

function mapPoverty(data, filePath, c, y, e){
  var keys = [10, 20, 30, 40, 50, 70]
  var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' %').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([55, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var countries = c;

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
          if (y.includes(d2.Year)) { 
            if (d2.code === d.id && e.includes(d2.ISCED11)) {
              val = val + d2.AVG;
              localStorage.setItem(d2.code, (val/y.length).toFixed(1));
            }
            
          }
        });
        return (val/y.length) ? colorScale(val/y.length) : "#1A1C1F";

      })
      .attr("name", function(d){
        return d.id;
      })
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();          
  });
}

function mapGWG(data, filePath, c, y, e){
  var keys = [-1, 1, 3, 5, 10, 20]
  var colorScale = d3.scaleThreshold() 
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
    svg.selectAll("text").each(function(d,i) { 
      d3.select(this).attr("x", 220).attr("y", 100 + i*bias).text(keys[i]+' %').style("fill", "white").style("font-size", "15px").attr("alignment-baseline","middle") 
      })
    }  

  d3.json(filePath).then(function (data2) {
    var projection = d3.geoMercator()     // creates the mercator projection
                       .center([55, 50])  // projection center [longitude, latitude]
                       .scale(300)        // scale factor of the projection
                       
    var countries = c;

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
          if ((y.includes(d2.Year)) && (d2.Country === d.id) && (e.includes(d2.ISCED11))) {   // TODO need to correct NL because dataset of Q1 does not contain id NL
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
      .attr("id", function(d){
        return d.id;
      })
      .attr("is_clicked", function(d){ //this changed
        if (c.includes(d.id)) {
          return true
        } else {
          return false
        }
      })
      .style("stroke", function(d) {
        if(countries.includes(d.id)) {
          this.parentNode.appendChild(this);
          return '#E0C090'
        }
        else {
          return '#515151'
        }
      })
      .style("stroke-width", function(d) {
        if(countries.includes(d['id'])) {
          return 3
        }
        else {
          return 1
        }
      })
      .on("click", function (){
        click(this);
      })
      .on("mouseover", function() {	 
        mouseOver(this)
      })			
      .on("mouseleave", function() {	 
        mouseLeave(this)
      })
      addZoom();          
  });
}


function changeBorder(Country){
  resetBorders();
  var b = document.getElementById("map-svg").getElementById(Country)
  var fill = b.attributes.style.value.split(";")[0].replace("fill: ", '')
  b.attributes.style.value = 'fill: ' + fill + "; stroke: white; stroke-width: 1;"
  b.attributes.is_clicked.value = true;
}

function resetBorders(){
  var c = document.getElementById("map-svg");
  for (let i = 0; i < c.childNodes.length; ++i){
    c.childNodes[i].attributes.is_clicked.value = false;
    var fill = c.childNodes[i].attributes.style.value.split(";")[0].replace("fill: ", '')
    c.childNodes[i].attributes.style.value = 'fill: ' + fill + "; stroke: #515151; stroke-width: 1;"
  }
  
}