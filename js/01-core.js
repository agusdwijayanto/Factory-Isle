// State global mockup. Satu-satunya sumber kebenaran untuk grid dan kamera.
const TILE_W = 64, TILE_H = 32;
const GRID_W = 16, GRID_H = 12;

const S = {
  money: 50,
  cam: { x: 0, y: 0, zoom: 1 },
  hover: null,     // {gx, gy} petak di bawah kursor
  selected: null,  // "gx,gy" mesin yang panelnya terbuka
  placing: null,   // id mesin yang sedang di-preview penempatannya
  floaters: [],    // {gx, gy, text, color, born}
  pulses: new Map(), // "gx,gy" -> born, untuk denyut saat diketuk
  beltT: 0,        // jam animasi conveyor, jalan terus
  time: 0,         // jam global detik
  grid: [],        // [gy][gx] -> {t, obj}
  machines: new Map(),   // "gx,gy" -> {id, dir}
  conveyors: new Map(),  // "gx,gy" -> {dir}
};

const key = (gx, gy) => gx + ',' + gy;
const inGrid = (gx, gy) => gx >= 0 && gy >= 0 && gx < GRID_W && gy < GRID_H;

// Hash deterministik: variasi visual stabil tiap muat ulang, tanpa RNG.
function hash2(gx, gy) {
  let h = (gx * 374761393 + gy * 668265263) | 0;
  h = Math.imul(h ^ (h >> 13), 1274126177);
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function newGrid() {
  S.grid = [];
  for (let gy = 0; gy < GRID_H; gy++) {
    const row = [];
    for (let gx = 0; gx < GRID_W; gx++) row.push({ t: 'grass', obj: null });
    S.grid.push(row);
  }
}

function tileAt(gx, gy) { return inGrid(gx, gy) ? S.grid[gy][gx] : null; }
