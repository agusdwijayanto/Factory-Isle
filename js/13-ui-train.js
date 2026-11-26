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
    body.appendChild(el('div', 'Kereta Trading Co. — angkutan cepat antar zona. Jalan kaki tetap bisa lewat ujung map.', 'mp-desc'));
    body.appendChild(el('div', 'Kereta di: ' + currentBlockName(), 'mp-desc'));
    // v56: stasiun cuma di Blok 1, 5, 9 — tujuan tampil nama blok.
    const TRAIN_BLOCK = { ice: 1, town: 5, harbor: 9 };
    for (const dest of ['ice', 'town', 'harbor']) {
      if (dest === S.map) continue;
      const row = el('div', null, 'mayor-row');
      row.appendChild(el('span', BLOCKS[TRAIN_BLOCK[dest]].name));
      const b = el('button', 'Naik');
      b.addEventListener('click', () => this.rideTrain(dest));
      row.appendChild(b);
      body.appendChild(row);
    }
    // v36: kereta jadi toko keliling — jual barang ke kereta harga papan.
    const sellable = Object.keys(S.inv).filter((id) => S.inv[id] > 0 && sellPrice(id) !== null);
    if (sellable.length) {
      body.appendChild(el('div', 'Jual ke kereta (harga papan):', 'mp-desc'));
      for (const id of sellable) {
        const row = el('div', null, 'shop-row');
        const left = el('span', null, 'shop-item');
        try { if (Atlas.canvas) left.appendChild(Atlas.iconCanvas('item_' + id, 28)); } catch (_) { /* abaikan */ }
        left.appendChild(document.createTextNode(ITEMS[id].name + ' x' + S.inv[id] + ' — $' + sellPrice(id)));
        row.appendChild(left);
        // v55: tombol 1/10/Semua dibungkus .shop-btns (dulu langsung di row, menyebar).
        const btns = el('span', null, 'shop-btns');
        for (const n of [1, 10, 0]) {
          const b = el('button', n === 0 ? 'Semua' : String(n));
          b.addEventListener('click', () => { sellItem(id, n === 0 ? (S.inv[id] || 0) : n); this.renderTrain(); });
          btns.appendChild(b);
        }
        row.appendChild(btns);
        body.appendChild(row);
      }
    }
  },
  rideTrain(dest) {
    const [gx, gy] = TRAIN_SPAWN[dest];
    this.closeAll();
    switchMap(dest, { fx: gx + 0.5, fy: gy + 0.5 });
    SFX.play('success');
  },
});
