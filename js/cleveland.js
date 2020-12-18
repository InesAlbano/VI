var dataset;
var width = 600;
var height = 400;
var padding = 60;
var radius = 5;

var tooltipLine = d3.select("div.tooltipLine");

analyzer("Init");

document.addEventListener('clickedCountry' , function(){
  changeLine(localStorage.getItem("clickedItemCountry"));
}); 

document.addEventListener('updateCharts' , function(){
  //d3.select("#").remove();
  updateLine()
});

var years1 = localStorage.getItem("years");

function updateLine(){
  var v = localStorage.getItem("variable");
  var e = localStorage.getItem("education");
  analyzer(v, e);
}

// ESCOLHE 1 OPCAO A VISUALIZAR, DO MENU
function analyzer(inequality, education) {
	switch (inequality) {
    
    //GDP ___________________________________________________________________________________________________
    case "GDP": // no education
      //d3.select("#line-svg").remove();
      d3.json("csv/LineChart/gdp.json").then(function (data) {
        dataset = data;
        
        var selected_countries = []; // selected countries
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years=[]; // selected years
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i)); //selected years in number

        var maximo=0;
        var minimo=0;
        var countries_filtered_years=[];
        
        for(let i=0; i<selected_countries.length; i++) {
          var aux=[]; 
          for(let j=0; j<selected_countries[i].length; j++){ // na lista de paises paises
            if(yearsv2.includes(selected_countries[i][j].Year)) { //escrutina os anos selecionados 
              aux.push(selected_countries[i][j]); // aux e a nova lista com os paises e os anos selecionados 
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

      var paises_avg_GDP=[];


      for(let i=0; i<countries_filtered_years.length; i++) {
        aux2 = {};
        aux2['Country'] = countries_filtered_years[i][0].Country
        let gdp_soma = 0;
        for(let j=0; j<countries_filtered_years[i].length; j++) {
          gdp_soma = gdp_soma + countries_filtered_years[i][j].GDP;
        }
        aux2['GDP'] = gdp_soma /yearsv2.length;
        paises_avg_GDP.push(aux2);   
      }
      
      maximo_avg_gdp=0;
      minimo_avg_gdp=0;
      for(let i=0; i<paises_avg_GDP.length; i++) {
        if(maximo_avg_gdp<paises_avg_GDP[i].GDP) {
          maximo_avg_gdp=paises_avg_GDP[i].GDP;
        }
        if(minimo_avg_gdp>paises_avg_GDP[i].GDP){
          minimo_avg_gdp=paises_avg_GDP[i].GDP;
        }
      }
      


      cleveland_chart(paises_avg_GDP, maximo_avg_gdp, minimo_avg_gdp, inequality);
      });
      break
    
    /* // EMPLOYMENT ___________________________________________________________________________________________
    case "Employment":
      //d3.select("#line-svg").remove();
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
      cleveland_chart(countries_filtered_years, maximo, minimo, inequality);
      });       
      break
    
    // INCOME ____________________________________________________________________________________________
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
      cleveland_chart(countries_filtered_years,maximo,minimo, inequality);
      });          
      break
    
    // EDUCATION ____________________________________________________________________________________________
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
      cleveland_chart(countries_filtered_years, maximo, minimo, inequality);
      });       
      break
      
      // WHP ____________________________________________________________________________________________
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
      cleveland_chart(countries_filtered_years, maximo, minimo, inequality);
      });
      break
    
    // POVERTY ____________________________________________________________________________________________
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
      cleveland_chart(countries_filtered_years,maximo,minimo, inequality);
      });
      break
    
    // GWG ____________________________________________________________________________________________
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
      cleveland_chart(countries_filtered_years, maximo, minimo, inequality);
      });
      break */
    
    // DEFAULT ____________________________________________________________________________________________
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
        
        var paises_avg_GDP=[];
  
        for(let i=0; i<countries_filtered_years.length; i++) {
          aux2 = {};
          aux2['Country'] = countries_filtered_years[i][0].Country
          let gdp_soma = 0;
          for(let j=0; j<countries_filtered_years[i].length; j++) {
            gdp_soma = gdp_soma + countries_filtered_years[i][j].GDP;
          }
          aux2['GDP'] = gdp_soma /yearsv2.length;
          paises_avg_GDP.push(aux2);   
        }
        
        maximo_avg_gdp=0;
        minimo_avg_gdp=0;
        for(let i=0; i<paises_avg_GDP.length; i++) {
          if(maximo_avg_gdp<paises_avg_GDP[i].GDP) {
            maximo_avg_gdp=paises_avg_GDP[i].GDP;
          }
          if(minimo_avg_gdp>paises_avg_GDP[i].GDP){
            minimo_avg_gdp=paises_avg_GDP[i].GDP;
          }
        }
        
      cleveland_chart(paises_avg_GDP, maximo, minimo, "GDP");
      });
	}
}


