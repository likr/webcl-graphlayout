function generate(n, p) {
  var i, j,
    nodes = [],
    links = [];

  for (i = 0; i < n; ++i) {
    nodes.push({
      value: i
    });
  }

  for (i = 0; i < n; ++i) {
    for (j = i + 1; j < n; ++j) {
      if (Math.random() < p) {
        links.push({
          source: i,
          target: j,
          value: 1
        });
      }
    }
  }

  return {
    nodes: nodes,
    links: links
  }
}


var width = 960,
    height = 500;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var graph = generate(1000, 0.005);


var startTime;
var lastTime;
var frame;
force
  .on("start", function() {
    frame = 0;
    lastTime = startTime = new Date();
  })
  .on("end", function() {
    var time = (new Date() - startTime) / 1000;
    d3.select("#fps-value").text(frame / time);
  })
  ;

d3.select("#run-button").on("click", function() {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("circle")
      .attr("class", "node")
      .attr("r", 5)
      .style("fill", function(d) { return color(d.group); })
      .call(force.drag);

  node.append("title")
      .text(function(d) { return d.name; });
  force
    .on("tick", function() {
      frame += 1;
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      var currentTime = new Date();
      var time = (currentTime - lastTime) / 1000;
      d3.select("#fps-value").text(1 / time);
      lastTime = currentTime;
    })
    ;
});
