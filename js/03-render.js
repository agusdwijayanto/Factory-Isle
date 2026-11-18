// Semua gambar prosedural di canvas. Palet meniru referensi: malam gelap,
// atap dan cahaya hangat, rumput hijau, aksen kuning lentera.
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1;

// Bintang dibuat sekali, posisinya tetap, hanya kerlipnya yang bergerak.
const STARS = [];
for (let i = 0; i < 70; i++) {
  STARS.push({ x: hash2(i, 7), y: hash2(i, 13) * 0.55, r: 0.6 + hash2(i, 29) * 1.3, p: hash2(i, 41) * 6.28 });
}
const FLIES = [];
for (let i = 0; i < 12; i++) {
  FLIES.push({ gx: 1 + hash2(i, 3) * (GRID_W - 2), gy: 1 + hash2(i, 5) * (GRID_H - 2), p: hash2(i, 11) * 6.28, s: 0.5 + hash2(i, 17) * 0.7 });
}

function fitCanvas() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  VW = window.innerWidth; VH = window.innerHeight;
  cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
  cv.style.width = VW + 'px'; cv.style.height = VH + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function diamondPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2); ctx.lineTo(x - w / 2, y);
  ctx.closePath();
}
function fillDiamond(x, y, w, h, color) {
  diamondPath(x, y, w, h);
  ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 1; ctx.stroke();
}

// Kotak isometrik: alas belah ketupat di (cx, cy), tinggi hgt ke atas.
function isoBox(cx, cy, w, hgt, cTop, cLeft, cRight) {
  const hw = w / 2, hh = w / 4, ty = cy - hgt;
  ctx.beginPath();
  ctx.moveTo(cx, ty - hh); ctx.lineTo(cx + hw, ty); ctx.lineTo(cx, ty + hh); ctx.lineTo(cx - hw, ty);
  ctx.closePath(); ctx.fillStyle = cTop; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - hw, ty); ctx.lineTo(cx, ty + hh); ctx.lineTo(cx, cy + hh); ctx.lineTo(cx - hw, cy);
  ctx.closePath(); ctx.fillStyle = cLeft; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx, ty + hh); ctx.lineTo(cx + hw, ty); ctx.lineTo(cx + hw, cy); ctx.lineTo(cx, cy + hh);
  ctx.closePath(); ctx.fillStyle = cRight; ctx.fill();
}

function glow(x, y, r, color, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.globalAlpha = 1;
}

