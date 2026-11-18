// Panel, HUD, tutorial, dan suara. Semua aksi di sini nyata.
const $ = (id) => document.getElementById(id);
const HINT_HOME = 'Ketuk petak untuk berjalan. Ketuk pohon, bijih, atau mesin untuk bekerja.';
let toastTimer = 0;
let buildTab = 'machines';
let inspectKey = null; // petak yang sedang diperiksa
let lastTargetText = '';

// Suara WebAudio tanpa aset: nada pendek per kejadian.
const SFXImpl = {
  ctx: null,
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { /* tanpa suara */ }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  tone(freq, dur, type, delay = 0) {
    if (!S.settings.sound) return;
    const c = this.ensure();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur);
  },
  play(name) {
    if (name === 'chop') this.tone(180, 0.06, 'square');
    else if (name === 'coin') { this.tone(1320, 0.07, 'sine'); this.tone(1760, 0.09, 'sine', 0.06); }
    else if (name === 'success') { this.tone(660, 0.09, 'sine'); this.tone(880, 0.12, 'sine', 0.08); }
    else if (name === 'error') this.tone(140, 0.15, 'sawtooth');
    else if (name === 'place') this.tone(220, 0.08, 'triangle');
    else if (name === 'craft') { this.tone(520, 0.08, 'sine'); this.tone(780, 0.1, 'sine', 0.07); }
  },
};
SFX = SFXImpl;
document.addEventListener('pointerdown', () => SFXImpl.ensure(), { once: true });

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function bufText(buf) {
  const parts = Object.entries(buf).map(([id, n]) => n + ' ' + ITEMS[id].name);
  return parts.length ? parts.join(', ') : 'kosong';
}

// Ikon item dari atlas untuk panel DOM. Atlas bisa belum siap saat panel
// pertama dibuka: kembalikan null supaya panel jatuh ke teks nama saja.
function iconEl(itemId) {
  try {
    if (Atlas.canvas) return Atlas.iconCanvas('item_' + itemId, 28);
  } catch (_) { /* abaikan */ }
  return null;
}
function chipWithIcon(itemId, n) {
  const span = document.createElement('span');
  span.className = 'chip icon-chip';
  const icon = iconEl(itemId);
  if (icon) span.appendChild(icon);
  span.appendChild(document.createTextNode(ITEMS[itemId].name + ' ' + n));
  return span;
}
let lastBufSig = '';

