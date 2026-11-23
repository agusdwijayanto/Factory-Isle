// =============================================
//   FACTORY ISLE — js/13-ui.js (Fixed & Full)
//   =============================================

document.addEventListener('DOMContentLoaded', () => {
  const btnBuild = $('btn-build');
  if (btnBuild) {
    btnBuild.addEventListener('click', () => {
      const menu = $('build-menu');
      if (menu && menu.classList.contains('hidden')) UI.openBuild();
      else UI.closePanel('build-menu');
    });
  }

  const btnTas = $('btn-tas');
  if (btnTas) btnTas.addEventListener('click', () => UI.openTas());

  const btnRotate = $('btn-rotate');
  if (btnRotate) btnRotate.addEventListener('click', () => { S.placeDir = (S.placeDir + 1) % 4; });

  const btnCancel = $('btn-place-cancel');
  if (btnCancel) btnCancel.addEventListener('click', () => UI.cancelPlacing());

  const btnOk = $('btn-place-ok');
  if (btnOk) btnOk.addEventListener('click', () => confirmPlace());

  const btnBurger = $('btn-burger');
  if (btnBurger) {
    btnBurger.addEventListener('click', (e) => {
      e.stopPropagation();
      const m = $('burger-menu');
      if (!m) return;
      if (m.classList.contains('hidden')) {
        UI.openPanel('burger-menu');
      } else {
        UI.closePanel('burger-menu');
      }
    });
  }

  const btnTutSkip = $('btn-tut-skip');
  if (btnTutSkip) {
    btnTutSkip.addEventListener('click', () => {
      S.tutDone = true;
      S.tutStarted = true;
      const tutPanel = $('tut-panel');
      if (tutPanel) tutPanel.classList.add('hidden');
      UI.toast('Tutorial dilewati');
      saveSoon();
    });
  }

  const btnTutNext = $('btn-tut-next');
  if (btnTutNext) {
    btnTutNext.addEventListener('click', () => {
      S.tutStarted = true;
      btnTutNext.classList.add('hidden');
      saveSoon();
    });
  }

  document.querySelectorAll('[data-close]').forEach((b) => {
    b.addEventListener('click', () => {
      const target = b.dataset.close;
      if (target === 'inspect-panel') UI.closeMachine();
      else if (target === 'storage-panel') UI.closeAll();
      else {
        const el = $(target);
        if (el) el.classList.add('hidden');
      }
    });
  });

  document.querySelectorAll('#burger-menu [data-act]').forEach((b) => {
    b.addEventListener('click', () => {
      const m = $('burger-menu');
      if (m) m.classList.add('hidden');
      const act = b.dataset.act;
      if (act === 'Pengaturan') UI.openPanel('settings-panel');
      else if (act === 'Bantuan') UI.openPanel('help-panel');
      else if (act === 'Admin') UI.openPanel('admin-panel');
      else if (act === 'Plot') UI.openPlot();
      else if (act === 'Badge') UI.openBadges();
      else if (act === 'Book') UI.openBook();
    });
  });

  const btnSound = $('btn-sound');
  if (btnSound) {
    btnSound.addEventListener('click', () => {
      S.settings.sound = !S.settings.sound;
      btnSound.textContent = 'Suara: ' + (S.settings.sound ? 'Hidup' : 'Mati');
      saveSoon();
    });
  }

  const btnRuler = $('btn-ruler');
  if (btnRuler) {
    btnRuler.addEventListener('click', () => {
      S.settings.ruler = !S.settings.ruler;
      btnRuler.textContent = 'Koordinat: ' + (S.settings.ruler ? 'Hidup' : 'Mati');
      saveSoon();
    });
  }

  const btnCenter = $('btn-center');
  if (btnCenter) {
    btnCenter.addEventListener('click', () => {
      const p = S.player;
      const c = isoPoint(p.fx, p.fy, { x: 0, y: 0, zoom: S.cam.zoom });
      S.cam.x = VW / 2 - c.x;
      S.cam.y = VH / 2 - c.y;
      UI.closePanel('settings-panel');
    });
}

  const btnZoomReset = $('btn-zoom-reset');
  if (btnZoomReset) {
    btnZoomReset.addEventListener('click', () => {
      S.cam.zoom = clampZoom(Math.min(1, window.innerWidth / 760));
      centerCamera(window.innerWidth, window.innerHeight);
      UI.closePanel('settings-panel');
    });
  }

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
      if (typeof SFX !== 'undefined' && SFX.play) SFX.play('success');
      UI.refreshHUD();
      saveSoon();
    });
  });
});
