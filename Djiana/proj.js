var dataset;

var width = 600;
var height = 400;
var padding = 60;
var radius = 5;


//FUNCAO QUE ESCOLHE DATASET -> PASSADO PELO HTML_____________________________________________
function analyzer(inequality) {
	switch (inequality)
	{
	case "Gdp":
    d3.select("svg").remove();
		d3.json("gdp.json").then(function (data) { //parse data
      dataset = data;
      // DATASET GDP TRATADINHO HIHIHIHI____________________
      let at = dataset.filter(row => row.Country === 'AT');
      let be = dataset.filter(row => row.Country === 'BE');
      let bg = dataset.filter(row => row.Country === 'BG');
      let cy = dataset.filter(row => row.Country === 'CY');
      let cz = dataset.filter(row => row.Country === 'CZ');
      let de = dataset.filter(row => row.Country === 'DE');
      let dk = dataset.filter(row => row.Country === 'DK');
      let ee = dataset.filter(row => row.Country === 'EE');
      let el = dataset.filter(row => row.Country === 'EL');
      let es = dataset.filter(row => row.Country === 'ES');
      let fi = dataset.filter(row => row.Country === 'FI');
      let fr = dataset.filter(row => row.Country === 'FR');
      let hr = dataset.filter(row => row.Country === 'HR');
      let hu = dataset.filter(row => row.Country === 'HU');
      let ie = dataset.filter(row => row.Country === 'IE');
      let it = dataset.filter(row => row.Country === 'IT');
      let lt = dataset.filter(row => row.Country === 'LT');
      let lu = dataset.filter(row => row.Country === 'LU');
      let lv = dataset.filter(row => row.Country === 'LV');
      let mt = dataset.filter(row => row.Country === 'MT');
      let nl = dataset.filter(row => row.Country === 'NL');
      let pl = dataset.filter(row => row.Country === 'PL');
      let pt = dataset.filter(row => row.Country === 'PT');
      let ro = dataset.filter(row => row.Country === 'RO');
      let se = dataset.filter(row => row.Country === 'SE');
      let si = dataset.filter(row => row.Country === 'SI');
      let sk = dataset.filter(row => row.Country === 'SK');
      let uk = dataset.filter(row => row.Country === 'UK');

      // countries initials
      var paises = [at,be,bg,cy,cz,de,dk,ee,el,es,fi,fr,hr,hu,ie,it,lt,lu,lv,mt,nl,pl,pt,ro,se,si,sk,uk];

      //______________________________________________________
      line_chart(paises);
      //mapa_chart();
    });
		break
	case "Poverty":
    d3.select("svg").remove();
		d3.json("poverty.json").then(function (data) { //parse data
      dataset = data;
      line_chart();
      //mapa_chart();
    });       
    break
  case "Employment":
    d3.select("svg").remove();
    d3.json("employment.json").then(function (data) { //parse data
      dataset = data;
      line_chart();
      //mapa_chart();
    });       
    break
	default:
    d3.select("svg").remove();
    inequality="Gdp";
		d3.json("gdp.json").then(function (data) { //parse data
      dataset = data;
      line_chart();
      //mapa_chart();
      d3.select("svg").remove();
    });
	}
}
//_____________________________________________________________________

//DISPLAY GDP
function line_chart(paises) {
    
  var xscaleData = dataset.map((a) => a.Year);
  //xscaleData.reverse();
  //console.log(countries);

  var xscale = d3
    .scalePoint()
    .domain(xscaleData)
    .range([padding, width - padding]);

  var hscale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d.GDP;
      }),
    ])
    .range([height - padding, padding]);

  var svg = d3
    .select("#line_chart")
    .append("svg") // we are appending an svg to the div 'line_chart'
    .attr("width", width)
    .attr("height", height);

/*   svg
    .append("path")
    .datum(dataset)
    .attr("fill", "none")
    .attr("stroke", "purple")
    .attr("stroke-width", 1)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return xscale(d.oscar_year);
        })
        .y(function (d) {
          return hscale(d.budget);
        })
    ); */


    
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
            return hscale(d.GDP);
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
