function renderMap(data){

    const map = d3.select("#country-map");

    // Dimensions set up
    const width = map.node().parentNode.parentNode.getBoundingClientRect().width * 0.7;
    const height = map.node().parentNode.parentNode.getBoundingClientRect().height * 0.7;
    var border = 1;
    var bordercolor = 'white';

    // Projections for map
    const projection = d3.geoMercator()
        .translate([width / 2, height / 2]);
    const path = d3.geoPath().projection(projection);

    // Color scale
    var color = d3.scaleLinear()
                  .domain([0, 1000])
                  .interpolate(d3.interpolateHcl)
                  .range([d3.rgb("#c6c2f4"), d3.rgb('#3528fc')]);

    // Main components
    const svg = map.append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("border", border);

    var tooltip = d3.select("#country-map")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .text("a simple tooltip");

    const g = svg.append("g")
        .attr("id", "country-paths");

    // Read all the data async
    d3.queue()
      .defer(d3.json, "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")  // World shape
      .await(ready);

    // After reading, do:
    function ready(error, world) {
      if (error) throw error;

      var countries = topojson.feature(world, world.objects.countries).features;

      // Plotting each country
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
              let count = parseInt(data[index]["n"]);
              if (count >= 1000) {
                count = 1000;
              }
              return color(count);
            } else {
              return "#ededee";
            }
          })
          .on('mouseover', function(d, i) {
            let countryName = d.properties.name;
            let idx = countryIndex(countryName, data);
            if (idx !== -1) {
              d3.select(this)
                .style('fill', "#1005c5");

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
              let count = parseInt(data[idx]["n"]);
              if (count >= 1000) {
                count = 1000;
              }
              d3.select(this).style('fill', color(count));
            }

            tooltip.html("HELLO")
                    .style("display", "none");
          });

        // Scale for legend
        let legendColors = d3.scaleLinear()
          .domain([0, 20])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb("#c6c2f4"), d3.rgb('#3528fc')]);

        let array = [...Array(20).keys()]
        
        // Legend-related components
        let legend = g
            .append("g")
            .attr("transform", `translate(50, ${height*0.85})`)
            .selectAll("legend")
            .data(array)
            .enter()
            .append("rect")
              .attr("x", function(d, i) {
                return 10*d;
              })
              .attr("y", 0)
              .attr("width", 10)
              .attr("height", 8)
              .style("fill", function(d, i) {
                return legendColors(d)
              })
              .attr("stroke", "none")
              .attr("opacity", 0)
              .transition()
              .style("opacity", 1)
              .duration(800);;

        let legendTitle = g.append("g")
            .attr("transform", `translate(80, ${height*0.85 - 10})`)
            .append("text")
            .attr("x", 0)
            .attr("y", 0)
            .text("# OF ARTWORKS")
            .attr("fill", "#3528fc")
            .attr("fill-opacity", 0)
            .transition()
            .style("fill-opacity", 1)
            .duration(800);

        const legendLabels = g.append("g")
            .attr("transform", `translate(50, ${height*0.85 + 20})`)
            .selectAll("legend")
            .data(array)
            .enter()
            .append("text")
            .attr("x", function(d, i) {
              if (i === 0) {
                return 0
              }
              if (i === 19 ) {
                return 10*(array.length-2);
              }
            })
            .attr("y", 10)
            .text(function(d, i) {
              if (i === 0) {
                return "0"
              }
              if (i === 19) {
                return "40000"
              }
            })
            .attr("fill", "#3528fc")
            .attr("font-sizes", "0.8rem")
            .attr("fill-opacity", 0)
            .transition()
            .style("fill-opacity", 1)
            .duration(800);

  }

  // Helper function to determine whether this country 
  // has data from our src file
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

  // Capitalizes the string 
  function capitalizeWords(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }
}
