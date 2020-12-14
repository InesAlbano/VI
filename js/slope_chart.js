var dataset;
var width = 600;
var height = 400;
var padding = 60;
var radius = 5;

var tooltipLine = d3.select("div.tooltipLine");

analyzer("Init")

document.getElementById("button-forms").addEventListener("click", function(){
  updateLine();
}); 

document.addEventListener('clickedCountry' , function(){
  changeLine(localStorage.getItem("clickedItemCountry"));
}); 

var years1 = localStorage.getItem("years");

var div = d3.select("body").append("div")	
    .attr("class", "tooltipLine")				
    .style("opacity", 0);

function updateLine(){
  var v = localStorage.getItem("variable");
  var e = localStorage.getItem("education");
  analyzer(v, e);
}

var maxGDP = 0, minGDP = 0, 
    maxEmp = 0, minEmp = 0, 
    maxInc = 0, minInc = 0, 
    maxEdu = 0, minEdu = 0,
    maxWomen = 0, minWomen = 0, 
    maxPov = 0, minPov = 0, 
    maxGWG = 0, minGWG = 0;

function analyzer(inequality, education) {
  var countries_filtered_years = [];  
  var maxMin = [];

  // GDP
  d3.json("csv/LineChart/gdp.json").then(function (data) {
    var selected_countries = [];
    dataset = data;

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

    // Max and min values, to built the scale
    for(let i = 0; i < selected_countries.length; i++) {
      gdp = 0;
      var aux = [];

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

      countries_filtered_years.push(aux);
    }

    maxMin.push(maxGDP);
    maxMin.push(minGDP);

    // EMPLOYMENT
    d3.json("csv/LineChart/Q2_total.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;

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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        employment = 0;
  
        var aux1 = [];
        for(let j = 0; j < selected_countries1[i].length; j++){
          if(yearsv2.includes(selected_countries1[i][j].Year)) {
            employment = employment + parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."));
            if(maxEmp < parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."))) { maxEmp = parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", ".")); }
            if(minEmp > parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", "."))) { minEmp = parseFloat(selected_countries1[i][j].AverageEmployment.replace(",", ".")); }
          }
        }

        dic = {}
        dic['Country'] = selected_countries1[i][0].Country;
        dic['Variable'] = "Employment";
        dic['Employment'] = employment/yearsv2.length; // average computation
        aux1.push(dic);

        if(minEmp > 0) { minEmp = 0; }
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxEmp);
      maxMin.push(minEmp);

    });

    // INCOME
    d3.json("csv/LineChart/Q4.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;
  
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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        income = 0;
  
        var aux1 = [];
        for(let j = 0; j < selected_countries1[i].length; j++){
          if(yearsv2.includes(selected_countries1[i][j].Year)) {
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
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxInc);
      maxMin.push(minInc);
    });

    // EDUCATION
    d3.json("csv/LineChart/Q3_total.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;
  
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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        education = 0;
  
        var aux1 = [];
        for(let j = 0; j < selected_countries1[i].length; j++){
          if(yearsv2.includes(selected_countries1[i][j].Year)) {
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
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxEdu);
      maxMin.push(minEdu);
    });

    // WOMEN IN HIGH POSITIONS
    d3.json("csv/LineChart/Q6.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;
  
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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        women = 0;
  
        var aux1 = [];
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
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxWomen);
      maxMin.push(minWomen);

    });

    // POVERTY
    d3.json("csv/LineChart/Q1.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;
  
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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        poverty = 0;
  
        var aux1 = [];
        for(let j = 0; j < selected_countries1[i].length; j++){
          if(yearsv2.includes(selected_countries1[i][j].Year)) {
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
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxPov);
      maxMin.push(minPov);

    });

    // GENDER WAGE GAP
    d3.json("csv/LineChart/Q4_b.json").then(function (data1) {
      var selected_countries1 = [];
      dataset1 = data1;
  
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
  
      for(let i = 0; i < selected_countries1.length; i++) {
        gwg = 0;
  
        var aux1 = [];
        for(let j = 0; j < selected_countries1[i].length; j++){
          if(yearsv2.includes(selected_countries1[i][j].Year)) {
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
        countries_filtered_years.push(aux1);
      }
      maxMin.push(maxGWG);
      maxMin.push(minGWG);

    });
    console.log(countries_filtered_years)
    slope_chart(countries_filtered_years, maxMin);
  });
}

/* ------------------------------------- SLOPE CHART --------------------------------------- */

