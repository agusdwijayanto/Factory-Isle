'use strict';
// ---------- Update: jam hari/malam, fajar, simpan otomatis ----------
function onDawn() {
  const prevSeason = seasonOf(S.day);
  S.day++; S.t = 0; S.phase = 'day';
  sfx.dawn();
  onDawnEconomy();
  genMissions();
  onDawnPlants();
  if (dayInWeek(S.day) === 0) { rotTurnips(); genTurnipWeek(weekOf(S.day)); }
  if (seasonOf(S.day) !== prevSeason) banner('Musim ' + SEASONS[seasonOf(S.day)] + ' tiba!');
  refreshHUD();
}
function update(dt) {
  if (S.frozen) return;
  S.rtime += dt;
  updatePlayer(dt, pollMove());
  updatePlants(dt);
  updateCamera();
  for (let i = S.parts.length - 1; i >= 0; i--) {
    const p = S.parts[i];
    p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 300 * dt;
    if (p.life <= 0) S.parts.splice(i, 1);
  }
  for (let i = S.floats.length - 1; i >= 0; i--) {
    const f = S.floats[i];
    f.life -= dt; f.y -= 30 * dt;
    if (f.life <= 0) S.floats.splice(i, 1);
  }
  if (S.shake > 0) S.shake = Math.max(0, S.shake - dt);
  S.t += dt;
  if (S.phase === 'day' && S.t >= DAY_LEN) { S.phase = 'night'; S.t = 0; sfx.night(); }
  else if (S.phase === 'night' && S.t >= NIGHT_LEN) onDawn();
  S.saveT += dt;
  if (S.saveT >= 10) { S.saveT = 0; save(); }
  refreshHUD();
}
