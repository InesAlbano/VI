var dataset;
var width = 600;
var height = 400;
var padding = 60;
var radius = 5;

analyzer("Init")

document.getElementById("button-forms").addEventListener("click", function(){
  updateLine();
}); 

function updateLine(){
  var v = localStorage.getItem("variable");
  var e = localStorage.getItem("education");
  analyzer(v, e);
}

function analyzer(inequality, education) {
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
      line_chart(countries_filtered_years,maximo,minimo, inequality);
      });
      break
    case "Employment": // TODO get csv
      d3.select("#line-svg").remove();
      d3.json("").then(function (data) { //parse data
        dataset = data;
        line_chart();
      });       
      break
    case "Income": //this is not workingggggggg
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
              aux.push(selected_countries[i][j]);
              if(maximo<(selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM)){
                maximo=selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyMn;
              }
              if(minimo>selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM){
                minimo=selected_countries[i][j].MoneyF+selected_countries[i][j].MoneyM;
              }
            }
          }
          if(minimo>0){
            minimo=0;
          } else {
            minimo = minimo * 2;
          }
          console.log("filtered years", countries_filtered_years)
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years,maximo,minimo, inequality);
      });          
      break
    case "Education": // TODO get csv
      d3.select("#line-svg").remove();
      d3.json("").then(function (data) { //parse data
        dataset = data;
        line_chart();
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
              if(maximo<selected_countries[i][j].femaleEmployeesHighPosition){
                maximo=selected_countries[i][j].femaleEmployeesHighPosition;
              }
              if(minimo>selected_countries[i][j].femaleEmployeesHighPosition){
                minimo=selected_countries[i][j].femaleEmployeesHighPosition;
              }
            }
          }
          if(minimo>0){
            minimo=0;
          } else {
            minimo = minimo  * 2;
          }
          countries_filtered_years.push(aux);
        }
      line_chart(countries_filtered_years,maximo,minimo, inequality);
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
          } else {
            minimo = minimo * 2;
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
              if(maximo<selected_countries[i][j].GenderWageGap){
                maximo=selected_countries[i][j].GenderWageGap;
              }
              if(minimo>selected_countries[i][j].GenderWageGap){
                minimo=selected_countries[i][j].GenderWageGap;
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
    console.log("countries", countries_filtered_years)
    line_chart(countries_filtered_years, maximo, minimo, inequality);
    });
    break
    default:
      d3.select("#line-svg").remove();
      inequality="Gdp";
      d3.json("csv/gdp.json").then(function (data) { //parse data
        dataset = data;
        line_chart([]);
      });
	}
}

/* --- DISPLAY GDP --- */
function line_chart(paises, maximo,minimo, v) {
  var xscaleData = paises[0].map((a) => a.Year);

  var xscale = d3
    .scalePoint()
    .domain(xscaleData)
    .range([padding, width - padding]);

  var hscale = d3
    .scaleLinear()
    .domain([minimo,maximo])
    .range([height - padding, padding]);

  var svg = d3
    .select("#line_chart")
    .append("svg")
    .attr("id", "line-svg")
    .attr("width", width)
    .attr("height", height);

    if(paises.length > 0)
      for (i = 0; i < paises.length; i++) {
        svg
        .append("path")
        .datum(paises[i])
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
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
              else if (v === "Employment")
                return hscale(); // TODO
              else if (v === "Income"){ //THIS IS NOT WORKINGGGGG
                var aux = 0;
                if (d.MoneyF == -1 || d.MoneyM == -1)
                  aux = 0 //outlier
                else
                  aux = parseInt(d.MoneyF) + parseInt(d.MoneyM);
                console.log("aux", aux)
                return hscale(aux);
              }
              else if (v === "Education")
                return hscale(); //TODO
              else if (v === "Women-high-pos")
                return hscale(d.femaleEmployeesHighPosition);
              else if (v === "Poverty"){console.log(d.AVG)
                return hscale(d.AVG);}
              else if (v === "GWG"){ // its not displaying correctly even though aux is correct
                var aux = parseFloat(d.GenderWageGap.replace(",", "."))
                console.log("aux", hscale(aux))
                return hscale(aux);
              }
            })
        );  
      }
    

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
    .text("Budget (M)");

  var xscaleDataFiltered = xscaleData.filter(function (d, i) {
    if (i % 5 == 0) return d;
  });

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
}
