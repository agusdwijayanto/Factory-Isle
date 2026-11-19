// Panel storage. Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Storage ----
  openStorage(gx, gy) {
    inspectKey = key(gx, gy);
    S.selected = inspectKey;
    this.renderStorage();
    this.openPanel('storage-panel');
  },
  renderStorage() {
    const st = S.storages.get(inspectKey);
    if (!st) return this.closeAll();
    $('storage-name').textContent = st.id === 'box' ? 'Wooden Box' : st.id === 'container' ? 'Container' : 'Storage Rack';
    const body = $('storage-body');
    body.innerHTML = '';
    const line = el('div', null, 'mp-desc');
    line.appendChild(document.createTextNode('Isi (' + bufferTotal(st.items) + '/' + STORAGE_CAP[st.id] + '): '));
    const entries = Object.entries(st.items);
    if (!entries.length) line.appendChild(document.createTextNode('kosong'));
    entries.forEach(([id, n]) => line.appendChild(chipWithIcon(id, n)));
    body.appendChild(line);
    body.appendChild(this.actionRow([
      ['Simpan semua bawaan', () => {
        for (const [id, n] of Object.entries(S.inv)) {
          const room = STORAGE_CAP[st.id] - bufferTotal(st.items);
          const move = Math.min(n, room);
          if (move <= 0) break;
          invAdd(id, -move);
          st.items[id] = (st.items[id] || 0) + move;
        }
        this.renderStorage(); this.refreshHUD(); saveSoon();
      }],
      ['Ambil semua', () => {
        for (const [id, n] of Object.entries(st.items)) invAdd(id, n);
        st.items = {};
        this.renderStorage(); this.refreshHUD(); saveSoon();
      }],
      ['Hapus', () => {
        for (const [id, n] of Object.entries(st.items)) invAdd(id, n);
        S.storages.delete(inspectKey);
        this.closeAll(); this.refreshHUD(); saveSoon();
      }],
    ]));
  },
});
