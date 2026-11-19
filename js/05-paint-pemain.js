// Karakter pemain. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
  player: (g, ox, oy, cell, v) => {
    // v: {dir 0..3, frame 0..2}. dir 0/1 depan, 2/3 belakang; 1/2 dicerminkan.
    const cx = ox + 32, gy = oy + 62;
    const flip = v.dir === 1 || v.dir === 2, back = v.dir >= 2;
    g.save();
    g.translate(cx, gy); if (flip) g.scale(-1, 1);
    const step = v.frame === 0 ? 0 : (v.frame === 1 ? 3 : -3);
    P_shadow(g, 0, 0, 9);
    g.fillStyle = '#3a3f47'; // kaki + sepatu
    g.fillRect(-6, -12 + Math.max(0, step), 5, 12 - Math.max(0, step));
    g.fillRect(1, -12 + Math.max(0, -step), 5, 12 - Math.max(0, -step));
    g.fillStyle = '#2c4a7a'; // celana
    g.fillRect(-6, -20, 12, 9);
    g.fillStyle = '#e07b39'; // baju
    g.fillRect(-7, -34, 14, 15);
    g.fillStyle = '#c96a2e'; g.fillRect(-7, -34, 14, 3);
    g.fillStyle = '#f0c8a0'; // tangan
    g.fillRect(-10, -32, 3, 10); g.fillRect(7, -32, 3, 10);
    g.fillStyle = back ? '#6a4a2a' : '#f0c8a0'; // kepala
    g.beginPath(); g.arc(0, -40, 7, 0, 6.29); g.fill();
    if (!back) { g.fillStyle = '#2a1a10'; g.fillRect(-3, -41, 2, 2); g.fillRect(2, -41, 2, 2); }
    g.fillStyle = '#e8c860'; // topi jerami
    g.beginPath(); g.ellipse(0, -45, 10, 3.5, 0, 0, 6.29); g.fill();
    g.fillRect(-5, -49, 10, 4);
    g.restore();
  },
  // ---------- Ikon item: tengah sel, wajib muat di dalam sel 64px ----------
});
