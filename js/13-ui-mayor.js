// Panel Mayor: ekspansi lahan + Auto Seller. Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Mayor: ekspansi lahan + Auto Seller ----
  openMayor() {
    this.renderMayor();
    this.openPanel('mayor-panel');
  },
  renderMayor() {
    const body = $('mayor-body');
    body.innerHTML = '';
    body.appendChild(el('div', 'Perbesar lahanmu. Sesudah semua ekspansi, Auto Seller menjual hasil pabrik secara berkala.', 'mp-desc'));
    const m = S.maps.plot;
    body.appendChild(el('div', 'Lahan sekarang: ' + m.w + 'x' + m.h + ' petak.', 'mp-desc'));
    const list = el('div', null, 'mayor-list');
    EXPANSIONS.forEach((ex, i) => {
      const done = i < S.expansion;
      const row = el('div', null, 'mayor-row');
      row.appendChild(el('span', (done ? '✓ ' : '') + ex.name + ' — ' + ex.w + 'x' + ex.h + ' ($' + fmt(ex.cost) + ')'));
      const b = el('button', done ? 'Terbeli' : 'Beli');
      b.disabled = done || i !== S.expansion || S.money < ex.cost;
      b.addEventListener('click', () => {
        if (buyExpansion()) {
          SFX.play('success');
          this.toast('Lahan membesar menjadi ' + ex.w + 'x' + ex.h + '!');
          this.renderMayor(); this.refreshHUD();
        }
      });
      row.appendChild(b);
      list.appendChild(row);
    });
    const row = el('div', null, 'mayor-row');
    row.appendChild(el('span', (S.autoSeller ? '✓ ' : '') + 'Auto Seller — jual otomatis tiap ' + AUTO_SELLER_EVERY + ' dtk ($' + fmt(AUTO_SELLER_COST) + ')'));
    const b = el('button', S.autoSeller ? 'Aktif' : 'Beli');
    b.disabled = !canBuyAutoSeller();
    b.addEventListener('click', () => {
      if (buyAutoSeller()) {
        SFX.play('success');
        this.toast('Auto Seller aktif!');
        this.renderMayor(); this.refreshHUD();
      }
    });
    row.appendChild(b);
    list.appendChild(row);
    body.appendChild(list);
    if (S.expansion < EXPANSIONS.length) {
      body.appendChild(el('div', 'Auto Seller terbuka sesudah semua ekspansi dibeli.', 'mp-desc'));
    }
  },
});
