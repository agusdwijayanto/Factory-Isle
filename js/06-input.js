// Input sentuh + mouse + keyboard. Ketuk dibedakan dari seret lewat jarak
// gerak. WASD/panah menggerakkan karakter, bukan kamera.
const pointers = new Map();
let downPos = null, dragged = false;
let pinchD0 = 0, pinchZ0 = 1;
let lastPan = null;

function pinchDist() {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pinchMid() {
  const [a, b] = [...pointers.values()];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function zoomAt(mx, my, newZoom) {
  const old = S.cam.zoom;
  newZoom = clampZoom(newZoom);
  const k = newZoom / old;
  S.cam.x = mx - (mx - S.cam.x) * k;
  S.cam.y = my - (my - S.cam.y) * k;
  S.cam.zoom = newZoom;
}

cv.addEventListener('pointerdown', (e) => {
  try { cv.setPointerCapture(e.pointerId); } catch (_) { /* pointer sintetis */ }
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) { downPos = { x: e.clientX, y: e.clientY }; dragged = false; lastPan = { x: e.clientX, y: e.clientY }; }
  else if (pointers.size === 2) { pinchD0 = pinchDist(); pinchZ0 = S.cam.zoom; dragged = true; }
});

cv.addEventListener('pointermove', (e) => {
  const p = pointers.get(e.pointerId);
  if (p) { p.x = e.clientX; p.y = e.clientY; }
  if (pointers.size === 2) {
    const mid = pinchMid();
    zoomAt(mid.x, mid.y, pinchZ0 * pinchDist() / pinchD0);
    lastPan = null;
    return;
  }
  if (pointers.size === 1 && downPos) {
    if (!dragged && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 6) dragged = true;
    if (dragged && lastPan) { S.cam.x += e.clientX - lastPan.x; S.cam.y += e.clientY - lastPan.y; }
    if (dragged) lastPan = { x: e.clientX, y: e.clientY };
  }
  const g = screenToGrid(e.clientX, e.clientY, S.cam);
  S.hover = inGrid(g.gx, g.gy) ? g : null;
});

function endPointer(e) {
  const wasSingle = pointers.size === 1;
  pointers.delete(e.pointerId);
  if (wasSingle && !dragged && downPos) handleTap(e.clientX, e.clientY);
  if (pointers.size === 0) { downPos = null; lastPan = null; }
}
cv.addEventListener('pointerup', endPointer);
cv.addEventListener('pointercancel', endPointer);
cv.addEventListener('pointerleave', () => { S.hover = null; });

cv.addEventListener('wheel', (e) => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, S.cam.zoom * Math.pow(1.1, -e.deltaY / 100));
}, { passive: false });

function handleTap(sx, sy) {
  const g = screenToGrid(sx, sy, S.cam);
  if (!inGrid(g.gx, g.gy)) { UI.closeAll(); return; }
  if (S.placing) { tryPlace(g.gx, g.gy); return; }
  interactAt(g.gx, g.gy);
}

function tryPlace(gx, gy) {
  const p = S.placing;
  if (S.map !== 'plot') { SFX.play('error'); UI.toast('Bangun hanya di lahanmu. Masuk lewat kotak plot.'); return; }
  if (!canPlace(gx, gy, p)) { SFX.play('error'); UI.toast('Tidak bisa ditaruh di sini'); return; }
  const cost = p.fromKey ? 0 : (BUILD_COST[p.id] || 0);
  if (S.money < cost) { SFX.play('error'); UI.toast('Uang tidak cukup'); return; }
  S.money -= cost;
  placeThing(p, gx, gy);
  SFX.play('place');
  addFloater(gx, gy, 'Terpasang!', '#5eff8a');
  UI.refreshHUD();
  // Rantai conveyor/dinding/dekor: tetap mode taruh supaya bisa lanjut.
  if (p.kind === 'machine' || p.kind === 'storage' || p.fromKey) UI.cancelPlacing();
}

function placeThing(p, gx, gy) {
  const k = key(gx, gy);
  if (p.fromKey) {
    // Pindah: bawa state lama (mesin/storage) ke petak baru.
    const old = p.kind === 'machine' ? S.machines.get(p.fromKey) : S.storages.get(p.fromKey);
    if (p.kind === 'machine') { S.machines.delete(p.fromKey); old.dir = S.placeDir; S.machines.set(k, old); }
    else { S.storages.delete(p.fromKey); S.storages.set(k, old); }
    return;
  }
  if (p.kind === 'machine') S.machines.set(k, newMachine(p.id, S.placeDir));
  else if (p.kind === 'conveyor') S.conveyors.set(k, { id: p.id, dir: S.placeDir, item: null, t: 0 });
  else if (p.kind === 'storage') S.storages.set(k, { id: p.id, items: {} });
  else if (p.kind === 'wall') S.walls.set(k, { id: p.id });
  else if (p.kind === 'decor') S.decor.set(k, { id: p.id });
  saveSoon();
}

const KEY_DIR = {
  ArrowRight: 0, d: 0, D: 0,
  ArrowDown: 1, s: 1, S: 1,
  ArrowLeft: 2, a: 2, A: 2,
  ArrowUp: 3, w: 3, W: 3,
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (S.placing) UI.cancelPlacing();
    else UI.closeAll();
    return;
  }
  if (KEY_DIR[e.key] !== undefined) {
    S.keys[KEY_DIR[e.key]] = true;
    cancelWork();
    e.preventDefault();
    return;
  }
  if (e.key === 'r' || e.key === 'R') {
    if (S.placing) { S.placeDir = (S.placeDir + 1) % 4; }
  }
  else if (e.key === '+' || e.key === '=') zoomAt(VW / 2, VH / 2, S.cam.zoom * 1.15);
  else if (e.key === '-') zoomAt(VW / 2, VH / 2, S.cam.zoom / 1.15);
});
document.addEventListener('keyup', (e) => {
  if (KEY_DIR[e.key] !== undefined) delete S.keys[KEY_DIR[e.key]];
});

function heldDir() {
  for (let d = 0; d < 4; d++) if (S.keys[d]) return d;
  return -1;
}
