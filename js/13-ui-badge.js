// Panel badge: daftar pencapaian buka resep. Pecahan 13-ui.js (v35).
// Badge diberikan saat resep dibuka (research); research tetap jadi cara
// membuka, badge hanya penanda.
Object.assign(UI, {
  // ---- Badge ----
  openBadges() {
    const body = $('badge-body');
    body.innerHTML = '';
    const got = Object.keys(BADGES).filter((id) => S.badges[id]).length;
    body.appendChild(el('div', 'Badge didapat: ' + got + ' / ' + Object.keys(BADGES).length + '. Badge diberikan saat resep dibuka.', 'mp-desc'));
    for (const [id, b] of Object.entries(BADGES)) {
      const row = el('div', null, 'shop-row');
      const left = el('span', null, 'shop-item');
      try { if (Atlas.canvas) left.appendChild(Atlas.iconCanvas('badge', 28)); } catch (_) { /* abaikan */ }
      left.appendChild(document.createTextNode(b.name + ' — ' + b.desc));
      row.appendChild(left);
      row.appendChild(el('span', S.badges[id] ? 'Didapat' : 'Belum'));
      body.appendChild(row);
    }
    this.openPanel('badge-panel');
  },
});
