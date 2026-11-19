// Panel Book: riwayat versi game (changelog dari CHANGELOG di
// 03-data-items.js, ringkasan ROADMAP.md). Pecahan 13-ui.js (v36).
Object.assign(UI, {
  // ---- Book ----
  openBook() {
    const body = $('book-body');
    body.innerHTML = '';
    body.appendChild(el('div', 'Riwayat versi Indotopia — yang baru di atas.', 'mp-desc'));
    for (const [v, text] of CHANGELOG) {
      const row = el('div', null, 'shop-row');
      row.appendChild(el('span', v, 'shop-item'));
      row.appendChild(el('span', text, 'shop-item'));
      body.appendChild(row);
    }
    this.openPanel('book-panel');
  },
});
