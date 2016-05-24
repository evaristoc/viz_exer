// All the initial functionality
d3.chartandpie = {}
var barColor = 'steelblue';
function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

// register barchart
d3.chartandpie.barchart = function(){
  //for the api, keep initialization functions inside the functions
  var maxWidth = 900;
  var rightPadding = 20;
  var hGDim = {t: 60, r: 0, b: 30, l: 5};
  var iwidthb = 900;
  var iheightb = 560;
  var svgb, barGroup;

  var dispatch1b = d3.dispatch("bcmouseover");
  var dispatch2b = d3.dispatch("bcmouseout");

  function exportshG(_selb){
    _selb.each(function(_datab){
      var _idhG = this;
      var xAxis, yAxis, xScale, yScale, xAxisComponent, yAxisComponent;

      hGDim.w = iwidthb - hGDim.l - hGDim.r;
      hGDim.h = iheightb - hGDim.t - hGDim.b; //height hardcoded...

      // Create function for y-axis map.
      yScale = d3.scale.linear()
          .range([hGDim.h, 0])
          .domain([0, d3.max(_datab, function(d) { return d[1]; })]);

      xScale = d3.scale.ordinal()
          .rangeRoundBands([0, hGDim.w], 0.1)
          .domain(_datab.map(function(d) { return d[0]; }));


      xAxis = d3.svg.axis()
              .scale(xScale)
              .orient("bottom");

      if (!svgb){
        console.error("no svgb at ", _idhG, this)
        svgb = d3.select(_idhG).append("svg").classed("chart", true).attr("width",900).attr("height",900)
            	   .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        var container = svgb.append("g").classed("container-group", true);
        barGroup = container.append("g").classed("chart-group", true);
        container.append("g").classed("x axis", true).attr("transform", "translate(0," + hGDim.h + ")");
        //yAxis = container.append("g").classed("y axis", true);
      };

      var varW = hGDim.w/_datab.length;

      //var gapSize = xScale.rangeBand()/2;
      //if (!barGroup){
        //console.error("no bars")
        var bars = barGroup
    					.selectAll(".bar")
    					.data(_datab)
              .enter()
          //bars
    					.append("g")
    					.attr("class", "bar")
    		//VERY IMPORTANT!!! In the next lines I gave up some functionality to jQuery... my setup is not allowing d3 to finding the attributes of the SVG elements. Hard to debug....
    		//create the rectangles.
    		//var rects = bars
            //.select("rect")
    			  .append("rect")
      			// .attr("x", function(d) { return xScale(d[0]); })
      			// .attr("width", xScale.rangeBand())
      			// .attr("y", function(d) { return yScale(d[1]); })
      			// .attr("height", function(d) { return yScale(0) - yScale(d[1]); })
      			// .attr('fill',barColor)
            //       .on("mouseover",dispatch1b.bcmouseover)// mouseover is defined below.
            //       .on("mouseout",dispatch2b.bcmouseout);// mouseout is defined below.
      //}






      // bars
      //   .exit()
      //   .remove();
      // 	//jQuery for updating width and x of bars
  		// $("rect").attr("width", xScale.rangeBand())
  		// $("rect").map(function(i, r){
  		//   //console.log(i,r,fD[i][0]);
  		//   if (_data[i] != undefined) {
  		// 	return $(r).attr("x", xScale(_data[i][0]));
  		//   }
  		//   })

  		// //Create the frequency labels above the rectangles.
  		// bars
  		// 	.append("text")
  		// 	.text(function(d){return d3.format(",")(d[1])})
  		// 	//.text(function(d){return }) //<-----------------------------
  		// 	.attr("class", "barvalue")
  		// 	.attr("x", function(d) {return xScale(d[0])+xScale.rangeBand()/2; })
  		// 	.attr("y", function(d) { return yScale(d[1])-5; })
  		// 	.attr("text-anchor", "middle")
  		// 	.attr("font-size", "10")

  		// //jQuery for updating x position of text
  		// $(".barvalue").map(function(i, t){
  		//   //console.log(i,t, xScale(fD[i][0]));
  		//   return $(t).attr("x", xScale(_data[i][0]) + xScale.rangeBand()/2);
      // });



      //create the rectangles.
      function update(){
        console.log("here")
        var h = iheightb - hGDim.t - hGDim.b;
        var newyScale = d3.scale.linear()
    				.range([h, 0])
    				.domain([0, d3.max(_datab, function(d) { return d[1]; })]);

        //if($(".bar").length > 0){
        //  $(".bar").remove();
        //};

        bars
    		 			.selectAll(".bar")
        			.data(_datab)
              .transition()
              .attr("x", function(d) { return xScale(d[0]); })
        			.attr("width", xScale.rangeBand())
        			.attr("y", function(d) { return newyScale(d[1]); })
        			.attr("height", function(d) { return newyScale(0) - newyScale(d[1]); })



      }

      update();
      // hGDim.h = iheightb - hGDim.t - hGDim.b;
      // var newyScale = d3.scale.linear()
  		// 		.range([hGDim.h, 0])
  		// 		.domain([0, d3.max(_datab, function(d) { return d[1]; })]);
      //
      // bars
      //   .transition()
      //   //.delay(200)
      //   .attr("x", function(d) { return xScale(d[0]); })
  		// 	.attr("width", xScale.rangeBand())
  		// 	.attr("y", function(d) { return newyScale(d[1]); })
  		// 	.attr("height", function(d) { return newyScale(0) - newyScale(d[1]); })

    });
  };

  exportshG.widthb = function(_wb){
    if(!arguments.length){return iwidthb};
    hGDim.w = parseInt(_wb);
    return this;
  };

  exportshG.heightb = function(_hb){
    if(!arguments.length){return iheightb};
    iheightb = parseInt(_hb);
    return this;
  };

  d3.rebind(exportshG, dispatch1b, "on");
  d3.rebind(exportshG, dispatch2b, "on");
  return exportshG
}

