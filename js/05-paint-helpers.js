// Pembantu pelukis atlas (belah ketupat tanah, bayangan, kotak iso,
// ikon bijih/batangan, api tungku) + wadah PAINTERS.
// v48: gaya cozy — satu warna dasar per bangunan, tiga tona turunan tetap,
// garis tepi coklat lembut, bayangan hangat dari kiri-atas.
// ---------- Palet & tona ----------
function P_rgb(hex) { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
// k < 1 menggelapkan, k > 1 mendekatkan ke putih. Selalu balik rgb().
function P_shade(hex, k) {
  const [r, g, b] = P_rgb(hex);
  if (k <= 1) return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k * 0.98)})`;
  const t = Math.min(1, k - 1), f = (c) => Math.round(c + (255 - c) * t);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
const P_OL = 'rgba(104,86,62,0.55)'; // garis tepi lembut, bukan hitam

// ---------- Pelukis atlas: g = konteks atlas, (cx, gy) = tengah & alas ----------
// Semua pelukis memakai skala 1 (sel 64px). Dipanggil Atlas.build.
// Belah ketupat tanah 2:1 (64x32), BUKAN 64x64: ubin setinggi sel penuh
// menumpuk seperti sisik dan tanah terlihat berbukit, bukan datar.
function P_ground(g, cx, gy, color, dots) {
  g.beginPath();
  g.moveTo(cx, gy - 16); g.lineTo(cx + 32, gy); g.lineTo(cx, gy + 16); g.lineTo(cx - 32, gy);
  g.closePath(); g.fillStyle = color; g.fill();
  g.strokeStyle = 'rgba(120,100,70,0.18)'; g.lineWidth = 1; g.stroke();
  if (dots) {
    g.fillStyle = dots;
    g.beginPath(); g.arc(cx - 9, gy - 2, 1.6, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 8, gy + 3, 1.4, 0, 6.29); g.fill();
  }
}

// Bayangan hangat: halo hijau-coklat lebar + inti kontak lebih pekat.
// Arah tetap kanan-bawah (terang dari kiri-atas), tidak pernah hitam.
function P_shadow(g, cx, gy, rx) {
  g.fillStyle = 'rgba(94,116,66,0.16)';
  g.beginPath(); g.ellipse(cx + rx * 0.16, gy + 4, rx * 1.02, rx * 0.4, 0, 0, 6.29); g.fill();
  g.fillStyle = 'rgba(91,73,49,0.20)';
  g.beginPath(); g.ellipse(cx + rx * 0.16, gy + 2, rx * 0.6, rx * 0.24, 0, 0, 6.29); g.fill();
}

// Kotak iso tiga sisi dari SATU warna dasar: atas terang, kiri sedang,
// kanan gelap, plus garis tepi. Ini yang membuat bangunan terasa padat.
// (cx, cy) = TITIK TANAH depan-belakang belah ketupat (bukan pusat alas):
// pusat alas digeser hh ke atas supaya ujung depan kaki kotak jatuh di cy.
function P_box(g, cx, cy, w, hgt, base, opt = {}) {
  const hw = w / 2, hh = w / 4, ty = cy - hh - hgt;
  cy = cy - hh;
  const top = opt.top || P_shade(base, 1.06);
  const lf = opt.left || P_shade(base, 0.86);
  const rt = opt.right || P_shade(base, 0.70);
  g.lineWidth = opt.olW || 1; g.strokeStyle = opt.ol || P_OL;
  g.beginPath();
  g.moveTo(cx - hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx, cy + hh); g.lineTo(cx - hw, cy);
  g.closePath(); g.fillStyle = lf; g.fill(); if (!opt.noOl) g.stroke();
  g.beginPath();
  g.moveTo(cx, ty + hh); g.lineTo(cx + hw, ty); g.lineTo(cx + hw, cy); g.lineTo(cx, cy + hh);
  g.closePath(); g.fillStyle = rt; g.fill(); if (!opt.noOl) g.stroke();
  g.beginPath();
  g.moveTo(cx, ty - hh); g.lineTo(cx + hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx - hw, ty);
  g.closePath(); g.fillStyle = top; g.fill(); if (!opt.noOl) g.stroke();
}

// Alas batu menjorok sedikit: langkah siluet kedua, menancapkan bangunan.
function P_plinth(g, cx, cy, w, base = '#C9C6C0') {
  P_box(g, cx, cy, w + 6, 4, base, { top: P_shade(base, 1.02), left: P_shade(base, 0.82), right: P_shade(base, 0.68) });
}

// Kotak iso lama (3 warna eksplisit) — dipakai mesin & sprite non-bangunan.
function P_isoBox(g, cx, cy, w, hgt, cTop, cLeft, cRight) {
  const hw = w / 2, hh = w / 4, ty = cy - hgt;
  g.beginPath();
  g.moveTo(cx, ty - hh); g.lineTo(cx + hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx - hw, ty);
  g.closePath(); g.fillStyle = cTop; g.fill();
  g.beginPath();
  g.moveTo(cx - hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx, cy + hh); g.lineTo(cx - hw, cy);
  g.closePath(); g.fillStyle = cLeft; g.fill();
  g.beginPath();
  g.moveTo(cx, ty + hh); g.lineTo(cx + hw, ty); g.lineTo(cx + hw, cy); g.lineTo(cx, cy + hh);
  g.closePath(); g.fillStyle = cRight; g.fill();
}
// Pembantu ikon: bongkahan bijih dan batangan ingot, tengah di (cx, cy).
function P_oreIcon(g, cx, cy, fleck) {
  g.fillStyle = '#7d8894';
  g.beginPath();
  g.moveTo(cx - 13, cy + 9); g.lineTo(cx - 8, cy - 8); g.lineTo(cx + 4, cy - 12);
  g.lineTo(cx + 12, cy - 2); g.lineTo(cx + 13, cy + 9); g.closePath(); g.fill();
  g.fillStyle = '#5d6773';
  g.beginPath();
  g.moveTo(cx + 4, cy - 12); g.lineTo(cx + 12, cy - 2);
  g.lineTo(cx + 13, cy + 9); g.lineTo(cx + 3, cy + 9); g.closePath(); g.fill();
  g.fillStyle = fleck;
  [[-6, -3], [2, -7], [6, 1]].forEach(([dx, dy]) => g.fillRect(cx + dx, cy + dy, 4, 4));
}
function P_ingot(g, cx, cy, color, dark) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(cx - 14, cy + 8); g.lineTo(cx - 10, cy - 6); g.lineTo(cx + 10, cy - 6); g.lineTo(cx + 14, cy + 8);
  g.closePath(); g.fill();
  g.fillStyle = dark; g.fillRect(cx - 14, cy + 5, 28, 3);
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(cx - 10, cy - 6, 20, 3);
}
function P_furnace(g, cx, cy) {
  const grad = g.createRadialGradient(cx, cy, 0, cx, cy, 8);
  grad.addColorStop(0, '#ffd75e'); grad.addColorStop(1, '#ff7a2e');
  g.fillStyle = grad;
  g.beginPath(); g.arc(cx, cy, 5, Math.PI, 0); g.fill();
  g.fillRect(cx - 5, cy, 10, 6);
}


const PAINTERS = {};