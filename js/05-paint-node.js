// Node panen dan hiasan alam: pohon, tunggul, bijih, kapas, lentera,
// bunga. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
  tree: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 13);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2.5, gy - 14, 5, 14);
    g.fillStyle = '#2f6b33'; g.beginPath(); g.arc(cx, gy - 30, 13, 0, 6.29); g.fill();
    g.fillStyle = '#357a38'; g.beginPath(); g.arc(cx - 8, gy - 22, 9, 0, 6.29); g.fill();
    g.fillStyle = '#2a5f2e'; g.beginPath(); g.arc(cx + 8, gy - 22, 9, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(255,215,94,0.55)'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, gy - 30, 12, Math.PI * 0.9, Math.PI * 1.5); g.stroke();
  },
  stump: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 6, gy - 6, 12, 6);
    g.fillStyle = '#a8763e'; g.beginPath(); g.ellipse(cx, gy - 6, 6, 2.5, 0, 0, 6.29); g.fill();
  },
  oreIron: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#e07b39'),
  oreCopper: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#4fae9d'),
  oreTin: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#d8e2e8'),
  _ore: (g, ox, oy, color) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    g.fillStyle = '#7d8894';
    g.beginPath();
    g.moveTo(cx - 14, gy); g.lineTo(cx - 9, gy - 14); g.lineTo(cx + 3, gy - 18);
    g.lineTo(cx + 13, gy - 8); g.lineTo(cx + 14, gy); g.closePath(); g.fill();
    g.fillStyle = '#5d6773';
    g.beginPath();
    g.moveTo(cx + 3, gy - 18); g.lineTo(cx + 13, gy - 8);
    g.lineTo(cx + 14, gy); g.lineTo(cx + 2, gy); g.closePath(); g.fill();
    g.fillStyle = color;
    [[-7, -8], [2, -12], [7, -5]].forEach(([dx, dy]) => g.fillRect(cx + dx, gy + dy, 3.5, 3.5));
  },
  cotton: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 11);
    g.strokeStyle = '#3f7a34'; g.lineWidth = 1.6;
    [[-8, 0], [0, -3], [8, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy - 12 + dy); g.stroke();
    });
    g.fillStyle = '#f2ede0';
    [[-8, -13], [0, -16], [8, -13], [-4, -10], [4, -10]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4, 0, 6.29); g.fill();
    });
  },
  lantern: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = '#3a2a1a'; g.fillRect(cx - 1.5, gy - 26, 3, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 4, gy - 33, 8, 8);
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.5; g.strokeRect(cx - 4, gy - 33, 8, 8);
  },
  flowers: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#3f7a34'; g.lineWidth = 1.5;
    [[-9, -8], [0, -11], [9, -8]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy + dy); g.stroke();
    });
    g.fillStyle = '#d97ba8';
    [[-9, -9], [0, -12], [9, -9]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 3, 0, 6.29); g.fill();
    });
  },
  // ---- v35: wagon, patung, badge, tanda plot ----
  // Wagon ikut referensi gambar 1: kuda menarik gerbong kayu berisi peti.
  wagon: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    // Kuda di depan kanan.
    g.fillStyle = '#8a5a33';
    g.beginPath(); g.ellipse(cx + 12, gy - 16, 9, 6, 0, 0, 6.29); g.fill(); // badan
    g.beginPath(); g.arc(cx + 20, gy - 24, 4.5, 0, 6.29); g.fill(); // kepala
    g.fillStyle = '#6a4526'; g.fillRect(cx + 18, gy - 30, 4, 6); // telinga/leher
    g.strokeStyle = '#6a4526'; g.lineWidth = 2;
    [[8, -10], [14, -10], [10, -10], [16, -10]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy - 12); g.lineTo(cx + dx, gy); g.stroke();
    });
    // Kanvas conestoga (atap lengkung putih)
    g.fillStyle = '#f2ede0';
    g.beginPath(); g.ellipse(cx - 8, gy - 26, 14, 10, 0, 0, 6.29); g.fill();
    g.fillStyle = '#d4ac0d';
    g.beginPath(); g.ellipse(cx - 8, gy - 24, 12, 6, 0, 0, 6.29); g.stroke(); g.lineWidth = 1.5; g.stroke();
    // Badan gerbong kayu di bawah kanvas
    g.fillStyle = '#a8763e'; g.fillRect(cx - 22, gy - 14, 24, 10);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 22, gy - 14, 24, 3);
    // Roda gigi
    g.fillStyle = '#5d6773';
    g.beginPath(); g.arc(cx - 16, gy - 1, 4, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 4, gy - 1, 4, 0, 6.29); g.fill();
    // Tali kuda ke gerbong.
    g.strokeStyle = '#5f3d22'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 16); g.lineTo(cx + 2, gy - 12); g.stroke();
    // Indikator slot muatan
    g.fillStyle = '#ffd75e'; g.font = '700 8px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('0 / 15', cx, gy - 28);
  },
  // Patung: alas batu + sosok, beda warna/siluet tiap patung.
  _statueBase: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 12);
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 11, gy - 6, 22, 6);
    g.fillStyle = '#6e7683'; g.fillRect(cx - 9, gy - 10, 18, 4);
  },
  statueLion: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#c98f2e';
    g.beginPath(); g.ellipse(cx, gy - 20, 9, 6, 0, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 8, gy - 26, 5, 0, 6.29); g.fill();
    g.fillStyle = '#a8763e'; g.fillRect(cx - 8, gy - 16, 16, 6);
  },
  statueMiner: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#8d99a8';
    g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = '#7a5230'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 28); g.lineTo(cx + 12, gy - 36); g.stroke();
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 2, gy - 42, 4, 3);
  },
  statueLumber: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#2f6b33';
    g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = '#7a5230'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx - 4, gy - 28); g.lineTo(cx - 12, gy - 38); g.stroke();
    g.fillStyle = '#8d99a8';
    g.beginPath(); g.moveTo(cx - 12, gy - 38); g.lineTo(cx - 6, gy - 34); g.lineTo(cx - 10, gy - 30); g.closePath(); g.fill();
  },
  statueSmith: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#6e7683';
    g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = '#7a5230'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 28); g.lineTo(cx + 12, gy - 40); g.stroke();
    g.fillStyle = '#3a3f47'; g.fillRect(cx + 10, gy - 42, 6, 4);
  },
  statueLiberty: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#4fae9d';
    g.fillRect(cx - 4, gy - 34, 8, 24);
    g.beginPath(); g.arc(cx, gy - 38, 5, 0, 6.29); g.fill();
    g.strokeStyle = '#4fae9d'; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 30); g.lineTo(cx + 12, gy - 42); g.stroke();
    g.fillStyle = '#ffd75e';
    g.beginPath(); g.arc(cx + 12, gy - 44, 3, 0, 6.29); g.fill();
  },
  badge: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.fillStyle = '#ffd75e';
    g.beginPath(); g.arc(cx, gy - 24, 11, 0, 6.29); g.fill();
    g.strokeStyle = '#c98f2e'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, gy - 24, 11, 0, 6.29); g.stroke();
    g.beginPath(); g.arc(cx, gy - 24, 6, 0, 6.29); g.stroke();
    g.fillStyle = '#c98f2e';
    g.beginPath(); g.moveTo(cx, gy - 30); g.lineTo(cx + 2, gy - 26); g.lineTo(cx + 6, gy - 26);
    g.lineTo(cx + 3, gy - 23); g.lineTo(cx + 4, gy - 19); g.lineTo(cx, gy - 21);
    g.lineTo(cx - 4, gy - 19); g.lineTo(cx - 3, gy - 23); g.lineTo(cx - 6, gy - 26);
    g.lineTo(cx - 2, gy - 26); g.closePath(); g.fill();
    g.strokeStyle = '#d97b4f'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 5, gy - 14); g.lineTo(cx - 8, gy - 4); g.stroke();
    g.beginPath(); g.moveTo(cx + 5, gy - 14); g.lineTo(cx + 8, gy - 4); g.stroke();
  },
  plotsign: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 2, gy - 30, 4, 30);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 14, gy - 42, 28, 16);
    g.strokeStyle = '#7a5230'; g.lineWidth = 2; g.strokeRect(cx - 14, gy - 42, 28, 16);
    g.fillStyle = '#3a2a1a'; g.font = '700 10px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('PLOT', cx, gy - 31);
  },
  campTipi: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 12);
    g.fillStyle = '#d4ac0d';
    g.beginPath(); g.moveTo(cx, gy - 24); g.lineTo(cx - 12, gy - 2); g.lineTo(cx + 12, gy - 2); g.closePath(); g.fill();
    g.fillStyle = '#a06530';
    g.beginPath(); g.moveTo(cx, gy - 22); g.lineTo(cx - 10, gy - 2); g.lineTo(cx + 10, gy - 2); g.closePath(); g.fill();
    g.fillStyle = '#5d6773'; g.fillRect(cx - 1, gy - 6, 2, 6);
    g.strokeStyle = '#8b4513'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx - 8, gy - 2); g.lineTo(cx - 8, gy - 10); g.stroke();
    g.beginPath(); g.moveTo(cx + 8, gy - 2); g.lineTo(cx + 8, gy - 10); g.stroke();
  },
  campfire: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = '#5d4037'; g.fillRect(cx - 4, gy - 4, 8, 4);
    g.fillRect(cx - 2, gy - 6, 4, 6);
    g.fillStyle = '#ff7a2e';
    g.beginPath(); g.arc(cx, gy - 8, 5, 0, 6.29); g.fill();
    g.fillStyle = '#f1c40f';
    g.beginPath(); g.arc(cx, gy - 10, 3, 0, 6.29); g.fill();
  },
});
