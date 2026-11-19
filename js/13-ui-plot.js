// Menu plot: 4 slot save + wagon. Pecahan 13-ui.js (v35).
// Tiap slot menyimpan uang, tas, bangunan, dan ukuran lahan sendiri
// (ikut sistem Mayor yang sudah ada: 4 tingkat ekspansi per slot).
let plotResetSlot = 0; // slot yang opsi resetnya sedang dibuka
Object.assign(UI, {
  // ---- Menu plot ----
  openPlot() {
    plotResetSlot = 0;
    this.renderPlot();
    this.openPanel('plot-panel');
  },
  renderPlot() {
    const body = $('plot-body');
    body.innerHTML = '';
    body.appendChild(el('div', '4 slot save. Muat = pindah ke slot itu (slot sekarang disimpan dulu). Lepas = simpan lalu kosongkan keadaan. Reset = hapus sebagian isi slot.', 'mp-desc'));
    body.appendChild(el('div', S.saveSlot ? 'Slot dimuat: ' + S.saveSlot : 'Tidak ada slot dimuat.', 'mp-desc'));
    for (let n = 1; n <= 4; n++) {
      const info = slotInfo(n);
      const row = el('div', null, 'mayor-row');
      const label = info
        ? 'Slot ' + n + ' — $' + fmt(info.money) + ', lahan ' + info.w + 'x' + info.h + ', ekspansi ' + info.expansion + (n === S.saveSlot ? ' (dimuat)' : '')
        : 'Slot ' + n + ' — Kosong';
      row.appendChild(el('span', label));
      const btns = el('span', null, 'shop-btns');
      const bLoad = el('button', 'Muat');
      bLoad.disabled = n === S.saveSlot;
      bLoad.addEventListener('click', () => {
        const r = loadSlot(n);
        SFX.play('success');
        this.toast(r === 'fresh' ? 'Slot ' + n + ' baru.' : 'Slot ' + n + ' dimuat.');
        this.renderPlot(); this.refreshHUD();
      });
      btns.appendChild(bLoad);
      const bReset = el('button', 'Reset');
      bReset.disabled = !info;
      bReset.addEventListener('click', () => { plotResetSlot = plotResetSlot === n ? 0 : n; this.renderPlot(); });
      btns.appendChild(bReset);
      if (n === S.saveSlot) {
        const bOut = el('button', 'Lepas');
        bOut.addEventListener('click', () => {
          unloadSlot();
          SFX.play('place');
          this.toast('Save dilepas. Muat slot lain untuk main lagi.');
          this.renderPlot(); this.refreshHUD();
        });
        btns.appendChild(bOut);
      }
      row.appendChild(btns);
      body.appendChild(row);
      // Opsi reset: barang / bangunan / upgrade lahan (ikut wiki Plots).
      if (plotResetSlot === n) {
        const rr = el('div', null, 'mayor-row');
        rr.appendChild(el('span', 'Reset slot ' + n + ':'));
        const rb = el('span', null, 'shop-btns');
        for (const [part, label] of [['items', 'Barang'], ['buildings', 'Bangunan'], ['upgrades', 'Upgrade lahan']]) {
          const b = el('button', label);
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
    // ---- Wagon: beli, naik tingkat, kuda, respawn ----
    body.appendChild(el('div', 'Wagon — transportasi: jalan kaki lv1, wagon lv2, kereta lv3. Ketuk wagon untuk naik/turun.', 'mp-desc'));
    if (!S.wagon) {
      const row = el('div', null, 'mayor-row');
      row.appendChild(el('span', 'Wagon — $' + fmt(WAGON_BUY_COST) + ' (peti 5 barang)'));
      const b = el('button', 'Beli');
      b.disabled = !adminOn() && S.money < WAGON_BUY_COST;
      b.addEventListener('click', () => {
        if (buyWagon()) {
          SFX.play('success');
          this.toast('Wagon dibeli! Muncul di lahan, ketuk untuk naik.');
        } else {
          SFX.play('error');
          this.toast('Uang tidak cukup.');
        }
        this.renderPlot(); this.refreshHUD();
      });
      row.appendChild(b);
      body.appendChild(row);
    } else {
      const w = S.wagon;
      body.appendChild(el('div', 'Wagon lv' + w.level + ' — peti ' + wagonItemsTotal() + '/' + wagonCap() + ', kuda: ' + w.horses + (w.riding ? ' (sedang ditunggangi)' : ''), 'mp-desc'));
      const row1 = el('div', null, 'mayor-row');
      const nextCap = w.level < WAGON_LEVELS.length ? WAGON_LEVELS[w.level] : null;
      row1.appendChild(el('span', nextCap ? 'Naik tingkat — peti ' + nextCap.cap + ' ($' + fmt(nextCap.cost) + ')' : 'Tingkat wagon maks.'));
      const bUp = el('button', 'Naik tingkat');
      bUp.disabled = !nextCap || (!adminOn() && S.money < nextCap.cost);
      bUp.addEventListener('click', () => {
        if (upgradeWagon()) { SFX.play('success'); this.toast('Wagon naik tingkat! Peti ' + wagonCap() + '.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      row1.appendChild(bUp);
      body.appendChild(row1);
      const row2 = el('div', null, 'mayor-row');
      const horseCost = w.horses < 2 ? WAGON_HORSE_COST[w.horses] : null;
      row2.appendChild(el('span', horseCost ? (w.horses === 0 ? 'Speed+ 1 kuda' : 'Speed++ 2 kuda') + ' ($' + fmt(horseCost) + ')' : 'Kuda maks (2).'));
      const bHorse = el('button', 'Beli kuda');
      bHorse.disabled = !horseCost || (!adminOn() && S.money < horseCost);
      bHorse.addEventListener('click', () => {
        if (buyHorse()) { SFX.play('success'); this.toast('Kuda ditambah! Wagon makin cepat.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      row2.appendChild(bHorse);
      body.appendChild(row2);
      const row3 = el('div', null, 'mayor-row');
      row3.appendChild(el('span', 'Respawn wagon — pindah ke depan lahan ($' + fmt(WAGON_RESPAWN_COST) + ')'));
      const bRe = el('button', 'Respawn');
      bRe.disabled = !adminOn() && S.money < WAGON_RESPAWN_COST;
      bRe.addEventListener('click', () => {
        if (respawnWagon()) { SFX.play('success'); this.toast('Wagon kembali ke depan lahan.'); }
        else { SFX.play('error'); this.toast('Uang tidak cukup.'); }
        this.renderPlot(); this.refreshHUD();
      });
      row3.appendChild(bRe);
      body.appendChild(row3);
    }
  },
});
