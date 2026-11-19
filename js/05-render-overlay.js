// Overlay dinamis: cahaya, asap, alir belt, panah arah, karakter,
// bar progres. Pecahan 05-render.js (v16).
// ---------- Overlay dinamis ----------
const GLOWS = { oven: [0, -4, 52, 0.55], smelter: [0, -6, 60, 0.6], blacksmith: [10, -8, 40, 0.5], lantern: [0, -29, 46, 0.5] };
const BELT_AXIS = [[1, 0.5], [-1, 0.5], [-1, -0.5], [1, -0.5]]; // arah grid 0..3

function diamondPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2); ctx.lineTo(x - w / 2, y);
  ctx.closePath();
}
function glow(x, y, r, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(255,150,60,0.55)');
  g.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.globalAlpha = 1;
}

function paintBeltFlow(x, y, z, dir) {
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  ctx.save();
  diamondPath(x, y, TILE_W * 0.72 * z, TILE_H * 0.72 * z); ctx.clip();
  ctx.fillStyle = '#e8b64c';
  const spacing = 16 * z, off = (S.beltT * 18 * z) % spacing;
  for (let k = -2; k <= 2; k++) {
    const cx = x + ux * (k * spacing + off), cy = y + uy * (k * spacing + off);
    ctx.beginPath();
    ctx.moveTo(cx + ux * 5 * z, cy + uy * 5 * z);
    ctx.lineTo(cx - uy * 5 * z, cy + ux * 5 * z);
    ctx.lineTo(cx + uy * 5 * z, cy - ux * 5 * z);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function paintDirArrow(x, y, z, dir) {
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  const ex = x + ux * 26 * z, ey = y + uy * 26 * z;
  ctx.fillStyle = 'rgba(255,215,94,0.85)';
  ctx.beginPath();
  ctx.moveTo(ex + ux * 5 * z, ey + uy * 5 * z);
  ctx.lineTo(ex - uy * 4 * z, ey + ux * 4 * z);
  ctx.lineTo(ex + uy * 4 * z, ey - ux * 4 * z);
  ctx.closePath(); ctx.fill();
}

function paintPlayer() {
  const p = S.player, z = S.cam.zoom;
  const { x, y } = isoPoint(p.fx, p.fy, S.cam);
  const bob = p.path.length ? Math.abs(Math.sin(p.walkT * 10)) * 2 * z : 0;
  const gy = y + 6 * z - bob;
  Atlas.draw(ctx, 'player', x, gy, z, p.frame, p.dir);
  // Perkakas di tangan kanan, berayun saat bekerja.
  const tool = TOOLS[p.tool].sprite;
  const sw = p.swing > 0 ? Math.sin(p.swing * 9) * 0.7 : 0;
  ctx.save();
  ctx.translate(x + 9 * z, gy - 30 * z);
  ctx.rotate(-0.5 + sw);
  Atlas.draw(ctx, tool, 0, 10 * z, z * 0.8);
  ctx.restore();
  // Bawaan dipanggul di bahu kiri.
  if (carriedTotal() > 0) Atlas.draw(ctx, 'crate', x - 11 * z, gy - 34 * z, z * 0.55);
}

function paintMiniBar(x, y, z, frac) {
  const w = 34 * z, h = 5 * z;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x - w / 2, y, w, h);
  ctx.fillStyle = '#5eff8a';
  ctx.fillRect(x - w / 2, y, w * Math.min(1, Math.max(0, frac)), h);
}

// Penggaris koordinat x/z: angka di luar belah ketupat map, di margin
// gelap — x di sisi kiri (naik ke atas), z di sisi bawah (ke kanan).
// Ikut zoom dan ukuran map aktif; petak yang di luar layar dilewati.
function paintRuler() {
  const z = S.cam.zoom;
  ctx.font = '700 ' + Math.max(10, Math.round(11 * z)) + 'px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.fillStyle = '#9aa3ad';
  const off = 10 * z;
  for (let gy = 0; gy < GRID_H; gy++) {
    const { x, y } = tileCenter(0, gy, S.cam);
    const lx = x - (TILE_W / 2) * z - off, ly = y;
    if (lx < -20 || lx > VW + 20 || ly < -20 || ly > VH + 20) continue;
    const s = String(GRID_H - gy);
    ctx.strokeText(s, lx, ly); ctx.fillText(s, lx, ly);
  }
  for (let gx = 0; gx < GRID_W; gx++) {
    const { x, y } = tileCenter(gx, GRID_H - 1, S.cam);
    const lx = x, ly = y + (TILE_H / 2) * z + off;
    if (lx < -20 || lx > VW + 20 || ly < -20 || ly > VH + 20) continue;
    const s = String(gx + 1);
    ctx.strokeText(s, lx, ly); ctx.fillText(s, lx, ly);
  }
}
