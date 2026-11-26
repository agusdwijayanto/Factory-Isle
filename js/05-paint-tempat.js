// Tempat di map: toko, gunung, stasiun, kereta, Mayor, gerbang,
// kotak plot. v48: semua bangunan lewat P_box (3 tona dari satu warna),
// alas batu, atap menjorok, papan nama krem, garis tepi coklat lembut.
Object.assign(PAINTERS, {
  shop: (g, ox, oy) => PAINTERS.shop_exchange(g, ox, oy),

  // ---------- Papan nama: krem + tepi coklat, font menyusut kalau sempit ----------
  _paintSign(g, cx, cy, w, h, text, size, fill, ink) {
    g.fillStyle = fill; g.fillRect(cx - w / 2, cy, w, h);
    g.strokeStyle = '#8A6B4C'; g.lineWidth = 1.5; g.strokeRect(cx - w / 2, cy, w, h);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    let f = size;
    g.font = `800 ${f}px system-ui, sans-serif`;
    while (g.measureText(text).width > w - 8 && f > 6) {
      f -= 0.5; g.font = `800 ${f}px system-ui, sans-serif`;
    }
    g.fillStyle = ink; g.fillText(text, cx, cy + h / 2 + 0.5);
    g.textBaseline = 'alphabetic';
  },

  // ---------- Atap ----------
  // Prisma iso dari belah ketupat (bawah) ke belah ketupat kecil (atas).
  // Empat bidang trapesium dengan nilai berbeda = atap terbaca tiga dimensi.
  // topFrac kecil (0.10) = atap limas, besar (0.40) = atap perisai/pelana.
  _roofPrism(g, cx, ty, a, b, H, roof, topFrac) {
    const t = topFrac === undefined ? 0.34 : topFrac;
    const A = Math.max(3, a * t), B = Math.max(2, b * t);
    const B0 = [cx, ty - b], R0 = [cx + a, ty], F0 = [cx, ty + b], L0 = [cx - a, ty];
    const B1 = [cx, ty - b - H], R1 = [cx + A, ty - H], F1 = [cx, ty + B - H], L1 = [cx - A, ty - H];
    const quad = (p1, p2, p3, p4, col) => {
      g.beginPath(); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]);
      g.lineTo(p3[0], p3[1]); g.lineTo(p4[0], p4[1]); g.closePath();
      g.fillStyle = col; g.fill();
      g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    };
    quad(L0, B0, B1, L1, P_shade(roof, 1.10));  // belakang-kiri: paling terang
    quad(B0, R0, R1, B1, P_shade(roof, 0.98));  // belakang-kanan
    quad(F0, L0, L1, F1, P_shade(roof, 0.84));  // depan-kiri
    quad(R0, F0, F1, R1, P_shade(roof, 0.66));  // depan-kanan: paling gelap
    // tutup atas + lis terang
    g.beginPath();
    g.moveTo(B1[0], B1[1]); g.lineTo(R1[0], R1[1]);
    g.lineTo(F1[0], F1[1]); g.lineTo(L1[0], L1[1]); g.closePath();
    g.fillStyle = P_shade(roof, 1.14); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    // garis atap / lis gantung: bayangan tipis di bawah eave
    g.strokeStyle = 'rgba(104,86,62,0.35)'; g.lineWidth = 1;
    g.beginPath();
    g.moveTo(L0[0], L0[1]); g.lineTo(F0[0], F0[1]); g.lineTo(R0[0], R0[1]); g.stroke();
  },

  _gableRoof(g, cx, ty, a, b, H, roof) { PAINTERS._roofPrism(g, cx, ty, a, b, H, roof, 0.30); },

  _hipRoof(g, cx, ty, a, b, H, roof) { PAINTERS._roofPrism(g, cx, ty, a, b, H, roof, 0.12); },

  // ---------- Badan toko 2x2 sel ----------
  // opt: wall, roof, style ('gable'|'hip'|'flat'|'awning'|'dome'),
  //      twoStory, extra(g,cx,gy,top)
  _paintWesternShop(g, ox, oy, o) {
    const cx = ox + 64, gy = oy + 126;
    const wall = o.wall, roof = o.roof || P_shade(wall, 0.72);
    const W = 96, H = o.twoStory ? 66 : 52;
    const top = gy - 4 - H;              // pusat muka atas badan
    P_shadow(g, cx, gy, 48);
    // alas batu
    P_plinth(g, cx, gy, W - 2, '#C9C6C0');
    // badan: kontras sisi dinaikkan supaya kubus terbaca
    P_box(g, cx, gy - 4, W, H, wall, {
      top: P_shade(wall, 1.10), left: P_shade(wall, 0.90), right: P_shade(wall, 0.66),
    });
    // teras kayu
    g.fillStyle = P_shade('#C79A6B', 0.94); g.fillRect(cx - 40, gy - 6, 80, 6);
    g.strokeStyle = 'rgba(104,86,62,0.45)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx - 40, gy - 6); g.lineTo(cx + 40, gy - 6); g.stroke();

    // pintu + jendela
    g.fillStyle = P_shade('#6B4A32', 0.9); g.fillRect(cx - 9, gy - 30, 18, 26);
    g.strokeStyle = 'rgba(104,86,62,0.5)'; g.strokeRect(cx - 9, gy - 30, 18, 26);
    g.fillStyle = '#FFF3C4'; g.fillRect(cx - 6, gy - 27, 12, 10);
    for (const sx of [-1, 1]) {
      const wx = cx + sx * 27;
      g.fillStyle = P_shade('#6B4A32', 0.9); g.fillRect(wx - 8, gy - 28, 16, 13);
      g.fillStyle = '#FFF3C4'; g.fillRect(wx - 6, gy - 26, 12, 9);
      g.fillStyle = 'rgba(104,86,62,0.45)';
      g.fillRect(wx - 0.5, gy - 26, 1, 9); g.fillRect(wx - 6, gy - 22, 12, 1);
    }
    // tiang teras
    g.fillStyle = P_shade('#B57A4E', 0.9);
    g.fillRect(cx - 38, gy - 16, 3, 12); g.fillRect(cx + 35, gy - 16, 3, 12);

    // atap: menjorok 6px keluar dari badan (x=54 vs 48, y=32 vs 24)
    const a = 54, b = 32;
    if (o.style === 'hip') PAINTERS._hipRoof(g, cx, top + 2, a, b, 26, roof);
    else if (o.style === 'dome') {
      PAINTERS._hipRoof(g, cx, top + 2, a, b, 18, roof);
      g.fillStyle = P_shade(roof, 0.86);
      g.beginPath(); g.ellipse(cx, top - 14, 20, 18, 0, Math.PI, 0); g.fill();
      g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
      g.fillStyle = P_shade(roof, 1.3); g.fillRect(cx - 2, top - 34, 4, 6);
    } else if (o.style === 'flat') {
      // fasad tiruan (false front): papan tegak menutupi atap, sengaja datar
      const fw = W + 8;
      g.fillStyle = P_shade(roof, 0.94); g.fillRect(cx - fw / 2, top - 12, fw, 15);
      g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx - fw / 2, top - 12, fw, 15);
      g.fillStyle = P_shade(roof, 1.22); g.fillRect(cx - fw / 2, top - 14, fw, 3);
      g.fillStyle = 'rgba(104,86,62,0.18)'; g.fillRect(cx - fw / 2, top + 3, fw, 2);
    } else {
      // v52: atap toko dua lantai (SALOON) diturunkan 3px — puncak atapnya
      // dulu menggambar 2px di luar sel atlas (luber).
      PAINTERS._gableRoof(g, cx, top + (o.twoStory ? 5 : 2), a, b, 28, roof);
    }
    if (o.style === 'awning') {
      const ay = gy - 36;
      g.fillStyle = '#FDF6E7'; g.fillRect(cx - 34, ay, 68, 9);
      g.fillStyle = o.awning || P_shade(roof, 0.9);
      for (let i = 0; i < 6; i++) g.fillRect(cx - 34 + i * 11, ay, 5.5, 9);
      g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx - 34, ay, 68, 9);
    }
    // papan nama: 74px, menempel dinding (tidak menutupi atap/sisi).
    // v51: gaya 'flat' (SUPPLY) fasad tiruannya tinggi dan busur pintunya
    // digambar SESUDAH papan nama, jadi dulu tulisan SUPPLY ketutup busur.
    // Papan gaya 'flat' dinaikkan ke fasad tiruan — sekaligus lebih mirip
    // toko fasad palsu asli.
    if (o.style === 'flat') PAINTERS._paintSign(g, cx, top - 10, 74, 11, o.title, 9, '#FDF6E7', '#5A4432');
    else PAINTERS._paintSign(g, cx, gy - H + 5, 74, 13, o.title, 10, '#FDF6E7', '#5A4432');
    if (o.extra) o.extra(g, cx, gy, top);
  },

  shop_exchange: (g, ox, oy) => {
    // SALOON: dua lantai, menara air, pintu ayun, bartender
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#C4614A', roof: '#8E3B33', twoStory: true, style: 'gable', title: 'SALOON',
      extra: (g, cx, gy, top) => {
        g.fillStyle = P_shade('#6B4A32', 0.85);
        g.fillRect(cx - 10, gy - 30, 8, 26); g.fillRect(cx + 2, gy - 30, 8, 26);
        g.strokeStyle = '#FFF3C4'; g.lineWidth = 1;
        g.strokeRect(cx - 10, gy - 30, 8, 26); g.strokeRect(cx + 2, gy - 30, 8, 26);
        // jendela lantai dua (di bawah papan nama, di atas pintu)
        for (const sx of [-1, 1]) {
          g.fillStyle = P_shade('#6B4A32', 0.8); g.fillRect(cx + sx * 27 - 8, gy - 46, 16, 10);
          g.fillStyle = '#FFF3C4'; g.fillRect(cx + sx * 27 - 6, gy - 44, 12, 6);
        }
        // menara air
        g.fillStyle = P_shade('#B57A4E', 0.85); g.fillRect(cx + 30, top - 22, 3, 24);
        g.fillStyle = P_shade('#9AA7A0', 0.95);
        g.beginPath(); g.arc(cx + 31, top - 26, 9, 0, 6.29); g.fill();
        g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
        g.fillStyle = P_shade('#8E3B33', 1.1); g.fillRect(cx + 23, top - 34, 16, 4);
        // bartender di ambang
        g.fillStyle = '#FFDB9E'; g.fillRect(cx - 2, gy - 28, 4, 7);
        g.fillStyle = '#8E3B33'; g.fillRect(cx - 3, gy - 22, 6, 6);
        g.fillStyle = '#4A2E1E'; g.beginPath(); g.arc(cx, gy - 30, 3, 0, 6.29); g.fill();
      },
    });
  },

  shop_carpenter: (g, ox, oy) => {
    // CARPENTER: kayu biru pastel + cart papan harga
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#8FB3C9', roof: '#C4664C', style: 'gable', title: 'CARPENTER',
      extra: (g, cx, gy, top) => {
        // tumpukan papan di sisi kiri
        for (let i = 0; i < 3; i++) {
          g.fillStyle = P_shade('#D9B27A', 0.95 - i * 0.08);
          g.fillRect(cx - 46, gy - 10 - i * 4, 22, 4);
        }
        // cart kecil + papan harga
        g.fillStyle = P_shade('#B57A4E', 0.95); g.fillRect(cx + 22, gy - 16, 18, 10);
        g.fillStyle = '#FDF6E7'; g.fillRect(cx + 20, gy - 30, 24, 12);
        g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx + 20, gy - 30, 24, 12);
        g.fillStyle = '#5A4432'; g.font = '700 6px system-ui, sans-serif'; g.textAlign = 'center';
        g.fillText('7 · 6 · 12', cx + 32, gy - 25);  // Log·Plank·Pillar
        g.fillText('L · P · Pi', cx + 32, gy - 21);
        g.fillStyle = P_shade('#6B4A32', 0.9);
        g.beginPath(); g.arc(cx + 25, gy - 4, 3.5, 0, 6.29); g.fill();
        g.beginPath(); g.arc(cx + 37, gy - 4, 3.5, 0, 6.29); g.fill();
      },
    });
  },

  shop_blacksmith: (g, ox, oy) => {
    // BLACKSMITH: batu arang, cerobong, nyala tungku
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#8A8378', roof: '#5C6B7A', style: 'gable', title: 'BLACKSMITH',
      extra: (g, cx, gy, top) => {
        // cerobong batu
        P_box(g, cx + 26, top - 6, 12, 22, '#B0A79A');
        g.fillStyle = 'rgba(255,240,220,0.55)';
        g.beginPath(); g.arc(cx + 27, top - 34, 5, 0, 6.29); g.fill();
        g.beginPath(); g.arc(cx + 31, top - 42, 4, 0, 6.29); g.fill();
        // tungku + landasan
        g.fillStyle = P_shade('#6B4A32', 0.7); g.fillRect(cx - 34, gy - 12, 16, 8);
        P_furnace(g, cx - 26, gy - 12);
        g.fillStyle = '#7C838C'; g.fillRect(cx + 16, gy - 12, 14, 4);
        g.fillStyle = '#5E666F'; g.fillRect(cx + 20, gy - 8, 6, 6);
      },
    });
  },

  shop_toolshop: (g, ox, oy) => {
    // TOOL SHOP: kanopi bergaris
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#C9A25E', roof: '#6C7FA0', style: 'awning', title: 'TOOL SHOP',
      extra: (g, cx, gy) => {
        g.fillStyle = '#AEB6BE'; g.fillRect(cx - 28, gy - 14, 3, 12);
        g.fillStyle = '#C96A4E'; g.fillRect(cx - 31, gy - 14, 9, 4);
        g.fillStyle = '#BFB49B'; g.fillRect(cx + 22, gy - 12, 10, 3);
        g.fillStyle = P_shade('#B57A4E', 0.9); g.fillRect(cx + 24, gy - 9, 3, 8);
      },
    });
  },

  shop_textile: (g, ox, oy) => {
    // TEXTILE: hip roof + gulungan kain
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#EFE3D2', roof: '#D97A6C', style: 'hip', title: 'TEXTILE',
      extra: (g, cx, gy) => {
        const rolls = [['#E2665C', cx - 30], ['#9A7BC4', cx - 22], ['#F0B94E', cx + 20], ['#7FB3A8', cx + 28]];
        for (const [col, x] of rolls) {
          g.fillStyle = P_shade(col, 0.95); g.fillRect(x, gy - 17, 6, 11);
          g.fillStyle = P_shade(col, 1.15); g.fillRect(x, gy - 17, 6, 2.5);
        }
      },
    });
  },

  shop_supply: (g, ox, oy) => {
    // SUPPLY: fasad tiruan + busur pintu
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#6FAE7B', roof: '#4E8F63', style: 'flat', title: 'SUPPLY',
      extra: (g, cx, gy) => {
        g.fillStyle = P_shade('#6FAE7B', 1.12);
        g.beginPath(); g.arc(cx, gy - 34, 11, Math.PI, 0); g.fill();
        g.strokeStyle = '#FDF6E7'; g.lineWidth = 2;
        g.beginPath(); g.arc(cx, gy - 34, 11, Math.PI, 0); g.stroke();
        g.fillStyle = '#E0A24E'; g.fillRect(cx - 32, gy - 14, 9, 9); g.fillRect(cx + 23, gy - 14, 9, 9);
        g.strokeStyle = P_OL; g.lineWidth = 1;
        g.strokeRect(cx - 32, gy - 14, 9, 9); g.strokeRect(cx + 23, gy - 14, 9, 9);
      },
    });
  },

  shop_desert: (g, ox, oy) => {
    // DESERT: kubah pasir
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#E3B771', roof: '#CE8450', style: 'dome', title: 'DESERT',
      extra: (g, cx, gy) => {
        g.fillStyle = P_shade('#CE8450', 1.05);
        g.beginPath(); g.arc(cx - 30, gy - 8, 6, 0, 6.29); g.fill();
        g.beginPath(); g.arc(cx + 30, gy - 8, 6, 0, 6.29); g.fill();
        g.strokeStyle = P_OL; g.lineWidth = 1;
        g.beginPath(); g.arc(cx - 30, gy - 8, 6, 0, 6.29); g.stroke();
        g.beginPath(); g.arc(cx + 30, gy - 8, 6, 0, 6.29); g.stroke();
      },
    });
  },

  shop_harbor: (g, ox, oy) => {
    // HARBOR: kanopi teal, jaring & tong
    PAINTERS._paintWesternShop(g, ox, oy, {
      wall: '#7FB3A8', roof: '#4F8C86', style: 'awning', title: 'HARBOR',
      awning: '#4F8C86',
      extra: (g, cx, gy) => {
        g.fillStyle = P_shade('#B57A4E', 0.9); g.fillRect(cx - 34, gy - 14, 12, 12);
        g.fillStyle = P_shade('#B57A4E', 1.1); g.fillRect(cx - 34, gy - 14, 12, 2.5);
        g.strokeStyle = 'rgba(253,246,231,0.85)'; g.lineWidth = 1.5;
        g.beginPath(); g.arc(cx + 26, gy - 14, 7, Math.PI * 0.15, Math.PI * 0.95); g.stroke();
        g.beginPath(); g.moveTo(cx + 19, gy - 13); g.lineTo(cx + 33, gy - 13); g.stroke();
      },
    });
  },

  mountain: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy + 2, 18);
    g.fillStyle = P_shade('#9DA5A2', 0.95);
    g.beginPath();
    g.moveTo(cx - 22, gy); g.lineTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44);
    g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 22, gy); g.closePath(); g.fill();
    g.fillStyle = P_shade('#9DA5A2', 0.72);
    g.beginPath();
    g.moveTo(cx + 2, gy - 44); g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 22, gy);
    g.lineTo(cx + 2, gy); g.closePath(); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#FBF7EC';
    g.beginPath();
    g.moveTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44); g.lineTo(cx + 7, gy - 36);
    g.lineTo(cx + 2, gy - 33); g.lineTo(cx - 3, gy - 36); g.closePath(); g.fill();
  },

  // Stasiun: bangunan kecil beratap pelana — pengganti peron.
  // v48: papan STATION menempel dinding, atap pelana di atasnya.
  station: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    // v52: bayangan dibatasi 26 (dulu 28) — pendar kanan bayangannya
    // menggambar 1px ke luar sel atlas.
    P_shadow(g, cx, gy, 26);
    P_plinth(g, cx, gy, 50, '#C9C6C0');
    P_box(g, cx, gy - 4, 50, 30, '#E9DCC4', {
      top: P_shade('#E9DCC4', 1.06), left: P_shade('#E9DCC4', 0.90), right: P_shade('#E9DCC4', 0.68),
    });
    PAINTERS._paintSign(g, cx, gy - 32, 42, 10, 'STATION', 7, '#FDF6E7', '#5A4432');
    // pintu + dua jendela kecil
    g.fillStyle = P_shade('#6B4A32', 0.9); g.fillRect(cx - 6, gy - 20, 12, 16);
    g.fillStyle = '#FFF3C4'; g.fillRect(cx - 4, gy - 18, 8, 7);
    g.fillStyle = '#FFF3C4'; g.fillRect(cx - 20, gy - 18, 8, 6); g.fillRect(cx + 12, gy - 18, 8, 6);
    // v52: atap pelana diturunkan 3px (puncak belakangnya dulu 2px di luar sel).
    PAINTERS._gableRoof(g, cx, gy - 34 + 5, 29, 17, 13, '#C4664C');
    // papan digambar SESUDAH atap: menempel di muka depan, tidak tertutup
    PAINTERS._paintSign(g, cx, gy - 30, 42, 10, 'STATION', 7, '#FDF6E7', '#5A4432');
    // bangku peron (v52: digeser 1px ke kiri supaya tidak luber ke sel sebelah)
    g.fillStyle = P_shade('#B57A4E', 0.9); g.fillRect(cx + 21, gy - 9, 10, 3);
    g.fillRect(cx + 22, gy - 6, 2, 4); g.fillRect(cx + 28, gy - 6, 2, 4);
  },

  // v51: kereta digambar ulang gaya isometrik cozy ikut referensi game asli.
  // v52: lokomotif dan gerbong DIPISAH (masing-masing 1 petak di rel) dan
  // semua tulisan dihapus — tidak ada lagi "TRADING CO." maupun "130".
  // menghadap kanan (+x = layar kanan); gerbong duduk di petak selatan.
  train: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy + 2, 20);
    g.fillStyle = '#33333A'; g.fillRect(cx - 16, gy - 7, 32, 3); // papan lari
    // boiler (kapsul biru batu tulis, punggung lebih terang)
    g.beginPath();
    g.moveTo(cx - 6, gy - 17); g.lineTo(cx + 11, gy - 17);
    g.quadraticCurveTo(cx + 16, gy - 17, cx + 16, gy - 11.5);
    g.quadraticCurveTo(cx + 16, gy - 6, cx + 11, gy - 6);
    g.lineTo(cx - 6, gy - 6); g.closePath();
    g.fillStyle = '#7C9CB8'; g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#9AB8D0'; g.fillRect(cx - 4, gy - 17, 14, 3); // kilau atas
    g.fillStyle = '#2E3038'; // smokebox depan
    g.beginPath(); g.ellipse(cx + 16, gy - 11.5, 2.6, 5.5, 0, 0, 6.29); g.fill();
    // cerobong hitam + mulut + pita kuningan
    g.fillStyle = '#2E3038'; g.fillRect(cx + 2, gy - 29, 6, 12);
    g.fillRect(cx + 0.5, gy - 32, 9, 3);
    g.fillStyle = '#D8A94A'; g.fillRect(cx + 2, gy - 26, 6, 2);
    // asap
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.beginPath(); g.arc(cx + 5, gy - 35, 3.5, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 9, gy - 41, 4.5, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 13, gy - 46, 3, 0, 6.29); g.fill();
    // kabin biru tua + atap navy + jendela + lis kuningan
    P_box(g, cx - 11, gy - 2, 15, 15, '#6E8AA6', { top: P_shade('#6E8AA6', 1.12), left: P_shade('#6E8AA6', 0.92), right: P_shade('#6E8AA6', 0.78) });
    P_box(g, cx - 11, gy - 17, 17, 4, '#3A4050', { top: P_shade('#3A4050', 1.25) });
    g.fillStyle = '#4A5A6A'; g.fillRect(cx - 16, gy - 13, 5, 5); // jendela kabin
    g.fillStyle = '#D8A94A'; g.fillRect(cx - 18, gy - 6, 15, 1.5); // lis kuningan
    // cowcatcher
    g.fillStyle = '#2E3038';
    g.beginPath(); g.moveTo(cx + 14, gy - 3); g.lineTo(cx + 22, gy - 3); g.lineTo(cx + 22, gy - 9); g.closePath(); g.fill();
    g.strokeStyle = '#6A6E76'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx + 16, gy - 3); g.lineTo(cx + 20, gy - 8); g.stroke();
    // roda (pelek terang)
    for (const rx of [cx - 8, cx + 2]) {
      g.fillStyle = '#33333A'; g.beginPath(); g.arc(rx, gy - 1.5, 4.4, 0, 6.29); g.fill();
      g.strokeStyle = '#8A8F98'; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#8A8F98'; g.beginPath(); g.arc(rx, gy - 1.5, 1.4, 0, 6.29); g.fill();
    }
  },

  // v52: gerbong penumpang lepas (1 petak) — digambar di petak rel selatan
  // lokomotif. Badan krem, pita merah-oranye, strip jendela gelap, atap kubah
  // ber ventilasi, rangka + roda kecil. Tanpa tulisan.
  trainCar: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy + 2, 20);
    P_box(g, cx, gy - 2, 34, 15, '#E8DCC8', { top: P_shade('#E8DCC8', 1.10), left: P_shade('#E8DCC8', 0.94), right: P_shade('#E8DCC8', 0.80) });
    g.fillStyle = '#C1502E'; g.fillRect(cx - 16, gy - 8, 32, 4);   // pita merah-oranye
    g.fillStyle = '#4A4A52'; g.fillRect(cx - 15, gy - 17, 30, 5);  // strip jendela
    g.fillStyle = 'rgba(255,255,255,0.35)';
    for (let i = 0; i < 5; i++) g.fillRect(cx - 13 + i * 6, gy - 17, 3, 5); // kaca
    // atap kubah gelap + dua ventilasi
    g.beginPath(); g.moveTo(cx - 17, gy - 18); g.quadraticCurveTo(cx, gy - 26, cx + 17, gy - 18); g.closePath();
    g.fillStyle = '#6B6156'; g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#5A5148';
    g.beginPath(); g.arc(cx - 8, gy - 22, 2.2, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 8, gy - 22, 2.2, 0, 6.29); g.fill();
    // rangka + roda
    g.fillStyle = '#33333A'; g.fillRect(cx - 17, gy - 6, 34, 2.5);
    for (const rx of [cx - 12, cx + 4]) {
      g.fillStyle = '#33333A'; g.beginPath(); g.arc(rx, gy - 1.5, 3.2, 0, 6.29); g.fill();
      g.strokeStyle = '#8A8F98'; g.lineWidth = 1; g.stroke();
    }
  },

  // v51: BANGUNAN BELI WAGON (referensi BangunanBeliWagon, tanpa NPC).
  // Papan abu-abu berpanel + blok tengah lebih tinggi dengan atap pelana,
  // poster merah di depan, bay gelap di tengah, dua sayap dengan pintu kayu
  // terbuka dan papan roda wagon bulat. Ketuk = buka menu wagon.
  wagonShop: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 22);
    P_plinth(g, cx, gy, 48, '#C9C6C0');
    // dua sayap (lebih pendek) + lis tan
    for (const sx of [-1, 1]) {
      P_box(g, cx + sx * 15, gy - 2, 22, 20, '#8E9092', { top: P_shade('#8E9092', 1.08), left: P_shade('#8E9092', 0.90), right: P_shade('#8E9092', 0.74) });
      P_box(g, cx + sx * 15, gy - 22, 24, 4, '#6E7073', { top: P_shade('#6E7073', 1.18) }); // atap gudang
      g.fillStyle = '#B6A888'; // lis papan sudut
      g.fillRect(cx + sx * 15 - 11, gy - 22, 2, 20);
      // pintu kayu terbuka (dua daun)
      g.fillStyle = '#C3A06A';
      g.beginPath();
      g.moveTo(cx + sx * 15 - 7, gy - 18); g.lineTo(cx + sx * 7, gy - 22);
      g.lineTo(cx + sx * 7, gy - 4); g.lineTo(cx + sx * 15 - 7, gy - 6);
      g.closePath(); g.fill();
      g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    }
    // papan roda wagon bulat di sayap kanan
    g.fillStyle = '#E8DCC0';
    g.beginPath(); g.arc(cx + 15, gy - 14, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#4A3A2A';
    g.beginPath(); g.arc(cx + 15, gy - 14, 3, 0, 6.29); g.fill();
    g.strokeStyle = '#E8DCC0'; g.lineWidth = 1;
    for (let a = 0; a < 4; a++) {
      g.beginPath(); g.moveTo(cx + 15, gy - 14);
      g.lineTo(cx + 15 + Math.cos(a * 1.571) * 3, gy - 14 + Math.sin(a * 1.571) * 3);
      g.stroke();
    }
    // blok tengah lebih tinggi + atap pelana
    P_box(g, cx, gy - 2, 20, 32, '#9A9C9E', { top: P_shade('#9A9C9E', 1.10), left: P_shade('#9A9C9E', 0.90), right: P_shade('#9A9C9E', 0.74) });
    g.fillStyle = '#8A8C8E';
    g.beginPath(); g.moveTo(cx - 12, gy - 40); g.lineTo(cx, gy - 51); g.lineTo(cx + 12, gy - 40); g.closePath(); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = 'rgba(104,86,62,0.25)';
    g.beginPath(); g.moveTo(cx, gy - 51); g.lineTo(cx + 12, gy - 40); g.lineTo(cx, gy - 40); g.closePath(); g.fill();
    // bay gelap (mulut gudang) + tiang papan
    g.fillStyle = '#2A2A2A'; g.fillRect(cx - 7, gy - 20, 14, 16);
    g.fillStyle = '#B6A888'; g.fillRect(cx - 8, gy - 20, 2, 16); g.fillRect(cx + 6, gy - 20, 2, 16);
    // jendela + poster merah
    g.fillStyle = '#B6A888'; g.fillRect(cx - 6, gy - 33, 12, 9);
    g.fillStyle = '#B03A3A'; g.fillRect(cx - 5, gy - 32, 10, 7);
    g.fillStyle = '#F0E0C0'; g.fillRect(cx - 4, gy - 30, 8, 1.5); g.fillRect(cx - 4, gy - 27.5, 6, 1.5);
    // papan nama
    PAINTERS._paintSign(g, cx, gy - 46, 40, 10, 'WAGON', 7, '#FDF6E7', '#5A4432');
    g.fillStyle = '#8A6B4C'; // tumpukan kayu di sisi kiri
    for (let i = 0; i < 3; i++) g.fillRect(cx - 30, gy - 6 - i * 3, 12, 3);
  },

  // ---------- Mayor, gerbang, kotak plot ----------
  mayor: (g, ox, oy) => {
    // Mayor asli: perempuan rambut pirang, gaun biru-putih (foto Mayor).
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 10);
    g.fillStyle = P_shade('#3D6AA8', 0.98);
    g.beginPath();
    g.moveTo(cx - 5, gy - 32); g.lineTo(cx + 5, gy - 32);
    g.lineTo(cx + 11, gy - 2); g.lineTo(cx - 11, gy - 2); g.closePath(); g.fill();
    g.fillStyle = '#FBF7EC';
    g.beginPath();
    g.moveTo(cx - 3, gy - 30); g.lineTo(cx + 3, gy - 30);
    g.lineTo(cx + 6, gy - 4); g.lineTo(cx - 6, gy - 4); g.closePath(); g.fill();
    g.fillStyle = '#F3CBA6';
    g.fillRect(cx - 9, gy - 30, 3, 9); g.fillRect(cx + 6, gy - 30, 3, 9);
    g.beginPath(); g.arc(cx, gy - 38, 7, 0, 6.29); g.fill();
    g.fillStyle = '#EBCB72';
    g.beginPath(); g.arc(cx, gy - 41, 8, Math.PI, 0); g.fill();
    g.fillRect(cx - 8, gy - 41, 3, 10); g.fillRect(cx + 5, gy - 41, 3, 10);
    g.fillStyle = '#3B2A1E'; g.fillRect(cx - 3, gy - 39, 2, 2); g.fillRect(cx + 2, gy - 39, 2, 2);
    g.strokeStyle = P_OL; g.lineWidth = 1;
    g.beginPath(); g.arc(cx, gy - 38, 7, 0, 6.29); g.stroke();
  },

  gate: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 18);
    // v52: tiang ditinggikan + balok diturunkan 4px supaya puncak balok tidak
    // luber keluar sel atlas (dulu 4px di atas sel).
    g.fillStyle = P_shade('#8A6B4C', 0.95);
    g.fillRect(cx - 20, gy - 38, 5, 38); g.fillRect(cx + 15, gy - 38, 5, 38);
    P_box(g, cx, gy - 30, 46, 6, '#B57A4E');
    PAINTERS._paintSign(g, cx, gy - 30, 30, 11, 'TOWN', 8, '#FDF6E7', '#5A4432');
  },

  plotpad: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    // v52: dimasukkan 1px + sambungan bulat — ujung lancip belah ketupat dulu
    // menggambar 1px di luar sel (sambungan miter memanjang di sudut tajam).
    g.beginPath();
    g.moveTo(cx, cy - 14); g.lineTo(cx + 29, cy); g.lineTo(cx, cy + 14); g.lineTo(cx - 29, cy);
    g.closePath(); g.fillStyle = '#F3EEDF'; g.fill();
    g.strokeStyle = '#E0A24E'; g.lineWidth = 2.5; g.lineJoin = 'round'; g.stroke();
    g.fillStyle = '#CE9A46';
    [[0, -9], [17, 0], [0, 9], [-17, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, cy + dy, 2, 0, 6.29); g.fill();
    });
  },
});