var dataset;
var width = 600;
var height = 400;
var padding = 60;
var radius = 5;

var tooltipLine = d3.select("div.tooltipLine");

var e = localStorage.getItem("education");

analyzer(e,true)

document.addEventListener('clickedCountryMap' , function(){
  changeSlope(localStorage.getItem("clickedItemCountry"));
}); 
document.addEventListener('clickedCountryLine' , function(){
  changeSlope(localStorage.getItem("clickedItemCountry"));
});
document.addEventListener('clickedCountryClev' , function(){
  changeSlope(localStorage.getItem("clickedItemCountry"));
});

document.addEventListener('updateCharts' , function(){
  d3.select("#slope-svg").remove();
  updateLineSlope()
}); 

var years1 = localStorage.getItem("years");

var div = d3.select("body").append("div")	
    .attr("class", "tooltipLine")				
    .style("opacity", 0);

function updateLineSlope(){
  var e = localStorage.getItem("education");
  analyzer(e, false);
}

var maxGDP = 0, minGDP = 0, 
    maxEmp = 0, minEmp = 0, 
    maxInc = 0, minInc = 0, 
    maxEdu = 0, minEdu = 0,
    maxWomen = 0, minWomen = 0, 
    maxPov = 0, minPov = 0, 
    maxGWG = 0, minGWG = 0;

