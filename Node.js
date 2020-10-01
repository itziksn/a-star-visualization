class Node{
  constructor(i, j, x, y) {
    this.i = i;
    this.j = j;
    this.x = x;
    this.y = y;
    this.wall = false;
    this.neighbours = [];
    this.gScore = Infinity;
    this.fScore = Infinity;
    this.cameFrom;
    this.color = '#FFF'
    this.freshColor = this.color;
  }

  show() {
    c.beginPath();
    c.rect(this.x, this.y, nodeSize, nodeSize);
    c.strokeStyle = '#000';
    c.lineWidth = '1px'
    c.stroke();
    if (!this.wall) c.fillStyle = this.color;
    else c.fillStyle = '#000';
    c.fill();
  }
  fresh() {
    this.color = this.freshColor;
    this.cameFrom = undefined;
    this.gScore = Infinity;
    this.fScore = Infinity;
    this.show();
  }
  initNeighbours() {
    for (let i = -1; i <= 1; i++) {
      if (this.i + i < 0 || this.i + i == nodes.length) continue;
      for (let j = -1; j <= 1; j++) {
      if (this.j + j < 0 || this.j + j == nodes[this.i].length || (this.j + j != this.j && this.i + i != this.i)) continue;
        this.neighbours.push(nodes[this.i + i][this.j + j]);
      }
    }
  }

  // calculateScores(cameFrom) {
  //   let gScore = cameFrom.gScore + 1;
  //   if (this.gScore > gScore) {
  //     this.gScore = gScore;
  //     this.cameFrom = cameFrom;
  //   }
  //   this.herustic = Math.abs(this.x - end.x) + Math.abs(this.y - end.y);
  // }

  // visit() {
  //     if (this.herustic > 0) {
  //     this.visited = true;
  //     this.neighbours.filter(neighbour => !neighbour.visited && !neighbour.wall).forEach(neighbour => {
  //       neighbour.calculateScores(this);
  //     });
  //     this.neighbours.sort((a, b) => a.herustic - b.herustic);
  //     path(this, this.neighbours[0])
  //     return this.neighbours[0];
  //   }
  // }
}