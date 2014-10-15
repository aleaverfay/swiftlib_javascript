$(document).ready(function () {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    // setup x 
    var xValue = function(d) { return d.x;}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
    // setup y
    var yValue = function(d) { return d.y;}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");
    
    var svg = d3.select("#graphdiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    //Add x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Error size");
    
    //Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Minimum library size");
        
    function plot(data) {
    
        //Update the domains used for scaling
        xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
        yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
        
        svg.selectAll("g.x.axis")
            .call(xAxis);

        svg.selectAll("g.y.axis")
            .call(yAxis);
    
        //Handle updating the dots
        var dots = svg.selectAll(".dot").data(data)

        //Update existing dots
        dots.attr("cx", xMap);
        dots.attr("cy", yMap);
    
        //Handle make any new dots
        dots.enter().append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "red");
    }

    var test_data = [ {x:1, y:20}, {x:2, y:30}, {x:3, y:40} ];
    plot(test_data)
    var last_x = 3;
    var last_y = 40;
    setInterval(function() {
        last_x += 1;
        last_y += 10;
        test_data.push({x: last_x, y: last_y});
        plot(test_data)
    }, 1500);
});