/* ------------------------------------- CLEVELAND CHART --------------------------------------- */

function cleveland_chart(paises, maximo,minimo, v) {
  dif_paises=[];
  // paises=[{Country: "BG", GDP: 79128.8}, {Country: "BE", GDP: 375094.19999999995}, {...}, {...}]
 
  // INITIAL VARS ____________________________________________________________________________
  for(let i=0; i<paises.length; i++){
    dif_paises.push(paises[i].Country); //dif_paises=["BG", "BE", "CZ", PT]
  }
  var hscale = d3
    .scalePoint()
    .domain(dif_paises)
    .range([height - padding, padding]);

  var xscale = d3
    .scaleLinear()
    .domain([minimo, maximo])
    .range([padding, width - padding]);

  // Define image SVG; everything of SVG will be append on the div of cleveland_chart
  var svg = d3
    .select("#cleveland_chart")
    .append("svg") // appends an svg to the div 'cleveland_chart'
    .attr("id","cleveland-svg")
    .attr("width", width)
    .attr("height", height);
  
  // SVG - Plots + Lines ______________________________________________________________________
  //console.log("PAISES [i]",paises[i]);
            
  // PLOTS - Faltam os outros Datasets que nao o GDP --------------------------------------
  var plots = svg
    .selectAll("circle")
    .data(paises)
    .join("circle") // now we append circles
    .attr("r", radius) // each circle
    .attr("fill", "red")
    .attr("stroke", "red")
    .attr("cy", function(d) {
      return hscale(d.Country);
    })
    //.attr("is_clicked", false)
    .attr("class", "plot")
    .attr("cx", function(d){
      if (v === "GDP"){
        return xscale(d.GDP);
      }
  })



  // LINES ----------------------------------------------------------------------------------

  var lineGenerator = d3
  .line()
  .x(function (d) {
    if(v === 'GDP'){
      return xscale(d.GDP);
    }
  })
  .y(function (d) { 
    if(v === 'GDP')
      return hscale(d.Country);
  })


  p = []
  if (v === 'GDP'){
    for (let i = 0; i < paises.length; ++i) {
      aux = []
      aux_dic = {}
      aux_dic['Country'] = paises[i].Country
      aux_dic['GDP'] = 0
      aux.push(aux_dic)
      aux.push(paises[i])
      p.push(aux)
    }
  }

  console.log(p)
  for (let i = 0; i < p.length; ++i){
    svg
    .append("path")
    .datum(p[i])
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 4)
    .attr("id", function(d){ return d[0].Country +'-Lines'; })
    .attr("selected", false)
    .attr("class", "line")
    .attr("d", lineGenerator(p[i]));
  }

   



     
  //______________________________________________________________________________________________

  // AXIS ________________________________________________________________________________________
  var yaxis = d3
    .axisLeft() // we are creating a d3 axis
    .scale(hscale) // fit to our scale
    //.tickFormat(d3.format(".2s")) // format of each year
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
    //.attr("dy", "1em")
    .attr("class", "label")
    .text("Value");

  /*   var xscaleDataFiltered = xscaleData.filter(function (d, i) {
      if (i % 5 == 0) return d;
  }); */

  var xaxis = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscale) // we are adding our padding
    .tickFormat(d3.format(".2s"))
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
    .attr("dy", "1em")
    .attr("class", "label")
    .text("Value");
}