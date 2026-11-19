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
    // Simpan otomatis throttled.
    saveTimer += dt;
    if (saveDirty && saveTimer > 5) { saveTimer = 0; saveGame(); }
  },
});