function analyzer(isced, init) {
  Promise.all([
    d3.json("csv/LineChart/gdp.json"),
    d3.json("csv/LineChart/Q2_total.json"),
    d3.json("csv/LineChart/Q4.json"),
    d3.json("csv/LineChart/Q3_total.json"),
    d3.json("csv/LineChart/Q6.json"),
    d3.json("csv/LineChart/Q1.json"),
    d3.json("csv/LineChart/Q4_b.json")
  ]).then(function(files){
  
    if(init) {
      var countries_filtered_years = [];  
      var maxMin = [];
      
      if (files[0]){ // GDP
        var selected_countries = [];
        dataset = files[0];
  
        // Default: countries
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('BG').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('BE').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('CZ').value))
        selected_countries.push(dataset.filter(row => row.Country === $(this).attr('PT').value))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
  
        var aux = [];
  
        // Max and min values, to built the scale
        for(let i = 0; i < selected_countries.length; i++) {
          gdp = 0;
  
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              gdp = gdp + selected_countries[i][j].GDP;
              if(maxGDP < selected_countries[i][j].GDP) { maxGDP = selected_countries[i][j].GDP; }
              if(minGDP > selected_countries[i][j].GDP) { minGDP = selected_countries[i][j].GDP; }
            }
          }
  
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "GDP";
          dic['GDP'] = gdp/yearsv2.length; // average computation
          aux.push(dic);
  
          if(minGDP > 0) { minGDP = 0; }
  
        }
        countries_filtered_years.push(aux);
  
        maxMin.push(maxGDP);
        maxMin.push(minGDP);
        }
  
      if (files[1]) { // Employment
        var selected_countries1 = [];
        dataset1 = files[1];
  
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.Country === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          employment = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year) && (selected_countries1[i][j].ISCED11 === '0-2')) {
              employment = employment + parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."));
              if(maxEmp < parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."))) { maxEmp = parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", ".")); }
              if(minEmp > parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."))) { minEmp = parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", ".")); }
            }
          }
  
          dic = {}
          dic['Country'] = selected_countries1[i][0].Country;
          dic['Variable'] = "Employment";
          dic['Employment'] = employment/(yearsv2.length); // average computation
          aux1.push(dic);
  
          if(minEmp > 0) { minEmp = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxEmp);
        maxMin.push(minEmp);
      }
  
      if (files[2]) { // Income
        var selected_countries1 = [];
        dataset1 = files[2];
    
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.Country === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          income = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year) && (selected_countries1[i][j].ISCED11 === '0-2')) {
              income = income + (selected_countries1[i][j].MoneyF + selected_countries1[i][j].MoneyM);
              if(maxInc < (selected_countries1[i][j].MoneyF + selected_countries1[i][j].MoneyM)) { maxInc = (selected_countries1[i][j].MoneyF + selected_countries1[i][j].MoneyM); }
              if(minInc > (selected_countries1[i][j].MoneyF + selected_countries1[i][j].MoneyM)) { minInc = (selected_countries1[i][j].MoneyF + selected_countries1[i][j].MoneyM); }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries1[i][0].Country;
          dic['Variable'] = "Income";
          dic['Income'] = income/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minInc > 0) { minInc = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxInc);
        maxMin.push(minInc);
      }
  
      if (files[3]) { // Education
        var selected_countries1 = [];
        dataset1 = files[3];
    
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.Country === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          education = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year) && (selected_countries1[i][j].ISCED11 === '0-2')) {
              education = education + parseFloat(selected_countries1[i][j].AveragePercentage.replace(",", "."));
              if(maxEdu < parseFloat(selected_countries1[i][j].AveragePercentage.replace(",", "."))) { maxEdu = parseFloat(selected_countries1[i][j].AveragePercentage.replace(",", ".")); }
              if(minEdu > parseFloat(selected_countries1[i][j].AveragePercentage.replace(",", "."))) { minEdu = parseFloat(selected_countries1[i][j].AveragePercentage.replace(",", ".")); }
            }
          }
  
          dic = {}
          dic['Country'] = selected_countries1[i][0].Country;
          dic['Variable'] = "Education";
          dic['Education'] = education/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minEdu > 0) { minEdu = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxEdu);
        maxMin.push(minEdu);
      }
  
      if (files[4]) { // Women in High Positions
        var selected_countries1 = [];
        dataset1 = files[4];
    
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.Country === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          women = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year)) {
              women = women + selected_countries1[i][j].growthRateWHP;
              if(maxWomen < selected_countries1[i][j].growthRateWHP) { maxWomen = selected_countries1[i][j].growthRateWHP; }
              if(minWomen > selected_countries1[i][j].growthRateWHP) { minWomen = selected_countries1[i][j].growthRateWHP; }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries1[i][0].Country;
          dic['Variable'] = "Women";
          dic['Women'] = women/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minWomen > 0) { minWomen = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxWomen);
        maxMin.push(minWomen);
      }
  
      if (files[5]) { // Poverty
        var selected_countries1 = [];
        dataset1 = files[5];
    
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.code === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.code === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.code === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.code === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          poverty = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year) && (selected_countries1[i][j].ISCED11 === '0-2')) {
              poverty = poverty + selected_countries1[i][j].AVG;
              if(maxPov < selected_countries1[i][j].AVG) { maxPov = selected_countries1[i][j].AVG; }
              if(minPov > selected_countries1[i][j].AVG) { minPov = selected_countries1[i][j].AVG; }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries1[i][0].code;
          dic['Variable'] = "Poverty";
          dic['Poverty'] = poverty/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minPov > 0) { minPov = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxPov);
        maxMin.push(minPov);
      }
  
      if (files[6]) { // GWG
        var selected_countries1 = [];
        dataset1 = files[6];
    
        // Default: countries
        selected_countries1.push(dataset1.filter(row => row.Country === 'BG'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'BE'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'CZ'))
        selected_countries1.push(dataset1.filter(row => row.Country === 'PT'))
  
        // Default: years
        var years = [];
        years.push('2010');
        years.push('2011');
        years.push('2012');
        let yearsv2 = years.map(i=>Number(i));
        var aux1 = [];
    
        for(let i = 0; i < selected_countries1.length; i++) {
          gwg = 0;
    
          for(let j = 0; j < selected_countries1[i].length; j++){
            if(yearsv2.includes(selected_countries1[i][j].Year) && (selected_countries1[i][j].ISCED11 === '0-2')) {
              gwg = gwg + parseFloat(selected_countries1[i][j].GenderWageGap.replace(",", "."));
              if(maxGWG < parseFloat(selected_countries1[i][j].GenderWageGap.replace(",", "."))) { maxGWG = parseFloat(selected_countries1[i][j].GenderWageGap.replace(",", ".")); }
              if(minGWG > parseFloat(selected_countries1[i][j].GenderWageGap.replace(",", "."))) { minGWG = parseFloat(selected_countries1[i][j].GenderWageGap.replace(",", ".")); }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries1[i][0].Country;
          dic['Variable'] = "GWG";
          dic['GWG'] = gwg/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minGWG > 0) { minGWG = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxGWG);
        maxMin.push(minGWG);
      }  
      slope_chart(countries_filtered_years, maxMin);
    }
    else {
      var countries_filtered_years = [];  
      var maxMin = [];
  
      d3.select("#slope-svg").remove();

      if (files[0]){ // GDP
        dataset1 = files[0];

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));
      
        var aux = [];
  
        // Max and min values, to built the scale
        for(let i = 0; i < selected_countries.length; i++) {
          gdp = 0;
  
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              gdp = gdp + selected_countries[i][j].GDP;
              if(maxGDP < selected_countries[i][j].GDP) { maxGDP = selected_countries[i][j].GDP; }
              if(minGDP > selected_countries[i][j].GDP) { minGDP = selected_countries[i][j].GDP; }
            }
          }
  
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "GDP";
          dic['GDP'] = gdp/yearsv2.length; // average computation
          aux.push(dic);
  
          if(minGDP > 0) { minGDP = 0; }
  
        }
        countries_filtered_years.push(aux);
  
        maxMin.push(maxGDP);
        maxMin.push(minGDP);
      }
  
      if (files[1]) { // Employment
        dataset1 = files[1];

        var selected_countries = [];

        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));  
  
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          employment = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year) && (selected_countries[i][j].ISCED11 === isced)) {
              employment = employment + parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."));
              if(maxEmp < parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."))) { maxEmp = parseFloat(selected_countries[i][j].AverageEmployment.replace(",", ".")); }
              if(minEmp > parseFloat(selected_countries[i][j].AverageEmployment.replace(",", "."))) { minEmp = parseFloat(selected_countries[i][j].AverageEmployment.replace(",", ".")); }
            }
          }
  
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "Employment";
          dic['Employment'] = employment/(yearsv2.length); // average computation
          aux1.push(dic);
  
          if(minEmp > 0) { minEmp = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxEmp);
        maxMin.push(minEmp);

      }
  
      if (files[2]) { // Income
        dataset1 = files[2];

        var selected_countries = [];
        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));
    
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          income = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year) && (selected_countries[i][j].ISCED11 === isced)) {
              income = income + (selected_countries[i][j].MoneyF + selected_countries[i][j].MoneyM);
              if(maxInc < (selected_countries[i][j].MoneyF + selected_countries[i][j].MoneyM)) { maxInc = (selected_countries[i][j].MoneyF + selected_countries[i][j].MoneyM); }
              if(minInc > (selected_countries[i][j].MoneyF + selected_countries[i][j].MoneyM)) { minInc = (selected_countries[i][j].MoneyF + selected_countries[i][j].MoneyM); }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "Income";
          dic['Income'] = income/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minInc > 0) { minInc = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxInc);
        maxMin.push(minInc);

      }
  
      if (files[3]) { // Education
        dataset1 = files[3];

        var selected_countries = [];

        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));  
    
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          education = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year) && (selected_countries[i][j].ISCED11 === isced)) {
              education = education + parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."));
              if(maxEdu < parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."))) { maxEdu = parseFloat(selected_countries[i][j].AveragePercentage.replace(",", ".")); }
              if(minEdu > parseFloat(selected_countries[i][j].AveragePercentage.replace(",", "."))) { minEdu = parseFloat(selected_countries[i][j].AveragePercentage.replace(",", ".")); }
            }
          }
  
  
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "Education";
          dic['Education'] = education/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minEdu > 0) { minEdu = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxEdu);
        maxMin.push(minEdu);

      }
  
      if (files[4]) { // Women in High Positions
        dataset1 = files[4];

        var selected_countries = [];

        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));  
    
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          women = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year)) {
              women = women + selected_countries[i][j].growthRateWHP;
              if(maxWomen < selected_countries[i][j].growthRateWHP) { maxWomen = selected_countries[i][j].growthRateWHP; }
              if(minWomen > selected_countries[i][j].growthRateWHP) { minWomen = selected_countries[i][j].growthRateWHP; }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "Women";
          dic['Women'] = women/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minWomen > 0) { minWomen = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxWomen);
        maxMin.push(minWomen);

      }
  
      if (files[5]) { // Poverty
        dataset1 = files[5];
        var selected_countries = [];

        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.code === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));  
    
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          poverty = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year) && (selected_countries[i][j].ISCED11 === isced)) {
              poverty = poverty + selected_countries[i][j].AVG;

              if(maxPov < selected_countries[i][j].AVG) { maxPov = selected_countries[i][j].AVG; }
              if(minPov > selected_countries[i][j].AVG) { minPov = selected_countries[i][j].AVG; }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries[i][0].code;
          dic['Variable'] = "Poverty";
          dic['Poverty'] = poverty/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minPov > 0) { minPov = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxPov);
        maxMin.push(minPov);

      }
  
      if (files[6]) { // GWG
        dataset1 = files[6];

        var selected_countries = [];

        $('#checkboxes input:checked').each(function() {
          selected_countries.push(dataset1.filter(row => row.Country === $(this).attr('value'))
        )});
              
        var years = [];
        $('#checkboxes1 input:checked').each(function() {years.push($(this).attr('value'))});
        let yearsv2 = years.map(i=>Number(i));  
    
        var aux1 = [];
    
        for(let i = 0; i < selected_countries.length; i++) {
          gwg = 0;
    
          for(let j = 0; j < selected_countries[i].length; j++){
            if(yearsv2.includes(selected_countries[i][j].Year) && (selected_countries[i][j].ISCED11 === isced)) {
              gwg = gwg + parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."));

              if(maxGWG < parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."))) { maxGWG = parseFloat(selected_countries[i][j].GenderWageGap.replace(",", ".")); }
              if(minGWG > parseFloat(selected_countries[i][j].GenderWageGap.replace(",", "."))) { minGWG = parseFloat(selected_countries[i][j].GenderWageGap.replace(",", ".")); }
            }
          }
    
          dic = {}
          dic['Country'] = selected_countries[i][0].Country;
          dic['Variable'] = "GWG";
          dic['GWG'] = gwg/yearsv2.length; // average computation
          aux1.push(dic);
  
          if(minGWG > 0) { minGWG = 0; }
        }
        countries_filtered_years.push(aux1);
        maxMin.push(maxGWG);
        maxMin.push(minGWG);
      }
    slope_chart(countries_filtered_years, maxMin);
    }
    
  }).catch(function(err) {
    // handle error here
  })
}

