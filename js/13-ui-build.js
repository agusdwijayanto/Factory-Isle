// Menu bangun: tab, daftar item, pilih item, batal taruh.
// Pecahan 13-ui.js (v16).
Object.assign(UI, {
  // ---- Menu bangun ----
  openBuild() {
    this.openPanel('build-menu');
    this.renderBuildTabs();
    this.renderBuildItems();
  },
  renderBuildTabs() {
    $('build-tabs').innerHTML = '';
    for (const c of CATEGORIES) {
      const b = el('button', c.name);
      if (c.id === buildTab) b.className = 'on';
      b.addEventListener('click', () => { buildTab = c.id; this.renderBuildTabs(); this.renderBuildItems(); });
      $('build-tabs').appendChild(b);
    }
  },
  renderBuildItems() {
    const box = $('build-items');
    box.innerHTML = '';
    const cat = CATEGORIES.find((c) => c.id === buildTab);
    for (const item of cat.items) {
      const b = el('button', null, 'build-item');
      b.appendChild(this.buildIcon(item));
      const label = el('span');
      label.appendChild(document.createTextNode(item.name));
      const sub = el('small');
      const locked = item.kind === 'machine' && !S.unlocked[item.id];
      sub.textContent = locked ? 'Terkunci: riset ' + researchCostText(item.id) : item.sub;
      label.appendChild(sub);
      b.appendChild(label);
      if (locked) b.classList.add('locked');
      b.addEventListener('click', () => this.pickBuildItem(item, locked));
      box.appendChild(b);
    }
  },
  // Ikon menu = gambar sprite yang sama dengan yang tertempel di lahan
  // (Atlas.iconCanvas memotong sel atlas). Atlas belum siap = jatuh ke
  // kotak warna lama, supaya menu tetap kebuka.
  buildIcon(item) {
    try {
      if (typeof Atlas !== 'undefined' && Atlas.canvas) {
        const c = Atlas.iconCanvas(item.id, 28);
        if (c) return c; // null = sel belum ada, jatuh ke kotak warna
      }
    } catch (_) { /* jatuh ke kotak warna */ }
    const sw = el('span', null, 'sw');
    sw.style.background = item.color;
    return sw;
  },
  pickBuildItem(item, locked) {
    if (locked) {
      if (doResearch(item.id)) {
        SFX.play('success');
        this.toast(MACHINES[item.id].name + ' terbuka!');
        this.renderBuildItems();
        this.refreshHUD();
      } else {
        SFX.play('error');
        this.toast('Belum cukup untuk riset ' + MACHINES[item.id].name);
      }
      return;
    }
    if (S.map !== 'plot') {
      SFX.play('error');
      this.toast('Bangun hanya di lahanmu. Masuk lewat ujung jalan di selatan kota.');
      return;
    }
    S.placing = { kind: item.kind, id: item.id };
    S.placeDir = 0;
    S.placeSpot = null;
    this.closePanel('build-menu');
    $('btn-rotate').classList.remove('hidden');
    $('btn-place-cancel').classList.remove('hidden');
    $('btn-place-ok').classList.remove('hidden');
    this.setHint('Ketuk petak rumput kosong untuk bayangan ' + item.name + '. Centang menaruh, X batal, PUTAR arah.');
  },
  cancelPlacing() {
    S.placing = null;
    S.placeSpot = null;
    $('btn-rotate').classList.add('hidden');
    $('btn-place-cancel').classList.add('hidden');
    $('btn-place-ok').classList.add('hidden');
    this.setHint(HINT_HOME);
  },
});
