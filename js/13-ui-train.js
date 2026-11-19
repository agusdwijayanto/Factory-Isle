// Panel kereta: pilih tujuan, naik. Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Kereta ----
  // Naik dari kereta; tujuan yang sedang dituju tidak ditawarkan.
  openTrain() {
    this.renderTrain();
    this.openPanel('train-panel');
  },
  renderTrain() {
    const body = $('train-body');
    body.innerHTML = '';
    body.appendChild(el('div', 'Kereta 130 Trading Co. — angkutan cepat antar zona. Jalan kaki tetap bisa lewat ujung map.', 'mp-desc'));
    for (const dest of ['mountain', 'forest', 'town', 'harbor']) {
      if (dest === S.map) continue;
      const row = el('div', null, 'mayor-row');
      row.appendChild(el('span', MAP_NAMES[dest]));
      const b = el('button', 'Naik');
      b.addEventListener('click', () => this.rideTrain(dest));
      row.appendChild(b);
      body.appendChild(row);
    }
  },
  rideTrain(dest) {
    const [gx, gy] = TRAIN_SPAWN[dest];
    this.closeAll();
    switchMap(dest, { fx: gx + 0.5, fy: gy + 0.5 });
    SFX.play('success');
  },
});
