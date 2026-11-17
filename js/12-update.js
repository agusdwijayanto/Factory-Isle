'use strict';
// ---------- Loop update: fisika, lava, NPC, drop, timer, simpan berkala ----------
function update(dt) {
  if (S.frozen) return;
  S.rtime += dt;
  if (!S.worldSelOpen) {
    updatePlayer(dt, pollMove());
    updateCamera();
    lavaCheck();
    if (S.hp < 100 && S.rtime - S.hurtT > 5) S.hp = Math.min(100, S.hp + 5 * dt);
    if (S.fireT > 0) {
      S.fireT -= dt;
      if (Math.random() < 0.3) burst(S.px, S.py - 10, '#ff6b35', 1, 30);
    }
    updateTrader(dt);
    updateDrops(dt);
    broadcastTick(dt);
    guildTick(dt);
    S.vendT -= dt;
    if (S.vendT <= 0) { S.vendT = 45 + Math.random() * 30; vendTick(); }
    S.saveT += dt;
    if (S.saveT > 10) { S.saveT = 0; save(); }
  }
  for (const p of S.parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 200 * dt; p.life -= dt; }
  S.parts = S.parts.filter(p => p.life > 0);
  for (const f of S.floats) { f.y -= 30 * dt; f.life -= dt; }
  S.floats = S.floats.filter(f => f.life > 0);
  if (S.punchFx) { S.punchFx.life -= dt; if (S.punchFx.life <= 0) S.punchFx = null; }
  if (S.bubble) { S.bubble.life -= dt; if (S.bubble.life <= 0) S.bubble = null; }
}
function lavaCheck() {
  // Sentuh lava: knockback + api + damage; mati sesudah 5 sentuhan cepat
  // (riset) = 5 x 20 damage dari HP 100.
  const x0 = Math.floor((S.px - PW / 2) / TILE), x1 = Math.floor((S.px + PW / 2 - 0.01) / TILE);
  const y0 = Math.floor((S.py - PH / 2) / TILE), y1 = Math.floor((S.py + PH / 2 - 0.01) / TILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) {
    if (fgAt(tx, ty) === T_LAVA) { hurtPlayer(20, tx * TILE + 16); return; }
  }
}
