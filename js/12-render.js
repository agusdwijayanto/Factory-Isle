'use strict';
// ---------- Gambar: semua prosedural, tanpa aset luar ----------
function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }
function circle(x, y, r, c) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function drawTile(tx, ty, code) {
  const x = tx * TILE, y = ty * TILE;
  let ox = 0;
  const hit = S.tileHit[key(tx, ty)];
  if (hit !== undefined && S.rtime - hit < 0.35) ox = Math.sin(S.rtime * 40) * 2;
  const X = x + ox;
  if (code === T_DIRT) {
    rect(X, y, TILE, TILE, '#8a5a33');
    rect(X + 6, y + 8, 5, 5, '#754a28'); rect(X + 20, y + 20, 6, 5, '#754a28');
    if (tileAt(tx, ty - 1) === T_EMPTY) rect(X, y, TILE, 8, '#5cb84d');
  } else if (code === T_STONE) {
    rect(X, y, TILE, TILE, '#8d8d98');
    rect(X + 5, y + 6, 8, 6, '#767682'); rect(X + 18, y + 19, 9, 7, '#767682');
  } else if (code === T_WOOD) {
    rect(X + 8, y, 16, TILE, '#7a5230');
    rect(X + 12, y, 3, TILE, '#5d3d22');
    if (tileAt(tx, ty - 1) === T_EMPTY) { circle(X + 16, y - 2, 18, '#3e8e41'); circle(X + 4, y + 4, 10, '#4da34f'); circle(X + 28, y + 4, 10, '#4da34f'); }
  } else if (code === T_FENCE) {
    rect(X + 4, y + 10, 5, 22, '#a9804e'); rect(X + 23, y + 10, 5, 22, '#a9804e'); rect(X + 2, y + 14, 28, 5, '#c9a06a');
  } else if (code === T_TORCH) {
    rect(X + 14, y + 12, 4, 20, '#7a5230'); circle(X + 16, y + 9, 6, '#ff9d2e'); circle(X + 16, y + 9, 3, '#ffe27a');
  } else if (code === T_BRICK) {
    rect(X, y, TILE, TILE, '#a44a3a');
    rect(X, y + 10, TILE, 2, '#7e352a'); rect(X, y + 21, TILE, 2, '#7e352a'); rect(X + 15, y, 2, 10, '#7e352a'); rect(X + 7, y + 12, 2, 9, '#7e352a');
  } else if (code === T_PLANKS) {
    rect(X, y, TILE, TILE, '#c9a06a');
    rect(X, y + 10, TILE, 2, '#a9804e'); rect(X, y + 21, TILE, 2, '#a9804e');
  } else if (code === T_WORKBENCH) {
    rect(X + 2, y + 14, 28, 6, '#a9804e'); rect(X + 4, y + 20, 4, 12, '#7a5230'); rect(X + 24, y + 20, 4, 12, '#7a5230');
    rect(X + 8, y + 8, 10, 6, '#d8d8d8');
  } else if (code === T_FURNACE) {
    rect(X + 3, y + 4, 26, 28, '#5a5a66'); rect(X + 9, y + 16, 14, 10, '#ff7a2e'); rect(X + 12, y + 18, 8, 6, '#ffe27a');
  } else if (code === T_SPLICE) {
    rect(X + 3, y + 4, 26, 28, '#6a4a9e'); circle(X + 11, y + 12, 4, '#c9a7ff'); circle(X + 21, y + 20, 4, '#c9a7ff'); circle(X + 11, y + 24, 3, '#fff');
  } else if (code === T_SHIPBIN) {
    rect(X + 3, y + 10, 26, 22, '#a9804e'); rect(X + 1, y + 6, 30, 6, '#c9a06a'); rect(X + 13, y + 16, 6, 8, '#7a5230');
  } else if (code === T_CHEST) {
    rect(X + 4, y + 12, 24, 18, '#8a5a33'); rect(X + 4, y + 8, 24, 7, '#a9804e'); rect(X + 14, y + 16, 4, 6, '#ffd94d');
  } else if (code === T_LANTERN) {
    rect(X + 14, y + 2, 4, 8, '#7a5230'); circle(X + 16, y + 18, 9, '#ffe27a'); circle(X + 16, y + 18, 5, '#fff6c9');
  }
}
function drawPlant(p) {
  const def = PLANTS[p.seed];
  const x = p.tx * TILE + 16, yb = (p.ty + 1) * TILE;
  const r = Math.min(1, p.growth / def.grow);
  const hgt = 6 + r * (def.tree ? 26 : 14);
  rect(x - 1, yb - hgt, 2, hgt, '#3e8e41');
  if (def.tree) {
    circle(x, yb - hgt - 6, 6 + r * 8, r >= 1 ? '#2f7a33' : '#57a85a');
    if (r >= 1 && def.yield !== 'wood') { circle(x - 6, yb - hgt - 4, 3, '#e74c3c'); circle(x + 6, yb - hgt - 8, 3, '#e74c3c'); }
  } else if (r >= 1) {
    const col = plantColor(p) ? FLOWER_COLORS[plantColor(p)] : (def.yield === 'wheat' ? '#e8c85a' : def.yield === 'pumpkin' ? '#e67e22' : def.yield === 'melon' ? '#2ecc71' : def.yield === 'grape' ? '#9b59b6' : def.yield === 'strawberry' ? '#e74c3c' : def.yield === 'gold-fruit' ? '#ffd94d' : '#fd79a8');
    if (plantColor(p) || def.yield === 'flower-sun' || def.yield === 'flower-rainbow') {
      circle(x, yb - hgt - 3, 6, col); circle(x, yb - hgt - 3, 2.5, '#fff');
    } else {
      circle(x - 4, yb - 6, 4, col); circle(x + 4, yb - 8, 4, col);
    }
  } else {
    circle(x - 3, yb - hgt + 2, 3, '#57a85a'); circle(x + 3, yb - hgt, 3, '#57a85a');
  }
  if (!p.watered && r < 1) { ctx.fillStyle = '#6db9ff'; ctx.font = '11px system-ui'; ctx.textAlign = 'center'; ctx.fillText('~', x, yb - hgt - 8); }
}
function drawNPC(n) {
  const x = n.tx * TILE + 16, yb = (n.ty + 1) * TILE;
  rect(x - 9, yb - 22, 18, 22, n.id === 'merchant' ? '#4a7ab8' : '#b87a4a');
  circle(x, yb - 28, 8, '#f2c89b');
  rect(x - 8, yb - 36, 16, 4, n.id === 'merchant' ? '#2e5a8a' : '#7a5230');
  ctx.fillStyle = '#fff'; ctx.font = 'bold 11px system-ui'; ctx.textAlign = 'center';
  ctx.fillText(n.name, x, yb - 40);
}
function drawPlayer() {
  const x = S.px, yb = S.py + PH / 2;
  const bob = S.onGround && Math.abs(S.vx) > 0 ? Math.sin(S.walk) * 1.5 : 0;
  rect(x - 8, yb - 20 + bob, 16, 20, '#3b6fd4');
  circle(x, yb - 26 + bob, 8, '#f2c89b');
  rect(x - 9, yb - 35 + bob, 18, 5, '#e74c3c');
  circle(x + S.face * 3, yb - 27 + bob, 1.6, '#222');
}
function render() {
  const night = S.phase === 'night';
  const grad = ctx.createLinearGradient(0, 0, 0, VH);
  if (night) { grad.addColorStop(0, '#141c36'); grad.addColorStop(1, '#2a3550'); }
  else { grad.addColorStop(0, '#87ceeb'); grad.addColorStop(1, '#cfefff'); }
  ctx.fillStyle = grad; ctx.fillRect(0, 0, VW, VH);
  if (night) circle(VW - 90, 70, 26, '#f4f1d8');
  else circle(VW - 90, 70, 30, '#ffd94d');
  ctx.save();
  const shx = S.shake > 0 ? (Math.random() - 0.5) * S.shake * 14 : 0;
  const shy = S.shake > 0 ? (Math.random() - 0.5) * S.shake * 14 : 0;
  ctx.translate(-Math.round(S.cam.x) + shx, -Math.round(S.cam.y) + shy);
  const x0 = Math.max(0, Math.floor(S.cam.x / TILE)), x1 = Math.min(S.mw - 1, Math.ceil((S.cam.x + VW) / TILE));
  const y0 = Math.max(0, Math.floor(S.cam.y / TILE)), y1 = Math.min(MH - 1, Math.ceil((S.cam.y + VH) / TILE));
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
    const c = S.tiles[ty][tx];
    if (c !== T_EMPTY) drawTile(tx, ty, c);
  }
  for (const p of S.plants) drawPlant(p);
  for (const n of S.npcs) drawNPC(n);
  drawPlayer();
  for (const pt of S.parts) { ctx.globalAlpha = clamp(pt.life * 2, 0, 1); rect(pt.x - 2, pt.y - 2, 4, 4, pt.color); }
  ctx.globalAlpha = 1;
  ctx.font = 'bold 13px system-ui'; ctx.textAlign = 'center';
  for (const f of S.floats) { ctx.globalAlpha = clamp(f.life, 0, 1); ctx.fillStyle = f.color; ctx.fillText(f.txt, f.x, f.y); }
  ctx.globalAlpha = 1;
  if (S.place && S.ghost) {
    const g = S.ghost;
    const ok = g.tx >= 0 && g.tx < S.mw && g.ty >= 0 && g.ty < MH && tileAt(g.tx, g.ty) === T_EMPTY && !plantAt(g.tx, g.ty) && inReach(g.tx, g.ty, 2);
    ctx.globalAlpha = 0.45;
    rect(g.tx * TILE, g.ty * TILE, TILE, TILE, ok ? '#5cb84d' : '#e74c3c');
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  if (night) { ctx.fillStyle = 'rgba(10,10,50,0.28)'; ctx.fillRect(0, 0, VW, VH); }
}
canvas.addEventListener('mousemove', e => { const t = canvasTile(e); S.ghost = { tx: t.tx, ty: t.ty }; });
