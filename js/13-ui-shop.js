// Panel toko: jual dan beli. Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Toko ----
  // Tiap toko beli dan jual barang beda dengan harga sendiri; harga yang
  // tidak dicantumkan berarti toko itu tidak melayani barang tersebut.
  openShop(shopId) {
    shopId = shopId && SHOPS[shopId] ? shopId : 'exchange';
    $('shop-title').textContent = SHOPS[shopId].name + ' — Jual / Beli';
    this.renderShop(shopId);
    this.openPanel('shop-panel');
  },
  renderShop(shopId) {
    const body = $('shop-body');
    body.innerHTML = '';
    const shop = SHOPS[shopId];
    const sellable = Object.keys(S.inv).filter((id) => shopSellPrice(shopId, id) !== null);
    if (!sellable.length) {
      body.appendChild(el('div', 'Toko ini tidak membeli barang yang ada di tasmu.', 'mp-desc'));
    }
    for (const id of sellable) {
      const price = shopSellPrice(shopId, id);
      const row = el('div', null, 'shop-row');
      const left = el('span', null, 'shop-item');
      const icon = iconEl(id);
      if (icon) left.appendChild(icon);
      left.appendChild(document.createTextNode(ITEMS[id].name + ' x' + invCount(id) + '  ($' + fmt(price) + ')'));
      row.appendChild(left);
      const btns = el('span', null, 'shop-btns');
      for (const n of [1, 10, Infinity]) {
        const b = el('button', n === Infinity ? 'Semua' : String(n));
        b.addEventListener('click', () => {
          const gain = sellItemAt(shopId, id, n);
          if (gain > 0) {
            SFX.play('coin');
            const p = playerTile();
            addFloater(p.gx, p.gy, '+$' + fmt(gain), '#ffd75e');
            this.toast('Terjual! +$' + fmt(gain));
          } else {
            SFX.play('error');
          }
          this.renderShop(shopId);
          this.refreshHUD();
        });
        btns.appendChild(b);
      }
      row.appendChild(btns);
      body.appendChild(row);
    }
    const buyable = shop.buy ? Object.keys(shop.buy) : [];
    if (buyable.length) {
      body.appendChild(el('div', 'Beli dari toko:', 'mp-desc'));
      for (const id of buyable) {
        const price = shop.buy[id];
        const row = el('div', null, 'shop-row');
        const left = el('span', null, 'shop-item');
        const icon = iconEl(id);
        if (icon) left.appendChild(icon);
        left.appendChild(document.createTextNode(ITEMS[id].name + '  ($' + fmt(price) + ')'));
        row.appendChild(left);
        const btns = el('span', null, 'shop-btns');
        for (const n of [1, 10]) {
          const b = el('button', String(n));
          b.addEventListener('click', () => {
            const bought = buyItem(shopId, id, n);
            if (bought > 0) {
              SFX.play('coin');
              this.toast('Terbeli ' + bought + ' ' + ITEMS[id].name + ' (-$' + fmt(price * bought) + ')');
            } else {
              SFX.play('error');
              this.toast('Uang tidak cukup.');
            }
            this.renderShop(shopId);
            this.refreshHUD();
          });
          btns.appendChild(b);
        }
        row.appendChild(btns);
        body.appendChild(row);
      }
    }
  },
});
