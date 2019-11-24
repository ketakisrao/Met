function renderMap(data){

    const map = d3.select("#country-map");

    const width = map.node().getBoundingClientRect().width;
    const height = width / 2;
    var border = 1;
    var bordercolor = 'white';

    const projection = d3.geoMercator()
        .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
        .scaleExtent([1, 3])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    // map.call(zoom);

    const svg = map.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("border", border);

    var tooltip = d3.select("#spiral-chart")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .text("a simple tooltip");

    // var borderPath = svg.append("rect")
    //     .attr("x", 0)
    //     .attr("y", 0)
    //     .attr("height", h)
    //     .attr("width", w)
    //     .style("stroke", bordercolor)
    //     .style("fill", "none")
    //     .style("stroke-width", border);

    const g = svg.append("g")
        .attr("id", "country-paths");

    // Read all the data
    d3.queue()
      .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")  // World shape
      .await(ready);

    function ready(error, world) {
      if (error) throw error;

      var countries = topojson.feature(world, world.objects.countries).features;

      g.selectAll(".country")
          .data(countries)
          .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path)
          .style("stroke", "white")
          .style("stroke-width", "0.5")
          .style("fill", function(d) {
            let countryName = d.properties.name;
            let index = countryIndex(countryName, data);
            if (index !== -1) {
              return d3.interpolateOranges(parseInt(data[index]["n"])/500);
            } else {
              return "black";
            }
          })
          .on('mouseover', function(d, i) {
            let countryName = d.properties.name;
            let idx = countryIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this)
                .style('fill', "red");

              tooltip.transition()		
                .duration(200)		
                .style("opacity", 1);	

              let string = `<h5>${countryName}</h5>
                            <b>${data[idx]["n"]} Artworks</b>`;

              tooltip.html(string)	
                      .style("left", (d3.event.pageX + 10) + "px")		
                      .style("top", (d3.event.pageY - 28) + "px")
                      .style("display", "block");	
            }
          })
          .on("mousemove", function(){
            tooltip.style("top", (d3.event.pageY - 28)+"px")
                   .style("left",(d3.event.pageX + 10)+"px");
          })
          .on('mouseout', function(d, i) {
            let countryName = d.properties.name;
            let idx = countryIndex(countryName, data);
            if (idx !== -1) {
              var currentState = this;
              d3.select(this).style('fill', d3.interpolateOranges(parseInt(data[idx]["n"])/500));
            }

            tooltip.html("HELLO")	
            .style("display", "none");	
          });
  }

  function zoomed(){
    g.attr("transform", d3.event.transform);
  }

  function countryIndex(countryName, data) {
    let idx = data.findIndex(field => {
      let countryInData = capitalizeWords(field["country"]);
      if (countryName === "United States of America" && field["country"].includes("United States")) {
        return true;
      }
      return countryInData === countryName;
    });

    return idx;
  }

  function capitalizeWords(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
}
