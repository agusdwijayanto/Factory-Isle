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
              this.toast('Terbeli ' + bought + ' ' + ITEMS[id].name + ' (-$' + fmt(adminOn() ? 0 : price * bought) + ')');
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
    // v35: Tool Shop jual + upgrade perkakas (kapak, sekop, pickaxe).
    if (shopId === 'toolshop') {
      body.appendChild(el('div', 'Perkakas (upgrade = tebang/gali/tambang lebih cepat, tanpa daya tahan):', 'mp-desc'));
      for (const toolId of ['axe', 'shovel', 'pickaxe']) {
        const lvl = S.tools[toolId] || 0;
        const cost = toolNextCost(toolId);
        const row = el('div', null, 'shop-row');
        const left = el('span', null, 'shop-item');
        // Ikon perkakas di atlas bernama 'axe'/'shovel'/'pickaxe' (bukan item_...).
        try { if (Atlas.canvas) left.appendChild(Atlas.iconCanvas(toolId, 28)); } catch (_) { /* abaikan */ }
        left.appendChild(document.createTextNode(TOOLS[toolId].name + ' — ' + TOOL_LEVEL_NAMES[lvl] + (cost === null ? '' : '  ($' + fmt(cost) + ')')));
        row.appendChild(left);
        const btns = el('span', null, 'shop-btns');
        const b = el('button', cost === null ? 'Maks' : (lvl === 0 ? 'Beli' : 'Upgrade'));
        b.disabled = cost === null || (!adminOn() && S.money < cost);
        b.addEventListener('click', () => {
          if (buyTool(toolId)) {
            SFX.play('success');
            this.toast(TOOLS[toolId].name + ' sekarang ' + TOOL_LEVEL_NAMES[S.tools[toolId]] + '!');
          } else {
            SFX.play('error');
            this.toast('Uang tidak cukup.');
          }
          this.renderShop(shopId);
          this.refreshHUD();
        });
        btns.appendChild(b);
        row.appendChild(btns);
        body.appendChild(row);
      }
    }
  },
});
