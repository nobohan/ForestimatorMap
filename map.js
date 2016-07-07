// Openlayers - test D3 - Julien Minet - julien_wa@yahoo.fr - Juillet 2016
 
// Global variables
var map;
var dataset = [];
var data;
var histdata;

// OpenLayers - general options
var proj = new OpenLayers.Projection("EPSG:3857");
var WGS84proj = new OpenLayers.Projection("EPSG:4326");
var BEproj = new OpenLayers.Projection("EPSG:31370");     
var boundsEu = new OpenLayers.Bounds(0, 45, 20, 50).transform(WGS84proj,proj); 
 
var options = {
    controls: [],
    projection: proj,
    units: "m"
};

// start of the init function
function init() {
	 // OpenLayers
    map = new OpenLayers.Map('map', options);
 	    
    var osm = new OpenLayers.Layer.OSM("OpenStreetMap");

    map.addLayers([osm]);

    var layer = new OpenLayers.Layer.Vector("ForEstimator", {protocol: new OpenLayers.Protocol.HTTP({url: "./data/forestimator_habay_3857.gml", format: new OpenLayers.Format.GML()}), 
         strategies: [new OpenLayers.Strategy.Fixed()], projection: proj, extractAttributes: true, displayInLayerSwitcher:true, isBaseLayer:false});
    map.addLayers([layer]);
		
	
    // OpenLayers - Add controls
    map.addControl(new OpenLayers.Control.Navigation());
    map.addControl(new OpenLayers.Control.Zoom());
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    map.setCenter(new OpenLayers.LonLat(5.4,49.6).transform(WGS84proj,proj),10); 
     
    // D3 charts
    
	 // D3 - import csv dataset
	 d3.csv("data/forestimator_habay.csv", function(csvdata) {
	    dataset = csvdata.map(function(d) { return [ +d["hdom"], +d["cv_tot"] ]; })
	    histdataset = csvdata.map(function(d) { return +d["hdom"]; })
	    //data = [dataset[1], dataset[2]];
	    data = dataset; 
	   
       //console.log(data) 
	    
	    // D3 - Scatter plot
	    var margin = {top: 20, right: 15, bottom: 60, left: 60}
	      , width = 600 - margin.left - margin.right
	      , height = 500 - margin.top - margin.bottom;
	    
	    var x = d3.scaleLinear()
	              .domain([0, d3.max(data, function(d) { return d[0]; })])
	              .range([ 0, width ]);
	    
	    var y = d3.scaleLinear()
	    	      .domain([0, d3.max(data, function(d) { return d[1]; })])
	    	      .range([ height, 0 ]);
	 
	    var chart = d3.select('#d3chart')
		.append('svg:svg')
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'chart')
	
	    var main = chart.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
		.attr('width', width)
		.attr('height', height)
		.attr('class', 'main')   
		
		 var xAxis = d3.axisBottom()
		 .scale(x)
		 
		 main.append('g')
		 .attr('transform', 'translate(0,' + height + ')')
		 .attr('class', 'main axis date')
		 .call(xAxis);
	
		 var yAxis = d3.axisLeft()
		 .scale(y)
		 
		 main.append('g')
		 .attr('transform', 'translate(0,0)')
		 .attr('class', 'main axis date')
		 .call(yAxis);
	
	    var g = main.append("svg:g"); 
	    
	    g.selectAll("scatter-dots")
	      .data(data)
	      .enter().append("svg:circle")
	          .attr("cx", function (d,i) { return x(d[0]); } )
	          .attr("cy", function (d) { return y(d[1]); } )
	          .attr("r", 8);
	          
	          
	   // D3 - Histogram
      histdata = histdataset;	    
	    
		var formatCount = d3.format(",.0f");
		
		var margin = {top: 10, right: 30, bottom: 30, left: 30},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;
		
		var x = d3.scaleLinear()
		    .domain([0, 50])
		    .rangeRound([0, width]);
		
		var bins = d3.histogram()
		    .domain(x.domain())
		    .thresholds(x.ticks(20))
		    (histdata);
		
		var y = d3.scaleLinear()
		    .domain([0, d3.max(bins, function(d) { return d.length; })])
		    .range([height, 0]);	    

		var hist = d3.select("#d3hist").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		var bar = hist.selectAll(".bar")
		    .data(bins)
		  .enter().append("g")
		    .attr("class", "bar")
		    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
		
		bar.append("rect")
		    .attr("x", 1)
		    .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
		    .attr("height", function(d) { return height - y(d.length); });
		
		bar.append("text")
		    .attr("dy", ".75em")
		    .attr("y", 6)
		    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
		    .attr("text-anchor", "middle")
		    .text(function(d) { return formatCount(d.length); });
		
		hist.append("g")
		    .attr("class", "axis axis--x")
		    .attr("transform", "translate(0," + height + ")")
		    .call(d3.axisBottom(x));    
    
    
    
    
       
   
	 });  // end of d3.csv function
	 
}     // end of the init function
	

