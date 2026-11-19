// Tick UI: tutorial maju, teks target, simpan otomatis.
// Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Tutorial + target ----
  tick(dt) {
    // Tutorial maju sendiri saat syarat langkah terpenuhi.
    if (!S.tutDone && S.tut < TUTORIAL.length && TUTORIAL[S.tut].done()) {
      S.tut++;
      SFX.play('success');
      this.toast('Target selesai!');
      if (S.tut >= TUTORIAL.length) S.tutDone = true;
      saveSoon();
    }
    let text;
    if (S.tutDone) text = 'Bebas: kembangkan pabrikmu. Target: buat 1 Motor.';
    else text = 'Target: ' + TUTORIAL[Math.min(S.tut, TUTORIAL.length - 1)].text;
    // ETA: sisa waktu crafting terdekat yang sedang berjalan.
    let eta = null;
    for (const m of S.machines.values()) {
      if (m.progress > 0 && !m.stopped) {
        const r = getRecipe(m);
        const left = Math.ceil((1 - m.progress) * r.secs);
        if (eta === null || left < eta.left) eta = { left, name: ITEMS[r.out].name };
      }
    }
    if (eta) text += ' | ' + eta.name + ' selesai dalam ' + eta.left + ' dtk';
    if (text !== lastTargetText) {
      lastTargetText = text;
      $('target-text').textContent = text;
    }
    this.updateInspectLive();
    // Simpan otomatis throttled.
    saveTimer += dt;
    if (saveDirty && saveTimer > 5) { saveTimer = 0; saveGame(); }
  },
});
