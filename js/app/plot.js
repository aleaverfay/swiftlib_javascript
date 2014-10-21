function plot(data) {

    console.log(data);

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    
    // setup x 
    var xValue = function(d) { return Math.exp(d[1]);}, // data -> value
        xScale = d3.scale.log().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    
    // setup y
    var yValue = function(d) { return d[0];}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    var svg = d3.select("#plotdiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Add a tooltip area
    var tooltip = d3.select("#plotdiv").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

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
        .text("Diversity");
    
    //Add y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 3)
        .attr("y", 6)
        .style("text-anchor", "end")
        .text("Error");

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
    .style("fill", "red")
    .on("mouseover", function(d) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Diversity: " + d3.format('.2e')(xValue(d))
            + "<br/>Error: " + yValue(d))
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });
}
