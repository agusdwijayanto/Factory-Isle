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
      body.appendChild(row);
    }
    this.openPanel('tas-panel');
  },
});