const UI = {
  toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
  },
  setHint(text) { $('hint').textContent = text; },

  refreshHUD() {
    $('money').textContent = '$' + fmt(S.money);
    $('mapname').textContent = S.map === 'plot' ? 'Lahan' : 'Kota';
    $('btn-tas').textContent = 'TAS (' + carriedTotal() + ')';
    // Bangun hanya di lahan: tombol disembunyikan di kota.
    $('btn-build').classList.toggle('hidden', S.map !== 'plot');
    if (S.map !== 'plot') {
      this.closePanel('build-menu');
      if (S.placing) this.cancelPlacing();
    }
  },

  // Satu panel dalam satu waktu: membuka panel lain menutup panel inspect/storage.
  openPanel(id) {
    ['build-menu', 'inspect-panel', 'storage-panel', 'shop-panel', 'tas-panel',
     'burger-menu', 'admin-panel', 'settings-panel', 'help-panel', 'mayor-panel'].forEach((p) => {
      if (p !== id) $(p).classList.add('hidden');
    });
    if (id !== 'inspect-panel' && id !== 'storage-panel') { inspectKey = null; S.selected = null; }
    $(id).classList.remove('hidden');
  },
  closePanel(id) { $(id).classList.add('hidden'); },
  closeAll() {
    ['build-menu', 'inspect-panel', 'storage-panel', 'shop-panel', 'tas-panel',
     'burger-menu', 'admin-panel', 'settings-panel', 'help-panel', 'mayor-panel'].forEach((id) => this.closePanel(id));
    S.selected = null; inspectKey = null;
    if (S.placing) this.cancelPlacing();
  },
  closeMachine() { this.closePanel('inspect-panel'); S.selected = null; inspectKey = null; },

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
      const sw = el('span', null, 'sw');
      sw.style.background = item.color;
      const label = el('span');
      label.appendChild(document.createTextNode(item.name));
      const sub = el('small');
      const locked = item.kind === 'machine' && !S.unlocked[item.id];
      sub.textContent = locked ? 'Terkunci: riset ' + researchCostText(item.id) : item.sub;
      label.appendChild(sub);
      b.appendChild(sw); b.appendChild(label);
      if (locked) b.classList.add('locked');
      b.addEventListener('click', () => this.pickBuildItem(item, locked));
      box.appendChild(b);
    }
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
      this.toast('Bangun hanya di lahanmu. Masuk lewat kotak plot putih di kota.');
      return;
    }
    S.placing = { kind: item.kind, id: item.id };
    S.placeDir = 0;
    this.closePanel('build-menu');
    $('btn-rotate').classList.remove('hidden');
    this.setHint('Ketuk petak rumput kosong untuk menaruh ' + item.name + '. PUTAR untuk arah, Esc batal.');
  },
  cancelPlacing() {
    S.placing = null;
    $('btn-rotate').classList.add('hidden');
    this.setHint(HINT_HOME);
  },

  // ---- Panel periksa: mesin / conveyor / dinding / dekor ----
  openInspect(gx, gy) {
    inspectKey = key(gx, gy);
    S.selected = inspectKey;
    this.renderInspect();
    this.openPanel('inspect-panel');
  },
  renderInspect() {
    if (!inspectKey) return;
    const [gx, gy] = inspectKey.split(',').map(Number);
    const body = $('insp-body');
    body.innerHTML = '';
    const m = S.machines.get(inspectKey);
    if (m) return this.renderMachineInspect(m, gx, gy, body);
    const c = S.conveyors.get(inspectKey);
    if (c) {
      $('insp-name').textContent = c.id === 'conveyorTilt' ? 'Inclined Conveyor' : 'Conveyor';
      body.appendChild(el('div', 'Mengalirkan item searah panah.', 'mp-desc'));
      body.appendChild(this.actionRow([
        ['Putar', () => { c.dir = (c.dir + 1) % 4; saveSoon(); }],
        ['Hapus (+$100)', () => { S.money += 100; S.conveyors.delete(inspectKey); this.closeMachine(); this.refreshHUD(); saveSoon(); }],
      ]));
      return;
    }
    const w = S.walls.get(inspectKey);
    if (w) {
      $('insp-name').textContent = w.id === 'wallWood' ? 'Wood Wall' : 'Iron Wall';
      body.appendChild(el('div', 'Dinding penghalang.', 'mp-desc'));
      body.appendChild(this.actionRow([['Hapus', () => { S.walls.delete(inspectKey); this.closeMachine(); saveSoon(); }]]));
      return;
    }
    const d = S.decor.get(inspectKey);
    if (d) {
      $('insp-name').textContent = d.id === 'lantern' ? 'Lantern' : 'Flowers';
      body.appendChild(el('div', 'Hiasan.', 'mp-desc'));
      body.appendChild(this.actionRow([['Hapus', () => { S.decor.delete(inspectKey); this.closeMachine(); saveSoon(); }]]));
      return;
    }
    this.closeMachine();
  },
  renderMachineInspect(m, gx, gy, body) {
    $('insp-name').textContent = MACHINES[m.id].name;
    body.appendChild(el('div', MACHINES[m.id].desc, 'mp-desc'));
    const recipes = RECIPES[m.id];
    const row = el('div', null, 'mp-recipes');
    recipes.forEach((r, i) => {
      const b = el('button', null);
      const icon = iconEl(r.out);
      if (icon) b.appendChild(icon);
      b.appendChild(document.createTextNode(ITEMS[r.out].name + ' x' + r.n));
      if (i === m.recipe) b.className = 'on';
      b.addEventListener('click', () => {
        if (i !== m.recipe) {
          for (const [id, n] of Object.entries(m.input)) invAdd(id, n);
          m.input = {}; m.progress = 0;
          m.recipe = i;
          this.renderInspect();
        }
      });
      row.appendChild(b);
    });
    body.appendChild(row);
    body.appendChild(el('div', recipeLabel(m), 'mp-recipe'));
    const buf = el('div', null, 'mp-buffers');
    buf.id = 'insp-buffers';
    body.appendChild(buf);
    const bar = el('div', null, 'mp-bar');
    const fill = el('div');
    fill.id = 'insp-progress';
    bar.appendChild(fill);
    body.appendChild(bar);
    // Status mesin selalu terlihat, supaya diamnya mesin tidak misterius.
    const status = el('div', null, 'mp-status');
    status.id = 'insp-status';
    body.appendChild(status);
    body.appendChild(this.actionRow([
      ['Masukkan bahan', () => { depositTo(m); this.renderInspect(); }],
      ['Ambil hasil', () => { takeFrom(m); this.renderInspect(); this.refreshHUD(); }],
    ]));
    body.appendChild(this.actionRow([
      ['Eject', () => { ejectMachine(m); SFX.play('place'); this.renderInspect(); this.refreshHUD(); }],
      [m.stopped ? 'Lanjutkan' : 'Stop', () => { m.stopped = !m.stopped; this.renderInspect(); saveSoon(); }],
    ]));
    body.appendChild(this.actionRow([
      ['Putar', () => { m.dir = (m.dir + 1) % 4; saveSoon(); }],
      ['Pindah', () => {
        S.placing = { kind: 'machine', id: m.id, fromKey: inspectKey };
        S.placeDir = m.dir;
        this.closeMachine();
        $('btn-rotate').classList.remove('hidden');
        this.setHint('Ketuk petak baru untuk ' + MACHINES[m.id].name + '.');
      }],
      ['Hapus', () => {
        ejectMachine(m);
        S.machines.delete(inspectKey);
        this.closeMachine(); this.refreshHUD(); saveSoon();
      }],
    ]));
    lastBufSig = '';
    this.updateInspectLive();
  },
  updateInspectLive() {
    if (!inspectKey) return;
    const m = S.machines.get(inspectKey);
    const fill = $('insp-progress'), buf = $('insp-buffers'), st = $('insp-status');
    if (m && fill) fill.style.width = Math.round(m.progress * 100) + '%';
    // Chip buffer dibangun ulang hanya bila isinya berubah: fungsi ini
    // dipanggil tiap tick, rebuild DOM tiap frame bikin panel berkedip.
    if (m && buf) {
      const sig = JSON.stringify(m.input) + '|' + JSON.stringify(m.output);
      if (sig !== lastBufSig) {
        lastBufSig = sig;
        buf.innerHTML = '';
        buf.appendChild(el('span', 'Masuk: '));
        const ins = Object.entries(m.input);
        if (!ins.length) buf.appendChild(document.createTextNode('kosong'));
        ins.forEach(([id, n]) => buf.appendChild(chipWithIcon(id, n)));
        buf.appendChild(el('span', '  Keluar: '));
        const outs = Object.entries(m.output);
        if (!outs.length) buf.appendChild(document.createTextNode('kosong'));
        outs.forEach(([id, n]) => buf.appendChild(chipWithIcon(id, n)));
      }
    }
    if (m && st) {
      st.textContent = m.stopped ? 'Dihentikan (Stop). Tekan Lanjutkan untuk jalan lagi.'
        : m.progress > 0 ? 'Sedang mengolah.'
        : !inputsOk(m) ? 'Menunggu bahan: ' + missingList(m) + '.'
        : !outputRoom(m) ? 'Output penuh — Ambil hasil atau sambung conveyor/storage.'
        : 'Siap mengolah.';
    }
  },
  actionRow(pairs) {
    const row = el('div', null, 'mp-actions');
    for (const [label, fn] of pairs) {
      const b = el('button', label);
      b.addEventListener('click', fn);
      row.appendChild(b);
    }
    return row;
  },

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

  // ---- Toko ----
  openShop() {
    this.renderShop();
    this.openPanel('shop-panel');
  },
  renderShop() {
    const body = $('shop-body');
    body.innerHTML = '';
    const sellable = Object.keys(S.inv).filter((id) => sellPrice(id) !== null);
    if (!sellable.length) {
      body.appendChild(el('div', 'Tas kosong atau hanya berisi komponen yang tidak dijual (Coil, Gear).', 'mp-desc'));
      return;
    }
    for (const id of sellable) {
      const row = el('div', null, 'shop-row');
      const left = el('span', null, 'shop-item');
      const icon = iconEl(id);
      if (icon) left.appendChild(icon);
      left.appendChild(document.createTextNode(ITEMS[id].name + ' x' + invCount(id) + '  ($' + fmt(sellPrice(id)) + ')'));
      row.appendChild(left);
      const btns = el('span', null, 'shop-btns');
      for (const n of [1, 10, Infinity]) {
        const b = el('button', n === Infinity ? 'Semua' : String(n));
        b.addEventListener('click', () => {
          const gain = sellItem(id, n);
          if (gain > 0) {
            SFX.play('coin');
            const p = playerTile();
            addFloater(p.gx, p.gy, '+$' + fmt(gain), '#ffd75e');
            this.toast('Terjual! +$' + fmt(gain));
          } else {
            SFX.play('error');
          }
          this.renderShop();
          this.refreshHUD();
        });
        btns.appendChild(b);
      }
      row.appendChild(btns);
      body.appendChild(row);
    }
  },

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

  // ---- Tutorial + target ----
  tick(dt) {
    // Tutorial maju sendiri saat syarat langkah terpenuhi.
    if (!S.tutDone && S.tut < TUTORIAL.length && TUTORIAL[S.tut].done()) {
      S.tut++;
      SFX.play('success');
      this.toast('Target selesai!');
      if (S.tut >= TUTORIAL.length) S.tutDone = true;
      saveSoon();
    }
    let text;
    if (S.tutDone) text = 'Bebas: kembangkan pabrikmu. Target: buat 1 Motor.';
    else text = 'Target: ' + TUTORIAL[Math.min(S.tut, TUTORIAL.length - 1)].text;
    // ETA: sisa waktu crafting terdekat yang sedang berjalan.
    let eta = null;
    for (const m of S.machines.values()) {
      if (m.progress > 0 && !m.stopped) {
        const r = getRecipe(m);
        const left = Math.ceil((1 - m.progress) * r.secs);
        if (eta === null || left < eta.left) eta = { left, name: ITEMS[r.out].name };
      }
    }
    if (eta) text += ' | ' + eta.name + ' selesai dalam ' + eta.left + ' dtk';
    if (text !== lastTargetText) {
      lastTargetText = text;
      $('target-text').textContent = text;
    }
    this.updateInspectLive();
    // Simpan otomatis throttled.
    saveTimer += dt;
    if (saveDirty && saveTimer > 5) { saveTimer = 0; saveGame(); }
  },
};

