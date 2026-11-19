// Tick UI: tutorial maju, teks panel tutorial, simpan otomatis.
// Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Tutorial + panel ----
  tick(dt) {
    // Tutorial maju sendiri saat syarat langkah terpenuhi.
    if (!S.tutDone && S.tut < TUTORIAL.length && TUTORIAL[S.tut].done()) {
      S.tut++;
      SFX.play('success');
      this.toast('Target selesai!');
      if (S.tut >= TUTORIAL.length) S.tutDone = true;
      saveSoon();
    }
    // Panel tutorial di tengah: ajakan dulu, lalu tiap langkah.
    // ETA: sisa waktu crafting terdekat yang sedang berjalan.
    let eta = null;
    for (const m of S.machines.values()) {
      if (m.progress > 0 && !m.stopped) {
        const r = getRecipe(m);
        if (!r) continue; // mesin tanpa resep tidak punya ETA crafting
        const left = Math.ceil((1 - m.progress) * r.secs);
        if (eta === null || left < eta.left) eta = { left, name: ITEMS[r.out].name };
      }
    }
    const panel = $('tut-panel');
    if (S.tutDone) {
      panel.classList.add('hidden');
    } else {
      panel.classList.remove('hidden');
      let text;
      if (!S.tutStarted) text = TUT_INTRO;
      else text = 'Target: ' + TUTORIAL[Math.min(S.tut, TUTORIAL.length - 1)].text;
      if (eta) text += ' | ' + eta.name + ' selesai dalam ' + eta.left + ' dtk';
      if (text !== lastTutText) {
        lastTutText = text;
        $('tut-text').textContent = text;
      }
      $('btn-tut-next').classList.toggle('hidden', S.tutStarted);
    }
    this.updateInspectLive();
    this.positionPlaceButtons();
    // Simpan otomatis throttled.
    saveTimer += dt;
    if (saveDirty && saveTimer > 5) { saveTimer = 0; saveGame(); }
  },
  // Tombol taruh melayang di dekat bayangan (v34): klaster bulat X / putar /
  // centang mengikuti petak bayangan; kalau belum ada bayangan, ikut hover;
  // kalau tidak ada juga, diam di tengah bawah supaya tetap terjangkau.
  // Dijepit ke dalam layar supaya tidak keluar di HP.
  positionPlaceButtons() {
    if (typeof window === 'undefined') return; // headless: tidak ada layar
    const wrap = $('place-btns');
    if (!wrap || !S.placing) return;
    const W = window.innerWidth, H = window.innerHeight;
    const CW = 148, CH = 44, M = 8; // 3 tombol 44px + 2 celah 8px
    const spot = S.placeSpot || (S.hover && { gx: S.hover.gx, gy: S.hover.gy });
    let x, y;
    if (spot) {
      const c = tileCenter(spot.gx, spot.gy, S.cam);
      x = c.x + 40; // kanan bayangan
      if (x + CW > W - M) x = c.x - 40 - CW; // mentok kanan: pindah ke kiri bayangan
      y = c.y - CH / 2;
    } else {
      x = (W - CW) / 2; y = H - 76; // belum ada petak: tengah bawah (posisi lama)
    }
    x = Math.max(M, Math.min(x, W - CW - M));
    y = Math.max(M, Math.min(y, H - CH - M));
    wrap.style.left = x + 'px';
    wrap.style.top = y + 'px';
  },
});
