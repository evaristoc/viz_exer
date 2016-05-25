// Bar chart Module
/////////////////////////////////

d3.custom = {};
function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

////////////////////////////
//
//pie chart
//
////////////////////////////


d3.custom.barChart = function module() {
    var margin = {top: 20, right: 20, bottom: 40, left: 40},
        width = 500,
        height = 500,
        gap = 0,
        ease = "bounce";
    var svg;
    var color;

    var dispatch = d3.dispatch("barHover", "barNHover");
    function exports(_selection) {
        _selection.each(function(_data) {
            
            var chartW = width - margin.left - margin.right,
                chartH = height - margin.top - margin.bottom;

            var xScale = d3.scale.ordinal()
                    .domain(_data.map(function(d, i) { return d[0]; }))
                    .rangeRoundBands([0, chartW], 0.1);

            var yScale = d3.scale.linear()
                    .domain([0, d3.max(_data, function(d, i) { return d[1]; })])
                    .range([chartH, 0]);

            var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

            var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");

            var barW = chartW / _data.length;

            if (!svg) {
                svg = d3.select(this)
                    .append("svg")
                    .classed("chart", true);
                var container = svg.append("g").classed("container-group", true);
                container.append("g").classed("chart-group", true);
                container.append("g").classed("x-axis-group axis", true);
                container.append("g").classed("y-axis-group axis", true);
            }

            svg.transition().attr({width: width, height: height});
            svg.select(".container-group")
                .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

            svg.select(".x-axis-group.axis")
                .transition()
                .ease(ease)
                .attr({transform: "translate(0," + (chartH) + ")"})
                .call(xAxis);

            svg.select(".y-axis-group.axis")
                .transition()
                .ease(ease)
                .call(yAxis);

            var gapSize = xScale.rangeBand() / 100 * gap;
            var barW = xScale.rangeBand() - gapSize;
            var bars = svg.select(".chart-group")
                    .selectAll(".bar")
                    .data(_data);
                    
            bars
                .enter()
                .append("rect")
                .classed("bar", true)
                .attr({
                    x: chartW,
                    width: barW,
                    y: function(d,i) { return yScale(d[1]); },
                    height: function(d,i) { return chartH - yScale(d[1]); },
                    fill: color
                })
                .on("mouseover", dispatch.barHover)
                .on("mouseout", dispatch.barNHover)
            
            bars
                .transition()
                .ease(ease)
                .attr({
                    x: function(d, i) { return xScale(d[0]) + gapSize / 2; },
                    width: barW,
                    y: function(d, i) { return yScale(d[1]); },
                    height: function(d, i) { return chartH - yScale(d[1]); },
                    fill: color
                });

            bars.exit().transition().style({opacity: 0}).remove();            

            
            var texts = svg.select(".chart-group")
                    .selectAll(".barvalue")
                    .data(_data);
            

            texts
                .enter()
                .append("text")
                .text(function(d,i){return d3.format("%")(d[1])})
                .classed("barvalue",true)
                .attr("x", function(d,i) {return xScale(d[0])+xScale.rangeBand()/2; })
                .attr("y", function(d,i) { return yScale(d[1])-5; })
                .attr("text-anchor", "middle")
                .attr("font-size", "10")                
            
            
            texts
                .transition()
                .ease(ease)
                .attr("x", function(d) {return xScale(d[0])+xScale.rangeBand()/2; })
                .attr("y", function(d) { return yScale(d[1])-5; })        
            
            texts.exit().transition().style({opacity: 0}).remove();

        });
    }
    
    exports.color = function(_x) {
        if (!arguments.length) return color;
        color = _x;
        return this;
    };
    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        return this;
    };
    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        return this;
    };
    exports.gap = function(_x) {
        if (!arguments.length) return gap;
        gap = _x;
        return this;
    };
    exports.ease = function(_x) {
        if (!arguments.length) return ease;
        ease = _x;
        return this;
    };
    d3.rebind(exports, dispatch, "on");
    return exports;
};


