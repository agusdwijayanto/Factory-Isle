'use strict';
// ---------- Fisika: jalan, lompat, gravitasi, tabrakan petak ----------
const PW = 20, PH = 28; // badan pemain lebih kecil dari petak, supaya tidak nyangkut
function tileAt(tx, ty) {
  if (tx < 0 || tx >= S.mw || ty < 0 || ty >= MH) return T_STONE; // dinding dunia
  return S.tiles[ty][tx];
}
function solidAt(tx, ty) {
  const c = tileAt(tx, ty);
  return c !== T_EMPTY && !!TILES[c] && TILES[c].solid;
}
function playerTile() { return { tx: Math.floor(S.px / TILE), ty: Math.floor(S.py / TILE) }; }
function doJump() {
  if (!S.onGround) return;
  S.vy = -JUMP_V; S.onGround = false; sfx.jump();
}
function collides(x, y) {
  const x0 = Math.floor((x - PW / 2) / TILE), x1 = Math.floor((x + PW / 2 - 0.01) / TILE);
  const y0 = Math.floor((y - PH / 2) / TILE), y1 = Math.floor((y + PH / 2 - 0.01) / TILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (solidAt(tx, ty)) return true;
  return false;
}
function updatePlayer(dt, move) {
  S.vx = move * WALK;
  if (move !== 0) { S.face = move; S.walk += dt * 10; }
  S.vy = Math.min(S.vy + GRAV * dt, FALL_MAX);
  // Sumbu X dulu, lalu Y: supaya mendarat di tanah tidak menempel dinding.
  let nx = S.px + S.vx * dt;
  if (!collides(nx, S.py)) S.px = nx;
  else {
    const dir = Math.sign(S.vx);
    // Snap dari posisi penetrasi (nx), bukan posisi lama: posisi lama masih di baris udara.
    S.px = dir > 0 ? Math.floor((nx + PW / 2) / TILE) * TILE - PW / 2 - 0.01 : (Math.floor((nx - PW / 2) / TILE) + 1) * TILE + PW / 2 + 0.01;
    S.vx = 0;
  }
  let ny = S.py + S.vy * dt;
  S.onGround = false;
  if (!collides(S.px, ny)) S.py = ny;
  else if (S.vy > 0) {
    S.py = Math.floor((ny + PH / 2) / TILE) * TILE - PH / 2 - 0.01;
    S.vy = 0; S.onGround = true;
  } else if (S.vy < 0) {
    S.py = (Math.floor((ny - PH / 2) / TILE) + 1) * TILE + PH / 2 + 0.01;
    S.vy = 0;
  }
  S.px = clamp(S.px, PW / 2, S.mw * TILE - PW / 2);
  if (S.py > MH * TILE) { S.py = MH * TILE - PH; S.vy = 0; S.onGround = true; } // pengaman, tidak boleh jatuh keluar dunia
}
function updateCamera() {
  const tx = clamp(S.px - VW / 2, 0, Math.max(0, S.mw * TILE - VW));
  const ty = clamp(S.py - VH / 2, 0, Math.max(0, MH * TILE - VH));
  S.cam.x += (tx - S.cam.x) * 0.2; S.cam.y += (ty - S.cam.y) * 0.2;
  if (Math.abs(tx - S.cam.x) < 0.5) S.cam.x = tx;
  if (Math.abs(ty - S.cam.y) < 0.5) S.cam.y = ty;
}