// Sekali tekan, semua bahan resep yang ada di tas masuk, berapa pun.
// Buffer input tidak dibatasi: batas 30 dulu membuat satu bahan
// menguasai buffer dan memblokir bahan lain (Carpenter macet di v8).
// Mesin tetap diam sampai 1 ronde lengkap terkumpul (inputsOk).
function depositTo(m) {
  const r = getRecipe(m);
  if (!r) return;
  const moved = [];
  for (const [id] of Object.entries(r.in)) {
    const take = invCount(id);
    if (take <= 0) continue;
    invAdd(id, -take);
    m.input[id] = (m.input[id] || 0) + take;
    moved.push(ITEMS[id].name + ' ' + take);
  }
  if (moved.length) {
    SFX.play('place');
    UI.toast('Bahan masuk: ' + moved.join(', ') + missingNote(m));
    UI.refreshHUD();
  } else {
    SFX.play('error');
    UI.toast('Tidak ada bahan resep ini di tas');
  }
  saveSoon();
}

// Bahan yang masih kurang untuk 1 ronde, supaya jelas apa yang dicari.
function missingList(m) {
  const r = getRecipe(m);
  if (!r) return '';
  return Object.entries(r.in)
    .filter(([id, n]) => (m.input[id] || 0) < n)
    .map(([id, n]) => ITEMS[id].name + ' ' + (n - (m.input[id] || 0)) + ' lagi')
    .join(', ');
}

