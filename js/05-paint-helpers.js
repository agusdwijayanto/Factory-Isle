// Pembantu pelukis atlas (belah ketupat tanah, bayangan, kotak iso,
// ikon bijih/batangan, api tungku) + wadah PAINTERS.
// Pecahan 05-render.js (v16).
// ---------- Pelukis atlas: g = konteks atlas, (cx, gy) = tengah & alas ----------
// Semua pelukis memakai skala 1 (sel 64px). Dipanggil Atlas.build.
// Belah ketupat tanah 2:1 (64x32), BUKAN 64x64: ubin setinggi sel penuh
// menumpuk seperti sisik dan tanah terlihat berbukit, bukan datar.
function P_ground(g, cx, gy, color, dots) {
  g.beginPath();
  g.moveTo(cx, gy - 16); g.lineTo(cx + 32, gy); g.lineTo(cx, gy + 16); g.lineTo(cx - 32, gy);
  g.closePath(); g.fillStyle = color; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 1; g.stroke();
  if (dots) { g.fillStyle = dots; g.beginPath(); g.arc(cx - 9, gy - 2, 1.6, 0, 6.29); g.fill(); g.beginPath(); g.arc(cx + 8, gy + 3, 1.4, 0, 6.29); g.fill(); }
}
function P_shadow(g, cx, gy, rx) {
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.beginPath(); g.ellipse(cx, gy + 3, rx, rx * 0.45, 0, 0, 6.29); g.fill();
}
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