/* ------------------------------------- SLOPE CHART --------------------------------------- */

function slope_chart(paises, maxMin) {

  // ---------------------------------------------------------------  
  // SCALES --------------------------------------------------------
  // ---------------------------------------------------------------  

  var xscale = d3
    .scalePoint()
    .domain(['GDP', 'Employment', 'Income', 'Education', 'Women', 'Poverty', 'GWG'])
    .range([padding, padding + 480]);

  var xscaleGDP = d3
    .scalePoint()
    .domain(['GDP'])
    .range([padding, padding]);

  var GDPscale = d3
    .scaleLinear()
    .domain([maxMin[1], maxMin[0]])
    .range([height - padding, padding]);

  var xscaleEmployment = d3
    .scalePoint()
    .domain(['Employment'])
    .range([padding + 80, padding + 80]);

  var employmentScale = d3
    .scaleLinear()
    .domain([maxMin[3], maxMin[2]])
    .range([height - padding, padding]);

  var xscaleIncome = d3
    .scalePoint()
    .domain(['Income'])
    .range([padding + 160, padding + 160]);

  var incomeScale = d3
    .scaleLinear()
    .domain([maxMin[5], maxMin[4]])
    .range([height - padding, padding]);

  var xscaleEducation = d3
    .scalePoint()
    .domain(['Education'])
    .range([padding + 240, padding + 240]);

  var educationScale = d3
    .scaleLinear()
    .domain([maxMin[7], maxMin[6]])
    .range([height - padding, padding]);
  
  var xscaleWomen = d3
    .scalePoint()
    .domain(['Women'])
    .range([padding + 320, padding + 320]);

  var womenScale = d3
    .scaleLinear()
    .domain([maxMin[9], maxMin[8]])
    .range([height - padding, padding]);
  
  var xscalePoverty = d3
    .scalePoint()
    .domain(['Poverty'])
    .range([padding + 400, padding + 400]);

  var povertyScale = d3
    .scaleLinear()
    .domain([maxMin[11], maxMin[10]])
    .range([height - padding, padding]);

  var xscaleGWG = d3
    .scalePoint()
    .domain(['GWG'])
    .range([padding + 480, padding + 480]);

  var GWGScale = d3
    .scaleLinear()
    .domain([maxMin[13], maxMin[12]])
    .range([height - padding, padding]);
  

  // Define image SVG; everything of SVG will be append on the div of slope_chart
  var svg = d3
    .select("#slope_chart")
    .append("svg") // appends an svg to the div 'slope_chart'
    .attr("id", "slope-svg")
    .attr("width", width)
    .attr("height", height);

  // Scatterplor cannot have 2 lists of obj. It has to get data all from the same array of obj. otherwise *Puffff*
  // to be used on SVG - PLOTS
  var new_paises = []; 
  for(let i = 0; i < paises.length; i++) {
    for(let j = 0; j < paises[i].length; j++){
      new_paises.push(paises[i][j]);
    }
  }

  
  // ---------------------------------------------------------------  
  // LINES ---------------------------------------------------------
  // --------------------------------------------------------------- 

  var lineGenerator = d3
  .line()
  .x(function (d) {
    if(d.Variable === 'GDP'){
      return xscale(d.Variable);}
    if(d.Variable === 'Employment'){
      return xscale(d.Variable);}
    if(d.Variable === 'Income'){
      return xscale(d.Variable);}
    if(d.Variable === 'Education'){
      return xscale(d.Variable);}
    if(d.Variable === 'Women'){
      return xscale(d.Variable);}
    if(d.Variable === 'Poverty'){
      return xscale(d.Variable);}
    if(d.Variable === 'GWG'){
      return xscale(d.Variable);}
    })
  .y(function (d) { 
    if(d.Variable === 'GDP')
      return GDPscale(d.GDP);
    if(d.Variable === 'Employment')
      return employmentScale(d.Employment);
    if(d.Variable === 'Income')
      return incomeScale(d.Income);
    if(d.Variable === 'Education')
      return educationScale(d.Education);
    if(d.Variable === 'Women')
      return womenScale(d.Women);
    if(d.Variable === 'Poverty')
      return povertyScale(d.Poverty);
    if(d.Variable === 'GWG')
      return GWGScale(d.GWG);
    })

  var p = []
  for (j = 0; j< paises[0].length; ++j){
  aux = []
    aux.push(paises[0][j])
    aux.push(paises[1][j])
    aux.push(paises[2][j])
    aux.push(paises[3][j])
    aux.push(paises[4][j])
    aux.push(paises[5][j])
    aux.push(paises[6][j])
  p.push(aux)
  }

  for (let i = 0; i< p.length; ++i){
  svg
  .append("path")
  .datum(p)
  .attr("fill", "none")
  .attr("stroke", "#878787")
  .attr("stroke-width", 3)
  .attr("id", function(d){ return p[i][0].Country +'-LinesSlope'; })
  .attr("selected", false)
  .attr("class", "lineSlope")
  .attr("d", lineGenerator(p[i]));
  } 

  // SVG - Plots + Lines ______________________________________________________________________
  if(paises.length > 0) {
    for (i = 0; i < paises.length; i++) {
      // ---------------------------------------------------------------  
      // PLOTS ---------------------------------------------------------
      // ---------------------------------------------------------------  

      var plots = svg
      .selectAll("circle")
      .data(new_paises)
      .join("circle") // now we append circles
      .attr("r", radius) // each circle
      .attr("fill", "#5b98c7")
      .attr("stroke", "white")
      .attr("id", function(d) { return d.Variable; })
      .attr("is_clicked", false)
      .attr("name", function(d){ return d.Country; })
      .attr("class", "plot")
      .attr("value", function(d){ 
        if (d.Variable === "GDP") {
          return d.GDP; 
        }
        if (d.Variable === "Employment") {
          return d.Employment;
          }
        if (d.Variable === "Income") {
          return d.Income;
          }
        if (d.Variable === "Education") {
          return d.Education;
          }
        if (d.Variable === "Women") {
          return d.Women;
          }
        if (d.Variable === "Poverty") {
          return d.Poverty;
          }
        if (d.Variable === "GWG") {
          return d.GWG;
          }
        })
      .attr("cx", function (d) { 
        if (d.Variable === "GDP")
          return xscaleGDP(d.Variable); 
        else if (d.Variable === "Employment")
          return xscaleEmployment(d.Variable);
        else if (d.Variable === "Income")
          return xscaleIncome(d.Variable);
        else if (d.Variable === "Education")
          return xscaleEducation(d.Variable);
        else if (d.Variable === "Women")
          return xscaleWomen(d.Variable);
        else if (d.Variable === "Poverty")
          return xscalePoverty(d.Variable);
        else if (d.Variable === "GWG")
          return xscaleGWG(d.Variable);
        })
      .attr("cy", function (d) { 
        if (d.Variable === "GDP")
          return GDPscale(d.GDP); 
        if (d.Variable === "Employment")
          return employmentScale(d.Employment);
        if (d.Variable === "Income")
          return incomeScale(d.Income);
        if (d.Variable === "Education")
          return educationScale(d.Education);
        if (d.Variable === "Women")
          return womenScale(d.Women);
        if (d.Variable === "Poverty")
          return povertyScale(d.Poverty);
        if (d.Variable === "GWG")
          return GWGScale(d.GWG);
        })
      .on("click", function (){
        this.parentNode.appendChild(this);

        // Change line colors on click
        var b = document.getElementById("slope-svg").getElementsByClassName("lineSlope")
        for (let i = 0; i < b.length; ++i){
          if(this.attributes.name.value != b[i].attributes.id.value.replace('-LinesSlope', '')){
            b[i].attributes.selected.value = false;
            b[i].attributes.stroke.value = "#878787"
          } else {
            b[i].attributes.selected.value = true;
            b[i].attributes.stroke.value = "#E0C090"
          }
        }

        // Change circle colors on click
        for (let i = 0; i < plots._groups[0].length; i++){
          if (plots._groups[0][i].attributes.id.value != this.attributes.id.value || plots._groups[0][i].attributes.name.value != this.attributes.name.value){
            //if (plots._groups[0][i].attributes.is_clicked.value === 'true') {
              console.log('aaaaaaaaaaaaaa') //TODO não entra aqui dentro
              plots._groups[0][i].attributes.is_clicked.value = 'false';
              d3.select(plots._groups[0][i])
                .attr("fill", "#5b98c7")
                .attr("r", radius);
              div.transition()		
                .duration(500)		
                .style("opacity", 0);	
              tooltipLine.classed("hidden", true);
            //}
          } else {
            console.log('here2', plots._groups[0][i].attributes, this)

            this.attributes.is_clicked.value = "true";
            d3.select(this)
              .attr("fill", "#dea959") // turns the circle into orange
              .attr("r", radius*1.5);   // doubles the size of the circle
            localStorage.setItem("clickedItemCountry", this.attributes.name.value)

            console.log(this)
            
            const event = new Event('clickedCountrySlope');
            document.dispatchEvent(event);
          }
        }
      })

      // Change circle colors when hovering
      .on("mouseover", function() {
        this.parentNode.appendChild(this);
        d3.select(this)
          .attr("fill", "#E0C090") // turns the circle into orange
          .attr("r", radius*1.5);   // doubles the size of the circle
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
        this.parentNode.appendChild(this);

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
        



  // ---------------------------------------------------------------  
  // AXIS ----------------------------------------------------------
  // ---------------------------------------------------------------  

  // Creating axis -------------------------------------------------
  var yGDP = d3
    .axisLeft() // we are creating a d3 axis
    .scale(GDPscale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  var yEmployment = d3
    .axisLeft() // we are creating a d3 axis
    .scale(employmentScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  var yIncome = d3
    .axisLeft() // we are creating a d3 axis
    .scale(incomeScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);
    
  var yEducation = d3
    .axisLeft() // we are creating a d3 axis
    .scale(educationScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  var yWomen = d3
    .axisLeft() // we are creating a d3 axis
    .scale(womenScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  var yPoverty = d3
    .axisLeft() // we are creating a d3 axis
    .scale(povertyScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  var yGWG = d3
    .axisLeft() // we are creating a d3 axis
    .scale(GWGScale) // fit to our scale
    .tickFormat(d3.format(".2s")) // format of each year
    .tickSizeOuter(0);

  // Appending axis --------------------------------------------------------
  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + padding + ",0)")
    .attr("class", "yGDP") // we are giving it a css style
    .call(yGDP)

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 80) + ",0)")
    .attr("class", "yEmployment") // we are giving it a css style
    .call(yEmployment)
  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 160) + ",0)")
    .attr("class", "yIncome") // we are giving it a css style
    .call(yIncome)

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 240) + ",0)")
    .attr("class", "yEducation") // we are giving it a css style
    .call(yEducation)

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 320) + ",0)")
    .attr("class", "yWomen") // we are giving it a css style
    .call(yWomen)

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 400) + ",0)")
    .attr("class", "yPoverty") // we are giving it a css style
    .call(yPoverty)

  svg
    .append("g") // we are creating a 'g' element to match our yaxis
    .attr("transform", "translate(" + (padding + 480) + ",0)")
    .attr("class", "yGWG") // we are giving it a css style
    .call(yGWG);

  var xaxisGDP = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleGDP) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisGDP);

  var xaxisEmployment = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleEmployment) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisEmployment);

  var xaxisIncome = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleIncome) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisIncome);
    
  var xaxisEducation = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleEducation) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisEducation);
  
  var xaxisWomen = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleWomen) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisWomen);

  var xaxisPoverty = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscalePoverty) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisPoverty);

  var xaxisGWG = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscaleGWG) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxisGWG);

  // text label for the x axis
  //svg
  //  .append("text")
  //  .attr("transform", "translate(5," + (height - padding / 3) + ")")
  //  .attr("class", "label")
  //  .text("Year");
}


/* interaction */
function changeSlope(Country){
  resetSlope()
  var a = document.getElementById(Country+'-LinesSlope')
  a.attributes.stroke.value = "#dea959"
  a.attributes.selected.value = "true"
}

function resetSlope(){
  var a = document.getElementById("slope-svg").getElementsByClassName("plot");
  for (let i = 0; i < a.length; ++i){
    a[i].attributes.is_clicked.value = false;
    a[i].attributes.stroke.value = "white";
    a[i].attributes.fill.value = "#5b98c7";
    a[i].attributes.r.value = radius;
  }

  var b = document.getElementsByClassName("lineSlope");
  for (let i = 0; i < b.length; ++i){
    b[i].attributes.selected.value = false;
    b[i].attributes.stroke.value = "#878787"
  }
}