function missingNote(m) {
  const miss = missingList(m);
  return miss ? '. Kurang: ' + miss : '';
}

function takeFrom(m) {
  const n = bufferTotal(m.output);
  if (!n) { SFX.play('error'); UI.toast('Belum ada hasil'); return; }
  for (const [id, q] of Object.entries(m.output)) invAdd(id, q);
  m.output = {};
  SFX.play('coin');
  UI.toast('Diambil ' + n + ' item');
  saveSoon();
}

// ---- Kait tombol statis ----
$('btn-build').addEventListener('click', () => {
  const menu = $('build-menu');
  if (menu.classList.contains('hidden')) UI.openBuild();
  else UI.closePanel('build-menu');
});
$('btn-tas').addEventListener('click', () => UI.openTas());
$('btn-rotate').addEventListener('click', () => { S.placeDir = (S.placeDir + 1) % 4; });
$('btn-burger').addEventListener('click', () => {
  const m = $('burger-menu');
  if (m.classList.contains('hidden')) UI.openPanel('burger-menu');
  else m.classList.add('hidden');
});
$('btn-skip').addEventListener('click', () => {
  S.tutDone = true;
  UI.toast('Tutorial dilewati');
  saveSoon();
});
document.querySelectorAll('[data-close]').forEach((b) => {
  b.addEventListener('click', () => {
    if (b.dataset.close === 'inspect-panel') UI.closeMachine();
    else if (b.dataset.close === 'storage-panel') UI.closeAll();
    else $(b.dataset.close).classList.add('hidden');
  });
});
document.querySelectorAll('#burger-menu [data-act]').forEach((b) => {
  b.addEventListener('click', () => {
    $('burger-menu').classList.add('hidden');
    const act = b.dataset.act;
    if (act === 'Pengaturan') UI.openPanel('settings-panel');
    else if (act === 'Bantuan') UI.openPanel('help-panel');
    else if (act === 'Admin') UI.openPanel('admin-panel');
  });
});
$('btn-sound').addEventListener('click', () => {
  S.settings.sound = !S.settings.sound;
  $('btn-sound').textContent = 'Suara: ' + (S.settings.sound ? 'Hidup' : 'Mati');
  saveSoon();
});
$('btn-center').addEventListener('click', () => {
  const p = S.player;
  const c = isoPoint(p.fx, p.fy, { x: 0, y: 0, zoom: S.cam.zoom });
  S.cam.x = VW / 2 - c.x;
  S.cam.y = VH / 2 - c.y;
  UI.closePanel('settings-panel');
});
$('btn-zoom-reset').addEventListener('click', () => {
  S.cam.zoom = clampZoom(Math.min(1, window.innerWidth / 760));
  centerCamera(window.innerWidth, window.innerHeight);
  UI.closePanel('settings-panel');
});
document.querySelectorAll('#admin-panel [data-admin]').forEach((b) => {
  b.addEventListener('click', () => {
    const act = b.dataset.admin;
    if (act === 'money') {
      S.money += 1000;
      UI.toast('ADMIN: +$1.000');
    } else if (act === 'materials') {
      ['Log', 'IronOre', 'CopperOre', 'TinOre', 'Sand', 'Clay', 'Cotton'].forEach((id) => invAdd(id, 50));
      ['Plank', 'Pillar', 'Firelog', 'Brick', 'Glass', 'IronIngot', 'CopperIngot', 'BronzeIngot',
       'Coil', 'Gear', 'IronBeam', 'IronFrame', 'Nails', 'WoodFrame'].forEach((id) => invAdd(id, 20));
      UI.toast('ADMIN: material ditambah');
    } else if (act === 'unlock') {
      Object.keys(MACHINES).forEach((id) => { S.unlocked[id] = true; });
      UI.toast('ADMIN: semua resep terbuka');
    } else if (act === 'finish') {
      finishAllInstant();
      UI.toast('ADMIN: crafting diselesaikan instan');
    } else if (act === 'reset') {
      if (window.confirm('Hapus simpan dan mulai dari awal?')) {
        resetSave();
        window.location.reload();
      }
      return;
    }
    SFX.play('success');
    UI.refreshHUD();
    saveSoon();
  });
});
TOAST = (msg) => UI.toast(msg);