const GRASS = ['#4e7d32', '#557f36', '#4a7a30', '#5d8a3a'];
function paintGrass(x, y, z, gx, gy) {
  fillDiamond(x, y, TILE_W * z, TILE_H * z, GRASS[Math.floor(hash2(gx, gy) * 4)]);
  const h = hash2(gx * 3 + 1, gy * 5 + 2);
  if (h < 0.25) { // bunga kecil, posisi tetap per petak
    ctx.fillStyle = h < 0.12 ? '#ffd75e' : '#e8e0f0';
    ctx.beginPath(); ctx.arc(x + (h * 40 - 10) * z, y - 4 * z, 1.6 * z, 0, 6.29); ctx.fill();
  }
}
function paintSand(x, y, z) {
  fillDiamond(x, y, TILE_W * z, TILE_H * z, '#c9a86a');
  ctx.fillStyle = 'rgba(120,90,40,0.5)';
  ctx.beginPath(); ctx.arc(x - 8 * z, y, 1.8 * z, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 7 * z, y + 3 * z, 1.5 * z, 0, 6.29); ctx.fill();
}
function paintClay(x, y, z) {
  fillDiamond(x, y, TILE_W * z, TILE_H * z, '#a5613f');
  ctx.fillStyle = '#8a4c2e';
  ctx.beginPath(); ctx.ellipse(x - 7 * z, y, 7 * z, 3.5 * z, 0, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.ellipse(x + 8 * z, y + 2 * z, 5 * z, 2.5 * z, 0, 0, 6.29); ctx.fill();
}

function shadow(x, y, z, rx) {
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath(); ctx.ellipse(x, y + 3 * z, rx * z, rx * 0.45 * z, 0, 0, 6.29); ctx.fill();
}

function paintTree(x, y, z) {
  shadow(x, y, z, 13);
  ctx.fillStyle = '#5f3d22';
  ctx.fillRect(x - 2.5 * z, y - 14 * z, 5 * z, 14 * z);
  ctx.fillStyle = '#2f6b33';
  ctx.beginPath(); ctx.arc(x, y - 30 * z, 13 * z, 0, 6.29); ctx.fill();
  ctx.fillStyle = '#357a38';
  ctx.beginPath(); ctx.arc(x - 8 * z, y - 22 * z, 9 * z, 0, 6.29); ctx.fill();
  ctx.fillStyle = '#2a5f2e';
  ctx.beginPath(); ctx.arc(x + 8 * z, y - 22 * z, 9 * z, 0, 6.29); ctx.fill();
  // Rim hangat di sisi kiri atas, seolah kena cahaya lentera.
  ctx.strokeStyle = 'rgba(255,215,94,0.55)'; ctx.lineWidth = 2 * z;
  ctx.beginPath(); ctx.arc(x, y - 30 * z, 12 * z, Math.PI * 0.9, Math.PI * 1.5); ctx.stroke();
}

function paintOre(x, y, z, color) {
  shadow(x, y, z, 14);
  ctx.fillStyle = '#7d8894';
  ctx.beginPath();
  ctx.moveTo(x - 14 * z, y); ctx.lineTo(x - 9 * z, y - 14 * z); ctx.lineTo(x + 3 * z, y - 18 * z);
  ctx.lineTo(x + 13 * z, y - 8 * z); ctx.lineTo(x + 14 * z, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d6773';
  ctx.beginPath();
  ctx.moveTo(x + 3 * z, y - 18 * z); ctx.lineTo(x + 13 * z, y - 8 * z);
  ctx.lineTo(x + 14 * z, y); ctx.lineTo(x + 2 * z, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = color;
  [[-7, -8], [2, -12], [7, -5]].forEach(([dx, dy]) => ctx.fillRect(x + dx * z, y + dy * z, 3.5 * z, 3.5 * z));
}

function paintCotton(x, y, z) {
  shadow(x, y, z, 11);
  ctx.strokeStyle = '#3f7a34'; ctx.lineWidth = 1.6 * z;
  [[-8, 0], [0, -3], [8, 0]].forEach(([dx, dy]) => {
    ctx.beginPath(); ctx.moveTo(x + dx * z, y); ctx.lineTo(x + dx * z, y - 12 * z + dy * z); ctx.stroke();
  });
  ctx.fillStyle = '#f2ede0';
  [[-8, -13], [0, -16], [8, -13], [-4, -10], [4, -10]].forEach(([dx, dy]) => {
    ctx.beginPath(); ctx.arc(x + dx * z, y + dy * z, 4 * z, 0, 6.29); ctx.fill();
  });
}

function paintLantern(x, y, z, glows) {
  shadow(x, y, z, 6);
  ctx.fillStyle = '#3a2a1a';
  ctx.fillRect(x - 1.5 * z, y - 26 * z, 3 * z, 26 * z);
  ctx.fillStyle = '#ffd75e';
  ctx.fillRect(x - 4 * z, y - 33 * z, 8 * z, 8 * z);
  ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 1.5 * z;
  ctx.strokeRect(x - 4 * z, y - 33 * z, 8 * z, 8 * z);
  glows.push({ x, y: y - 29 * z, r: 46 * z, a: 0.5 });
}

// Mesin: kotak isometrik + detail + cahaya tungku untuk yang membakar.
const MACHINE_PAINT = {
  sawhorse(x, y, z) {
    shadow(x, y, z, 14);
    ctx.strokeStyle = '#8a5a33'; ctx.lineWidth = 3 * z; ctx.lineCap = 'round';
    [-10, 10].forEach(dx => {
      ctx.beginPath(); ctx.moveTo(x + (dx - 5) * z, y); ctx.lineTo(x + (dx + 5) * z, y - 12 * z); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x + (dx + 5) * z, y); ctx.lineTo(x + (dx - 5) * z, y - 12 * z); ctx.stroke();
    });
    ctx.fillStyle = '#a8763e';
    ctx.fillRect(x - 17 * z, y - 15 * z, 34 * z, 4 * z);
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(x - 10 * z, y - 19 * z, 20 * z, 4 * z);
    ctx.fillStyle = '#c9a86a';
    ctx.beginPath(); ctx.arc(x + 10 * z, y - 17 * z, 2.5 * z, 0, 6.29); ctx.fill();
  },
  carpenter(x, y, z) {
    shadow(x, y, z, 16);
    isoBox(x, y, 36 * z, 11 * z, '#a8763e', '#7a5230', '#5f3d22');
    ctx.fillStyle = '#c9a86a';
    ctx.fillRect(x - 12 * z, y - 16 * z, 14 * z, 3 * z);
    ctx.fillRect(x - 9 * z, y - 19 * z, 12 * z, 3 * z);
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 2 * z;
    ctx.beginPath(); ctx.moveTo(x + 8 * z, y - 18 * z); ctx.lineTo(x + 13 * z, y - 12 * z); ctx.stroke();
  },
  oven(x, y, z, glows) {
    shadow(x, y, z, 17);
    isoBox(x, y, 40 * z, 22 * z, '#b06040', '#8a4630', '#6e3626');
    ctx.fillStyle = '#3a1c12';
    ctx.beginPath(); ctx.arc(x, y - 8 * z, 7 * z, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - 7 * z, y - 8 * z, 14 * z, 8 * z);
    const g = ctx.createRadialGradient(x, y - 4 * z, 0, x, y - 4 * z, 8 * z);
    g.addColorStop(0, '#ffd75e'); g.addColorStop(1, '#ff7a2e');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y - 6 * z, 5 * z, Math.PI, 0); ctx.fill();
    ctx.fillRect(x - 5 * z, y - 6 * z, 10 * z, 6 * z);
    isoBox(x - 10 * z, y - 22 * z, 10 * z, 8 * z, '#8a4630', '#6e3626', '#5a2c1e');
    glows.push({ x, y: y - 4 * z, r: 52 * z, a: 0.55 });
  },
  smelter(x, y, z, glows) {
    shadow(x, y, z, 18);
    isoBox(x, y, 42 * z, 26 * z, '#96553c', '#74402c', '#5c3222');
    isoBox(x + 11 * z, y - 26 * z, 11 * z, 26 * z, '#7d8894', '#5d6773', '#49525c');
    // Asap naik dari cerobong, posisinya mengulang tiap 40px.
    for (let i = 0; i < 3; i++) {
      const rise = (S.time * 9 + i * 14) % 42;
      ctx.globalAlpha = 0.35 * (1 - rise / 42);
      ctx.fillStyle = '#9aa3ad';
      ctx.beginPath(); ctx.arc(x + 11 * z + rise * 0.3 * z, y - 54 * z - rise * z, (4 + rise * 0.14) * z, 0, 6.29); ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = '#3a1c12';
    ctx.fillRect(x - 7 * z, y - 12 * z, 14 * z, 12 * z);
    const g = ctx.createRadialGradient(x, y - 6 * z, 0, x, y - 6 * z, 8 * z);
    g.addColorStop(0, '#ffd75e'); g.addColorStop(1, '#ff7a2e');
    ctx.fillStyle = g;
    ctx.fillRect(x - 5 * z, y - 10 * z, 10 * z, 10 * z);
    glows.push({ x, y: y - 6 * z, r: 60 * z, a: 0.6 });
  },
  blacksmith(x, y, z, glows) {
    shadow(x, y, z, 16);
    isoBox(x, y, 38 * z, 13 * z, '#6e6a72', '#54505a', '#43404a');
    ctx.fillStyle = '#2c2833';
    ctx.beginPath();
    ctx.moveTo(x - 12 * z, y - 16 * z); ctx.lineTo(x - 4 * z, y - 16 * z); ctx.lineTo(x - 2 * z, y - 20 * z);
    ctx.lineTo(x + 8 * z, y - 20 * z); ctx.lineTo(x + 12 * z, y - 24 * z); ctx.lineTo(x + 4 * z, y - 24 * z);
    ctx.lineTo(x + 2 * z, y - 20 * z); ctx.lineTo(x - 6 * z, y - 20 * z); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#8d99a8';
    ctx.fillRect(x - 3 * z, y - 16 * z, 6 * z, 3 * z);
    const g = ctx.createRadialGradient(x + 10 * z, y - 8 * z, 0, x + 10 * z, y - 8 * z, 7 * z);
    g.addColorStop(0, '#ffd75e'); g.addColorStop(1, '#ff7a2e');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x + 10 * z, y - 8 * z, 5 * z, 0, 6.29); ctx.fill();
    glows.push({ x: x + 10 * z, y: y - 8 * z, r: 40 * z, a: 0.5 });
  },
  splitter(x, y, z) {
    shadow(x, y, z, 14);
    ctx.fillStyle = '#5f3d22';
    ctx.fillRect(x - 13 * z, y - 24 * z, 4 * z, 24 * z);
    ctx.fillRect(x + 9 * z, y - 24 * z, 4 * z, 24 * z);
    ctx.fillRect(x - 13 * z, y - 27 * z, 26 * z, 4 * z);
    ctx.fillStyle = '#8d99a8';
    ctx.beginPath();
    ctx.moveTo(x - 4 * z, y - 23 * z); ctx.lineTo(x + 4 * z, y - 23 * z); ctx.lineTo(x, y - 13 * z);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7a5230';
    ctx.fillRect(x - 12 * z, y - 6 * z, 24 * z, 6 * z);
    ctx.fillStyle = '#c9a86a';
    ctx.beginPath(); ctx.arc(x + 12 * z, y - 3 * z, 3 * z, 0, 6.29); ctx.fill();
  },
};

// Sumbu gerak belt di layar untuk tiap arah grid: +x, +y, -x, -y.
const BELT_AXIS = [[1, 0.5], [-1, 0.5], [-1, -0.5], [1, -0.5]];
function paintConveyor(x, y, z, dir) {
  fillDiamond(x, y, TILE_W * 0.72 * z, TILE_H * 0.72 * z, '#26262e');
  ctx.strokeStyle = '#45454f'; ctx.lineWidth = 1.5 * z;
  diamondPath(x, y, TILE_W * 0.72 * z, TILE_H * 0.72 * z); ctx.stroke();
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  ctx.save();
  diamondPath(x, y, TILE_W * 0.72 * z, TILE_H * 0.72 * z); ctx.clip();
  ctx.fillStyle = '#e8b64c';
  const spacing = 16 * z, off = (S.beltT * 18 * z) % spacing;
  for (let k = -2; k <= 2; k++) {
    const cx = x + ux * (k * spacing + off), cy = y + uy * (k * spacing + off);
    ctx.beginPath();
    ctx.moveTo(cx + ux * 5 * z, cy + uy * 5 * z);
    ctx.lineTo(cx - uy * 5 * z, cy + ux * 5 * z);
    ctx.lineTo(cx + uy * 5 * z, cy - ux * 5 * z);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function paintDirArrow(x, y, z, dir) {
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  const ex = x + ux * 26 * z, ey = y + uy * 26 * z;
  ctx.fillStyle = 'rgba(255,215,94,0.85)';
  ctx.beginPath();
  ctx.moveTo(ex + ux * 5 * z, ey + uy * 5 * z);
  ctx.lineTo(ex - uy * 4 * z, ey + ux * 4 * z);
  ctx.lineTo(ex + uy * 4 * z, ey - ux * 4 * z);
  ctx.closePath(); ctx.fill();
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

  // Alas gelap di bawah seluruh plot, supaya grid menapak di kegelapan.
  const c0 = isoPoint(0, 0, S.cam), c1 = isoPoint(GRID_W, 0, S.cam);
  const c2 = isoPoint(GRID_W, GRID_H, S.cam), c3 = isoPoint(0, GRID_H, S.cam);
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.moveTo(c0.x, c0.y + 8 * z); ctx.lineTo(c1.x, c1.y + 8 * z);
  ctx.lineTo(c2.x, c2.y + 8 * z); ctx.lineTo(c3.x, c3.y + 8 * z);
  ctx.closePath(); ctx.fill();

  const glows = [];
  // Urutan pelukis: jumlah gx+gy menaik, yang di belakang digambar dulu.
  for (let s = 0; s <= GRID_W + GRID_H - 2; s++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      const gy = s - gx;
      if (gy < 0 || gy >= GRID_H) continue;
      const t = S.grid[gy][gx];
      const { x, y } = tileCenter(gx, gy, S.cam);
      if (x < -80 || x > VW + 80 || y < -80 || y > VH + 80) continue;
      if (t.t === 'sand') paintSand(x, y, z);
      else if (t.t === 'clay') paintClay(x, y, z);
      else paintGrass(x, y, z, gx, gy);

      const conv = S.conveyors.get(key(gx, gy));
      if (conv) paintConveyor(x, y, z, conv.dir);

      // Denyut sesudah diketuk: objek membesar sebentar lalu kembali.
      const pulse = S.pulses.get(key(gx, gy));
      let scale = 1;
      if (pulse !== undefined) {
        const p = (S.time - pulse) / 0.3;
        if (p < 1) scale = 1 + 0.12 * Math.sin(p * Math.PI);
        else S.pulses.delete(key(gx, gy));
      }
      ctx.save();
      if (scale !== 1) { ctx.translate(x, y); ctx.scale(scale, scale); ctx.translate(-x, -y); }
      if (t.obj === 'tree') paintTree(x, y, z);
      else if (t.obj === 'oreIron') paintOre(x, y, z, '#e07b39');
      else if (t.obj === 'oreCopper') paintOre(x, y, z, '#4fae9d');
      else if (t.obj === 'cotton') paintCotton(x, y, z);
      else if (t.obj === 'lantern') paintLantern(x, y, z, glows);
      const m = S.machines.get(key(gx, gy));
      if (m) {
        MACHINE_PAINT[m.id](x, y, z, glows);
        paintDirArrow(x, y, z, m.dir);
      }
      ctx.restore();
    }
  }

  // Cahaya tungku dan lentera digabung aditif di atas segalanya.
  ctx.globalCompositeOperation = 'lighter';
  for (const g of glows) glow(g.x, g.y, g.r, 'rgba(255,150,60,0.55)', g.a);
  ctx.globalCompositeOperation = 'source-over';

  // Kunang-kunang: nyawa kecil supaya malam tidak diam.
  for (const f of FLIES) {
    const bx = tileCenter(f.gx, f.gy, S.cam);
    const fx = bx.x + Math.sin(S.time * f.s + f.p) * 22 * z;
    const fy = bx.y - 14 * z + Math.cos(S.time * f.s * 0.8 + f.p) * 10 * z;
    ctx.globalAlpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(S.time * 2.2 + f.p * 3));
    ctx.fillStyle = '#ffe89a';
    ctx.beginPath(); ctx.arc(fx, fy, 1.8 * z, 0, 6.29); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Sorot petak hover dan petak mesin terpilih.
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

  // Hantu penempatan: mesin transparan + petak hijau kalau boleh, merah kalau tidak.
  if (S.placing && S.hover && inGrid(S.hover.gx, S.hover.gy)) {
    const { x, y } = tileCenter(S.hover.gx, S.hover.gy, S.cam);
    const ok = canPlace(S.hover.gx, S.hover.gy);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.fillStyle = ok ? 'rgba(94,255,138,0.25)' : 'rgba(255,80,80,0.25)'; ctx.fill();
    ctx.strokeStyle = ok ? '#5eff8a' : '#ff5050'; ctx.lineWidth = 2; ctx.stroke();
    if (ok) {
      ctx.globalAlpha = 0.55;
      MACHINE_PAINT[S.placing](x, y, z, []);
      ctx.globalAlpha = 1;
    }
  }

  // Vignette: tepi lebih gelap, tengah terang seperti di referensi.
  const vg = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.35, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,3,10,0.45)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);

  // Angka melayang: naik 36px selama 0,9 detik lalu hilang.
  ctx.textAlign = 'center';
  ctx.font = '700 ' + Math.max(13, Math.round(14 * z)) + 'px system-ui, sans-serif';
  for (const f of S.floaters) {
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
}

function canPlace(gx, gy) {
  const t = tileAt(gx, gy);
  return !!t && t.t === 'grass' && !t.obj && !S.machines.has(key(gx, gy)) && !S.conveyors.has(key(gx, gy));
}
