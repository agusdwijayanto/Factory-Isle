// Panel tas. Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Tas ----
  openTas() {
    const body = $('tas-body');
    body.innerHTML = '';
    const ids = Object.keys(S.inv);
    if (!ids.length) body.appendChild(el('div', 'Tas kosong. Panen dulu dengan mengetuk pohon atau bijih.', 'mp-desc'));
    for (const id of ids) {
      const row = el('div', null, 'shop-row');
      const left = el('span', null, 'shop-item');
      const icon = iconEl(id);
      if (icon) left.appendChild(icon);
      left.appendChild(document.createTextNode(ITEMS[id].name));
      row.appendChild(left);
      row.appendChild(el('span', 'x' + S.inv[id]));
      // v35: muat barang tas ke peti wagon (kalau wagon ada dan muat).
      if (S.wagon) {
        const b = el('button', 'Muat');
        b.addEventListener('click', () => {
          const moved = wagonLoad(id, S.inv[id] || 0);
          if (moved > 0) { SFX.play('place'); this.toast('Dimuat ke wagon: ' + ITEMS[id].name + ' x' + moved); }
          else { SFX.play('error'); this.toast('Peti wagon penuh.'); }
          this.openTas(); this.refreshHUD();
        });
        row.appendChild(b);
      }
      body.appendChild(row);
    }
    // v35: isi peti wagon + tombol ambil kembali ke tas.
    if (S.wagon) {
      body.appendChild(el('div', 'Peti Wagon (' + wagonItemsTotal() + '/' + wagonCap() + '):', 'mp-desc'));
      const wids = Object.keys(S.wagon.items);
      if (!wids.length) body.appendChild(el('div', 'Peti kosong.', 'mp-desc'));
      for (const id of wids) {
        const row = el('div', null, 'shop-row');
        const left = el('span', null, 'shop-item');
        const icon = iconEl(id);
        if (icon) left.appendChild(icon);
        left.appendChild(document.createTextNode(ITEMS[id].name));
        row.appendChild(left);
        row.appendChild(el('span', 'x' + S.wagon.items[id]));
        const b = el('button', 'Ambil');
        b.addEventListener('click', () => {
          wagonUnload(id, S.wagon.items[id] || 0);
          SFX.play('coin');
          this.openTas(); this.refreshHUD();
        });
        row.appendChild(b);
        body.appendChild(row);
      }
    }
    this.openPanel('tas-panel');
  },
});
