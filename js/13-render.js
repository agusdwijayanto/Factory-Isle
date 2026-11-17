'use strict';
// ---------- Render: langit, petak, pohon, avatar, efek ----------
// Grafik prosedural: tiap petak digambar dari bentuk dasar + detail hash,
// tanpa aset gambar. Animasi minimal 2-frame, sesuai kritik riset bahwa
// rasa Growtopia datang dari respons + partikel + suara, bukan animasi halus.
const TILE_COLORS = {
  1: '#8a5a2b', 2: '#8d8d8d', 3: '#a06a35', 4: '#5da244', 5: '#a8442e',
  6: '#e8e0d0', 7: '#ff6b35', 8: '#3a2a1a', 9: '#f1c40f', 10: '#7a3b2a',
  11: '#ffd75e', 12: '#c0392b', 13: '#222222', 14: '#9c6b30', 15: '#a8d8ea',
  16: '#c0392b', 17: '#7f8c8d', 18: '#8a5a2b', 19: '#e67e22', 20: '#e67e22',
  21: '#e67e22', 22: '#e67e22',
};
const GEM_COLORS = { 1: '#ffe015', 5: '#3498db', 10: '#e74c3c', 50: '#27ae60', 100: '#9b59b6' };
const FRUIT_COLORS = { pepper: '#e74c3c', golden: '#f1c40f', chandelier: '#ffd75e', fireplace: '#ff6b35', brick: '#a8442e', door: '#e8e0d0', lava: '#ff6b35', glass: '#a8d8ea', sign: '#9c6b30' };
function render() {
  const w = S.world;
  ctx.save();
  ctx.scale(S.zoom, S.zoom);
  ctx.translate(-S.cam.x, -S.cam.y);
  drawSky();
  const x0 = Math.max(0, Math.floor(S.cam.x / TILE) - 1), x1 = Math.min(MW - 1, Math.ceil((S.cam.x + VW / S.zoom) / TILE) + 1);
  const y0 = Math.max(0, Math.floor(S.cam.y / TILE) - 1), y1 = Math.min(MH - 1, Math.ceil((S.cam.y + VH / S.zoom) / TILE) + 1);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
    const bg = w.bg[ty][tx];
    if (bg !== T_EMPTY) drawTile(tx, ty, bg, true);
    const fg = w.fg[ty][tx];
    if (fg !== T_EMPTY) drawTile(tx, ty, fg, false);
    const paint = w.paint[key(tx, ty)];
    if (paint && (fg !== T_EMPTY || bg !== T_EMPTY)) {
      ctx.globalAlpha = 0.35; ctx.fillStyle = paint;
      ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE); ctx.globalAlpha = 1;
    }
  }
  drawTrees(x0, x1, y0, y1);
  drawCracks();
  drawLocks();
  drawDrops();
  drawTrader();
  drawPlayer();
  drawPunchFx();
  drawParts();
  drawFloats();
  drawWeatherFx();
  ctx.restore();
}
function drawSky() {
  const vw = VW / S.zoom, vh = VH / S.zoom;
  let sky = '#79b5e8';
  if (S.world.weather === 'malam') sky = '#1a2340';
  else if (S.world.weather === 'hujan') sky = '#6b7f8f';
  else if (S.world.weather === 'salju') sky = '#cfdde8';
  ctx.fillStyle = sky;
  ctx.fillRect(S.cam.x, S.cam.y, vw, vh);
  // Matahari/bulan + awan. Bukit jauh tidak digambar: pita di garis permukaan
  // akan mengambang di lubang galian pemain.
  ctx.fillStyle = S.world.weather === 'malam' ? '#f4f1de' : '#ffd75e';
  ctx.beginPath(); ctx.arc(S.cam.x + vw - 80, S.cam.y + 60, 26, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  for (let i = 0; i < 6; i++) {
    const cx = ((i * 397 + S.rtime * 6) % (MW * TILE)) - 60;
    const cy = 30 + (i % 3) * 44;
    if (cx > S.cam.x - 120 && cx < S.cam.x + vw + 120) {
      ctx.fillRect(cx, cy, 70, 16); ctx.fillRect(cx + 14, cy - 10, 40, 12);
    }
  }
}
function drawTile(tx, ty, code, isBg) {
  const x = tx * TILE, y = ty * TILE, h = hash2(tx, ty);
  ctx.fillStyle = TILE_COLORS[code] || '#888';
  if (code === T_GLASS) { ctx.globalAlpha = 0.55; ctx.fillRect(x, y, TILE, TILE); ctx.globalAlpha = 1; }
  else ctx.fillRect(x, y, TILE, TILE);
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  if (code === T_DIRT || code === T_ROCK) {
    ctx.fillRect(x + (h % 12), y + ((h >> 3) % 12), 5, 4);
    ctx.fillRect(x + 18 - (h % 8), y + 16 + ((h >> 5) % 8), 4, 4);
  }
  if (code === T_WOOD) { ctx.fillRect(x, y + 10, TILE, 2); ctx.fillRect(x, y + 21, TILE, 2); }
  if (code === T_GRASS) { ctx.fillStyle = '#7ed957'; ctx.fillRect(x, y, TILE, 8); }
  if (code === T_BRICK) { ctx.fillRect(x, y + 10, TILE, 2); ctx.fillRect(x + 15, y, 2, 10); ctx.fillRect(x + 7, y + 12, 2, 10); ctx.fillRect(x + 23, y + 12, 2, 10); }
  if (code === T_DOOR) {
    ctx.fillStyle = '#8a5a2b'; ctx.fillRect(x + 4, y + 2, TILE - 8, TILE - 2);
    ctx.fillStyle = '#e8e0d0'; ctx.fillRect(x + 8, y + 6, TILE - 16, TILE - 8);
    ctx.fillStyle = '#f1c40f'; ctx.fillRect(x + 21, y + 18, 4, 4);
  }
  if (code === T_LAVA) {
    const f = Math.floor(S.rtime * 2) % 2;
    ctx.fillStyle = f ? '#ff8c42' : '#e74c3c'; ctx.fillRect(x, y + 6, TILE, TILE - 6);
    ctx.fillStyle = '#ffd75e'; ctx.fillRect(x + 6 + f * 4, y + 12, 8, 4); ctx.fillRect(x + 18 - f * 4, y + 20, 8, 4);
  }
  if (code === T_CAVE && !isBg) { ctx.fillStyle = '#2a1e12'; ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12); }
  if (code === T_GOLDEN) { ctx.fillStyle = '#fff3a0'; ctx.fillRect(x + 5, y + 5, 8, 8); ctx.fillRect(x + 19, y + 19, 8, 8); }
  if (code === T_FIREPLACE) {
    ctx.fillStyle = '#222'; ctx.fillRect(x + 8, y + 14, TILE - 16, TILE - 14);
    ctx.fillStyle = '#ff6b35'; ctx.fillRect(x + 12, y + 18, 8, 10); ctx.fillStyle = '#ffd75e'; ctx.fillRect(x + 14, y + 21, 4, 7);
  }
  if (code === T_CHANDELIER) {
    ctx.fillStyle = '#8a6d1a'; ctx.fillRect(x + 14, y, 4, 8);
    ctx.fillStyle = '#ffd75e'; ctx.fillRect(x + 4, y + 8, TILE - 8, 6);
    ctx.fillStyle = '#fff3a0'; ctx.fillRect(x + 7, y + 2, 3, 6); ctx.fillRect(x + 15, y + 2, 3, 6); ctx.fillRect(x + 23, y + 2, 3, 6);
  }
  if (code === T_PEPPER) { ctx.fillStyle = '#27ae60'; ctx.fillRect(x + 4, y + 4, TILE - 8, 6); ctx.fillStyle = '#e74c3c'; ctx.fillRect(x + 8, y + 12, 6, 12); ctx.fillRect(x + 18, y + 12, 6, 12); }
  if (code === T_BEDROCK) { ctx.fillStyle = '#111'; ctx.fillRect(x + 4, y + 4, 8, 8); ctx.fillRect(x + 18, y + 18, 8, 8); }
  if (code === T_SIGN) {
    ctx.fillStyle = '#6b4a22'; ctx.fillRect(x + 13, y + 18, 6, 14);
    ctx.fillStyle = '#e8d5a8'; ctx.fillRect(x + 3, y + 4, TILE - 6, 16);
    ctx.fillStyle = '#333'; ctx.fillRect(x + 7, y + 9, TILE - 14, 2); ctx.fillRect(x + 7, y + 14, TILE - 18, 2);
  }
  if (code === T_VENDING) {
    ctx.fillStyle = '#eee'; ctx.fillRect(x + 5, y + 5, TILE - 10, 12);
    ctx.fillStyle = '#333'; ctx.fillRect(x + 5, y + 20, TILE - 10, 8);
  }
  if (code === T_WEATHER) {
    ctx.fillStyle = '#bdc3c7'; ctx.fillRect(x + 6, y + 6, TILE - 12, TILE - 12);
    ctx.fillStyle = '#2980b9'; ctx.fillRect(x + 10, y + 10, TILE - 20, 8);
  }
  if (code === T_CHEST) { ctx.fillStyle = '#f1c40f'; ctx.fillRect(x + 13, y + 12, 6, 6); ctx.fillStyle = '#5d3a17'; ctx.fillRect(x, y, TILE, 8); }
  if (code >= T_LOCK_S && code <= T_LOCK_W) {
    ctx.fillStyle = '#ffd75e'; ctx.fillRect(x + 10, y + 12, 12, 12);
    ctx.fillStyle = '#333'; ctx.fillRect(x + 14, y + 16, 4, 4);
  }
}
function drawTrees(x0, x1, y0, y1) {
  const p = playerTile();
  for (const k in S.world.trees) {
    const parts = k.split(',');
    const tx = +parts[0], ty = +parts[1];
    if (tx < x0 || tx > x1 || ty < y0 || ty > y1) continue;
    const tr = S.world.trees[k], st = treeStage(tr);
    const x = tx * TILE, y = ty * TILE;
    ctx.fillStyle = '#7a4a22';
    if (st === 0) {
      ctx.fillStyle = '#27ae60'; ctx.fillRect(x + 13, y + 20, 6, 12); ctx.fillRect(x + 8, y + 16, 6, 6); ctx.fillRect(x + 18, y + 16, 6, 6);
    } else {
      const hgt = st === 1 ? 14 : st === 2 ? 22 : 30;
      ctx.fillRect(x + 14, y + TILE - hgt, 4, hgt);
      ctx.fillStyle = '#27ae60';
      const r = st === 1 ? 8 : st === 2 ? 12 : 15;
      ctx.fillRect(x + 16 - r, y + TILE - hgt - r + 4, r * 2, r);
      ctx.fillRect(x + 16 - r + 4, y + TILE - hgt - r, r * 2 - 8, 6);
      if (st === 3) {
        ctx.fillStyle = FRUIT_COLORS[tr.item] || '#e74c3c';
        ctx.fillRect(x + 7, y + TILE - hgt - 6, 4, 4); ctx.fillRect(x + 21, y + TILE - hgt - 2, 4, 4); ctx.fillRect(x + 14, y + TILE - hgt - 10, 4, 4);
      }
    }
    if (Math.max(Math.abs(tx - p.tx), Math.abs(ty - p.ty)) <= 4) {
      label(x + 16, y - 6, treeLabel(tr));
    }
  }
}
function label(x, y, txt) {
  ctx.font = '11px Verdana'; ctx.textAlign = 'center';
  ctx.fillStyle = '#000'; ctx.fillText(txt, x + 1, y + 1);
  ctx.fillStyle = '#fff'; ctx.fillText(txt, x, y);
}
function drawCracks() {
  for (const k in S.tileHp) {
    const m = k.match(/^(\d+),(\d+)(fg|bg)$/);
    if (!m) continue;
    const tx = +m[1], ty = +m[2];
    const code = m[3] === 'fg' ? fgAt(tx, ty) : bgAt(tx, ty);
    const def = TILES[code];
    if (!def) continue;
    // Retakan hilang kalau sudah lewat waktu restore: kerusakan sudah pulih,
    // jadi tidak boleh membekas sampai dipukul lagi.
    const last = S.tileHit[k] == null ? -99 : S.tileHit[k];
    if (!S.tileHp[k] || (S.rtime || 0) - last > def.restore) { delete S.tileHp[k]; delete S.tileHit[k]; continue; }
    const f = S.tileHp[k] / def.hits;
    ctx.strokeStyle = 'rgba(0,0,0,0.7)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tx * TILE + 6, ty * TILE + 6); ctx.lineTo(tx * TILE + 16, ty * TILE + 14);
    if (f > 0.4) { ctx.moveTo(tx * TILE + 26, ty * TILE + 8); ctx.lineTo(tx * TILE + 18, ty * TILE + 18); }
    if (f > 0.7) { ctx.moveTo(tx * TILE + 8, ty * TILE + 26); ctx.lineTo(tx * TILE + 16, ty * TILE + 18); }
    ctx.stroke();
  }
}
function drawLocks() {
  for (const lk of S.world.locks) {
    const a = lockArea(lk);
    ctx.strokeStyle = '#ffd75e'; ctx.lineWidth = 2;
    ctx.strokeRect(a.x0 * TILE + 1, a.y0 * TILE + 1, (a.x1 - a.x0 + 1) * TILE - 2, (a.y1 - a.y0 + 1) * TILE - 2);
  }
}
function drawDrops() {
  const bob = Math.sin(S.rtime * 3) * 2;
  for (const d of S.drops) {
    ctx.fillStyle = TILE_COLORS[ITEMS[d.id].tile] || '#ccc';
    ctx.fillRect(d.x - 7, d.y - 7 + bob, 14, 14);
    ctx.fillStyle = '#000'; ctx.fillRect(d.x - 7, d.y - 7 + bob, 14, 2);
  }
  for (const g of S.gemDrops) {
    const s = g.value >= 100 ? 9 : g.value >= 50 ? 8 : g.value >= 10 ? 7 : g.value >= 5 ? 6 : 5;
    ctx.fillStyle = GEM_COLORS[g.value];
    ctx.beginPath();
    ctx.moveTo(g.x, g.y - s + bob); ctx.lineTo(g.x + s, g.y + bob); ctx.lineTo(g.x, g.y + s + bob); ctx.lineTo(g.x - s, g.y + bob);
    ctx.closePath(); ctx.fill();
  }
}
// Posisi x glif kunci di samping nama: tepi kanan nama + 9px. Lebar nama
// ditaksir 7px per huruf (font 11px), sama untuk gambar dan zona klik.
function wrenchIconX(x, name) { return x + name.length * 3.5 + 9; }
function drawWrenchGlyph(x, y) {
  ctx.font = '13px Verdana'; ctx.textAlign = 'center';
  ctx.fillText('🔧', x, y);
}
function drawAvatar(x, y, face, walk, shirt, name, color) {
  const bob = Math.abs(Math.sin(walk)) * 2;
  const px = x - 10, py = y - 14 + bob * 0.3;
  ctx.fillStyle = '#f1c27d'; ctx.fillRect(px + 3, py, 14, 12); // kepala
  ctx.fillStyle = '#4a3222'; ctx.fillRect(px + 3, py, 14, 4); // rambut
  ctx.fillStyle = '#222'; ctx.fillRect(px + (face > 0 ? 12 : 6), py + 6, 3, 3); // mata
  ctx.fillStyle = shirt; ctx.fillRect(px + 2, py + 12, 16, 8); // badan
  ctx.fillStyle = '#2c4a8a'; ctx.fillRect(px + 3, py + 20, 6, 8); ctx.fillRect(px + 11, py + 20, 6, 8); // celana
  if (name) {
    label(x, py - 6, name);
    if (S.mode === 'wrench') drawWrenchGlyph(wrenchIconX(x, name), py - 6);
  }
}
function drawTrader() {
  const npc = S.npc;
  if (!npc) return;
  const x = npc.tx * TILE + 16, y = npc.ty * TILE + 16;
  drawAvatar(x, y, npc.dir, S.rtime * 2, '#c0392b', npc.name, '#fff');
}
function drawPlayer() {
  drawAvatar(S.px, S.py, S.face, S.walk, '#e8b98a', null);
  ctx.font = '11px Verdana'; ctx.textAlign = 'center';
  ctx.fillStyle = '#000'; ctx.fillText('Pemain', S.px + 1, S.py - 19);
  ctx.fillStyle = nameColor(); ctx.fillText('Pemain', S.px, S.py - 20);
  if (S.mode === 'wrench') drawWrenchGlyph(wrenchIconX(S.px, 'Pemain'), S.py - 20);
  if (S.fireT > 0) {
    ctx.fillStyle = 'rgba(255,107,53,0.7)';
    ctx.fillRect(S.px - 10, S.py - 16, 20, 6);
  }
  if (S.bubble) {
    ctx.font = '12px Verdana';
    const w = Math.min(220, S.bubble.text.length * 7 + 14);
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.fillRect(S.px - w / 2, S.py - 52, w, 22);
    ctx.fillStyle = '#000'; ctx.fillText(S.bubble.text.slice(0, 32), S.px, S.py - 37);
  }
}
function drawPunchFx() {
  if (!S.punchFx) return;
  const x = S.punchFx.tx * TILE + 16, y = S.punchFx.ty * TILE + 16;
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x - 10, y - 10); ctx.lineTo(x + 10, y + 10);
  ctx.moveTo(x + 10, y - 10); ctx.lineTo(x - 10, y + 10);
  ctx.stroke();
}
function drawParts() {
  for (const p of S.parts) {
    ctx.globalAlpha = clamp(p.life * 2, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
  }
  ctx.globalAlpha = 1;
}
function drawFloats() {
  ctx.font = 'bold 12px Verdana'; ctx.textAlign = 'center';
  for (const f of S.floats) {
    ctx.globalAlpha = clamp(f.life, 0, 1);
    ctx.fillStyle = '#000'; ctx.fillText(f.txt, f.x + 1, f.y + 1);
    ctx.fillStyle = f.color; ctx.fillText(f.txt, f.x, f.y);
  }
  ctx.globalAlpha = 1;
}
function drawWeatherFx() {
  if (S.world.weather === 'malam') {
    ctx.fillStyle = 'rgba(10,10,40,0.25)';
    ctx.fillRect(S.cam.x, S.cam.y, VW / S.zoom, VH / S.zoom);
  }
  if (S.world.weather === 'hujan') {
    ctx.strokeStyle = 'rgba(180,200,220,0.7)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 40; i++) {
      const x = S.cam.x + ((i * 173 + S.rtime * 40) % (VW / S.zoom));
      const y = S.cam.y + ((i * 97 + S.rtime * 300) % (VH / S.zoom));
      ctx.moveTo(x, y); ctx.lineTo(x - 4, y + 12);
    }
    ctx.stroke();
  }
  if (S.world.weather === 'salju') {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    for (let i = 0; i < 40; i++) {
      const x = S.cam.x + ((i * 211 + S.rtime * 20) % (VW / S.zoom));
      const y = S.cam.y + ((i * 131 + S.rtime * 40) % (VH / S.zoom));
      ctx.fillRect(x, y, 3, 3);
    }
  }
}
