var dataset;
var width = 600;
var height = 400;
var padding = 60;
var radius = 5;

var tooltipLine = d3.select("div.tooltipLine");

analyzerLine("Init")

document.addEventListener('clickedCountryMap' , function(){
  changeLine(localStorage.getItem("clickedItemCountry"));
}); 
document.addEventListener('clickedCountrySlope' , function(){
  changeLine(localStorage.getItem("clickedItemCountry"));
}); 
document.addEventListener('clickedCountryClev' , function(){
  changeLine(localStorage.getItem("clickedItemCountry"));
}); 

document.addEventListener('updateCharts' , function(){
  d3.select("#line-svg").remove();
  console.log("vou dar update")
  updateLine()
}); 

var years1 = localStorage.getItem("years");

function updateLine(){
  var v = localStorage.getItem("variable");
  var e = localStorage.getItem("education");
  console.log("antes do update analyzer")
  console.log(v, e)
  analyzerLine(v, e)
  console.log("depois do update analyzer")
}

function analyzerLine(inequality, education) {
  console.log(inequality, education)
  console.log("dentro do analyzer")
	switch (inequality) {
    case "GDP": // no education
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/gdp.json").then(function (data) {
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              aux.push(selected_countries[i][j]);
              if(maximo<selected_countries[i][j].GDP){
                maximo=selected_countries[i][j].GDP;
              }
              if(minimo>selected_countries[i][j].GDP){
                minimo=selected_countries[i][j].GDP;
              }
            }
          }
          if(minimo>0){
            minimo=0;
          }
          countries_filtered_years.push(aux);
        }
        
      line_chart(countries_filtered_years, maximo, minimo, inequality);
      });
      break
    case "Employment":
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/Q2_total.json").then(function (data) { //parse data
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              if (education === selected_countries[i][j].ISCED11) {
                aux.push(selected_countries[i][j]);
                if(maximo<parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."))){
                  maximo=parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."));
                }
                if(minimo>parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."))){
                  minimo=parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."));
                }
              }
            }
          }
          if(minimo>0){
            minimo=0;
          }
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years, maximo, minimo, inequality);
      });       
      break
    case "Income":
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/Q4.json").then(function (data) {
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              if (education === selected_countries[i][j].ISCED11) {
                aux.push(selected_countries[i][j]);
                if(maximo<(selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM)){
                  maximo=selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM;
                }
                if(minimo>selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM){
                  minimo=selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM;
                }
            }
          }
        }

        if(minimo>0){
          minimo=0;
        } else {
          minimo = minimo * 2;
        }
        countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years,maximo,minimo, inequality);
      });          
      break
    case "Education":
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/Q3_total.json").then(function (data) { //parse data
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              if (education === selected_countries[i][j].ISCED11) {
                aux.push(selected_countries[i][j]);
                if(maximo<parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."))){
                  maximo=parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."));
                }
                if(minimo>parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."))){
                  minimo=parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."));
                }
              }
            }
          }
          if(minimo>0){
            minimo=0;
          }
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years, maximo, minimo, inequality);
      });       
      break
      case "Women-high-pos": // no education
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/Q6.json").then(function (data) {
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              aux.push(selected_countries[i][j]);
              if(maximo<selected_countries[i][j].growthRateWHP){
                maximo=selected_countries[i][j].growthRateWHP;
              }
              if(minimo>selected_countries[i][j].growthRateWHP){
                minimo=selected_countries[i][j].growthRateWHP;
              }
            }
          }
          if(minimo>0){
            minimo=0;
          } else {
            minimo = minimo *2;
          }
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years, maximo, minimo, inequality);
      });
      break
    case "Poverty":
      d3.select("#line-svg").remove();
      d3.json("csv/LineChart/Q1.json").then(function (data) {
        dataset = data;

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.code === $(this).attr('value'))
        )});
              
        var years=[];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              if (education === selected_countries[i][j].ISCED11) {
                aux.push(selected_countries[i][j]);
                if(maximo<selected_countries[i][j].AVG){
                  maximo=selected_countries[i][j].AVG;
                }
                if(minimo>selected_countries[i][j].AVG){
                  minimo=selected_countries[i][j].AVG;
                }
              }
            }
          }
          if(minimo>0){
            minimo = 0;
          } 
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years,maximo,minimo, inequality);
      });
      break
    case "GWG": 
    d3.select("#line-svg").remove();
    d3.json("csv/LineChart/Q4_b.json").then(function (data) {
      dataset = data;

      var selected_countries = [];
      $('#checkboxes input:checked').each(function() {
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
      )});
            
      var years=[];
      $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
      let yearsv2 = years.map(i=>Number(i));

      var maximo=0;
      var minimo=0;
      var countries_filtered_years=[];

      for(let i=0; i<selected_countries.length; i++) {
        var aux=[];
        for(let j=0; j<selected_countries[i].length; j++){
          if(yearsv2.includes(selected_countries[i][j].Year)) {
            if (education === selected_countries[i][j].ISCED11) {
              aux.push(selected_countries[i][j]);
              if(maximo<parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."))){
                maximo=parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."));
              }
              if(minimo>parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."))){
                minimo=parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."));
              }
            }
          }
        }
        if(minimo>0){
          minimo = 0;
        } else {
          minimo = minimo * 2;
        }
        countries_filtered_years.push(aux);
      }
      line_chart(countries_filtered_years, maximo, minimo, inequality);
      });
      break
    default:

      d3.json("csv/LineChart/gdp.json").then(function (data) {
        dataset = data;
        var selected_countries = [];
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('BG').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('BE').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('CZ').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('PT').value))
              
        var years=[];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];

        for(let i=0; i<selected_countries.length; i++) {
          var aux=[];
          for(let j=0; j<selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              aux.push(selected_countries[i][j]);
              if(maximo<selected_countries[i][j].GDP){
                maximo=selected_countries[i][j].GDP;
              }
              if(minimo>selected_countries[i][j].GDP){
                minimo=selected_countries[i][j].GDP;
              }
            }
          }
          if(minimo>0){
            minimo=0;
          }
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years, maximo, minimo, "GDP");
      });
	}
}

