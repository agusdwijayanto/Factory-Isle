// Tempat di map: toko, gunung, stasiun, kereta, Mayor, gerbang,
// kotak plot. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
  shop: (g, ox, oy) => {
    // Blok 2x2 sel: alas di bawah blok.
    const cx = ox + 64, gy = oy + 126;
    P_shadow(g, cx, gy, 34);
    P_isoBox(g, cx, gy, 84, 34, '#b06040', '#8a4630', '#6e3626');
    P_isoBox(g, cx, gy - 34, 70, 22, '#7a5230', '#5f3d22', '#4a2e18');
    g.fillStyle = '#e8b64c';
    g.beginPath();
    g.moveTo(cx - 42, gy - 34); g.lineTo(cx, gy - 56); g.lineTo(cx + 42, gy - 34);
    g.lineTo(cx + 42, gy - 28); g.lineTo(cx, gy - 50); g.lineTo(cx - 42, gy - 28);
    g.closePath(); g.fill();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 12, gy - 26, 24, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 9, gy - 23, 18, 8);
    g.fillStyle = '#2a1f16'; g.fillRect(cx - 26, gy - 62, 52, 14);
    g.strokeStyle = '#ffd75e'; g.lineWidth = 1.5; g.strokeRect(cx - 26, gy - 62, 52, 14);
    g.fillStyle = '#ffd75e'; g.font = '800 10px system-ui, sans-serif';
    g.textAlign = 'center'; g.fillText('TOKO', cx, gy - 51);
  },
  mountain: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 18);
    g.fillStyle = '#7d8894';
    g.beginPath();
    g.moveTo(cx - 20, gy); g.lineTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44);
    g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 20, gy); g.closePath(); g.fill();
    g.fillStyle = '#5d6773';
    g.beginPath();
    g.moveTo(cx + 2, gy - 44); g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 20, gy);
    g.lineTo(cx + 2, gy); g.closePath(); g.fill();
    g.fillStyle = '#f2ede0'; // salju di puncak
    g.beginPath();
    g.moveTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44); g.lineTo(cx + 7, gy - 36);
    g.lineTo(cx + 2, gy - 33); g.lineTo(cx - 3, gy - 36); g.closePath(); g.fill();
  },
  station: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 40, 16, '#3a5a8a', '#2c4468', '#223452');
    g.fillStyle = '#2c4468'; g.fillRect(cx - 18, gy - 34, 36, 18);
    g.fillStyle = '#e8b64c'; // atap menara jam
    g.beginPath();
    g.moveTo(cx - 12, gy - 34); g.lineTo(cx, gy - 46); g.lineTo(cx + 12, gy - 34); g.closePath(); g.fill();
    g.fillStyle = '#f2ede0'; g.beginPath(); g.arc(cx, gy - 40, 4, 0, 6.29); g.fill();
    g.strokeStyle = '#2a1f16'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx, gy - 40); g.lineTo(cx, gy - 43); g.stroke();
    g.beginPath(); g.moveTo(cx, gy - 40); g.lineTo(cx + 2, gy - 39); g.stroke();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 5, gy - 14, 10, 14);
  },
  train: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.fillStyle = '#2c2833'; // badan lokomotif uap
    g.fillRect(cx - 18, gy - 26, 36, 18);
    g.fillStyle = '#43404a'; g.fillRect(cx + 8, gy - 36, 10, 10); // kabin
    g.fillStyle = '#2c2833'; g.fillRect(cx - 14, gy - 38, 5, 12); // cerobong
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 15, gy - 40, 7, 3);
    g.fillStyle = '#c0392b'; g.fillRect(cx - 18, gy - 9, 36, 3); // garis merah
    g.fillStyle = '#43404a';
    [[-13, -2], [0, -2], [13, -2]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4.5, 0, 6.29); g.fill();
    });
    g.fillStyle = 'rgba(255,255,255,0.5)'; // asap
    g.beginPath(); g.arc(cx - 11, gy - 46, 4, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 14, gy - 52, 5, 0, 6.29); g.fill();
  },
  // ---------- Mayor, gerbang, kotak plot ----------
  mayor: (g, ox, oy) => {
    // Perempuan rambut pirang, gaun biru-putih (foto Mayor).
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 10);
    g.fillStyle = '#2c4a7a'; // gaun
    g.beginPath();
    g.moveTo(cx - 5, gy - 32); g.lineTo(cx + 5, gy - 32);
    g.lineTo(cx + 11, gy); g.lineTo(cx - 11, gy);
    g.closePath(); g.fill();
    g.fillStyle = '#e8e4f5'; // celemek putih
    g.beginPath();
    g.moveTo(cx - 3, gy - 30); g.lineTo(cx + 3, gy - 30);
    g.lineTo(cx + 6, gy - 2); g.lineTo(cx - 6, gy - 2);
    g.closePath(); g.fill();
    g.fillStyle = '#f0c8a0'; // tangan + kepala
    g.fillRect(cx - 9, gy - 30, 3, 9); g.fillRect(cx + 6, gy - 30, 3, 9);
    g.beginPath(); g.arc(cx, gy - 38, 7, 0, 6.29); g.fill();
    g.fillStyle = '#e8c860'; // rambut pirang
    g.beginPath(); g.arc(cx, gy - 41, 8, Math.PI, 0); g.fill();
    g.fillRect(cx - 8, gy - 41, 3, 10); g.fillRect(cx + 5, gy - 41, 3, 10);
    g.fillStyle = '#2a1a10'; g.fillRect(cx - 3, gy - 39, 2, 2); g.fillRect(cx + 2, gy - 39, 2, 2);
  },
  gate: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 20, gy - 34, 5, 34); g.fillRect(cx + 15, gy - 34, 5, 34);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 22, gy - 40, 44, 6);
    g.fillStyle = '#ffd75e';
    g.fillRect(cx - 19, gy - 33, 3, 3); g.fillRect(cx + 16, gy - 33, 3, 3);
    g.fillStyle = '#e8b64c'; g.fillRect(cx - 8, gy - 32, 16, 9);
    g.strokeStyle = '#5f3d22'; g.lineWidth = 1.5; g.strokeRect(cx - 8, gy - 32, 16, 9);
  },
  plotpad: (g, ox, oy) => {
    // Lempeng putih berbingkai kuning, rata dengan lantai (drawTile).
    const cx = ox + 32, cy = oy + 32;
    g.beginPath();
    g.moveTo(cx, cy - 15); g.lineTo(cx + 30, cy); g.lineTo(cx, cy + 15); g.lineTo(cx - 30, cy);
    g.closePath(); g.fillStyle = '#e8e4da'; g.fill();
    g.strokeStyle = '#e8b64c'; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = '#c98f2e';
    [[0, -9], [17, 0], [0, 9], [-17, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, cy + dy, 2, 0, 6.29); g.fill();
    });
  },
});
