// Loop render utama + aturan taruh. Pelukis atlas ada di 05-paint-*.js,
// overlay di 05-render-overlay.js, kanvas di 05-render-core.js.
// Daftarkan semua pelukis ke Atlas sesudah semua file paint dimuat.
Object.assign(Atlas.painters, PAINTERS);

// Petak tanah -> sprite atlas. Tiap terrain wajib punya cabang di sini;
// yang tidak punya jatuh ke rumput diam-diam (pernah menelan railBend).
function groundSprite(t, gx, gy) {
  return t === 'sand' ? 'sand' : t === 'clay' ? 'clay'
    : t === 'water' ? 'water' : t === 'bridge' ? 'bridge'
    : t === 'platform' ? 'platform' : t === 'dock' ? 'dock'
    : t === 'road' ? 'road' : t === 'railX' ? 'railX'
    : t === 'railY' ? 'railY' : t === 'railStop' ? 'railStop'
    : t === 'railBend' ? 'railBend'
    : 'grass' + Math.floor(hash2(gx, gy) * 4);
}

function render() {
  const z = S.cam.zoom;
  const bg = ctx.createLinearGradient(0, 0, 0, VH);
  bg.addColorStop(0, '#0b0912'); bg.addColorStop(1, '#16102a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, VW, VH);
  for (const st of STARS) {
    ctx.globalAlpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(S.time * 2 + st.p));
    ctx.fillStyle = '#e8e4f5';
    ctx.beginPath(); ctx.arc(st.x * VW, st.y * VH, st.r, 0, 6.29); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const glows = [];
  const onPlot = S.map === 'plot';
  const playerS = Math.floor(S.player.fx + S.player.fy);
  let playerDrawn = false;
  for (let s = 0; s <= GRID_W + GRID_H - 2; s++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      const gy = s - gx;
      if (gy < 0 || gy >= GRID_H) continue;
      const t = S.grid[gy][gx];
      const { x, y } = tileCenter(gx, gy, S.cam);
      if (x < -90 || x > VW + 90 || y < -90 || y > VH + 90) continue;
      const ground = groundSprite(t.t, gx, gy);
      Atlas.drawTile(ctx, ground, x, y, z);

      const conv = onPlot ? S.conveyors.get(key(gx, gy)) : null;
      if (conv) {
        // Belt itu rata dengan lantai: pakai drawTile (jangkar tengah petak).
        // draw() berjangkar alas sel, mengangkat belah ketupat belt 26px
        // ke atas sehingga item dan panah alir terlihat ngambang di rumput.
        Atlas.drawTile(ctx, conv.id, x, y, z);
        paintBeltFlow(x, y, z, conv.dir, conv.color);
        if (conv.item) {
          const [ax, ay] = BELT_AXIS[conv.dir];
          const len = Math.hypot(ax, ay);
          const ix = x + (ax / len) * (conv.t - 0.5) * 22 * z;
          const iy = y + (ay / len) * (conv.t - 0.5) * 22 * z - 4 * z;
          ctx.fillStyle = ITEMS[conv.item].color;
          ctx.fillRect(ix - 4 * z, iy - 4 * z, 8 * z, 8 * z);
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(ix - 4 * z, iy - 4 * z, 8 * z, 8 * z);
        }
      }

      const pulse = S.pulses.get(key(gx, gy));
      let scale = 1;
      if (pulse !== undefined) {
        const p = (S.time - pulse) / 0.3;
        if (p < 1) scale = 1 + 0.12 * Math.sin(p * Math.PI);
        else S.pulses.delete(key(gx, gy));
      }
      ctx.save();
      if (scale !== 1) { ctx.translate(x, y); ctx.scale(scale, scale); ctx.translate(-x, -y); }
      if (t.obj && !t.obj.startsWith('shop')) {
        // Node habis (hp 0) hilang sampai tumbuh lagi; pohon/kapas/dye
        // menyisakan tunggul (digali sekop jadi benih). Tanaman muda
        // (growIn > 0) digambar mengecil sesuai tahap tumbuhnya.
        const isYoung = PLANT_GROWTH[t.obj] && t.growIn > 0;
        const dead = NODES[t.obj] && t.hp <= 0 && !isYoung;
        if (!dead || DIGGABLE[t.obj]) {
          const sprite = isYoung ? t.obj : (dead ? 'stump' : t.obj);
          const gs = isYoung ? growthScale(t) : 1;
          if (sprite === 'plotpad') {
            Atlas.drawTile(ctx, 'plotpad', x, y, z);
          } else {
            Atlas.draw(ctx, sprite, x, y + 6 * z, z * gs);
            if (t.obj === 'mayor') {
              ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
              ctx.strokeText('Mayor', x, y - 56 * z);
              ctx.fillStyle = '#ffd75e'; ctx.fillText('Mayor', x, y - 56 * z);
            }
            if (t.obj === 'station') {
              ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
              ctx.strokeText('Stasiun', x, y - 56 * z);
              ctx.fillStyle = '#ffd75e'; ctx.fillText('Stasiun', x, y - 56 * z);
            }
            if (t.obj === 'conductor') {
              ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
              ctx.strokeText('Conductor', x, y - 56 * z);
              ctx.fillStyle = '#ffd75e'; ctx.fillText('Conductor', x, y - 56 * z);
            }
          }
          if (GLOWS[t.obj]) { const [dx, dy, r, a] = GLOWS[t.obj]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
        }
      }
      if (t.obj && t.obj.startsWith('shop')) {
        // v41: gambar sprite toko itu sendiri (shop_carpenter, shop_blacksmith, ...),
        // bukan lagi 'shop' generik — v40 bikin gambarnya tapi render masih pakai yang lama.
        Atlas.draw(ctx, t.obj === 'shop_pirate' ? 'ship' : t.obj, x, y + 6 * z, z);
        const label = SHOPS[t.obj.slice(5)] ? SHOPS[t.obj.slice(5)].name : '';
        ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.strokeText(label, x, y - 56 * z);
        ctx.fillStyle = '#ffd75e'; ctx.fillText(label, x, y - 56 * z);
      }
      const m = onPlot ? S.machines.get(key(gx, gy)) : null;
      if (m) {
        Atlas.draw(ctx, m.id, x, y + 6 * z, z);
        paintDirArrow(x, y, z, m.dir);
        if (GLOWS[m.id]) { const [dx, dy, r, a] = GLOWS[m.id]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
        if (m.id === 'smelter') {
          for (let i = 0; i < 3; i++) {
            const rise = (S.time * 9 + i * 14) % 42;
            ctx.globalAlpha = 0.35 * (1 - rise / 42);
            ctx.fillStyle = '#9aa3ad';
            ctx.beginPath(); ctx.arc(x + 11 * z + rise * 0.3 * z, y - 54 * z - rise * z, (4 + rise * 0.14) * z, 0, 6.29); ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        if (m.progress > 0 && !m.stopped) paintMiniBar(x, y - 52 * z, z, m.progress);
      }
      const st = onPlot ? S.storages.get(key(gx, gy)) : null;
      if (st) Atlas.draw(ctx, st.id, x, y + 6 * z, z);
      const w = onPlot ? S.walls.get(key(gx, gy)) : null;
      if (w) Atlas.draw(ctx, w.id, x, y + 6 * z, z);
      const d = onPlot ? S.decor.get(key(gx, gy)) : null;
      if (d) {
        Atlas.draw(ctx, d.id, x, y + 6 * z, z);
        if (GLOWS[d.id]) { const [dx, dy, r, a] = GLOWS[d.id]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
      }
      // v35: wagon digambar di petaknya (ikut pemain saat ditunggangi).
      if (S.wagon && S.wagon.map === S.map && S.wagon.gx === gx && S.wagon.gy === gy) {
        Atlas.draw(ctx, 'wagon', x, y + 6 * z, z);
      }
      ctx.restore();
    }
    if (!playerDrawn && s >= playerS) { paintPlayer(); playerDrawn = true; }
  }
  if (!playerDrawn) paintPlayer();

  ctx.globalCompositeOperation = 'lighter';
  for (const g of glows) glow(g.x, g.y, g.r, g.a);
  ctx.globalCompositeOperation = 'source-over';

  for (const f of FLIES) {
    const bx = tileCenter(f.gx, f.gy, S.cam);
    const fx = bx.x + Math.sin(S.time * f.s + f.p) * 22 * z;
    const fy = bx.y - 14 * z + Math.cos(S.time * f.s * 0.8 + f.p) * 10 * z;
    ctx.globalAlpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(S.time * 2.2 + f.p * 3));
    ctx.fillStyle = '#ffe89a';
    ctx.beginPath(); ctx.arc(fx, fy, 1.8 * z, 0, 6.29); ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (S.hover && inGrid(S.hover.gx, S.hover.gy)) {
    const { x, y } = tileCenter(S.hover.gx, S.hover.gy, S.cam);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.fillStyle = 'rgba(255,215,94,0.12)'; ctx.fill();
    ctx.strokeStyle = '#ffd75e'; ctx.lineWidth = 2; ctx.stroke();
  }
  if (S.selected) {
    const [gx, gy] = S.selected.split(',').map(Number);
    const { x, y } = tileCenter(gx, gy, S.cam);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.strokeStyle = '#7fb8ff'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  // Bayangan di petak yang DIPILIH (placeSpot); kalau belum dipilih, ikut hover.
  // placeSpot menang supaya di HP yang tidak ada hover pun bayangan kelihatan.
  const gp = S.placing && (S.placeSpot || S.hover);
  if (gp && inGrid(gp.gx, gp.gy)) {
    const { x, y } = tileCenter(gp.gx, gp.gy, S.cam);
    const ok = canPlace(gp.gx, gp.gy, S.placing);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.fillStyle = ok ? 'rgba(94,255,138,0.25)' : 'rgba(255,80,80,0.25)'; ctx.fill();
    ctx.strokeStyle = ok ? '#5eff8a' : '#ff5050'; ctx.lineWidth = 2; ctx.stroke();
    if (ok) {
      if (S.placing.kind === 'conveyor') Atlas.drawTile(ctx, S.placing.id, x, y, z, 0.55);
      // v36: hantu benih digambar sebagai kecambah (bukan ikon tas).
      else if (S.placing.kind === 'seed') Atlas.draw(ctx, 'sapling', x, y + 6 * z, z, 0, 0, 0.55);
      else Atlas.draw(ctx, S.placing.id, x, y + 6 * z, z, 0, 0, 0.55);
      if (S.placing.kind === 'machine' || S.placing.kind === 'conveyor') paintDirArrow(x, y, z, S.placeDir);
    }
  }

  const vg = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.35, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,3,10,0.45)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);

  ctx.textAlign = 'center';
  ctx.font = '700 ' + Math.max(13, Math.round(14 * z)) + 'px system-ui, sans-serif';
  for (const f of S.floaters) {
    if (f.map && f.map !== S.map) continue;
    const p = (S.time - f.born) / 0.9;
    if (p >= 1) continue;
    const { x, y } = tileCenter(f.gx, f.gy, S.cam);
    const fy = y - 26 * z - p * 36;
    ctx.globalAlpha = 1 - p;
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeText(f.text, x, fy);
    ctx.fillStyle = f.color; ctx.fillText(f.text, x, fy);
  }
  ctx.globalAlpha = 1;

  paintRuler(); // penggaris x/z di luar map, di atas vignette supaya kebaca
}

// Aturan taruh: hanya di plot, rumput kosong; gerbang tidak boleh ditutup.
// v35: housing penuh juga menolak (pindah tidak menambah housing).
function canPlace(gx, gy, placing) {
  if (S.map !== 'plot') return false;
  const t = tileAt(gx, gy);
  if (!t || t.obj) return false;
  const g = gatePos();
  if (gx === g.gx && gy === g.gy) return false;
  const k = key(gx, gy);
  if (S.machines.has(k) || S.storages.has(k) || S.walls.has(k) || S.decor.has(k) || S.conveyors.has(k)) return false;
  if (placing && !placing.fromKey && !adminOn() && housingUsed() + housingCostOf(placing) > housingMax()) return false;
  if (placing && placing.kind === 'conveyor') return t.t === 'grass';
  return t.t === 'grass';
}
