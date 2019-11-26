function generateBarTimeline(data) {

  // Margin conventions
  var margin = {top: 0, right: 30, bottom: 30, left: 30};
  var constWidth = d3.select(".bar-graph").node().getBoundingClientRect().width;
  var constHeight = d3.select(".bar-graph").node().getBoundingClientRect().height;
  var width = constWidth - margin.left - margin.right,
      height = width*0.2 - margin.top - margin.bottom;

  var strokeWidth = 10;

  // Appends the svg to the chart-container div
  var svg = d3.select("#bar-svg")
              .append("svg")
              .attr("viewBox", `0 0 ${width+margin.left+margin.right} ${height+margin.top+margin.bottom}`)
              .attr("transform", "translate(0," + (constHeight - height*1.2) +")")
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
                // .ticks(11)
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
                          return "translate(0," + height + ")";
                        })
                        .call(xAxis);

    var yearCounter = {};

    var images = svg.selectAll("images")
                    .data(data)
                    .enter()
                    .append('g')
                    .attr("transform", function(d) {
                      let x = xScale(d["Object End Date"]);
                      
                      let date = d["Object End Date"];
                      if (date in yearCounter) {
                        yearCounter[date] = yearCounter[date] + 1;
                      } else {
                        yearCounter[d["Object End Date"]] = 0;
                      }

                      let imgHeight = 5;
                      let multiple = yearCounter[d["Object End Date"]];

                      let y = height*0.8 - (imgHeight * multiple) + 10;

                      return `translate(${x-10},${y})`;
                    })
                    .append('svg')
                    .attr("width", 5)
                    .attr("height", 5)
                    .append('image')
                    .attr('xlink:href', function(d) {
                      return d["Image URL"]
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", "100%")
                    .attr("height", "100%")
                    .append('rect')
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("stroke", "white")
                    .style("stroke-width", 2)

                    

                  
    // .on("mouseout", function(d) {
    //   d3.select(this)
    //     .transition().duration(100)
    //     .attr("y1", 50)
    //     .style("stroke-width", strokeWidth)
    //     .style("stroke", color)
    //     .style("opacity", 0.4);

    //   tooltip.transition(300)
    //     .style("opacity", 0)
    // }) 

    // Binds data to strips
    // var drawstrips = svg.selectAll("line.percent")
    //                     .data(data)
    //                     .enter()
    //                     .append("line")
    //                     .attr("class", "percentline")
    //                     .attr("x1", function(d,i) { return xScale(d["Object End Date"]); })
    //                     .attr("x2", function(d) { return xScale(d["Object End Date"]); })
    //                     // .attr("y1", 50)
    //                     // .attr("y2", 100)
    //                     .attr("y1", function() {
    //                       return 0;
    //                     })
    //                     .attr("y2", function() {
    //                       return 50;
    //                     })
    //                     .style("stroke", "blue")
    //                     .style("stroke-width", strokeWidth)
    //                     .style("opacity", 0.4)

    
  }
}
