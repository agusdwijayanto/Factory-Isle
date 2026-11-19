// Pelukis v36: Conductor, stasiun pelabuhan, mesin/storage baru, pohon
// dari benih, kapal bajak laut, papan jual, ikon barang baru.
// Pecahan 05-render.js.
Object.assign(PAINTERS, {
  // NPC Conductor: seragam biru gelap + topi kondektur (foto stasiun Agus).
  conductor: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 10);
    g.fillStyle = '#2c4468'; // seragam
    g.beginPath();
    g.moveTo(cx - 5, gy - 30); g.lineTo(cx + 5, gy - 30);
    g.lineTo(cx + 10, gy); g.lineTo(cx - 10, gy);
    g.closePath(); g.fill();
    g.fillStyle = '#e8b64c'; g.fillRect(cx - 5, gy - 28, 10, 2); // kancing emas
    g.fillStyle = '#f0c8a0'; // tangan + kepala
    g.fillRect(cx - 8, gy - 28, 3, 8); g.fillRect(cx + 5, gy - 28, 3, 8);
    g.beginPath(); g.arc(cx, gy - 36, 7, 0, 6.29); g.fill();
    g.fillStyle = '#223452'; // topi kondektur
    g.beginPath(); g.arc(cx, gy - 39, 8, Math.PI, 0); g.fill();
    g.fillRect(cx - 8, gy - 40, 16, 3);
    g.fillStyle = '#e8b64c'; g.fillRect(cx - 2, gy - 39, 4, 2);
    g.fillStyle = '#2a1a10'; g.fillRect(cx - 3, gy - 37, 2, 2); g.fillRect(cx + 2, gy - 37, 2, 2);
  },
  // Papan jual di peron: papan kayu + tulisan $ (kereta = toko keliling).
  sign: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2, gy - 22, 4, 22);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 13, gy - 36, 26, 15);
    g.strokeStyle = '#5f3d22'; g.lineWidth = 1.5; g.strokeRect(cx - 13, gy - 36, 26, 15);
    g.fillStyle = '#ffd75e'; g.font = 'bold 12px sans-serif'; g.textAlign = 'center';
    g.fillText('$', cx, gy - 24);
  },
  // Kapal bajak laut: lambung hitam + layar + bendera (di atas air).
  ship: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 18);
    g.fillStyle = '#2c2833'; // lambung
    g.beginPath();
    g.moveTo(cx - 20, gy - 12); g.lineTo(cx + 20, gy - 12);
    g.lineTo(cx + 14, gy + 2); g.lineTo(cx - 14, gy + 2);
    g.closePath(); g.fill();
    g.fillStyle = '#c0392b'; g.fillRect(cx - 20, gy - 12, 40, 3);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2, gy - 44, 4, 32); // tiang
    g.fillStyle = '#f2ede0'; // layar
    g.beginPath();
    g.moveTo(cx, gy - 42); g.lineTo(cx + 13, gy - 20); g.lineTo(cx, gy - 20);
    g.closePath(); g.fill();
    g.fillStyle = '#2c2833'; // bendera bajak laut
    g.beginPath();
    g.moveTo(cx - 2, gy - 44); g.lineTo(cx + 10, gy - 41); g.lineTo(cx - 2, gy - 38);
    g.closePath(); g.fill();
    g.fillStyle = '#f2ede0'; g.fillRect(cx + 3, gy - 41, 2, 2);
  },
  // Sorter: belah ketupat conveyor + corong ungu di atasnya.
  sorter: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.beginPath();
    g.moveTo(cx, cy - 11); g.lineTo(cx + 23, cy); g.lineTo(cx, cy + 11); g.lineTo(cx - 23, cy);
    g.closePath(); g.fillStyle = '#3a2a4a'; g.fill();
    g.strokeStyle = '#9a6a9a'; g.lineWidth = 1.5; g.stroke();
    g.fillStyle = '#9a6a9a';
    g.beginPath();
    g.moveTo(cx - 10, cy - 24); g.lineTo(cx + 10, cy - 24);
    g.lineTo(cx + 4, cy - 10); g.lineTo(cx - 4, cy - 10);
    g.closePath(); g.fill();
    g.fillStyle = '#e8b64c';
    g.beginPath(); g.moveTo(cx, cy - 20); g.lineTo(cx + 4, cy - 14); g.lineTo(cx, cy - 8); g.lineTo(cx - 4, cy - 14); g.closePath(); g.fill();
  },
  // Storage Barrel: tong kayu.
  barrel: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 13);
    g.fillStyle = '#7a5230';
    g.beginPath(); g.ellipse(cx, gy - 14, 11, 13, 0, 0, 6.29); g.fill();
    g.fillStyle = '#a8763e'; g.beginPath(); g.ellipse(cx, gy - 26, 11, 4, 0, 0, 6.29); g.fill();
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(cx, gy - 18, 11, 4, 0, 0, 6.29); g.stroke();
    g.beginPath(); g.ellipse(cx, gy - 8, 11, 4, 0, 0, 6.29); g.stroke();
  },
  // Storage Crane: gantry + kait.
  crane: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    g.strokeStyle = '#e8b64c'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 13, gy); g.lineTo(cx - 13, gy - 34); g.stroke();
    g.beginPath(); g.moveTo(cx + 13, gy); g.lineTo(cx + 13, gy - 34); g.stroke();
    g.beginPath(); g.moveTo(cx - 16, gy - 34); g.lineTo(cx + 16, gy - 34); g.stroke();
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx + 6, gy - 34); g.lineTo(cx + 6, gy - 22); g.stroke();
    g.fillStyle = '#c0392b';
    g.beginPath(); g.moveTo(cx + 2, gy - 22); g.lineTo(cx + 10, gy - 22); g.lineTo(cx + 6, gy - 16); g.closePath(); g.fill();
  },
  // Storage Rack Advanced: rak tinggi 3 tingkat.
  rackAdv: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    g.fillStyle = '#6e6a72';
    g.fillRect(cx - 14, gy - 44, 4, 44); g.fillRect(cx + 10, gy - 44, 4, 44);
    g.fillStyle = '#8d99a8';
    for (const dy of [-44, -30, -16, -2]) g.fillRect(cx - 14, gy + dy, 28, 3);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 10, gy - 40, 8, 9); g.fillRect(cx + 2, gy - 40, 8, 9);
    g.fillStyle = '#c9a86a'; g.fillRect(cx - 10, gy - 26, 8, 9); g.fillRect(cx + 2, gy - 12, 8, 9);
  },
  // Ore Generator: tumpukan batu + mata bor.
  oreGen: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    PAINTERS._ore(g, ox, oy, '#ffd75e');
    g.fillStyle = '#8d99a8';
    g.beginPath(); g.moveTo(cx + 6, gy - 30); g.lineTo(cx + 12, gy - 44); g.lineTo(cx + 16, gy - 30); g.closePath(); g.fill();
    g.fillStyle = '#5d6773'; g.fillRect(cx + 10, gy - 48, 4, 6);
  },
  // Mixing Machine: tong aduk + pengaduk.
  mixer: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    g.fillStyle = '#4fae9d';
    g.beginPath(); g.ellipse(cx, gy - 12, 13, 15, 0, 0, 6.29); g.fill();
    g.fillStyle = '#e07b9d'; g.beginPath(); g.ellipse(cx, gy - 26, 13, 4, 0, 0, 6.29); g.fill();
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, gy - 26); g.lineTo(cx + 4, gy - 42); g.stroke();
    g.fillStyle = '#3a2a1a'; g.fillRect(cx - 2, gy - 44, 12, 3);
  },
  stone: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#9aa3ad'),
  // Pohon dari benih: Oak (bulat gelap), Pine (kerucut), Palm (pelepah).
  treeOak: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 13);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2.5, gy - 14, 5, 14);
    g.fillStyle = '#245c2a'; g.beginPath(); g.arc(cx, gy - 30, 14, 0, 6.29); g.fill();
    g.fillStyle = '#2f6b33'; g.beginPath(); g.arc(cx - 9, gy - 22, 9, 0, 6.29); g.fill();
    g.fillStyle = '#1e4d23'; g.beginPath(); g.arc(cx + 9, gy - 22, 9, 0, 6.29); g.fill();
  },
  treePine: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 12);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2, gy - 10, 4, 10);
    g.fillStyle = '#2e6b3e';
    g.beginPath(); g.moveTo(cx, gy - 44); g.lineTo(cx + 12, gy - 18); g.lineTo(cx - 12, gy - 18); g.closePath(); g.fill();
    g.fillStyle = '#245c2a';
    g.beginPath(); g.moveTo(cx, gy - 34); g.lineTo(cx + 10, gy - 12); g.lineTo(cx - 10, gy - 12); g.closePath(); g.fill();
  },
  palm: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 11);
    g.strokeStyle = '#8a5a33'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(cx, gy); g.quadraticCurveTo(cx + 4, gy - 18, cx + 2, gy - 30); g.stroke();
    g.strokeStyle = '#2f6b33'; g.lineWidth = 3;
    [[-14, -32], [-8, -38], [0, -40], [9, -38], [14, -32]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + 2, gy - 30); g.quadraticCurveTo(cx + dx, gy - 34, cx + dx, gy + dy); g.stroke();
    });
    g.fillStyle = '#8a5a33'; g.beginPath(); g.arc(cx + 2, gy - 28, 3, 0, 6.29); g.fill();
  },
  // Tanaman pewarna: semak kecil bunga pink.
  dyeplant: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 10);
    g.strokeStyle = '#3f7a34'; g.lineWidth = 1.6;
    [[-8, 0], [0, -3], [8, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy - 12 + dy); g.stroke();
    });
    g.fillStyle = '#e07b9d';
    [[-8, -13], [0, -16], [8, -13], [-4, -10], [4, -10]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4, 0, 6.29); g.fill();
    });
  },
  // Kecambah: hantu tanam benih.
  sapling: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#4fae6b'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, gy); g.lineTo(cx, gy - 12); g.stroke();
    g.fillStyle = '#4fae6b';
    g.beginPath(); g.ellipse(cx - 4, gy - 14, 4, 2.5, -0.5, 0, 6.29); g.fill();
    g.beginPath(); g.ellipse(cx + 4, gy - 14, 4, 2.5, 0.5, 0, 6.29); g.fill();
  },
  // ---------- Ikon barang v36 ----------
  item_GoldOre: (g, ox, oy) => P_oreIcon(g, ox + 32, oy + 32, '#ffd75e'),
  item_GoldIngot: (g, ox, oy) => P_ingot(g, ox + 32, oy + 32, '#ffd75e', '#c98f2e'),
  item_GoldPlate: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 15, cy - 8, 30, 16);
    g.strokeStyle = '#c98f2e'; g.lineWidth = 2; g.strokeRect(cx - 15, cy - 8, 30, 16);
    g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(cx - 15, cy - 8, 30, 4);
  },
  item_Stone: (g, ox, oy) => P_oreIcon(g, ox + 32, oy + 32, '#9aa3ad'),
  item_DyeFlower: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#e07b9d';
    [[0, -10], [9, -3], [6, 8], [-6, 8], [-9, -3]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, cy + dy, 6, 0, 6.29); g.fill();
    });
    g.fillStyle = '#ffd75e'; g.beginPath(); g.arc(cx, cy, 4, 0, 6.29); g.fill();
  },
  item_Dye: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#4fae9d';
    g.beginPath(); g.moveTo(cx - 7, cy - 14); g.lineTo(cx + 7, cy - 14); g.lineTo(cx + 10, cy + 14); g.lineTo(cx - 10, cy + 14); g.closePath(); g.fill();
    g.fillStyle = '#3a2a1a'; g.fillRect(cx - 5, cy - 18, 10, 4);
    g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(cx - 7, cy - 10, 3, 20);
  },
  item_TinCan: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#b8c4cc'; g.fillRect(cx - 11, cy - 14, 22, 28);
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 11, cy - 14, 22, 4); g.fillRect(cx - 11, cy + 10, 22, 4);
    g.fillStyle = '#5d6773'; g.fillRect(cx - 11, cy - 2, 22, 2);
  },
  item_GrindingWheel: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#9aa3ad'; g.beginPath(); g.arc(cx, cy, 15, 0, 6.29); g.fill();
    g.fillStyle = '#7d8894'; g.beginPath(); g.arc(cx, cy, 6, 0, 6.29); g.fill();
    g.fillStyle = '#5d6773'; g.beginPath(); g.arc(cx, cy, 2.5, 0, 6.29); g.fill();
    g.strokeStyle = '#5d6773'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx + 12, cy - 12); g.lineTo(cx + 18, cy - 18); g.stroke();
  },
  item_SeedOak: (g, ox, oy) => { const cx = ox + 32, cy = oy + 32; g.fillStyle = '#4fae6b'; g.beginPath(); g.ellipse(cx, cy, 7, 10, 0, 0, 6.29); g.fill(); g.fillStyle = '#2f6b33'; g.fillRect(cx - 1, cy - 14, 2, 6); },
  item_SeedPine: (g, ox, oy) => { const cx = ox + 32, cy = oy + 32; g.fillStyle = '#2e6b3e'; g.beginPath(); g.moveTo(cx, cy - 14); g.lineTo(cx + 8, cy + 8); g.lineTo(cx - 8, cy + 8); g.closePath(); g.fill(); },
  item_SeedPalm: (g, ox, oy) => { const cx = ox + 32, cy = oy + 32; g.fillStyle = '#e8b64c'; g.beginPath(); g.arc(cx, cy, 8, 0, 6.29); g.fill(); g.fillStyle = '#a8763e'; g.beginPath(); g.arc(cx, cy, 4, 0, 6.29); g.fill(); },
  item_SeedCotton: (g, ox, oy) => { const cx = ox + 32, cy = oy + 32; g.fillStyle = '#f2ede0'; g.beginPath(); g.arc(cx, cy, 8, 0, 6.29); g.fill(); g.fillStyle = '#d9d2c0'; g.beginPath(); g.arc(cx - 3, cy - 2, 3, 0, 6.29); g.fill(); },
  item_SeedDye: (g, ox, oy) => { const cx = ox + 32, cy = oy + 32; g.fillStyle = '#e07b9d'; g.beginPath(); g.arc(cx, cy, 7, 0, 6.29); g.fill(); g.fillStyle = '#ffd75e'; g.beginPath(); g.arc(cx, cy, 3, 0, 6.29); g.fill(); },
  item_Rack: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#6e6a72'; g.fillRect(cx - 13, cy - 16, 3, 32); g.fillRect(cx + 10, cy - 16, 3, 32);
    g.fillStyle = '#8d99a8'; for (const dy of [-16, -6, 4, 14]) g.fillRect(cx - 13, cy + dy, 26, 2);
  },
  item_Barrel: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#7a5230'; g.beginPath(); g.ellipse(cx, cy, 11, 14, 0, 0, 6.29); g.fill();
    g.fillStyle = '#a8763e'; g.beginPath(); g.ellipse(cx, cy - 13, 11, 4, 0, 0, 6.29); g.fill();
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy - 4, 11, 4, 0, 0, 6.29); g.stroke();
  },
  item_RackAdv: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#6e6a72'; g.fillRect(cx - 13, cy - 20, 3, 40); g.fillRect(cx + 10, cy - 20, 3, 40);
    g.fillStyle = '#e8b64c'; for (const dy of [-20, -10, 0, 10, 18]) g.fillRect(cx - 13, cy + dy, 26, 2);
  },
});
