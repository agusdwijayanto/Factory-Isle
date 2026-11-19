// Kait tombol statis. Panel-panelnya di 13-ui-*.js,
// inti UI di 13-ui-core.js.
// ---- Kait tombol statis ----
$('btn-build').addEventListener('click', () => {
  const menu = $('build-menu');
  if (menu.classList.contains('hidden')) UI.openBuild();
  else UI.closePanel('build-menu');
});
$('btn-tas').addEventListener('click', () => UI.openTas());
$('btn-rotate').addEventListener('click', () => { S.placeDir = (S.placeDir + 1) % 4; });
$('btn-place-cancel').addEventListener('click', () => UI.cancelPlacing());
$('btn-place-ok').addEventListener('click', () => confirmPlace());
$('btn-burger').addEventListener('click', () => {
  const m = $('burger-menu');
  if (m.classList.contains('hidden')) UI.openPanel('burger-menu');
  else m.classList.add('hidden');
});
// Panel tutorial di tengah: Lewati mematikan tutorial total,
// Lanjut memulai langkah 1 (panel lalu menampilkan tiap langkah).
$('btn-tut-skip').addEventListener('click', () => {
  S.tutDone = true;
  S.tutStarted = true;
  $('tut-panel').classList.add('hidden');
  UI.toast('Tutorial dilewati');
  saveSoon();
});
$('btn-tut-next').addEventListener('click', () => {
  S.tutStarted = true;
  $('btn-tut-next').classList.add('hidden');
  saveSoon();
});
document.querySelectorAll('[data-close]').forEach((b) => {
  b.addEventListener('click', () => {
    if (b.dataset.close === 'inspect-panel') UI.closeMachine();
    else if (b.dataset.close === 'storage-panel') UI.closeAll();
    else $(b.dataset.close).classList.add('hidden');
  });
});
document.querySelectorAll('#burger-menu [data-act]').forEach((b) => {
  b.addEventListener('click', () => {
    $('burger-menu').classList.add('hidden');
    const act = b.dataset.act;
    if (act === 'Pengaturan') UI.openPanel('settings-panel');
    else if (act === 'Bantuan') UI.openPanel('help-panel');
    else if (act === 'Admin') UI.openPanel('admin-panel');
  });
});
$('btn-sound').addEventListener('click', () => {
  S.settings.sound = !S.settings.sound;
  $('btn-sound').textContent = 'Suara: ' + (S.settings.sound ? 'Hidup' : 'Mati');
  saveSoon();
});
$('btn-ruler').addEventListener('click', () => {
  S.settings.ruler = !S.settings.ruler;
  $('btn-ruler').textContent = 'Koordinat: ' + (S.settings.ruler ? 'Hidup' : 'Mati');
  saveSoon();
});
$('btn-center').addEventListener('click', () => {
  const p = S.player;
  const c = isoPoint(p.fx, p.fy, { x: 0, y: 0, zoom: S.cam.zoom });
  S.cam.x = VW / 2 - c.x;
  S.cam.y = VH / 2 - c.y;
  UI.closePanel('settings-panel');
});
$('btn-zoom-reset').addEventListener('click', () => {
  S.cam.zoom = clampZoom(Math.min(1, window.innerWidth / 760));
  centerCamera(window.innerWidth, window.innerHeight);
  UI.closePanel('settings-panel');
});
document.querySelectorAll('#admin-panel [data-admin]').forEach((b) => {
  b.addEventListener('click', () => {
    const act = b.dataset.admin;
    if (act === 'money') {
      S.money += 1000;
      UI.toast('ADMIN: +$1.000');
    } else if (act === 'materials') {
      ['Log', 'IronOre', 'CopperOre', 'TinOre', 'Sand', 'Clay', 'Cotton'].forEach((id) => invAdd(id, 50));
      ['Plank', 'Pillar', 'Firelog', 'Brick', 'Glass', 'IronIngot', 'CopperIngot', 'BronzeIngot',
       'Coil', 'Gear', 'IronBeam', 'IronFrame', 'Nails', 'WoodFrame'].forEach((id) => invAdd(id, 20));
      UI.toast('ADMIN: material ditambah');
    } else if (act === 'unlock') {
      Object.keys(MACHINES).forEach((id) => { S.unlocked[id] = true; });
      UI.toast('ADMIN: semua resep terbuka');
    } else if (act === 'finish') {
      finishAllInstant();
      UI.toast('ADMIN: crafting diselesaikan instan');
    } else if (act === 'reset') {
      if (window.confirm('Hapus simpan dan mulai dari awal?')) {
        resetSave();
        window.location.reload();
      }
      return;
    }
    SFX.play('success');
    UI.refreshHUD();
    saveSoon();
  });
});
// Saklar Mode Admin (on/off). Efeknya di setAdminMode (11-ekonomi.js);
// tombol lama di atas tetap ada dan tetap jalan.
$('admin-toggle').addEventListener('click', () => {
  setAdminMode(!S.admin);
  SFX.play('success');
  UI.refreshHUD();
});
TOAST = (msg) => UI.toast(msg);
