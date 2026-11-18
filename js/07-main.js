// Boot mockup: peta demo, ukuran canvas, loop gambar.
buildDemoMap();

let centered = false;
function onResize() {
  fitCanvas();
  if (!centered) {
    // Zoom awal menyesuaikan lebar layar supaya sebagian besar plot terlihat.
    S.cam.zoom = clampZoom(Math.min(1, window.innerWidth / 760));
    centerCamera(window.innerWidth, window.innerHeight);
    centered = true;
  }
}
window.addEventListener('resize', onResize);
onResize();

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  S.time += dt;
  S.beltT += dt;
  S.floaters = S.floaters.filter((f) => S.time - f.born < 0.9);
  render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

// Kaitan untuk tes otomatis dan debug dari konsol.
window.MOCK = S;
window.__ready = true;