var div = d3.select("body").append("div")	
    .attr("class", "tooltipLine")				
    .style("opacity", 0);

/* ------------------------------------- LINE CHART --------------------------------------- */

function line_chart(paises, maximo,minimo, v) {
  // INITIAL VARS ____________________________________________________________________________
  var xscaleData = paises[0].map((a) => a.Year);

  // Scales
  var xscale = d3
    .scalePoint()
    .domain(xscaleData)
    .range([padding, width - padding]);

  var hscale = d3
    .scaleLinear()
    .domain([minimo, maximo])
    .range([height - padding, padding]);

  // Define image SVG; everything of SVG will be append on the div of line_chart
  var svg = d3
    .select("#line_chart")
    .append("svg") // appends an svg to the div 'line_chart'
    .attr("id", "line-svg")
    .attr("width", width)
    .attr("height", height);

  // Scatterplor cannot have 2 lists of obj. It has to get data all from the same array of obj. otherwise *Puffff*
  // to be used on SVG - PLOTS
  var new_paises=[]; 
  for(let i=0; i<paises.length; i++) {
    for(let j=0; j<paises[i].length; j++){
      new_paises.push(paises[i][j]);
    }
  }

  // AXIS ________________________________________________________________________________________
  var yaxis = d3
    .axisLeft() // we are creating a d3 axis
    .scale(hscale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + padding + ",0)")
    .attr("class", "yaxis") // we are giving it a css style
    .call(yaxis);

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .attr("class", "label")
    .text("Value");

  /*   var xscaleDataFiltered = xscaleData.filter(function (d, i) {
      if (i % 5 == 0) return d;
  }); */

  var xaxis = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscale) // we are adding our padding
    //.tickValues(xscaleDataFiltered)
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxis);

  // text label for the x axis
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (height - padding / 3) + ")"
    )
    .attr("class", "label")
    .text("Year");

  // SVG - Plots + Lines ______________________________________________________________________
  if(paises.length > 0) {
    for (i = 0; i < paises.length; i++) {

      // LINES ----------------------------------------------------------------------------------
      svg
        .append("path")
        .datum(paises[i])
        .attr("fill", "none")
        .attr("stroke", "#878787")
        .attr("stroke-width", 2)
        .attr("id", function(d){
          return d[0].Country +'-Lines';
        })
        .attr("selected", false)
        .attr("class", "line")
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return xscale(d.Year);
            })
            .y(function (d) {
              
              if (v === "GDP")
                return hscale(d.GDP);

              else if (v === "Employment"){
                return hscale(parseFloat(d.AverageEmployment.replace(",", "."))); 

              } else if (v === "Income"){
                return hscale(d.MoneyM+d.MoneyF);

              } else if (v === "Education")
              return hscale(parseFloat(d.AveragePercentage.replace(",", "."))); 

              if (v === "Women-high-pos")
                return hscale(d.growthRateWHP);

              else if (v === "Poverty")
                return hscale(d.AVG);

              else if (v === "GWG"){ 
                return hscale(parseFloat(d.GenderWageGap.replace(",", ".")));
              }
            })
        ); 
      // PLOTS - Faltam os outros Datasets que nao o GDP --------------------------------------
      var plots = svg
        .selectAll("circle")
        .data(new_paises)
        .join("circle") // now we append circles
        .attr("r", radius) // each circle
        .attr("fill", "#5b98c7")
        .attr("stroke", "white")
        .attr("id", function(d) {
          return d.Year;
        })
        .attr("is_clicked", false)
        .attr("name", function(d){
          return d.Country;
        })
        .attr("class", "plot")
        .attr("value", function(d){
          if (v === "GDP")
            return d.GDP;
          if (v === "Employment")
            return parseFloat(d.AverageEmployment.replace(",", "."));
          if (v === "Income")
            return d.MoneyF+d.MoneyM;
          if (v === "Education")
            return parseFloat(d.AveragePercentage.replace(",", "."));
          if (v === "Women-high-pos")
            return d.growthRateWHP;
          if (v === "Poverty")
            return d.AVG;
          if (v === "GWG")
            return parseFloat(d.GenderWageGap.replace(",", "."));
        })
        .attr("cx", function (d, i) {
          return xscale(d.Year);
        })
        .attr("cy", function (d) {
          // we define each circle y position
          if (v === "GDP")
            return hscale(d.GDP);
          if (v === "Employment")
            return hscale(parseFloat(d.AverageEmployment.replace(",", ".")));
          if (v === "Income")
            return hscale(d.MoneyF+d.MoneyM);
          if (v === "Education")
            return hscale(parseFloat(d.AveragePercentage.replace(",", ".")));
          if (v === "Women-high-pos")
            return hscale(d.growthRateWHP);
          if (v === "Poverty")
            return hscale(d.AVG);
          if (v === "GWG")
            return hscale(parseFloat(d.GenderWageGap.replace(",", ".")));
        })
        .on("click", function (){
          var country = ''
          this.parentNode.appendChild(this);
          var b = document.getElementById("line-svg").getElementsByClassName("line")
          for (let i = 0; i < b.length; ++i){
            if(this.attributes.name.value != b[i].attributes.id.value.replace('-Lines', '')){
              b[i].attributes.selected.value = false;
              b[i].attributes.stroke.value = "#878787"
            } else {
              b[i].attributes.selected.value = true;
              b[i].attributes.stroke.value = "#E0C090"
            }
          }

          for (let i = 0; i < plots._groups[0].length; i++){
            if (plots._groups[0][i].attributes.id.value != this.attributes.id.value || plots._groups[0][i].attributes.name.value != this.attributes.name.value){
              if (plots._groups[0][i].attributes.is_clicked.value === 'true') {
                plots._groups[0][i].attributes.is_clicked.value = 'false';
                d3.select(plots._groups[0][i])
                  .attr("fill", "#5b98c7")
                  .attr("r", radius);
                div.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
                tooltipLine.classed("hidden", true);
              }
            } else {
              this.attributes.is_clicked.value = "true";
              d3.select(this)
                .attr("fill", "#dea959")
                .attr("r", radius*1.5);
              localStorage.setItem("clickedItemCountry", this.attributes.name.value)

              const event = new Event('clickedCountryLine');
              document.dispatchEvent(event);
            }
          }
        })
        .on("mouseover", function() {
          this.parentNode.appendChild(this);
          d3.select(this)
            .attr("fill", "#E0C090")
            .attr("r", radius*1.5);
          d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 1)
            .style("stroke", "white")     
          div.transition()		
            .duration(200)		
            .style("opacity", .9);

          var value;
          var c = []
          var y = []

          for (i in paises) {
            for (j in paises[i]) {
              if (!(c.includes(paises[i][j].Country))) {
                c.push(paises[i][j].Country)
              }
              if (!(y.includes(paises[i][j].Year))) {
                y.push(parseInt(paises[i][j].Year))
              }
            }
          }

          if((c.includes($(this).attr('name'))) && (y.includes(parseInt($(this).attr('id'))))) { 
            if (this == null){
              value = ''
            } else {
              value = parseFloat($(this).attr('value'))
              value = value.toFixed(1)
            }
              div	.html($(this).attr('name') + "<br/>"  + value)	
                .style("left", (event.pageX) + "px")		
                .style("top", (event.pageY - 28) + "px");	
            }
          })			          
        .on("mouseout", function(){
          if (this.attributes.is_clicked.value === 'false'){
            d3.select(this)
            .attr("fill", "#5b98c7")
            .attr("r", radius);

            div.transition()		
              .duration(500)		
              .style("opacity", 0);	
            tooltipLine.classed("hidden", true);
          }
          
        }); 
        
    }
  }
  //______________________________________________________________________________________________

  
}


/* interaction */
function changeLine(Country){
  resetLines()
  var a = document.getElementById(Country+'-Lines')
  a.attributes.stroke.value = "#dea959"
  a.attributes.selected.value = "true"
}

function resetLines(){
  var a = document.getElementById("line-svg").getElementsByClassName("plot");
  for (let i = 0; i < a.length; ++i){
    a[i].attributes.is_clicked.value = false;
    a[i].attributes.stroke.value = "white";
    a[i].attributes.fill.value = "#5b98c7";
    a[i].attributes.r.value = radius;
  }

  var b = document.getElementById("line-svg").getElementsByClassName("line")
  for (let i = 0; i < b.length; ++i){
    b[i].attributes.selected.value = false;
    b[i].attributes.stroke.value = "#878787"
  }
}