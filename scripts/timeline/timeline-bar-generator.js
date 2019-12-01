function generateBarTimeline(data) {

  // Margin conventions
  var margin = {top: 0, right: 30, bottom: 30, left: 30};
  var constWidth = d3.select(".bar-graph").node().getBoundingClientRect().width*0.8;
  var constHeight = d3.select(".bar-graph").node().getBoundingClientRect().height*0.8;
  var width = constWidth - margin.left - margin.right,
      height = constHeight*0.5 - margin.top - margin.bottom;

  var strokeWidth = 10;

  // Remove old stuff if exists
  d3.select("#bar-svg").selectAll("*").remove();

  // Appends the svg to the chart-container div
  var svg = d3.select("#bar-svg")
              .append("svg")
              .attr("viewBox", `0 0 ${width+margin.left+margin.right} ${constHeight+margin.top+margin.bottom}`)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Creates the xScale
  var xScale = d3.scaleTime()
    .range([0, width-100]);

  // Creates the yScale
  var yScale = d3.scaleLinear()
    .range([height, 0]);

  // Defines the x axis styles
  var xAxis = d3.axisTop()
                .scale(xScale)
                .tickPadding(10)
                .ticks(11)
                .tickFormat(function(d) { return d * 1});

  ready(data);

  function ready(data) {

    let max = d3.max(data, function(d) {
      return d["Object End Date"];
    })

    let min = d3.min(data, function(d) {
      return d["Object End Date"];
    })

    // Defines the xScale max
    //xScale.domain(d3.extent(data, function(d) { return d["Object End Date"]; }));
    xScale.domain([min-2, max]);

    // Defines the yScale max
    yScale.domain([0, 100]);

    // Appends the x axis
    var xAxisGroup = svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", function() {
                          return "translate(80," + height*0.4 + ")";
                        })
                        .call(xAxis);

    var yearCounter = {};
    var imgSize = 5;
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

                      let multiple = yearCounter[d["Object End Date"]];

                      let y = height*0.3 + (imgSize * multiple) + 10;

                      return `translate(${x+78},${y})`;
                    })
                    .append('svg')
                    .attr("width", imgSize)
                    .attr("height", imgSize)
                    .append('image')
                    .attr('xlink:href', function(d) {
                      return d["Image URL"]
                    })
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", "100%")
                    .attr("height", "100%")

    images.on("mouseover", function(d) {
            let artTitle = d["Title"] ? d["Title"] : "Untitled";
            let maxChar = 40;
            if (artTitle.length > maxChar) {
              artTitle = artTitle.slice(0, maxChar) + "...";
            }

            d3.select(".art-title")
              .html(artTitle)

            d3.select(".art-type")
              .html("TYPE: " + d["Object Name"])

            d3.select(".art-medium")
              .html("MEDIUM: " + d["Medium"])

            d3.select(".art-end-date")
              .html("DATE: " + d["Object End Date"])

            d3.select("#bar-img")
              .attr("src", d["Image URL"])

            d3.select(".bar-column")
              .style("display", "block");

            d3.select("#bar-img")
              .style("display", "block");

          })
          .on("mouseout", function(d) {
            d3.select(".bar-column")
              .style("display", "none");

            d3.select("#bar-img")
              .style("display", "none");
          })
  }
}