function slope_chart(paises, maxMin) {

  var xscaleData = paises[0].map(function (a) {return a.Variable});

  // ---------------------------------------------------------------  
  // SCALES --------------------------------------------------------
  // ---------------------------------------------------------------  

  var xscale = d3
    .scalePoint()
    .domain(xscaleData)
    .range([padding, padding]);

  var GDPscale = d3
    .scaleLinear()
    .domain([maxMin[1], maxMin[0]])
    .range([height - padding, padding]);

  var employmentScale = d3
    .scaleLinear()
    .domain([maxMin[3], maxMin[2]])
    .range([height - padding, padding]);

  var incomeScale = d3
    .scaleLinear()
    .domain([maxMin[5], maxMin[4]])
    .range([height - padding, padding]);

  var educationScale = d3
    .scaleLinear()
    .domain([maxMin[7], maxMin[6]])
    .range([height - padding, padding]);

  var womenScale = d3
    .scaleLinear()
    .domain([maxMin[9], maxMin[8]])
    .range([height - padding, padding]);

  var povertyScale = d3
    .scaleLinear()
    .domain([maxMin[11], maxMin[10]])
    .range([height - padding, padding]);

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
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("id", function(d) { return d.Variable; })
        .attr("is_clicked", false)
        .attr("name", function(d){ return d.Country; })
        .attr("class", "plot")
        .attr("value", function(d){ return d.GDP; })
          /*if (v === "Employment")
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
        */
        .attr("cx", function (d) { return xscale(d.Variable); })
        .attr("cy", function (d) { return GDPscale(d.GDP); })
          /*if (v === "Employment")
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
        */
        .on("click", function (){
          this.parentNode.appendChild(this);

          // Change line colors on click
          var b = document.getElementById("slope-svg").getElementsByClassName("line")
          for (let i = 0; i < b.length; ++i){
            if(this.attributes.name.value != b[i].attributes.id.value.replace('-Lines', '')){
              b[i].attributes.selected.value = false;
              b[i].attributes.stroke.value = "red"
            } else {
              b[i].attributes.selected.value = true;
              b[i].attributes.stroke.value = "yellow"
            }
          }

          // Change circle colors on click
          for (let i = 0; i < plots._groups[0].length; i++){
            if (plots._groups[0][i].attributes.id.value != this.attributes.id.value || plots._groups[0][i].attributes.name.value != this.attributes.name.value){
              if (plots._groups[0][i].attributes.is_clicked.value === 'true') {
                plots._groups[0][i].attributes.is_clicked.value = 'false';
                d3.select(plots._groups[0][i])
                  .attr("fill", "red")
                  .attr("r", radius);
                div.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
                tooltipLine.classed("hidden", true);
              }
            } else {
              this.attributes.is_clicked.value = "true";
              d3.select(this)
                .attr("fill", "orange") // turns the circle into orange
                .attr("r", radius*2);   // doubles the size of the circle
              localStorage.setItem("clickedItemCountry", this.attributes.name.value)

              const event = new Event('clickedCountryLine');
              document.dispatchEvent(event);
            }
          }
        })

        // Change circle colors when hovering
        .on("mouseover", function() {
          this.parentNode.appendChild(this);
          d3.select(this)
            .attr("fill", "orange") // turns the circle into orange
            .attr("r", radius*2);   // doubles the size of the circle
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
            .attr("fill", "red")
            .attr("r", radius);

            div.transition()		
              .duration(500)		
              .style("opacity", 0);	
            tooltipLine.classed("hidden", true);
          }
          
        });
      
  // ---------------------------------------------------------------  
  // LINES ---------------------------------------------------------
  // ---------------------------------------------------------------  

      svg
        .append("path")
        .datum(paises[i])
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 4)
        .attr("id", function(d){ return d[0].Country +'-Lines'; })
        .attr("selected", false)
        .attr("class", "line")
        .attr("d",
          d3.line()
            .x(function (d) { return xscale(d.Variable); })
            .y(function (d) { return GDPscale(d.GDP); })

              /*else if (v === "Employment"){
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
            */
        );  
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


  var xaxis = d3
    .axisBottom() // we are creating a d3 axis
    .scale(xscale) // we are adding our padding
    .tickSizeOuter(0);

  svg
    .append("g") // we are creating a 'g' element to match our x axis
    .attr("transform", "translate(0," + (height - padding) + ")")
    .attr("class", "xaxis") // we are giving it a css style
    .call(xaxis);

  // text label for the x axis
  //svg
  //  .append("text")
  //  .attr("transform", "translate(5," + (height - padding / 3) + ")")
  //  .attr("class", "label")
  //  .text("Year");
}