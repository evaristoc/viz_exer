if (!d3.chart) {
    d3.chart = {};
};

//http://stackoverflow.com/questions/11857615/placing-labels-at-the-center-of-nodes-in-d3-js

d3.chart.sunburn = function(){
    var root;
    var margin = {top: 350, right: 480, bottom: 350, left: 480},
        radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;
    var svg;
    var partition;
    var arc;
    var groupct;
    var center;
    var path;
    var tspan;
    var dynum = -20;
    var dispatch = d3.dispatch(exports, ["zoomIn", "zoomOut"])
    
    function exports(slc){
        //$(slc).children().remove();
        //console.log("here",d3.select(slc))
        if ($("#chart").children()) {
            $("#chart").children().remove();
        }

        svg = d3.select(slc)
            .append("svg")
            .attr("width", margin.left + margin.right)
            .attr("height", margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       
        partition = d3.layout.partition()
            .sort(function(a, b) { return d3.ascending(a.name, b.name); })
            .size([2 * Math.PI, radius]);

     
        //center = svg.append("circle")
        //    .attr("r", radius / 3)
        //
        //textcl = d3.select("#classif")
        //    .append("text")
        //    .text("Caudata"); 

        
        //http://stackoverflow.com/questions/11857615/placing-labels-at-the-center-of-nodes-in-d3-js
        //https://bl.ocks.org/mbostock/7555321        
        groupct = svg
                //.select("g")
                .append('g')
                .classed('cir', true);

        center = groupct
                //.select("circle")
                .append("circle")
                .attr("r", radius / 3)
                .style("fill", "green")
                .style("stroke","green")
                .style("stroke-width", radius/3)
                .classed("center", true);

        var ct = [root.name, "Extinct: "+stats(root.color)[0],"Endagn: "+stats(root.color)[1],"NoThrt: "+stats(root.color)[2],"NoData: "+stats(root.color)[3],"Other: "+stats(root.color)[4]]
        
        textcl = groupct
                .selectAll("text")
                .data(ct)
                //.data(["Caudata","Extinct: 0","Endagn: 258","NoThrt: 217","NoData: 205","Other: 2"])
        
          
        textcl
                .enter()
                .append("text")
                .text(function(d){return d})
                .classed("classif",true)
                .style("fill", "white")
                .attr("text-anchor","middle")
                .attr("y", function(d,i){return - 50+i*25});

 
        center.append("title")
            .text("zoom out");

        path = svg.selectAll("path")
                .data(partition.nodes(root).slice(1))
                .enter()
                .append("path")
                //.style("fill","white")

        
        $(slc).fadeIn(1000);
        //$(slc).css("display", "");
        
        update();

    };
    
    exports.update = update;
    
    function update(){

        // Compute the initial layout on the entire tree to sum sizes.
        // Also compute the full name and fill color for each node,
        // and stash the children so they can be restored as we descend.
        partition
            .value(function(d) { return d.size; })
            .nodes(root)
            .forEach(function(d) {
                d._children = d.children;
                d.sum = d.value;
                d.key = key(d);
                d.fill = fill(d);
            });

        // Now redefine the value function to use the previously-computed sum.
        partition
            .children(function(d, depth) { return depth < 3 ? d._children : null; }) //this is the depth controller...
            .value(function(d) { return d.sum; });
                
        arc = d3.svg.arc()
            .startAngle(function(d) { return d.x; })
            .endAngle(function(d) { return d.x + d.dx ; })
            .padAngle(.01)
            .padRadius(radius / 3)
            .innerRadius(function(d) { return radius / 3 * d.depth; })
            .outerRadius(function(d) { return radius / 3 * (d.depth + 1) - 1; });
    
       
    
        center   
            .on("click", dispatch.zoomOut);
            
        path
            //.transition()
            .attr("d", arc)
            .style("fill", function(d) { return d.fill; })
            .each(function(d) { this._current = updateArc(d); })
            .on("click", dispatch.zoomIn);

    };

    dispatch.zoomIn = function(p) {
      if (p.depth > 1) p = p.parent;
      if (!p.children) return;
      zoom(p, p);
    };
    
    dispatch.zoomOut = function(p) {
      //console.log(p.parent.name);
      if (!p.parent) return;
      zoom(p.parent, p);
    };

  // Zoom to the specified new root.
    function zoom(root, p) {
        if (document.documentElement.__transition__) return;
        //console.log(p.depth)
        // Rescale outside angles to match the new layout.
        var enterArc,
            exitArc,
            outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);
    
        function insideArc(d) {
          return p.key > d.key
              ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
              ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
              : {depth: 0, x: 0, dx: 2 * Math.PI};
        }
    
        function outsideArc(d) {
          return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
        }
    
        center.datum(root);
    
        // When zooming in, arcs enter from the outside and exit to the inside.
        // Entering outside arcs start from the old layout.
        if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);
    
        path = path
                .data(partition.nodes(root).slice(1), function(d) { return d.key; });
    
      
        // When zooming out, arcs enter from the inside and exit to the outside.
        // Exiting outside arcs transition to the new layout.
        if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);
        
        
        textcl.remove();                //use exit when you want to remove only those cells that are spare!!


        
        //["Caudata","Extinct: 0","Endagn: 258","NData: 217","NonThrt: 205","Other: 2"]
        var textcl1 =  groupct
                .selectAll("text")
                //.data([Math.random(),2,3,4,5,6])
                .data(function(d){ //WHY d WORKS? Because even after removing, my cells in groupct container for textcl are still 6!!
                    //console.log(p.name, p.parent.name, p.depth, stats(p.color));
                    if(p.depth == 1){
                        var arr = [p.parent.name].concat(stats(p.parent.color));
                        return [arr[0], "Extinct: "+arr[1], "Endgn: "+arr[2], "NoThrt: "+arr[3], "NoData: "+arr[4], "Other: "+arr[5]];
                    }else{
                        var arr = [p.name].concat(stats(p.color));
                        return [arr[0], "Extinct: "+arr[1], "Endgn: "+arr[2], "NoThrt: "+arr[3], "NoData: "+arr[4], "Other: "+arr[5]];
                    }
                })
                .enter()
                .append("text")
                .text(function(d){return d})
                .classed("classif",true)
                .attr("text-anchor","middle")
                .style("fill", "white")
                .attr("y", function(d,i){return - 50+i*25});
        
        textcl = textcl1;               //this was the key issue: textcl CONTINUES to be ALIVE BY REFERENCE IN THE GLOBAL SCOPE!!! It is a JS issue... I need to re-direct the reference into my new LOCAL variable
        
        d3
            .transition()
            .duration(d3.event.altKey ? 7500 : 750)
            .each(function() {
                path.exit().transition()
                    .style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
                    .attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
                    .remove();
          
                path.enter().append("path")
                    .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
                    .style("fill", function(d) { return d.fill; })
                    .on("click", dispatch.zoomIn)
                    .each(function(d) { this._current = enterArc(d); });
          
                path.transition()
                    .style("fill-opacity", 1)
                    .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
            });
    };

    function wraptext(text){
        text.each(function(){
            //console.log(this);
            var txt = d3.select(this);
            var word;
            var lineNumber = 0;
            var ynum = txt.attr("y") - 30;
            //var dynum = parseFloat(txt.attr("dy"));
            //console.log(dynum);
            tspan = txt.text(word).append("tspan").attr("y", ynum + 10);

        })
    }
    
    function stats(arr){
        var extct = 0;
        var endng = 0;
        var nonth = 0;
        var unkwn = 0;
        var ndata = 0;
        for (var i = 0; i < arr.length; i++){
          if(arr[i].toString() == [0,0,0].toString()){
            extct++;
          }else if (arr[i].toString() == [255,51,51].toString()) {
            endng++;
          }else if (arr[i].toString() == [192,192,192].toString()) {
            unkwn++;
          }else if (arr[i].toString() == [102,178, 255].toString()) {
            nonth++;
          }else{
            ndata++;
          }
        };
        return [extct, endng, nonth, unkwn, ndata];
    };


    function key(d) {
      var k = [], p = d;
      while (p.depth) k.push(p.name), p = p.parent;
      return k.reverse().join(".");
    };
    
    function fill(d) {
        var p = d;
        //console.log(p.name, p.depth, p.status);
        var c = [0,0,0];
        for(var i = 0; i < p.color.length; i++){
            if (p.color.length == 1) {
                return c = d3.rgb(p.color[0][0], p.color[0][1], p.color[0][2]);
            };
            c[0] = c[0] + p.color[i][0];
            c[1] = c[1] + p.color[i][1];
            c[2] = c[2] + p.color[i][2];
        }
        c[0] = Math.round(c[0]/p.color.length);
        c[1] = Math.round(c[1]/p.color.length);
        c[2] = Math.round(c[2]/p.color.length);
        
        
      //console.log(d3.rgb(c[0],c[1],c[2]))
      return d3.rgb(c[0],c[1],c[2]);
    };
    
    function arcTween(b) {
      var i = d3.interpolate(this._current, b);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    };
    
    function updateArc(d) {
      return {depth: d.depth, x: d.x, dx: d.dx};
    };

    
    exports.root = function(_value){
        if (!arguments.length) {
            return root;
        };
        root = _value;
        return exports;
    };
   
    return d3.rebind(exports, dispatch, "on");
}
