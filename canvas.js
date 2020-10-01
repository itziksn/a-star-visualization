const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const nodeSize = 30;
canvas.width = innerWidth - 5;
canvas.height = innerHeight - 5;
const cols = Math.floor(canvas.height / nodeSize);
const rows = Math.floor(canvas.width / nodeSize);


let nodes = new Array(rows);
for (let i = 0; i < rows; i++) {
  nodes[i] = new Array(cols);
  for (let j = 0; j < cols; j++) {
    nodes[i][j] = new Node(i, j, i * nodeSize, j * nodeSize);
  }
}

nodes.forEach(row => row.forEach(node => {
  node.initNeighbours();
}));

const numOfWalls = cols * rows / 3;
for (let i = 0; i < numOfWalls; i++) {
  let x = Math.floor(Math.random() * rows);
  let y = Math.floor(Math.random() * cols);
  nodes[x][y].wall = true;
}

let start = nodes[0][0];
let end = nodes[Math.floor(Math.random()*rows)][Math.floor(Math.random()*cols)];
const frameRate = 0;
let frame = 0;
let closedSet = [];
let openSet = [];

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    nodes[i][j].fresh();
  }
}

function fresh() {
  openSet.forEach(node => node.fresh());
  closedSet.forEach(node => node.fresh());
}

canvas.addEventListener('mousedown', newStart);
fresh();

function init() {
  closedSet = [];
  openSet = [start];
  end.color = '#FF0000'
  start.wall = false;
  end.wall = false;
  start.gScore = 0;
  start.fScore = fScoreCalc(start, end);
  c.beginPath();
  loop();
}

function newStart(e) {
  fresh();
  const i = Math.floor(e.x / nodeSize);
  const j = Math.floor(e.y / nodeSize);
  if (nodes[i] && nodes[i][j] && !nodes[i][j].wall) {
    nodes[i][j].color = '#FFAAAA';
    nodes[i][j].show();
    start = nodes[i][j];
    canvas.removeEventListener('mousedown', newStart);
    canvas.addEventListener('mousedown', newEnd);
  }
}

function newEnd(e) {
  const i = Math.floor(e.x / nodeSize);
  const j = Math.floor(e.y / nodeSize);
  if (nodes[i] && nodes[i][j] && !nodes[i][j].wall) {
    nodes[i][j].color = '#FFAAAA';
    nodes[i][j].show();
    end = nodes[i][j];
    canvas.removeEventListener('mousedown', newEnd);
    init();
  }
}


function loop() {
  const number = requestAnimationFrame(loop);
  
  if (frame >= frameRate) {
    if (openSet.length > 0) {
      let current = openSet.sort((a, b) => a.fScore - b.fScore)[0];
      current.color = '#0000FF'
      current.show();
      closedSet.forEach(node => node.show());
      pathRecontruct(current);
      if (current.i == end.i && current.j == end.j) {
        cancelAnimationFrame(number);
        canvas.addEventListener('mousedown', newStart);
        return;
      }
      closedSet.push(current);
      openSet.splice(indexOf(openSet, current), 1);
      current.neighbours.forEach(nebr => {
        if((!includes(closedSet, nebr)) && !nebr.wall) {
          if (!includes(openSet, nebr)) {
            nebr.color = '#00FF00'
            nebr.show();
            openSet.push(nebr);
          }
          let dist = 1;
          if (nebr.i != current.i && nebr.j != current.j) dist = 1.41;
          const tempDist = current.gScore + dist;
          if (tempDist < nebr.gScore) {
            nebr.gScore = tempDist;
            nebr.cameFrom = current;
            nebr.fScore = fScoreCalc(nebr, end);
          }
        }
      })
    } else {
      pathRecontruct(end);
      cancelAnimationFrame(number);
      canvas.addEventListener('mousedown', newStart);
    }
  }
  frame++;
  
}
function path(nodeA, nodeB) {
  
  const aCenter = {
    x: nodeA.x + (nodeSize / 2),
    y: nodeA.y + (nodeSize / 2),
  };
  const bCenter = {
    x: nodeB.x + (nodeSize / 2),
    y: nodeB.y + (nodeSize / 2),
  };

  c.moveTo(aCenter.x, aCenter.y);
  c.lineTo(bCenter.x, bCenter.y);
  c.strokeStyle = '#FF0000';
  c.stroke();
}

function pathRecontruct(node) {
  while(node.cameFrom != undefined) {
    path(node, node.cameFrom)
    node = node.cameFrom;
  }
}

function includes(array, element) {
  for (let el of array) {
    if (el.i == element.i && el.j == element.j) return true;
  };
  return false;
}

function indexOf(array, element) {
  for (let i = 0; i < array.length; i++) {
    let el = array[i];
    if (el.i == element.i && el.j == element.j) return i;
  };
  return -1;
}

function fScoreCalc(node, goal) {
  return node.gScore + Math.abs(node.j - goal.j) + Math.abs(node.i - goal.i);
}