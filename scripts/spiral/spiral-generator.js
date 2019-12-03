function renderSpiral(dynasty, data) {

  // Dimensions
  var container = d3.select(".spiral").node();
  var height = container.getBoundingClientRect().height;
  var width = container.getBoundingClientRect().width;

  // Spiral constants
  var start = 0,
      end = 2.5,
      numSpirals = 2
      margin = {top:50,bottom:50,left:50,right:50};

  var theta = function(r) {
    return numSpirals * Math.PI * r;
  };

  var r = d3.min([width, height - 100]) / 2 - 40;

  var radius = d3.scaleLinear()
    .domain([start, end])
    .range([40, r]);

  // Color scales
  if (dynasty === "bc") {
    var colors = d3.scaleLinear()
                  .domain([-4300,0])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#051c95"), d3.rgb('#d7f5fb')]);
  }else if(dynasty === "0-500"){
    var colors = d3.scaleLinear()
                  .domain([0,500])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#4c059d"), d3.rgb('#dbbcfe')]);
  }else if(dynasty === "500-1000"){
    var colors = d3.scaleLinear()
                  .domain([500, 1000])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#051c95"), d3.rgb('#d7f5fb')]);
  }else if(dynasty === "1000-1500"){
    var colors = d3.scaleLinear()
                  .domain([1000, 1500])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#4c059d"), d3.rgb('#dbbcfe')]);
  }else if(dynasty === "1500-2000"){
    var colors = d3.scaleLinear()
                  .domain([1500, 2000])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#051c95"), d3.rgb('#d7f5fb')]);
  }

  // Make sure all contents removed first 
  d3.select("#spiral-chart").selectAll("*").remove();

  // Append to main div
  var svg = d3.select("#spiral-chart").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height*0.8 + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // Spiral-related components
  var points = d3.range(start, end + 0.001, (end - start) / 1000);

  var spiral = d3.radialLine()
    .curve(d3.curveCardinal)
    .angle(theta)
    .radius(radius);

  var path = svg.append("path")
    .datum(points)
    .attr("id", "spiral")
    .attr("d", spiral)
    .style("fill", "none")
    .style("stroke", "#d3dafc");

  var spiralLength = path.node().getTotalLength(),
      N = 500,
      barWidth = (spiralLength / N) - 1;

  // Scale for time
  var timeScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d){
                      return d["Date"];
                    }))
                    .range([0, spiralLength]);

  // Adjust maxDomain for 1500-2000 period
  var maxDomain = 200;
  if (dynasty === ("1500-2000")) {
    maxDomain = 2000;
  } 

  // Set bar height
  var yScale = d3.scaleLinear()
    .domain([0, maxDomain])
    .range([0, (r / numSpirals) - 50]);

  // Appending data
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d,i){

      var linePer = timeScale(d["Date"]);

      var posOnLine = path.node().getPointAtLength(linePer);
      var angleOnLine = path.node().getPointAtLength(linePer - barWidth);

      d.linePer = linePer; // % distance are on the spiral
      d.x = posOnLine.x; // x postion on the spiral
      d.y = posOnLine.y; // y position on the spiral

      d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

      return d.x;
    })
    .attr("y", function(d){
      return d.y;
    })
    .attr("width", function(d){
      return barWidth;
    })
    .attr("height", function(d){
      let num = d["Count"];
      if (parseInt(d["Count"]) > maxDomain) {
        num = maxDomain;
      }
      return yScale(num);
    })
    .style("fill", function(d) {
      return colors(parseInt(d["Date"]));
    })
    .style("stroke", "none")
    .attr("transform", function(d){
      return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
    })
    .attr("opacity", 0)
    .transition()
    .delay(function(d, i) {
      return i * 10
    })
    .attr("opacity", 1)

  // Appending labels
  svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .attr("dy", 10)
    .style("text-anchor", "start")
    .style("font", "10px arial")
    .append("textPath")
    // only add for the first of each month
    .filter(function(d){
      if (dynasty === "bc" && d["Date"] % 100 === 0){
        return true;
      } else if (dynasty !== "bc" && d["Date"] % 10 === 0) {
        return true;
      }
      return false;
    })
    .text(function(d){
      return d["Date"]
    })

    // place text along spiral
    .attr("xlink:href", "#spiral")
    .style("fill", function(d){
      return colors(parseInt(d["Date"]));
    })
    .attr("startOffset", function(d){
      return ((d.linePer / spiralLength) * 100) + "%";
    })

  // Tool-tip related components
  var tooltip = d3.select("#spiral-chart")
                  .append('div')
                  .attr('class', 'tooltip');

  tooltip.append('div')
        .attr('class', 'date');
  tooltip.append('div')
        .attr('class', 'value');

  // Hover effects
  svg.selectAll("rect")
      .on('mouseover', function (d) {
        tooltip.select('.date').html("<b>Year: " + d["Date"] + "</b>");
        tooltip.select('.value').html("<b># Artworks:" + d["Count"] + "</b>");

        tooltip.style('display', 'block')
              .style("left", (d3.event.pageX + 10) + "px")
              .style("top", (d3.event.pageY - 28) + "px")
              .style('opacity', 1);

        d3.select(this)
            .style("fill", "#FFFFFF")
            .style("stroke", "#01136f")
            .style("stroke-width", "2px");

      })
      .on('mousemove', function (d) {
          tooltip.style('top', (d3.event.pageY + 10) + 'px')
                  .style('left', (d3.event.pageX - 25) + 'px');
      })
      .on('mouseout', function (d) {
          d3.selectAll("#spiral-chart rect")
              .style("fill", function (d) {
                  if (d) {
                      return colors(parseInt(d["Date"]));
                  }
                  return "none";
              })
              .style("stroke", "none")
          tooltip.style('opacity', 0);
      });


}
