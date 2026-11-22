// Menu plot: 4 slot save + wagon. Pecahan 13-ui.js (v35).
// v52-cozy: slot visual diperkaya (uang, waktu, ekspansi, badge aktif).
let plotResetSlot = 0;

Object.assign(UI, {
  openPlot() {
    plotResetSlot = 0;
    this.renderPlot();
    this.openPanel('plot-panel');
  },

  renderPlot() {
    const body = $('plot-body');
    body.innerHTML = '';

    // --- Deskripsi ---
    body.appendChild(el('div',
      'Pilih slot save. Muat = pindah ke slot itu. Lepas = simpan lalu keluar. Reset = hapus sebagian isi.',
      'mp-desc'
    ));
    if (S.saveSlot) {
      body.appendChild(el('div', '▶ Slot aktif: ' + S.saveSlot, 'mp-desc mp-desc--active'));
    }

    // --- 4 Slot ---
    for (let n = 1; n <= 4; n++) {
      const info    = slotInfo(n);
      const locked  = !info && n > 1 && !slotUnlocked(n);
      const isActive = n === S.saveSlot;

      // Card slot
      const card = el('div', null, 'save-slot' + (isActive ? ' save-slot--active' : '') + (!info ? ' empty' : ''));

      if (!info && !locked) {
        // Kosong
        card.appendChild(el('span', '— Slot ' + n + ' kosong —', 'slot-name'));
      } else if (locked) {
        // Terkunci
        const lockEl = el('div', null, '');
        lockEl.appendChild(el('span', 'Slot ' + n, 'slot-name'));
        lockEl.appendChild(el('span', '🔒 Terkunci — $' + fmt(SLOT_UNLOCK_COST[n]) + ' untuk buka', 'slot-time'));
        card.appendChild(lockEl);
      } else {
        // Ada data
        const header = el('div', null, 'slot-header');
        header.appendChild(el('span', 'Slot ' + n + (isActive ? ' ▶ aktif' : ''), 'slot-name'));

        // Waktu save
        const ts = info.savedAt ? new Date(info.savedAt) : null;
        const timeStr = ts
          ? ts.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })
            + ' ' + ts.toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
          : 'Waktu tidak diketahui';
        header.appendChild(el('span', timeStr, 'slot-time'));
        card.appendChild(header);

        // Info baris
        const infoRow = el('div', null, 'slot-info-row');
        infoRow.appendChild(el('span', '💰 $' + fmt(info.money), 'slot-money'));
        infoRow.appendChild(el('span', '🗺 ' + info.w + '×' + info.h, 'slot-money'));
        infoRow.appendChild(el('span', '⬆ Ekspansi ' + info.expansion, 'slot-time'));
        card.appendChild(infoRow);
      }

      // Tombol aksi
      const btns = el('div', null, 'slot-actions');

      const bLoad = el('button', locked ? '🔓 Buka ($' + fmt(SLOT_UNLOCK_COST[n]) + ')' : '▶ Muat');
      bLoad.className = 'btn-primary';
      bLoad.disabled = isActive;
      bLoad.addEventListener('click', () => {
        const r = loadSlot(n);
        if (r === 'locked') {
          SFX.play('error');
          this.toast('Uang tidak cukup untuk buka Slot ' + n + ' ($' + fmt(SLOT_UNLOCK_COST[n]) + ').');
        } else {
          SFX.play('success');
          this.toast(r === 'fresh' ? 'Slot ' + n + ' baru dibuat.' : 'Slot ' + n + ' dimuat.');
        }
        this.renderPlot(); this.refreshHUD();
      });
      btns.appendChild(bLoad);

      const bReset = el('button', '↺ Reset');
      bReset.className = 'btn-secondary';
      bReset.disabled = !info;
      bReset.addEventListener('click', () => {
        plotResetSlot = plotResetSlot === n ? 0 : n;
        this.renderPlot();
      });
      btns.appendChild(bReset);

      if (isActive) {
        const bOut = el('button', '⏏ Lepas');
        bOut.className = 'btn-secondary';
        bOut.addEventListener('click', () => {
          unloadSlot();
          SFX.play('place');
          this.toast('Save dilepas. Muat slot lain untuk main lagi.');
          this.renderPlot(); this.refreshHUD();
        });
        btns.appendChild(bOut);
      }

      card.appendChild(btns);
      body.appendChild(card);

      // Sub-menu reset
      if (plotResetSlot === n) {
        const rr = el('div', null, 'save-slot save-slot--reset');
        rr.appendChild(el('span', 'Reset slot ' + n + ' — pilih bagian:', 'slot-name'));
        const rb = el('div', null, 'slot-actions');
        for (const [part, label] of [['items','🎒 Barang'], ['buildings','🏗 Bangunan'], ['upgrades','📐 Upgrade lahan']]) {
          const b = el('button', label);
          b.className = 'btn-danger';
          b.addEventListener('click', () => {
            if (resetSlotPart(n, part)) {
              SFX.play('success');
              this.toast('Slot ' + n + ' direset: ' + label + '.');
            } else {
              SFX.play('error');
              this.toast('Reset gagal.');
            }
            plotResetSlot = 0;
            this.renderPlot(); this.refreshHUD();
          });
          rb.appendChild(b);
        }
        rr.appendChild(rb);
        body.appendChild(rr);
      }
    }

    // ---- Wagon ----
    body.appendChild(el('div', 'Wagon — transportasi: jalan kaki lv1, wagon lv2, kereta lv3.', 'mp-desc'));

    if (!S.wagon) {
      const row = el('div', null, 'save-slot');
      row.appendChild(el('span', '🛒 Wagon — $' + fmt(WAGON_BUY_COST) + ' (peti 5 barang)', 'slot-name'));
      const b = el('button', 'Beli Wagon');
      b.className = 'btn-primary';
      b.disabled = !adminOn() && S.money < WAGON_BUY_COST;
      b.addEventListener('click', () => {
        if (buyWagon()) { SFX.play('success'); this.toast('Wagon dibeli! Ketuk untuk naik.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      const ba = el('div', null, 'slot-actions');
      ba.appendChild(b);
      row.appendChild(ba);
      body.appendChild(row);
    } else {
      const w = S.wagon;
      body.appendChild(el('div',
        '🛒 Wagon lv' + w.level + ' — peti ' + wagonItemsTotal() + '/' + wagonCap() +
        ', kuda: ' + w.horses + (w.riding ? ' (ditunggangi)' : ''),
        'mp-desc'
      ));

      // Naik tingkat
      const nextCap = w.level < WAGON_LEVELS.length ? WAGON_LEVELS[w.level] : null;
      const r1 = el('div', null, 'save-slot');
      r1.appendChild(el('span', nextCap ? '⬆ Naik tingkat — peti ' + nextCap.cap + ' ($' + fmt(nextCap.cost) + ')' : '✅ Tingkat wagon maks.', 'slot-name'));
      const bUp = el('button', 'Naik Tingkat');
      bUp.className = 'btn-primary';
      bUp.disabled = !nextCap || (!adminOn() && S.money < nextCap.cost);
      bUp.addEventListener('click', () => {
        if (upgradeWagon()) { SFX.play('success'); this.toast('Wagon naik tingkat! Peti ' + wagonCap() + '.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      const ba1 = el('div', null, 'slot-actions'); ba1.appendChild(bUp); r1.appendChild(ba1);
      body.appendChild(r1);

      // Kuda
      const horseCost = w.horses < 2 ? WAGON_HORSE_COST[w.horses] : null;
      const r2 = el('div', null, 'save-slot');
      r2.appendChild(el('span',
        horseCost ? (w.horses === 0 ? '🐴 Speed+ 1 kuda' : '🐴🐴 Speed++ 2 kuda') + ' ($' + fmt(horseCost) + ')' : '✅ Kuda maks (2).',
        'slot-name'
      ));
      const bHorse = el('button', 'Beli Kuda');
      bHorse.className = 'btn-primary';
      bHorse.disabled = !horseCost || (!adminOn() && S.money < horseCost);
      bHorse.addEventListener('click', () => {
        if (buyHorse()) { SFX.play('success'); this.toast('Kuda ditambah!'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      const ba2 = el('div', null, 'slot-actions'); ba2.appendChild(bHorse); r2.appendChild(ba2);
      body.appendChild(r2);

      // Respawn
      const r3 = el('div', null, 'save-slot');
      r3.appendChild(el('span', '🔄 Respawn wagon ($' + fmt(WAGON_RESPAWN_COST) + ')', 'slot-name'));
      const bRe = el('button', 'Respawn');
      bRe.className = 'btn-secondary';
      bRe.disabled = !adminOn() && S.money < WAGON_RESPAWN_COST;
      bRe.addEventListener('click', () => {
        if (respawnWagon()) { SFX.play('success'); this.toast('Wagon kembali ke depan lahan.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      const ba3 = el('div', null, 'slot-actions'); ba3.appendChild(bRe); r3.appendChild(ba3);
      body.appendChild(r3);
    }
  },
});
