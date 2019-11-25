function renderSpiral(data) {

  let container = d3.select(".spiral").node();
  var height = container.getBoundingClientRect().height;
  var width = container.getBoundingClientRect().width;

  var start = 0,
      end = 2.25,
      numSpirals = 2
      margin = {top:50,bottom:50,left:50,right:50};

  var theta = function(r) {
    return numSpirals * Math.PI * r;
  };

  // used to assign nodes color by group
  // var color = d3.scaleLinear()
  //               .domain([1, 1000])
  //               .range(['#d73027', '#1a9850'])
  //               .interpolate(d3.interpolateHcl);

  var colors = ["#FF7858", "#6DB8BD", "#956DBD"];

  var r = d3.min([width, height]) / 2 - 40;

  var radius = d3.scaleLinear()
    .domain([start, end])
    .range([40, r]);

  var svg = d3.select("#spiral-chart").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height*0.8 + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

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
    // .style("stroke", "steelblue");

  var spiralLength = path.node().getTotalLength(),
      N = data.length,
      barWidth = (spiralLength / N) - 1;

  var timeScale = d3.scaleLinear()
                    .domain(d3.extent(data, function(d){
                      return d["Date"];
                    }))
                    .range([0, spiralLength]);

  // yScale for the bar height
  var yScale = d3.scaleLinear()
    // .domain([0, d3.max(data, function(d){
    //   return d["Count"];
    // })])
    .domain([0, 2000])
    .range([0, (r / numSpirals) - 30]);

  var maxGroup = d3.max(data, function(d) {
    return parseInt(d["Group"])
  });

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
      return yScale(d["Count"]);
    })
    .style("fill", function(d) {
      return colors[parseInt(d["Group"])];
      //return d3.interpolateSpectral(parseInt(d["Group"])/maxGroup);
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
      if (d["Date"] % 10 === 0){
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
      return colors[d["Group"]%3];
    })
    .attr("startOffset", function(d){
      return ((d.linePer / spiralLength) * 100) + "%";
    })


  var tooltip = d3.select("#spiral-chart")
                  .append('div')
                  .attr('class', 'tooltip');

  tooltip.append('div')
        .attr('class', 'date');
  tooltip.append('div')
        .attr('class', 'value');

  svg.selectAll("rect")
  .on('mouseover', function(d) {

      tooltip.select('.date').html("Date: <b>" + d["Date"] + "</b>");
      tooltip.select('.value').html("# Artworks: <b>" + d["Count"] + "<b>");

      d3.select(this)
      .style("fill","#FFFFFF")
      .style("stroke","#000000")
      .style("stroke-width","2px");

      tooltip.style('display', 'block');
      tooltip.style('opacity',2);

  })
  .on('mousemove', function(d) {
      tooltip.style('top', (d3.event.layerY + 10) + 'px')
      .style('left', (d3.event.layerX - 25) + 'px');
  })
  .on('mouseout', function(d) {
      d3.selectAll("rect")
      .style("fill", function(d) {
        //return "white";
        //return d3.interpolateSpectral(parseInt(d["Group"])/maxGroup);
        return colors[parseInt(d["Group"])%3];
      })
      .style("stroke", "none")

      tooltip.style('display', 'none');
      tooltip.style('opacity',0);
  });

}