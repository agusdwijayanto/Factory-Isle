'use strict';
// ---------- Update ----------
function update(dt) {
  dt *= S.speed || 1;
  S.rtime += dt;
  if (!S.frozen) {
    S.t += dt;
    if (S.phase === 'day' && S.t >= DAY_LEN) { S.phase = 'night'; S.charge = false; spawnWave(); }
    else if (S.phase === 'night' && S.t >= DAY_LEN + NIGHT_LEN) {
      S.t = 0; S.day++; S.phase = 'day';
      for (const m of S.monsters) burst(m.x, m.y, '#b9a7e6', 8, 60);
      S.monsters = []; sfx.dawn();
      addFloat(S.px, S.py - 30, 'Pagi tiba — hari ' + S.day, '#ffe27a');
      onDawn();
    }
  }
  pollKeys();
  let mx = input.mx, my = input.my;
  if (joy.active) { mx = joy.x; my = joy.y; }
  const len = Math.hypot(mx, my);
  S.moving = len > 0.15;
  if (S.moving) {
    mx /= len; my /= len;
    S.face = {
      x: Math.abs(mx) > Math.abs(my) ? Math.sign(mx) : 0,
      y: Math.abs(my) >= Math.abs(mx) ? Math.sign(my) : 0,
    };
    S.walk += dt * 10;
    moveAxis(mx * PLAYER_SPEED * dt, my * PLAYER_SPEED * dt);
  }
  for (const t of WORLD.trees) {
    if (t.shake > 0) t.shake -= dt;
    if (t.respawn > 0) { t.respawn -= dt; if (t.respawn <= 0) { t.hp = TREE_HP; burst(t.tx * TILE + 16, t.ty * TILE + 16, '#7ec850', 5, 40); } }
  }
  for (const r of WORLD.rocks) {
    if (r.shake > 0) r.shake -= dt;
    if (r.respawn > 0) { r.respawn -= dt; if (r.respawn <= 0) { r.hp = ROCK_HP; burst(r.tx * TILE + 16, r.ty * TILE + 16, '#b8b8b8', 5, 40); } }
  }
  for (const p of S.planted) {
    if (p.shake > 0) p.shake -= dt;
    if (p.grow > 0) { p.grow -= dt; if (p.grow <= 0) { p.hp = TREE_HP; burst(p.tx * TILE + 16, p.ty * TILE + 16, '#7ec850', 6, 40); } }
  }
  for (const k in S.crops) { const c = S.crops[k]; if (c.t < CROP_TIME) c.t += dt; }
  for (const b of S.buildings) if (!b.built) {
    b.prog += dt;
    if (b.prog >= BUILD[b.type].time) { b.built = true; celebrateBuilding(b); }
  }
  if (S.cookQ.length > 0) {
    S.cookQ[0].t -= dt;
    if (S.cookQ[0].t <= 0) {
      S.cookQ.shift(); S.bread++;
      const k = S.buildings.find(b => b.type === 'kitchen' && b.built);
      const cx = k ? k.x * TILE + TILE : S.px, cy = k ? k.y * TILE + TILE : S.py;
      addFloat(cx, cy - 20, '+1 roti', '#ffd94d');
      burst(cx, cy, '#ffd94d', 5, 40);
      sfx.harvest();
    }
  }
  updateVillagers(dt);
  updateMonsters(dt);
  if (S.dun) updateDungeon(dt);
  for (let i = S.parts.length - 1; i >= 0; i--) {
    const p = S.parts[i]; p.life -= dt;
    if (p.life <= 0) { S.parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt;
  }
  for (let i = S.floats.length - 1; i >= 0; i--) {
    const f = S.floats[i]; f.life -= dt; f.y -= 26 * dt;
    if (f.life <= 0) S.floats.splice(i, 1);
  }
  if (S.shake > 0) S.shake = Math.max(0, S.shake - 30 * dt);
  if (S.hurtT > 0) S.hurtT -= dt;
  let tx, ty;
  if (S.dun) { tx = DUN_W * TILE / 2; ty = DUN_H * TILE / 2; }
  else { tx = clamp(S.px, VW / 2, MW * TILE - VW / 2); ty = clamp(S.py, VH / 2, MH * TILE - VH / 2); }
  S.cam.x += (tx - S.cam.x) * Math.min(1, dt * 5);
  S.cam.y += (ty - S.cam.y) * Math.min(1, dt * 5);
  S.saveT += dt;
  if (S.saveT >= 5) { S.saveT = 0; save(); }
  refreshHUD();
}