////////////////////////////
//
//pie chart
//
////////////////////////////


d3.custom.pieChart = function module() {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 250,
        height = 250,
        gap = 0,
        ease = "bounce";
    var svg, container;
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

    var dispatch = d3.dispatch("pieHover","pieNHover");
    function exports(_selection) {
        _selection.each(function(_data) {
            var pieW = width - margin.left - margin.right,
                pieH = height - margin.top - margin.bottom;


            if (!svg) {
                svg = d3.select(this)
                        .append("svg")
                        .classed("pie", true)
                        .attr({width: width, height: height})
                        .append("g")
                        .classed("container-group", true)
                        .attr({transform: "translate(" + width/2 + "," + height/2 + ")"});
                //container.append("g").classed("pie-group", true);
            }

            //svg.transition()
            // container.select(".container-group")
            //     .attr({transform: "translate(" + width/2 + "," + height/2 + ")"});

            var pielyout, arcScale;

            var radius = Math.min(width, height) / 2;

            arcScale = d3.svg.arc()
          				  .outerRadius(radius - 10)
          				  .innerRadius(0);

        	// create a function to compute the pie slice angles.
        		pielyout = d3.layout.pie()
        				    .sort(null)
        				    .value(function(d) { return d.freq; });


        		// Draw the pie slices.
        		var pie = svg
        			           .selectAll("path")
            			       .data(pielyout(_data))

            pie
                  .enter()
            			.append("path")
            			.attr("d", arcScale)
            			.each(function(d) { this._current = d; })
            			.style("fill", function(d) { return segColor(d.data.type); })
            			.on("mouseover",dispatch.pieHover)
                        .on("mouseout", dispatch.pieNHover);

        	// Animating the pie-slice requiring a custom function which specifies
        	// how the intermediate paths should be drawn.
        	function arcTween(a) {
        		var i = d3.interpolate(this._current, a);
        		this._current = i(0);
        		return function(t) { return arcScale(i(t));    };
        	}


          pie
              .transition()
              .ease("elastic")
              .each(function(d) { this._current = d; })
              .attrTween("d",arcTween)

         pie.exit().transition().style({opacity: 0}).remove();
        });
    }
    exports.width = function(_x) {
        if (!arguments.length) return width;
        width = parseInt(_x);
        return this;
    };
    exports.height = function(_x) {
        if (!arguments.length) return height;
        height = parseInt(_x);
        return this;
    };
    exports.ease = function(_x) {
        if (!arguments.length) return ease;
        ease = _x;
        return this;
    };
    d3.rebind(exports, dispatch, "on");
    return exports;
};


////////////////////////////
//
//legend table
//
////////////////////////////


d3.custom.legTable = function module() {
    var leg;
    var dispatch = d3.dispatch("legHover", "legNHover");
    function exports(_selection) {
        _selection.each(function(_data) {

        //	function getLegend(d,aD){ // Utility function to compute percentage.
        //        return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        //    }
        
        
            if (!leg) {
                leg = d3.select(this)
                    .append("table")
                    .classed("legend", true);
            }

            var tr = leg.append("tbody")
                .selectAll("tr")
                .data(_data)
                .enter()
                .append("tr");

            tr
                .append("td")
                .append("svg")
                .attr("width", '16')
                .attr("height", '16')
                .append("rect")
                .attr("width", '16')
                .attr("height", '16')
                .attr("fill",function(d){ return segColor(d.type); });

            tr
                .append("td")
                .text(function(d){ var v; if(d.type == "low"){v = "0-3mths"}else if(d.type == "mid"){v = "4-10mths"}else{v = "+11mths"};return v;});


            tr
                .append("td")
                .attr("class",'legendPerc')
                //.text(function(d){ return getLegend(d,lD);});

            
        });
    }
    
    d3.rebind(exports, dispatch, "on");
    return exports;
};