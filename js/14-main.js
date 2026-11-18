// Boot: peta + muat simpan, lalu atlas, lalu loop game.
buildMap();
loadGame();

let centered = false;
function onResize() {
  fitCanvas();
  if (!centered) {
    S.cam.zoom = clampZoom(Math.min(1, window.innerWidth / 760));
    centerCamera(window.innerWidth, window.innerHeight);
    centered = true;
  }
}
window.addEventListener('resize', onResize);

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  S.time += dt;
  S.beltT += dt;
  updatePlayer(dt);
  updateMachines(dt);
  updateConveyors(dt);
  updateRegrow(dt);
  autoSellerTick(dt);
  S.floaters = S.floaters.filter((f) => S.time - f.born < 0.9);
  UI.tick(dt);
  render();
  requestAnimationFrame(frame);
}

Atlas.init().then(() => {
  onResize();
  UI.refreshHUD();
  UI.setHint(HINT_HOME);
  $('btn-sound').textContent = 'Suara: ' + (S.settings.sound ? 'Hidup' : 'Mati');
  requestAnimationFrame(frame);
  window.__ready = true;
});

window.addEventListener('pagehide', () => saveGame());
document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveGame();
});

// Kaitan untuk tes otomatis dan debug dari konsol.
window.GAME = S;
window.ATLAS = Atlas;
