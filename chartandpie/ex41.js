// Bar chart Module
/////////////////////////////////

d3.custom = {};
function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

d3.custom.pieChart = function module() {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 250,
        height = 250,
        gap = 0,
        ease = "bounce";
    var svg, container;
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }

    var dispatch = d3.dispatch("customHover");
    function exports(_selection) {
        _selection.each(function(_data) {
            var pieW = width - margin.left - margin.right,
                pieH = height - margin.top - margin.bottom;


            if (!svg) {
                svg = d3.select(this)
                        .append("svg")
                        .classed("pie", true)
                        .append("g")
                        .classed("container-group", true)
                        .attr({transform: "translate(" + width/2 + "," + height/2 + ")"});
                //container.append("g").classed("pie-group", true);
            }

            svg.transition().attr({width: width, height: height});
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
            			.on("mouseover",dispatch.customHover);

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

// Usage
/////////////////////////////////

// var chart = d3.custom.pieChart();
//
// function update() {
//     var data = randomDataset();
//     d3.select("#figure")
//         .datum(data)
//         .call(chart);
// }
//
// function randomDataset() {
//     return d3.range(~~(Math.random() * 50)).map(function(d, i) {
//         return ~~(Math.random() * 1000);
//     });
// }
//
// update();

setInterval(update, 1000);
