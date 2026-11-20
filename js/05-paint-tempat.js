// Tempat di map: toko, gunung, stasiun, kereta, Mayor, gerbang,
// kotak plot. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
  shop: (g, ox, oy) => {
    // Blok 2x2 sel: alas di bawah blok.
    const cx = ox + 64, gy = oy + 126;
    P_shadow(g, cx, gy, 34);
    P_isoBox(g, cx, gy, 84, 34, '#8b4513', '#65351a', '#3a1c12');
    P_isoBox(g, cx, gy - 34, 70, 22, '#a0522d', '#8b4513', '#4a2e18');
    g.fillStyle = '#c0392b';
    g.beginPath();
    g.moveTo(cx - 42, gy - 34); g.lineTo(cx, gy - 56); g.lineTo(cx + 42, gy - 34);
    g.lineTo(cx + 42, gy - 28); g.lineTo(cx, gy - 50); g.lineTo(cx - 42, gy - 28);
    g.closePath(); g.fill();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 12, gy - 26, 24, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 9, gy - 23, 18, 8);
    g.fillStyle = '#2a1f16'; g.fillRect(cx - 26, gy - 62, 52, 14);
    g.strokeStyle = '#ffd75e'; g.lineWidth = 1.5; g.strokeRect(cx - 26, gy - 62, 52, 14);
    g.fillStyle = '#ffd75e'; g.font = '800 10px system-ui, sans-serif';
    g.textAlign = 'center'; g.fillText('WESTERN', cx, gy - 51);
  },
  _paintWesternShop(g, ox, oy, wallColor1, wallColor2, roofColor1, roofColor2, title, extraFn) {
    const cx = ox + 64, gy = oy + 126;
    P_shadow(g, cx, gy, 34);
    P_isoBox(g, cx, gy, 86, 36, wallColor1, wallColor2, '#3a1c12');
    // Teras depan / front porch
    g.fillStyle = '#b06040';
    g.fillRect(cx - 30, gy - 18, 60, 10);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 32, gy - 36, 6, 20);
    g.fillRect(cx + 26, gy - 36, 6, 20);
    P_isoBox(g, cx, gy - 36, 74, 24, roofColor1, roofColor2, '#2a1f16');
    g.fillStyle = roofColor1;
    g.beginPath();
    g.moveTo(cx - 45, gy - 36); g.lineTo(cx, gy - 62); g.lineTo(cx + 45, gy - 36);
    g.lineTo(cx + 45, gy - 30); g.lineTo(cx, gy - 56); g.lineTo(cx - 45, gy - 30);
    g.closePath(); g.fill();
    g.fillStyle = '#2a1f16'; g.fillRect(cx - 10, gy - 30, 20, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 7, gy - 26, 14, 10);
    if (extraFn) extraFn(g, cx, gy);
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 38, gy - 70, 76, 18);
    g.strokeStyle = '#ffd75e'; g.lineWidth = 2; g.strokeRect(cx - 38, gy - 70, 76, 18);
    g.fillStyle = '#ffd75e'; g.font = '800 9.5px system-ui, sans-serif';
    g.textAlign = 'center'; g.fillText(title, cx, gy - 57);
  },
  shop_carpenter: (g, ox, oy) => {
    PAINTERS._paintWesternShop(g, ox, oy, '#8b9dc3', '#6b7fa3', '#a0522d', '#873600', 'CARPENTER', (g, cx, gy) => {
      // Cart jual di luar dengan harga
      g.fillStyle = '#8b4513'; g.fillRect(cx - 30, gy - 6, 20, 10);
      g.fillStyle = '#d2b48c'; g.fillRect(cx - 32, gy - 14, 24, 8);
      g.fillStyle = '#ffd75e'; g.font = '700 8px system-ui, sans-serif'; g.textAlign = 'center';
      g.fillText('Plank 12 / 8 / 5', cx - 20, gy - 10);
      g.fillStyle = '#5d6773'; g.beginPath(); g.arc(cx - 24, gy - 1, 3, 0, 6.29); g.fill();
      g.beginPath(); g.arc(cx - 8, gy - 1, 3, 0, 6.29); g.fill();
    });
  },
  shop_blacksmith: (g, ox, oy) => {
    PAINTERS._paintWesternShop(g, ox, oy, '#555555', '#333333', '#3b4252', '#2e3440', 'BLACKSMITH', (g, cx, gy) => {
      g.fillStyle = '#e67e22'; g.fillRect(cx - 30, gy - 16, 12, 14);
      g.fillStyle = '#e74c3c'; g.fillRect(cx - 28, gy - 12, 8, 8);
      g.fillStyle = '#222222'; g.fillRect(cx + 18, gy - 10, 10, 6);
    });
  },
  shop_exchange: (g, ox, oy) => {
    // SALOON: menara air, pintu berkunci, 2 lantai, bartender NPC, papan SALOON.
    PAINTERS._paintWesternShop(g, ox, oy, '#962d22', '#78281f', '#c0392b', '#922b21', 'SALOON', (g, cx, gy) => {
      // Pintu berkunci saloon (swinging doors, ganda)
      g.fillStyle = '#5d2e1a';
      g.fillRect(cx - 9, gy - 30, 8, 26); g.fillRect(cx + 1, gy - 30, 8, 26);
      g.strokeStyle = '#ffd75e'; g.lineWidth = 1;
      g.strokeRect(cx - 9, gy - 30, 8, 26); g.strokeRect(cx + 1, gy - 30, 8, 26);
      // Jendela lantai 2
      g.fillStyle = '#2a1f16';
      g.fillRect(cx - 26, gy - 60, 10, 8); g.fillRect(cx + 16, gy - 60, 10, 8);
      g.fillStyle = '#ffd75e'; g.fillRect(cx - 24, gy - 58, 6, 4); g.fillRect(cx + 18, gy - 58, 6, 4);
      // Menara air di atas atap
      g.fillStyle = '#5f3d22'; g.fillRect(cx - 6, gy - 84, 4, 20);
      g.fillStyle = '#2c3e50'; g.beginPath(); g.arc(cx - 4, gy - 86, 10, 0, 6.29); g.fill();
      g.fillStyle = '#c0392b'; g.fillRect(cx - 9, gy - 80, 14, 6);
      // Bartender NPC di pintu
      g.fillStyle = '#e8c860'; g.fillRect(cx - 2, gy - 34, 4, 8);
      g.fillStyle = '#c0392b'; g.fillRect(cx - 3, gy - 28, 6, 6);
      g.fillStyle = '#2a1f16'; g.beginPath(); g.arc(cx, gy - 36, 3, 0, 6.29); g.fill();
    });
  },
  shop_toolshop: (g, ox, oy) => {
    PAINTERS._paintWesternShop(g, ox, oy, '#784212', '#5e3310', '#8e44ad', '#7d3c98', 'TOOL SHOP', (g, cx, gy) => {
      g.fillStyle = '#bdc3c7'; g.fillRect(cx - 26, gy - 14, 4, 12);
      g.fillStyle = '#e74c3c'; g.fillRect(cx - 28, gy - 14, 8, 4);
    });
  },
  shop_textile: (g, ox, oy) => {
    PAINTERS._paintWesternShop(g, ox, oy, '#d6dbdf', '#bfccdc', '#d98880', '#cb4335', 'TEXTILE', (g, cx, gy) => {
      // Gulungan kain di jendela
      g.fillStyle = '#e74c3c'; g.fillRect(cx - 26, gy - 14, 6, 10); g.fillRect(cx - 26, gy - 14, 6, 3);
      g.fillStyle = '#9b59b6'; g.fillRect(cx + 20, gy - 14, 6, 10); g.fillRect(cx + 20, gy - 14, 6, 3);
      g.fillStyle = '#f1c40f'; g.fillRect(cx - 28, gy - 12, 2, 6); g.fillRect(cx + 22, gy - 12, 2, 6);
    });
  },
  shop_supply: (g, ox, oy) => {
    // SUPPLY hijau: fasad tiruan + busur di atas pintu.
    PAINTERS._paintWesternShop(g, ox, oy, '#1e8449', '#145a32', '#27ae60', '#1e8449', 'SUPPLY', (g, cx, gy) => {
      // Fasad tiruan (false front) — dinding depan lebih tinggi dari atap
      g.fillStyle = '#1e8449'; g.fillRect(cx - 34, gy - 70, 68, 4);
      g.strokeStyle = '#ffd75e'; g.lineWidth = 1.5; g.strokeRect(cx - 34, gy - 70, 68, 4);
      // Busur di atas pintu
      g.fillStyle = '#27ae60';
      g.beginPath(); g.arc(cx, gy - 30, 6, Math.PI, 0); g.fill();
      g.fillRect(cx - 6, gy - 30, 12, 6);
      // Papan barang di luar
      g.fillStyle = '#d4ac0d'; g.fillRect(cx - 28, gy - 10, 8, 8); g.fillRect(cx + 20, gy - 10, 8, 8);
    });
  },
  shop_desert: (g, ox, oy) => {
    PAINTERS._paintWesternShop(g, ox, oy, '#d4ac0d', '#b7950b', '#ca6f1e', '#b9770e', 'DESERT', (g, cx, gy) => {
      g.fillStyle = '#a04000'; g.beginPath(); g.arc(cx - 24, gy - 8, 5, 0, 6.29); g.fill();
      g.fillStyle = '#dc7633'; g.beginPath(); g.arc(cx + 22, gy - 8, 5, 0, 6.29); g.fill();
    });
  },
  shop_harbor: (g, ox, oy) => {
    // v41: toko Pelabuhan (id 'harbor') ketinggalan di v40 — tanpa ini gambarnya hilang.
    PAINTERS._paintWesternShop(g, ox, oy, '#1a5276', '#154360', '#2e86c1', '#2471a3', 'HARBOR', (g, cx, gy) => {
      g.fillStyle = '#7fb3d5'; g.fillRect(cx - 28, gy - 12, 10, 8);
      g.fillStyle = '#aed6f1'; g.fillRect(cx + 20, gy - 12, 10, 8);
    });
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
    P_isoBox(g, cx, gy, 40, 16, '#8b4513', '#65351a', '#3a1c12');
    g.fillStyle = '#65351a'; g.fillRect(cx - 18, gy - 34, 36, 18);
    g.fillStyle = '#c0392b'; // atap stasiun western
    g.beginPath();
    g.moveTo(cx - 16, gy - 34); g.lineTo(cx, gy - 46); g.lineTo(cx + 16, gy - 34); g.closePath(); g.fill();
    g.fillStyle = '#ffd75e'; g.beginPath(); g.arc(cx, gy - 40, 4, 0, 6.29); g.fill();
    g.strokeStyle = '#2a1f16'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx, gy - 40); g.lineTo(cx, gy - 43); g.stroke();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 5, gy - 14, 10, 14);
  },
  train: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 18);
    // Kereta marong (gerbong maroon dengan hias kuning di belakang)
    g.fillStyle = '#5d2e1a'; g.fillRect(cx - 44, gy - 22, 28, 14);
    g.strokeStyle = '#f1c40f'; g.lineWidth = 1.5;
    g.strokeRect(cx - 44, gy - 22, 28, 14);
    g.fillStyle = '#f1c40f'; g.fillRect(cx - 40, gy - 18, 4, 6); g.fillRect(cx - 4, gy - 18, 4, 6);
    // Lokomotif
    g.fillStyle = '#7f8c8d';
    g.beginPath();
    g.moveTo(cx - 20, gy - 4); g.lineTo(cx - 24, gy - 16); g.lineTo(cx - 16, gy - 16);
    g.closePath(); g.fill();
    // Boiler
    g.fillStyle = '#2c2833';
    g.fillRect(cx - 16, gy - 26, 32, 18);
    // Cab
    g.fillStyle = '#8b4513'; g.fillRect(cx + 6, gy - 38, 14, 14);
    // Smokestack (cerobong tinggi klasik)
    g.fillStyle = '#111111'; g.fillRect(cx - 12, gy - 40, 6, 16);
    g.fillStyle = '#d4ac0d'; g.fillRect(cx - 14, gy - 42, 10, 3);
    g.fillStyle = '#c0392b'; g.fillRect(cx - 16, gy - 10, 32, 3);
    g.fillStyle = '#c0392b';
    [[-10, -2], [4, -2], [14, -2]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 5, 0, 6.29); g.fill();
      g.fillStyle = '#111111'; g.beginPath(); g.arc(cx + dx, gy + dy, 2, 0, 6.29); g.fill();
      g.fillStyle = '#c0392b';
    });
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.beginPath(); g.arc(cx - 9, gy - 48, 4, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 12, gy - 55, 6, 0, 6.29); g.fill();
    // Nomor kereta di kabin
    g.fillStyle = '#ffd75e'; g.font = '700 9px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('130', cx + 13, gy - 32);
    // Tulisan TRADING CO. di tender (belakang lokomotif)
    g.fillText('TRADING CO.', cx - 30, gy - 24);
  },
  // ---------- Mayor, gerbang, kotak plot ----------
  mayor: (g, ox, oy) => {
    // v43: kembali ke Mayor asli — perempuan rambut pirang, gaun biru-putih
    // (foto Mayor). v42 mengubahnya jadi koboi pria, itu menyimpang dari aslinya.
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