//---SPECIFIC SETTINGS PIE---//

//
// d3.chartandpie.piechart = function(){
//   var pieDim = {w:wp, h:260};
//   var dispatch1p = d3.dispatch("pmouseover");
//   var dispacth2p = d3.dispatch("pmouseout");
//   var svgp;
//   var arc, piec;
//
//   var exportsP = function(_selp){
//     _selp.each(function(_datap){
//       var _idP = this;
//
//       // create svg for pie chart.
//       if(!svgp){
//         var piesvg = d3.select(_idP)
//         		  .append("svg")
//         		  .attr("width", pieDim.w)
//         		  .attr("height", pieDim.h)
//         		  .append("g")
//         		  .attr("transform", "translate("+pieDim.w/2.2+","+pieDim.h/2+")");
//       };
//
//       pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
//
//       // create function to draw the arcs of the pie slices.
//     	arc = d3.svg.arc()
//     				  .outerRadius(pieDim.r - 10)
//     				  .innerRadius(0);
//
//     	// create a function to compute the pie slice angles.
//     		piec = d3.layout.pie()
//     				.sort(null)
//     				.value(function(d) { return d.freq; });
//
//
//     		// Draw the pie slices.
//     		piesvg
//     			.selectAll("path")
//     			.data(piec(_datap))
//     			.enter()
//     			.append("path")
//     			.attr("d", arc)
//     			.each(function(d) { this._current = d; })
//     			.style("fill", function(d) { return segColor(d.data.type); })
//     			.on("mouseover",dispatch1p.pmouseover)
//     			.on("mouseout",dispatch2p.pmouseout);
//
//     	// Animating the pie-slice requiring a custom function which specifies
//     	// how the intermediate paths should be drawn.
//     	function arcTween(a) {
//     		var i = d3.interpolate(this._current, a);
//     		this._current = i(0);
//     		return function(t) { return arc(i(t));    };
//     	};
//     })
//     this.arc = arc;
//   }
//
//
//   exportsP.pieDimw = function(_wp){
//     if(!arguments.length){return pieDim.w};
//     pieDim.w = _wp;
//     return this;
//   };
//
//   d3.rebind(exportsP, dispatch1p, "on");
//   d3.rebind(exportsP, dispatch2p, "on");
//   return exportsP
//
// }
//
//
//
//
//
// 	//   // create function to update pie-chart. This will be used by histogram.
// 	//   pC.update = function(nD){
// 	// 	  piesvg
// 	// 		.selectAll("path")
// 	// 		.data(piec(nD))
// 	// 		.transition()
// 	// 		.duration(500)
// 	// 		.attrTween("d", arcTween);
// 	//   }
//   //
//   //
// 	// // // Utility function to be called on mouseover a pie slice.
// 	// // function mouseover(d){
// 	// // 	// call the update function of histogram with new data.
// 	// // 	hG.update(freqData.map(function(v){
// 	// // 		return [v.State, v.freq[d.data.type]];}),segColor(d.data.type));
// 	// // }
// 	// // //Utility function to be called on mouseout a pie slice.
// 	// // function mouseout(d){
// 	// // 	// call the update function of histogram with all data.
// 	// // 	hG.update(freqData.map(function(v){
// 	// // 		return [v.State,v.total];}), barColor);
// 	// // }
//   //
//   //
//   //
// 	// function updateSize(){
// 	//   if ($(window).width() < 500) {
// 	// 	pieDim = {w:150, h:250}
// 	// 	pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
// 	// 	//console.log(pieDim)
// 	//   }else{
// 	// 	pieDim = {w:180, h:250}
// 	// 	pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
// 	//   }
// 	// }
//   //
// 	// pC.update_test = function(){
// 	//   updateSize();
// 	//   initPie();
// 	// }
