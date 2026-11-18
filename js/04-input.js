// Input sentuh + mouse + keyboard. Ketuk dibedakan dari seret lewat jarak
// gerak, supaya geser kamera tidak ikut memanen atau membuka panel.
const pointers = new Map();
let downPos = null, dragged = false;
let pinchD0 = 0, pinchZ0 = 1;

function pinchDist() {
  const [a, b] = [...pointers.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}
function pinchMid() {
  const [a, b] = [...pointers.values()];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// Zoom dengan jangkar: titik dunia di bawah jangkar harus tetap di tempat.
function zoomAt(mx, my, newZoom) {
  const old = S.cam.zoom;
  newZoom = clampZoom(newZoom);
  const k = newZoom / old;
  S.cam.x = mx - (mx - S.cam.x) * k;
  S.cam.y = my - (my - S.cam.y) * k;
  S.cam.zoom = newZoom;
}

cv.addEventListener('pointerdown', (e) => {
  try { cv.setPointerCapture(e.pointerId); } catch (_) { /* pointer sintetis: abaikan */ }
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 1) { downPos = { x: e.clientX, y: e.clientY }; dragged = false; lastPan = { x: e.clientX, y: e.clientY }; }
  else if (pointers.size === 2) { pinchD0 = pinchDist(); pinchZ0 = S.cam.zoom; dragged = true; }
});

let lastPan = null; // posisi pointer sebelumnya, untuk delta seret manual

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
    // Delta manual, bukan movementX: movementX tidak konsisten di browser sentuh.
    // lastPan hanya maju saat sudah menyeret, supaya gerakan sebelum ambang
    // batas tidak hilang begitu seretan dimulai.
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
  if (!inGrid(g.gx, g.gy)) { UI.closeMachine(); return; }
  const t = tileAt(g.gx, g.gy), k = key(g.gx, g.gy);

  if (S.placing) {
    if (canPlace(g.gx, g.gy)) {
      S.machines.set(k, { id: S.placing, dir: 0 });
      addFloater(g.gx, g.gy, 'Terpasang!', '#5eff8a');
      UI.toast('Mockup: ' + MACHINES[S.placing].name + ' terpasang');
      UI.cancelPlacing();
    } else {
      UI.toast('Tidak bisa ditaruh di sini');
    }
    return;
  }

  const m = S.machines.get(k);
  if (m) { UI.openMachine(m.id, g.gx, g.gy); return; }
  if (S.conveyors.has(k)) { UI.toast('Mockup: conveyor mengalirkan item'); return; }

  const harvest = HARVEST[t.obj] || HARVEST[t.t];
  if (harvest) {
    S.pulses.set(k, S.time);
    addFloater(g.gx, g.gy, harvest.text, harvest.color);
    return;
  }
  UI.closeMachine();
}

function addFloater(gx, gy, text, color) {
  S.floaters.push({ gx, gy, text, color, born: S.time });
  if (S.floaters.length > 24) S.floaters.shift();
}

document.addEventListener('keydown', (e) => {
  const step = 48;
  if (e.key === 'Escape') {
    if (S.placing) UI.cancelPlacing();
    else UI.closeAll();
  }
  else if (e.key === 'ArrowLeft' || e.key === 'a') S.cam.x += step;
  else if (e.key === 'ArrowRight' || e.key === 'd') S.cam.x -= step;
  else if (e.key === 'ArrowUp' || e.key === 'w') S.cam.y += step;
  else if (e.key === 'ArrowDown' || e.key === 's') S.cam.y -= step;
  else if (e.key === '+' || e.key === '=') zoomAt(VW / 2, VH / 2, S.cam.zoom * 1.15);
  else if (e.key === '-') zoomAt(VW / 2, VH / 2, S.cam.zoom / 1.15);
});
