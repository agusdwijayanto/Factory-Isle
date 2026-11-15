'use strict';
// ---------- Gambar: semua prosedural, tanpa aset luar ----------
function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function drawGround() {
  const x0 = Math.max(0, Math.floor((S.cam.x - VW / 2) / TILE)), x1 = Math.min(MW - 1, Math.ceil((S.cam.x + VW / 2) / TILE));
  const y0 = Math.max(0, Math.floor((S.cam.y - VH / 2) / TILE)), y1 = Math.min(MH - 1, Math.ceil((S.cam.y + VH / 2) / TILE));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const g = WORLD.ground[y][x], sh = WORLD.shade[y][x], px = x * TILE, py = y * TILE;
    if (g === 'g') {
      ctx.fillStyle = (x + y) % 2 ? '#7cc24f' : '#75b948';
      ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.72) { ctx.fillStyle = '#69a844'; ctx.fillRect(px + 6 + sh * 12, py + 8 + sh * 10, 3, 3); }
    } else if (g === 'd') {
      ctx.fillStyle = '#b08a54'; ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.6) { ctx.fillStyle = '#9c7643'; ctx.fillRect(px + 4 + sh * 14, py + 6 + sh * 12, 4, 3); }
    } else if (g === 's') {
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#754c2b';
      ctx.fillRect(px + 3, py + 8, TILE - 6, 2); ctx.fillRect(px + 3, py + 20, TILE - 6, 2);
    } else if (g === 'r') {
      ctx.fillStyle = '#9c917d'; ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.6) { ctx.fillStyle = '#8a7f6b'; ctx.fillRect(px + 5 + sh * 12, py + 7 + sh * 10, 4, 4); }
    } else if (g === 'w') {
      ctx.fillStyle = '#4aa3df'; ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1;
      const off = Math.sin(S.rtime * 2 + x) * 3;
      ctx.beginPath(); ctx.moveTo(px + 5, py + 12 + off); ctx.lineTo(px + 18, py + 12 + off); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + 14, py + 22 - off); ctx.lineTo(px + 27, py + 22 - off); ctx.stroke();
    }
    const tl = S.tiles[key(x, y)];
    if (tl === 'road') {
      ctx.fillStyle = '#b08a54'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#9c7643'; ctx.fillRect(px + 6, py + 14, 8, 3); ctx.fillRect(px + 18, py + 20, 8, 3);
    } else if (tl === 'farm') {
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#754c2b';
      ctx.fillRect(px + 3, py + 8, TILE - 6, 2); ctx.fillRect(px + 3, py + 20, TILE - 6, 2);
    }
  }
}
function drawCrops() {
  for (const k in S.crops) {
    const p = k.split(',').map(Number), c = S.crops[k];
    const cx = p[0] * TILE + 16, cy = p[1] * TILE + 16;
    ctx.strokeStyle = '#4e8f2f'; ctx.lineWidth = 2;
    if (c.t < 10) {
      for (const dx of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(cx + dx, cy + 6); ctx.lineTo(cx + dx, cy); ctx.stroke(); }
    } else if (c.t < CROP_TIME) {
      for (const dx of [-7, 0, 7]) { ctx.beginPath(); ctx.moveTo(cx + dx, cy + 8); ctx.lineTo(cx + dx, cy - 6); ctx.stroke(); }
    } else {
      circle(cx - 7, cy + 2, 6, '#5cb84d'); circle(cx + 7, cy + 2, 6, '#5cb84d'); circle(cx, cy - 4, 7, '#6cc957');
      circle(cx - 7, cy, 2, '#ffd94d'); circle(cx + 7, cy, 2, '#ffd94d'); circle(cx, cy - 6, 2, '#ffd94d');
    }
  }
}
function drawBalai() {
  const px = BALAI.x * TILE, py = BALAI.y * TILE;
  ctx.fillStyle = '#8a6a3e'; ctx.fillRect(px - 4, py + 44, BALAI.w * TILE + 8, 10);
  ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 4, py + 16, BALAI.w * TILE - 8, 32);
  ctx.fillStyle = '#c8552e';
  ctx.beginPath();
  ctx.moveTo(px - 4, py + 18); ctx.lineTo(px + BALAI.w * TILE / 2, py - 10); ctx.lineTo(px + BALAI.w * TILE + 4, py + 18);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d3d1e'; ctx.fillRect(px + BALAI.w * TILE / 2 - 6, py + 28, 12, 20);
  ctx.strokeStyle = '#5d3d1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(px + BALAI.w * TILE - 6, py - 8); ctx.lineTo(px + BALAI.w * TILE - 6, py - 24); ctx.stroke();
  ctx.fillStyle = '#e74c3c';
  const wave = Math.sin(S.rtime * 4) * 2;
  ctx.beginPath();
  ctx.moveTo(px + BALAI.w * TILE - 6, py - 24); ctx.lineTo(px + BALAI.w * TILE + 8, py - 21 + wave); ctx.lineTo(px + BALAI.w * TILE - 6, py - 18);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < S.th; i++) circle(px + 14 + i * 12, py + 8, 4, '#ffd94d');
}
function drawDoor() {
  const px = DOOR.x * TILE, py = DOOR.y * TILE;
  ctx.fillStyle = '#6e6258'; ctx.fillRect(px - 2, py - 2, TILE + 4, TILE + 4);
  ctx.fillStyle = '#241d33';
  ctx.beginPath(); ctx.arc(px + 16, py + 22, 11, Math.PI, 0); ctx.fill();
  ctx.fillRect(px + 5, py + 22, 22, 10);
  ctx.fillStyle = '#8a6a3e'; ctx.fillRect(px + 2, py + 20, 4, 12); ctx.fillRect(px + 26, py + 20, 4, 12);
  ctx.fillStyle = '#ffd94d';
  const fl = 2 + Math.sin(S.rtime * 5) * 1;
  circle(px + 4, py + 14, fl, '#ff9d2e'); circle(px + 28, py + 14, fl, '#ff9d2e');
}
function drawBuilding(b) {
  const px = b.x * TILE, py = b.y * TILE;
  if (!b.built) {
    ctx.fillStyle = 'rgba(176,122,69,.45)'; ctx.fillRect(px + 6, py + 18, 52, 40);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.strokeRect(px + 6, py + 18, 52, 40);
    ctx.beginPath(); ctx.moveTo(px + 6, py + 58); ctx.lineTo(px + 32, py + 6); ctx.lineTo(px + 58, py + 58); ctx.stroke();
    const w = 52 * clamp(b.prog / BUILD[b.type].time, 0, 1);
    ctx.fillStyle = '#444'; ctx.fillRect(px + 6, py - 6, 52, 6);
    ctx.fillStyle = '#ffd94d'; ctx.fillRect(px + 6, py - 6, w, 6);
    return;
  }
  if (b.type === 'hut') {
    const h = b.level === 1 ? 0 : b.level === 2 ? 6 : 12;
    ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 6, py + 20 - h, 52, 38 + h);
    ctx.fillStyle = b.level >= 3 ? '#8e44ad' : '#c8552e';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 22 - h); ctx.lineTo(px + 32, py - 2 - h); ctx.lineTo(px + 62, py + 22 - h);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5d3d1e'; ctx.fillRect(px + 26, py + 36, 12, 22);
    ctx.fillStyle = '#ffe27a'; ctx.fillRect(px + 12, py + 28, 8, 8); ctx.fillRect(px + 44, py + 28, 8, 8);
    if (b.level >= 2) { ctx.fillStyle = '#ffe27a'; ctx.fillRect(px + 26, py + 8 - h, 12, 8); }
    return;
  }
  if (b.type === 'mine') {
    ctx.fillStyle = '#8d8d8d';
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 60); ctx.lineTo(px + 14, py + 14); ctx.lineTo(px + 32, py + 2); ctx.lineTo(px + 50, py + 14); ctx.lineTo(px + 60, py + 60);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#241d33';
    ctx.beginPath(); ctx.arc(px + 32, py + 44, 11, Math.PI, 0); ctx.fill();
    ctx.fillRect(px + 21, py + 44, 22, 16);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 18, py + 60); ctx.lineTo(px + 18, py + 34); ctx.moveTo(px + 46, py + 60); ctx.lineTo(px + 46, py + 34); ctx.stroke();
    return;
  }
  if (b.type === 'smith') {
    ctx.fillStyle = '#8d8578'; ctx.fillRect(px + 6, py + 20, 52, 38);
    ctx.fillStyle = '#6e675c'; ctx.fillRect(px + 6, py + 20, 52, 8);
    ctx.fillStyle = '#5d564c'; ctx.fillRect(px + 44, py + 2, 10, 20);
    ctx.fillStyle = '#ff9d2e';
    const fl = 3 + Math.sin(S.rtime * 6) * 1.5;
    circle(px + 49, py + 2, fl, '#ff9d2e');
    ctx.fillStyle = '#3d3d3d'; ctx.fillRect(px + 12, py + 44, 18, 8);
    ctx.fillStyle = '#c9c9c9'; ctx.fillRect(px + 12, py + 42, 18, 4);
    return;
  }
  if (b.type === 'kitchen') {
    ctx.fillStyle = '#c9a06a'; ctx.fillRect(px + 6, py + 20, 52, 38);
    ctx.fillStyle = '#a8502e';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 22); ctx.lineTo(px + 32, py - 2); ctx.lineTo(px + 62, py + 22);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5d564c'; ctx.fillRect(px + 44, py + 2, 10, 18);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    circle(px + 49, py - 4 - Math.sin(S.rtime * 2) * 2, 4, 'rgba(255,255,255,.45)');
    ctx.fillStyle = '#e8c53a';
    ctx.beginPath(); ctx.ellipse(px + 32, py + 38, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (b.type === 'market') {
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 8, py + 58); ctx.lineTo(px + 8, py + 18); ctx.moveTo(px + 56, py + 58); ctx.lineTo(px + 56, py + 18); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? '#e74c3c' : '#fff8e7';
      ctx.fillRect(px + 6 + i * 11, py + 10, 11, 10);
    }
    ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 8, py + 40, 48, 16);
    circle(px + 20, py + 34, 5, '#e74c3c'); circle(px + 32, py + 34, 5, '#e8c53a'); circle(px + 44, py + 34, 5, '#5cb84d');
  }
}
function drawTree(t) {
  const cx = t.tx * TILE + 16, cy = t.ty * TILE + 16;
  const dx = t.shake > 0 ? Math.sin(S.rtime * 40) * 3 * t.shake : 0;
  ctx.fillStyle = '#7a5230'; ctx.fillRect(cx - 3 + dx, cy - 2, 6, 14);
  circle(cx - 8 + dx, cy - 2, 9, '#3f8f3a');
  circle(cx + 8 + dx, cy - 2, 9, '#3f8f3a');
  circle(cx + dx, cy - 10, 13, t.seed > 0.5 ? '#4da344' : '#5cb84d');
}
function drawSapling(p) {
  const cx = p.tx * TILE + 16, cy = p.ty * TILE + 16;
  ctx.strokeStyle = '#4e8f2f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy - 4); ctx.stroke();
  circle(cx - 4, cy - 4, 4, '#5cb84d'); circle(cx + 4, cy - 4, 4, '#5cb84d');
}
function drawRock(r) {
  const cx = r.tx * TILE + 16, cy = r.ty * TILE + 16;
  const dx = r.shake > 0 ? Math.sin(S.rtime * 40) * 2 * r.shake : 0;
  circle(cx - 6 + dx, cy + 4, 8, '#8d8d8d');
  circle(cx + 5 + dx, cy + 2, 10, '#a8a8a8');
  circle(cx + 2 + dx, cy - 2, 3, '#d5d5d5');
}
function drawSlime(x, y, color, face, sq, scale) {
  const s = scale || 1;
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.beginPath(); ctx.ellipse(x, y + 10 * s, 11 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, 13 * s * (1 + sq), 11 * s * (1 - sq), 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(x - 4 * s, y - 4 * s, 4 * s, 3 * s, -0.4, 0, Math.PI * 2); ctx.fill();
  const ex = face.x * 2 * s, ey = face.y * 2 * s;
  for (const sd of [-1, 1]) {
    circle(x + sd * 5 * s, y - 2 * s, 3.4 * s, '#fff');
    circle(x + sd * 5 * s + ex, y - 2 * s + ey, 1.8 * s, '#1c2333');
  }
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y + 3 * s, 3 * s, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
}
function drawToolIcon(x, y, job) {
  ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2;
  if (job === 'wood') {
    ctx.beginPath(); ctx.moveTo(x - 4, y + 5); ctx.lineTo(x + 4, y - 5); ctx.stroke();
    ctx.fillStyle = '#c9c9c9';
    ctx.beginPath(); ctx.moveTo(x + 4, y - 5); ctx.lineTo(x + 9, y - 1); ctx.lineTo(x + 4, y + 1); ctx.closePath(); ctx.fill();
  } else if (job === 'mine') {
    ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x, y - 5); ctx.stroke();
    ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 6, y - 2); ctx.quadraticCurveTo(x, y - 8, x + 6, y - 2); ctx.stroke();
  } else if (job === 'farm') {
    ctx.strokeStyle = '#e8c53a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x, y - 6); ctx.stroke();
    circle(x - 3, y - 3, 2, '#ffd94d'); circle(x + 3, y - 3, 2, '#ffd94d'); circle(x, y - 6, 2, '#ffd94d');
  }
}
function drawPlayer() {
  const sq = S.moving ? Math.sin(S.walk) * 0.13 : Math.sin(S.rtime * 2) * 0.03;
  drawSlime(S.px, S.py, '#45a5f5', S.face, sq, 1);
}
function drawVillager(v) {
  if (v.dead) return;
  const sq = v.moving ? Math.sin(v.walk) * 0.13 : Math.sin(S.rtime * 2 + v.phase) * 0.03;
  drawSlime(v.x, v.y, JOB_COLOR[v.job], v.face, sq, 0.9);
  if (v.job !== 'none') drawToolIcon(v.x, v.y - 20, v.job);
  if (!v.fed) {
    ctx.font = 'bold 14px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ff5a5a';
    ctx.fillText('!', v.x + 14, v.y - 16);
  }
  if (v.hp < VILL_HP) {
    ctx.fillStyle = '#444'; ctx.fillRect(v.x - 12, v.y - 18, 24, 4);
    ctx.fillStyle = '#4caf50'; ctx.fillRect(v.x - 12, v.y - 18, 24 * clamp(v.hp / VILL_HP, 0, 1), 4);
  }
}
function drawMonster(m) {
  const bob = Math.sin(m.phase) * 2;
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.beginPath(); ctx.ellipse(m.x, m.y + 10, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = m.color || '#7a4a9e';
  ctx.beginPath(); ctx.ellipse(m.x, m.y + bob, 13, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8d9f5';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(m.x + s * 9, m.y - 6 + bob); ctx.lineTo(m.x + s * 13, m.y - 13 + bob); ctx.lineTo(m.x + s * 5, m.y - 9 + bob);
    ctx.closePath(); ctx.fill();
  }
  for (const s of [-1, 1]) {
    circle(m.x + s * 5, m.y - 2 + bob, 3.2, '#fff');
    circle(m.x + s * 5, m.y - 2 + bob, 1.8, '#d21f1f');
  }
  ctx.strokeStyle = '#3d2352'; ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(m.x + s * 8, m.y - 8 + bob); ctx.lineTo(m.x + s * 2, m.y - 5 + bob);
    ctx.stroke();
  }
  ctx.fillStyle = '#444'; ctx.fillRect(m.x - 12, m.y - 18 + bob, 24, 4);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(m.x - 12, m.y - 18 + bob, 24 * clamp(m.hp / (m.maxHp || MON_HP), 0, 1), 4);
}
function drawDungeon() {
  const d = S.dun;
  for (let y = 0; y < DUN_H; y++) for (let x = 0; x < DUN_W; x++) {
    const px = x * TILE, py = y * TILE;
    if (d.ground[y][x] === 'w') {
      ctx.fillStyle = '#3a3348'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#4a4260'; ctx.fillRect(px, py, TILE, 4);
    } else {
      ctx.fillStyle = (x + y) % 2 ? '#6b6259' : '#655c52';
      ctx.fillRect(px, py, TILE, TILE);
    }
  }
  for (const tx of [4, 21]) for (const ty of [4, 13]) {
    const fl = 3 + Math.sin(S.rtime * 5 + tx) * 1.5;
    circle(tx * TILE + 16, ty * TILE + 8, fl + 2, 'rgba(255,157,46,.35)');
    circle(tx * TILE + 16, ty * TILE + 8, fl, '#ff9d2e');
  }
  const ex = d.exit.x * TILE + 16, ey = d.exit.y * TILE + 16;
  ctx.fillStyle = '#2e8f5b';
  ctx.beginPath(); ctx.arc(ex, ey, 12, Math.PI, 0); ctx.fill();
  ctx.fillRect(ex - 12, ey, 24, 12);
  ctx.fillStyle = '#9fe870';
  ctx.beginPath(); ctx.arc(ex, ey, 7, Math.PI, 0); ctx.fill();
  ctx.fillRect(ex - 7, ey, 14, 12);
  if (d.stairs) {
    const sx = d.stairs.x * TILE, sy = d.stairs.y * TILE;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i % 2 ? '#8d8578' : '#7a7368';
      ctx.fillRect(sx + 4, sy + 4 + i * 8, 24, 8);
    }
  }
  for (const c of d.chests) {
    const px = c.x * TILE, py = c.y * TILE;
    ctx.fillStyle = c.opened ? '#6e5636' : '#8a6a3e';
    ctx.fillRect(px + 5, py + 12, 22, 14);
    ctx.fillStyle = c.opened ? '#5d4a2e' : '#a87f4e';
    ctx.fillRect(px + 5, py + 8, 22, 6);
    ctx.fillStyle = '#ffd94d'; ctx.fillRect(px + 14, py + 12, 4, 6);
  }
}
function render() {
  ctx.clearRect(0, 0, VW, VH);
  const sx = (Math.random() * 2 - 1) * S.shake, sy = (Math.random() * 2 - 1) * S.shake;
  ctx.save();
  ctx.translate(Math.round(VW / 2 - S.cam.x + sx), Math.round(VH / 2 - S.cam.y + sy));
  if (S.dun) {
    drawDungeon();
    const dyn = [];
    for (const m of S.dun.monsters) dyn.push({ y: m.y, f: () => drawMonster(m) });
    dyn.push({ y: S.py, f: drawPlayer });
    dyn.sort((a, b) => a.y - b.y);
    for (const dd of dyn) dd.f();
  } else {
    drawGround();
    drawCrops();
    drawBalai();
    drawDoor();
    for (const b of S.buildings) drawBuilding(b);
    const dyn = [];
    for (const t of WORLD.trees) if (alive(t)) dyn.push({ y: t.ty * TILE + 16, f: () => drawTree(t) });
    for (const p of S.planted) dyn.push({ y: p.ty * TILE + 16, f: grown(p) ? () => drawTree(p) : () => drawSapling(p) });
    for (const r of WORLD.rocks) if (alive(r)) dyn.push({ y: r.ty * TILE + 16, f: () => drawRock(r) });
    for (const m of S.monsters) dyn.push({ y: m.y, f: () => drawMonster(m) });
    for (const v of S.villagers) dyn.push({ y: v.y, f: () => drawVillager(v) });
    dyn.push({ y: S.py, f: drawPlayer });
    dyn.sort((a, b) => a.y - b.y);
    for (const dd of dyn) dd.f();
  }
  for (const p of S.parts) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  const dark = darkness();
  if (dark > 0) { ctx.fillStyle = 'rgba(8,10,38,' + dark + ')'; ctx.fillRect(0, 0, VW, VH); }
  ctx.save();
  ctx.translate(Math.round(VW / 2 - S.cam.x + sx), Math.round(VH / 2 - S.cam.y + sy));
  ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
  for (const f of S.floats) {
    ctx.globalAlpha = clamp(f.life / 1.1, 0, 1);
    ctx.fillStyle = f.color;
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
    ctx.strokeText(f.txt, f.x, f.y);
    ctx.fillText(f.txt, f.x, f.y);
  }
  ctx.globalAlpha = 1;
  if (S.buildMode && !S.dun) {
    const size = (S.buildMode === 'road' || S.buildMode === 'farm' || S.buildMode === 'tree' || S.buildMode === 'erase') ? 1 : 2;
    const ok = ghostValid(S.ghost.x, S.ghost.y, S.buildMode);
    const px = S.ghost.x * TILE, py = S.ghost.y * TILE;
    ctx.fillStyle = ok ? 'rgba(80,220,90,.35)' : 'rgba(230,60,60,.35)';
    ctx.fillRect(px, py, TILE * size, TILE * size);
    ctx.strokeStyle = ok ? '#50dc5a' : '#e63c3c'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(px, py, TILE * size, TILE * size);
    ctx.setLineDash([]);
  }
  ctx.restore();
  if (S.hurtT > 0) {
    ctx.strokeStyle = 'rgba(231,76,60,' + clamp(S.hurtT * 2, 0, .8) + ')';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, VW - 10, VH - 10);
  }
}

