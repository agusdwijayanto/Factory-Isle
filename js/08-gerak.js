// Rintangan dan pathfinding BFS 4 arah. Karakter memutar rintangan,
// tidak pernah menerobos.
const DIRS = [
  { dx: 1, dy: 0 },  // 0: layar kanan-bawah
  { dx: 0, dy: 1 },  // 1: layar kiri-bawah
  { dx: -1, dy: 0 }, // 2: layar kiri-atas
  { dx: 0, dy: -1 }, // 3: layar kanan-atas
];

function blockedForWalk(gx, gy) {
  if (!inGrid(gx, gy)) return true;
  const k = key(gx, gy);
  // Bangunan hanya ada di plot; di kota koordinat yang sama adalah rumput.
  if (S.map === 'plot' && (S.machines.has(k) || S.storages.has(k) || S.walls.has(k))) return true;
  const t = S.grid[gy][gx];
  // Air menghalangi; jembatan (rumput jembatan) satu-satunya jalan menyeberang.
  if (t.t === 'water') return true;
  if (t.obj === 'mayor' || t.obj === 'station' || t.obj === 'train' || t.obj === 'mountain') return true;
  if (t.obj && t.obj.startsWith('shop')) return true;
  // Pohon/bijih/kapas hidup menghalangi; tunggul (hp 0) dan lentera bisa dilewati.
  if (t.obj && NODES[t.obj] && t.hp > 0) return true;
  return false;
}

// BFS dari (sx,sy) ke (tx,ty). Kalau target terhalang, cari petak jalan
// terdekat yang bersebelahan dengan target. Kembalikan daftar petak tanpa
// petak awal, atau [] kalau tidak ada jalan.
function findPath(sx, sy, tx, ty) {
  sx = Math.floor(sx); sy = Math.floor(sy);
  if (sx === tx && sy === ty) return [];
  const targetBlocked = blockedForWalk(tx, ty);
  const prev = new Map();
  const q = [[sx, sy]];
  prev.set(key(sx, sy), null);
  let found = null;
  while (q.length) {
    const [cx, cy] = q.shift();
    const isGoal = targetBlocked
      ? Math.abs(cx - tx) + Math.abs(cy - ty) === 1
      : (cx === tx && cy === ty);
    if (isGoal) { found = [cx, cy]; break; }
    for (const d of DIRS) {
      const nx = cx + d.dx, ny = cy + d.dy;
      const k = key(nx, ny);
      if (prev.has(k) || blockedForWalk(nx, ny)) continue;
      prev.set(k, [cx, cy]);
      q.push([nx, ny]);
    }
  }
  if (!found) return [];
  const path = [];
  let cur = found;
  while (cur && !(cur[0] === sx && cur[1] === sy)) {
    path.unshift({ gx: cur[0], gy: cur[1] });
    cur = prev.get(key(cur[0], cur[1]));
  }
  return path;
}

function dirToward(fx, fy, tx, ty) {
  const dx = tx - fx, dy = ty - fy;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 0 : 2;
  return dy > 0 ? 1 : 3;
}
