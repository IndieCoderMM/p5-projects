const WIDTH = 500;
const DIM = 25;
const TOTALTILES = [...Object.keys(CURRENT_MAP)].length;
const TILEWIDTH = WIDTH / DIM;

const tiles = [];
const tileImages = [];
let running = false;
let startX;
let startY;
let waveFunc;
let builder;

function preload() {
  const path = 'assets/topdown-map';
  for (let i = 0; i < TOTALTILES; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function setup() {
  createCanvas(WIDTH, WIDTH);
  for (let i = 0; i < TOTALTILES; i++) {
    tiles[i] = new Tile(tileImages[i], CURRENT_MAP[i]);
  }
  for (let i = 0; i < TOTALTILES; i++) {
    const tile = tiles[i];
    tile.makeNeighbors(tiles);
  }

  builder = new Builder(TILEWIDTH, 240);
  waveFunc = new WaveFunc(tiles, DIM);
}

function draw() {
  background(0);
  startX = Math.floor(mouseX / TILEWIDTH);
  startY = Math.floor(mouseY / TILEWIDTH);
  builder.draw(waveFunc.grid);
  if (!running) {
    stroke(0, 240, 111);
    noFill();
    rect(startX * TILEWIDTH, startY * TILEWIDTH, TILEWIDTH, TILEWIDTH);
    noStroke();
    return;
  }
  const selected = waveFunc.selectNextCell();
  if (!selected) {
    running = false;
    return;
  }
  waveFunc.collapse(selected);
  waveFunc.propagate(selected);
}

function mousePressed() {
  if (running) return;
  running = true;
  waveFunc = new WaveFunc(tiles, DIM);

  waveFunc.cellAt(startX, startY).options = [random(Object.keys(CURRENT_MAP))];
}