// ---------- HUD ----------
const hudCache = {};
function setTxt(elm, k, val) { if (hudCache[k] !== val) { hudCache[k] = val; elm.textContent = val; } }
function refreshHUD() {
  setTxt(el.wood, 'w', S.wood);
  setTxt(el.stone, 's', S.stone);
  setTxt(el.wheat, 'wh', S.wheat);
  setTxt(el.bread, 'br', S.bread);
  setTxt(el.iron, 'ir', S.iron);
  setTxt(el.coal, 'co', S.coal);
  setTxt(el.gold, 'go', S.gold);
  setTxt(el.diamond, 'di', S.diamond);
  setTxt(el.vill, 'vi', S.villagers.length + '/' + houseCapacity() + ' · TH ' + S.th);
  setTxt(el.hpTxt, 'hp', S.hp + '/' + PLAYER_HP);
  el.hp.style.width = clamp(S.hp, 0, 100) + '%';
  setTxt(el.day, 'd', 'Hari ' + S.day);
  setTxt(el.phase, 'p', S.dun ? 'Dungeon L' + S.dun.floor : S.phase === 'day' ? 'Siang' : 'Malam');
  const prog = S.phase === 'day' ? S.t / DAY_LEN : (S.t - DAY_LEN) / NIGHT_LEN;
  el.cyc.style.width = Math.round(clamp(prog, 0, 1) * 100) + '%';
}

