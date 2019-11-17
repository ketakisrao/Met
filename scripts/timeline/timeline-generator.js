function generateTimeline(id, data, datesData, color, enableToolTip) {
  
  // Margin conventions
  var margin = {top: 0, right: 30, bottom: 30, left: 50};
  var constWidth = d3.select("#" + id).node().clientWidth;
  var width = constWidth - margin.left - margin.right,
      height = 125 - margin.top - margin.bottom;

  var strokeWidth = 10;
  
  // Appends the svg to the chart-container div
  var svg = d3.select("#" + id)
              .append("svg")
              .attr("viewBox", `0 0 ${width+margin.left+margin.right} ${height+margin.top+margin.bottom}`)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (enableToolTip) {
    var tooltip = d3.select("#" + id)
                    .append("div")   
                    .attr("class", "tooltip")               
                    .style("opacity", 0);
  }   

  // Creates the xScale 
  var xScale = d3.scaleTime()
    .range([0, width]);

  // Creates the yScale
  var yScale = d3.scaleLinear()
    .range([height, 0]);  

  // Defines the x axis styles
  var xAxis = d3.axisBottom()
                .scale(xScale)
                .tickPadding(10)
                .ticks(10)
                .tickFormat(function(d) { return d * 1}) 

  ready(data);

  function ready(data) {

    // Defines the xScale max
    xScale.domain(d3.extent(data, function(d) { return d["Object End Date"]; }));

    // Defines the yScale max
    yScale.domain([0, 100]); 
     
    // Appends the x axis    
    var xAxisGroup = svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", function() {
                          if (enableToolTip) {
                            return "translate(0," + height + ")";
                          } 
                          return "translate(0," + height/2 + ")";
                        })
                        .call(xAxis);  

    // Binds data to strips
    var drawstrips = svg.selectAll("line.percent")
                        .data(data)
                        .enter()
                        .append("line")
                        .attr("class", "percentline")
                        .attr("x1", function(d,i) { return xScale(d["Object End Date"]); }) 
                        .attr("x2", function(d) { return xScale(d["Object End Date"]); })  
                        // .attr("y1", 50)
                        // .attr("y2", 100)
                        .attr("y1", function() {
                          if (enableToolTip) {
                            return 50;
                          }
                          return 0;
                        })
                        .attr("y2", function() {
                          if (enableToolTip) {
                            return 100;
                          }
                          return 50;
                        })
                        .style("stroke", color)
                        .style("stroke-width", strokeWidth)
                        .style("opacity", 0.4)

    // Tooltip mouseover/mouseout
    if (enableToolTip) {
      drawstrips.on("mouseover", function(d) {

        // Set tooltip
        var right = d3.event.pageX > window.innerWidth / 2;

        let numWorks;
        if (datesData[d["Object End Date"]]) {
          numWorks = datesData[d["Object End Date"]]
        }

        d3.select(this)
          .transition().duration(100)
          .attr("y1", 0)
          .style("stroke-width", strokeWidth)
          .style("opacity", 1)
          .style("stroke", "#ffffff")

        tooltip.transition(300)
              .style("opacity", 1)
        tooltip.html(numWorks + " artpiece(s)")
        
        var offset = tooltip.node().offsetWidth + 10;

        let topDisplacement = d3.select("#"+id).node().getBoundingClientRect().top;
                              
        console.log(topDisplacement);
        tooltip.style("left", (d3.event.pageX - offset) + "px")
                .style("top", (topDisplacement) + "px")
        
        // Set img
        let img = d3.select("#art-img")
                    .attr("src", d["Image URL"])

        let artTitle = d["Title"] ? d["Title"] : "Untitled";

        d3.select(".art-title")
          .html(artTitle)
        
        d3.select(".art-type")
          .html(d["Object Name"])

        d3.select(".art-medium")
          .html(d["Medium"])

        d3.select(".art-end-date")
          .html(d["Object End Date"])
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition().duration(100)
          .attr("y1", 50)
          .style("stroke-width", strokeWidth)
          .style("stroke", color)  
          .style("opacity", 0.4);

        tooltip.transition(300)
          .style("opacity", 0)
      })  
    }                 
  }  
}