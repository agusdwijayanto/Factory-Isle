// Panel periksa mesin/conveyor/dinding/dekor.
// Pecahan 13-ui.js (v16).
Object.assign(UI, {
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
      $('insp-name').textContent = c.id === 'conveyorTilt' ? 'Inclined Conveyor' : c.id === 'sorter' ? 'Sorter' : 'Conveyor';
      body.appendChild(el('div', c.id === 'sorter' ? 'Hanya melewatkan 1 jenis barang (pilih di bawah).' : 'Mengalirkan item searah panah.', 'mp-desc'));
      // v36: warna conveyor (visual saja) — border tombol = warnanya.
      const colorRow = el('div', null, 'mp-recipes');
      for (const [cid, cname] of Object.entries(CONVEYOR_COLOR_NAMES)) {
        const b = el('button', cname);
        if ((c.color || 'gold') === cid) b.className = 'on';
        b.style.borderColor = CONVEYOR_COLOR_HEX[cid];
        b.addEventListener('click', () => { c.color = cid === 'gold' ? null : cid; saveSoon(); this.renderInspect(); });
        colorRow.appendChild(b);
      }
      body.appendChild(colorRow);
      // v36: Sorter — pilih 1 jenis barang yang dilewatkan (null = semua).
      if (c.id === 'sorter') {
        const filterRow = el('div', null, 'mp-recipes');
        const choices = [null, 'Log', 'Plank', 'Firelog', 'IronOre', 'CopperOre', 'TinOre', 'Sand', 'Clay', 'Cotton', 'IronIngot', 'Brick', 'WoodFrame'];
        for (const fid of choices) {
          const b = el('button', fid === null ? 'Semua' : ITEMS[fid].name);
          if ((c.filter || null) === fid) b.className = 'on';
          b.addEventListener('click', () => { c.filter = fid; saveSoon(); this.renderInspect(); });
          filterRow.appendChild(b);
        }
        body.appendChild(filterRow);
      }
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
      // v35: patung juga disimpan sebagai dekor; namanya dari STATUES.
      $('insp-name').textContent = STATUES[d.id] ? STATUES[d.id].name : (d.id === 'lantern' ? 'Lantern' : 'Flowers');
      body.appendChild(el('div', STATUES[d.id] ? 'Patung: +' + STATUES[d.id].bonus + ' Housing.' : 'Hiasan.', 'mp-desc'));
      body.appendChild(this.actionRow([['Hapus', () => { S.decor.delete(inspectKey); this.closeMachine(); saveSoon(); }]]));
      return;
    }
    this.closeMachine();
  },
  renderMachineInspect(m, gx, gy, body) {
    $('insp-name').textContent = MACHINES[m.id].name;
    body.appendChild(el('div', MACHINES[m.id].desc, 'mp-desc'));
    const recipes = RECIPES[m.id];
    if (recipes) {
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
    } else {
      // Mesin tanpa resep (Tree Generator / Harvester / Ore Generator /
      // Storage Crane): jalan otomatis, tidak ada resep untuk dipilih dan
      // tidak ada bahan untuk dimasukkan.
      const AUTO_TEXT = {
        treeGen: 'Otomatis: menumbuhkan 1 pohon tiap 20 detik di petak rumput sebelah.',
        harvester: 'Otomatis: menebang pohon terdekat di lahan jadi 3 Log tiap 12 detik.',
        oreGen: 'Otomatis: menghasilkan 1 bijih (Iron/Copper/Tin bergiliran) tiap 20 detik ke output.',
        crane: 'Otomatis: mengambil 1 barang dari storage di sebelah tiap 5 detik ke output.',
      };
      body.appendChild(el('div', AUTO_TEXT[m.id] || 'Otomatis.', 'mp-recipe'));
    }
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
    const acts1 = [];
    if (recipes) acts1.push(['Masukkan bahan', () => { depositTo(m); this.renderInspect(); }]);
    acts1.push(['Ambil hasil', () => { takeFrom(m); this.renderInspect(); this.refreshHUD(); }]);
    body.appendChild(this.actionRow(acts1));
    body.appendChild(this.actionRow([
      ['Eject', () => { ejectMachine(m); SFX.play('place'); this.renderInspect(); this.refreshHUD(); }],
      [m.stopped ? 'Lanjutkan' : 'Stop', () => { m.stopped = !m.stopped; this.renderInspect(); saveSoon(); }],
    ]));
    body.appendChild(this.actionRow([
      ['Putar', () => { m.dir = (m.dir + 1) % 4; saveSoon(); }],
      ['Pindah', () => {
        S.placing = { kind: 'machine', id: m.id, fromKey: inspectKey };
        S.placeDir = m.dir;
        S.placeSpot = null;
        this.closeMachine();
        $('btn-rotate').classList.remove('hidden');
        $('btn-place-cancel').classList.remove('hidden');
        $('btn-place-ok').classList.remove('hidden');
        this.setHint('Ketuk petak baru untuk ' + MACHINES[m.id].name + '. Centang pindah, X batal, tombol putar.');
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
        : !RECIPES[m.id] ? (m.id === 'treeGen' ? 'Menumbuhkan pohon di petak sebelah.' : m.id === 'oreGen' ? 'Menghasilkan bijih ke output.' : m.id === 'crane' ? 'Mengambil barang dari storage sebelah.' : 'Menebang pohon di lahan.')
        : m.progress > 0 ? 'Sedang mengolah.'
        : !inputsOk(m) ? 'Menunggu bahan: ' + missingList(m) + '.'
        : !outputRoom(m) ? 'Output penuh — Ambil hasil atau sambung conveyor/storage.'
        : !canStart(m) ? 'Batas item aktif 150 tercapai — jual/simpan barang.'
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

});

// Ambil/masuk bahan mesin. Dipakai renderMachineInspect di atas.
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
    if (!adminOn()) invAdd(id, -take); // Mode Admin: bahan disalin, tas tidak berkurang
    m.input[id] = (m.input[id] || 0) + take;
    moved.push(ITEMS[id].name + ' ' + take);
  }
  if (moved.length) {
    SFX.play('place');
    UI.toast('Bahan masuk: ' + moved.join(', ') + missingNote(m));
    UI.refreshHUD();
  } else if (adminOn()) {
    SFX.play('place');
    UI.toast('Mode Admin: bahan infinite, mesin jalan tanpa deposit');
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
