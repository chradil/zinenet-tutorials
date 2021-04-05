sigma.classes.graph.addMethod("neighbors", function(nodeId) {
  let k,
    neighbors = {},
    index = this.allNeighborsIndex[nodeId] || {};

  for (k in index) neighbors[k] = this.nodesIndex[k];

  return neighbors;
});

let s = new sigma(
{
container: "graph-container",
    type: "canvas"
}
)

sigma.parsers.json("data.json", s, function() {
  s.refresh();
  
});

s.addRenderer({
  type: "canvas",
  container: "graph-container",
  camera: s.cameras[0],
  settings: {
    drawNodes: false,
    drawEdges: false,
    labelThreshold: 5
  }
});


let lowerCanvas = s.renderers[0].contexts.labels;

s.renderers[0].bind("render", function() {
  drawGenres();

});



function drawGenres() {

  s.graph.nodes().forEach(function(point) {
    if (point.attributes.type == "Genre") {
      getNeighborGroup(point);

      if (neighborListArray.length > 2) {
        let neighborHull = convexhull.makeHull(neighborListArray); 
        console.log(neighborHull);

        lowerCanvas.beginPath();
        lowerCanvas.moveTo(neighborHull[0]["cam0:x"], neighborHull[0]["cam0:y"]);

        for (i = 1; i < neighborHull.length; i++) {
          lowerCanvas.lineTo(neighborHull[i]["cam0:x"], neighborHull[i]["cam0:y"]);
        }

        lowerCanvas.closePath();
        lowerCanvas.lineWidth = 5;
        lowerCanvas.globalAlpha = 0.25;
        lowerCanvas.strokeStyle = neighborListArray[2].color;
        lowerCanvas.stroke();
        lowerCanvas.globalAlpha = 0.15;
        lowerCanvas.fillStyle = neighborListArray[2].color;
        lowerCanvas.fill();
        lowerCanvas.globalAlpha = 1;

      }
    }
  });
}

function getNeighborGroup(genre) {
  neighborList = s.graph.neighbors(genre.id);
  neighborListArray = Object.values(neighborList);
}
