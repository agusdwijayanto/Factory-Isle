// Atlas: render membaca manifest, bukan posisi hardcode. Selama manifest
// bilang source=procedural, atlas dibuat saat boot dari pelukis prosedural
// (didaftarkan 05-render.js) mengikuti sel manifest. Nanti atlas.png Gemini
// dengan tata letak sel yang sama tinggal menggantikan canvas ini.
const Atlas = {
  manifest: null,
  canvas: null,
  painters: {}, // nama sprite -> (g, ox, oy, cell, variant) => void
  _ready: null,
  // Pelukis prosedural menggambar sampai ~10px di bawah alas sel (sudut depan
  // kotak isometrik + bayangan). Tanpa ruang luapan, piksel itu merembes ke
  // sel baris bawah dan muncul sebagai mangkuk di ubin tanah. Tiap baris
  // atlas prosedural diberi bantalan 24px di bawah sel. Sprite atlas.png
  // nanti harus muat di dalam selnya sendiri.
  pad: 24,

  // Salinan darurat kalau fetch manifest gagal (mis. dibuka via file://).
  fallback: null, // diisi dari MANIFEST_EMBEDDED di bawah saat init

  init() {
    if (this._ready) return this._ready;
    this._ready = (async () => {
      let m = null;
      try {
        const r = await fetch('assets/atlas-manifest.json?v=9');
        if (r.ok) m = await r.json();
      } catch (_) { /* file:// atau offline: pakai salinan darurat */ }
      this.manifest = m || MANIFEST_EMBEDDED;
      this.build();
      return this.manifest;
    })();
    return this._ready;
  },

  build() {
    const m = this.manifest, cell = m.cell;
    const stride = cell + this.pad;
    const cv = document.createElement('canvas');
    cv.width = m.cols * cell; cv.height = m.rows * stride;
    const g = cv.getContext('2d');
    for (const [name, s] of Object.entries(m.sprites)) {
      const paint = this.painters[name];
      if (!paint) continue;
      if (s.frames && s.dirs) {
        for (let d = 0; d < s.dirs; d++)
          for (let f = 0; f < s.frames; f++)
            paint(g, (s.col + f) * cell, (s.row + d) * stride, cell, { dir: d, frame: f });
      } else {
        paint(g, s.col * cell, s.row * stride, cell, {});
      }
    }
    this.canvas = cv;
  },

  // Rect sel sprite di atlas, termasuk ruang luapan di bawah sel.
  // frame/dir hanya untuk sprite animasi.
  rect(name, frame = 0, dir = 0) {
    const s = this.manifest.sprites[name];
    if (!s) return null;
    const cell = this.manifest.cell;
    const col = s.col + (s.frames ? frame : 0);
    const row = s.row + (s.dirs ? dir : 0);
    return { sx: col * cell, sy: row * (cell + this.pad), sw: s.w * cell, sh: s.h * cell + this.pad, cellH: s.h * cell };
  },

  // Gambar sprite dengan alas sel di titik tanah (x, y) layar; luapan di
  // bawah alas ikut tergambar, seperti sudut depan kotak isometrik.
  draw(ctx, name, x, y, scale, frame = 0, dir = 0, alpha = 1) {
    const r = this.rect(name, frame, dir);
    if (!r) return;
    const w = r.sw * scale, h = r.sh * scale;
    if (alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(this.canvas, r.sx, r.sy, r.sw, r.sh, x - w / 2, y - r.cellH * scale, w, h);
    if (alpha !== 1) ctx.globalAlpha = 1;
  },

  // Gambar ubin tanah: sel berisi belah ketupat, jangkar di tengah petak.
  drawTile(ctx, name, x, y, scale, alpha = 1) {
    const r = this.rect(name);
    if (!r) return;
    const w = r.sw * scale, h = r.sh * scale;
    if (alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(this.canvas, r.sx, r.sy, r.sw, r.sh, x - w / 2, y - (r.cellH * scale) / 2, w, h);
    if (alpha !== 1) ctx.globalAlpha = 1;
  },

  // Ikon untuk panel DOM: potong SEL SAJA (tanpa bantalan luapan) dari
  // atlas ke canvas kecil. Pelukis ikon wajib muat di dalam selnya.
  iconCanvas(name, size = 28) {
    const r = this.rect(name);
    const cv = document.createElement('canvas');
    cv.width = size; cv.height = size;
    cv.className = 'item-icon';
    if (!r) return cv;
    const g = cv.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(this.canvas, r.sx, r.sy, r.cellH, r.cellH, 0, 0, size, size);
    return cv;
  },
};

// Salinan darurat manifest, sama isinya dengan assets/atlas-manifest.json.
const MANIFEST_EMBEDDED = {
  name: 'indotopia-tycoon-atlas-v1', atlasFile: 'atlas.png', source: 'procedural',
  cell: 64, cols: 8, rows: 14, anchor: 'bottom-center',
  sprites: {
    tree: { col: 0, row: 0, w: 1, h: 1 }, oreIron: { col: 1, row: 0, w: 1, h: 1 },
    oreCopper: { col: 2, row: 0, w: 1, h: 1 }, oreTin: { col: 3, row: 0, w: 1, h: 1 },
    cotton: { col: 4, row: 0, w: 1, h: 1 }, lantern: { col: 5, row: 0, w: 1, h: 1 },
    flowers: { col: 6, row: 0, w: 1, h: 1 }, stump: { col: 7, row: 0, w: 1, h: 1 },
    sawhorse: { col: 0, row: 1, w: 1, h: 1 }, carpenter: { col: 1, row: 1, w: 1, h: 1 },
    oven: { col: 2, row: 1, w: 1, h: 1 }, smelter: { col: 3, row: 1, w: 1, h: 1 },
    blacksmith: { col: 4, row: 1, w: 1, h: 1 }, splitter: { col: 5, row: 1, w: 1, h: 1 },
    conveyor: { col: 6, row: 1, w: 1, h: 1 }, conveyorTilt: { col: 7, row: 1, w: 1, h: 1 },
    wallWood: { col: 0, row: 2, w: 1, h: 1 }, wallIron: { col: 1, row: 2, w: 1, h: 1 },
    box: { col: 2, row: 2, w: 1, h: 1 }, container: { col: 3, row: 2, w: 1, h: 1 },
    rack: { col: 4, row: 2, w: 1, h: 1 }, crate: { col: 5, row: 2, w: 1, h: 1 },
    axe: { col: 6, row: 2, w: 1, h: 1 }, pickaxe: { col: 7, row: 2, w: 1, h: 1 },
    shovel: { col: 0, row: 3, w: 1, h: 1 },
    grass0: { col: 1, row: 3, w: 1, h: 1 }, grass1: { col: 2, row: 3, w: 1, h: 1 },
    grass2: { col: 3, row: 3, w: 1, h: 1 }, grass3: { col: 4, row: 3, w: 1, h: 1 },
    sand: { col: 5, row: 3, w: 1, h: 1 }, clay: { col: 6, row: 3, w: 1, h: 1 },
    shop: { col: 0, row: 4, w: 2, h: 2 },
    player: { col: 0, row: 6, w: 1, h: 1, frames: 3, dirs: 4 },
    item_Log: { col: 2, row: 5, w: 1, h: 1 }, item_Pillar: { col: 3, row: 5, w: 1, h: 1 },
    item_Plank: { col: 4, row: 5, w: 1, h: 1 }, item_Firelog: { col: 5, row: 5, w: 1, h: 1 },
    item_Brick: { col: 6, row: 5, w: 1, h: 1 }, item_Glass: { col: 7, row: 5, w: 1, h: 1 },
    item_IronOre: { col: 0, row: 10, w: 1, h: 1 }, item_CopperOre: { col: 1, row: 10, w: 1, h: 1 },
    item_TinOre: { col: 2, row: 10, w: 1, h: 1 }, item_Sand: { col: 3, row: 10, w: 1, h: 1 },
    item_Clay: { col: 4, row: 10, w: 1, h: 1 }, item_Cotton: { col: 5, row: 10, w: 1, h: 1 },
    item_IronIngot: { col: 6, row: 10, w: 1, h: 1 }, item_CopperIngot: { col: 7, row: 10, w: 1, h: 1 },
    item_BronzeIngot: { col: 0, row: 11, w: 1, h: 1 }, item_Coil: { col: 1, row: 11, w: 1, h: 1 },
    item_Gear: { col: 2, row: 11, w: 1, h: 1 }, item_IronBeam: { col: 3, row: 11, w: 1, h: 1 },
    item_IronFrame: { col: 4, row: 11, w: 1, h: 1 }, item_Nails: { col: 5, row: 11, w: 1, h: 1 },
    item_Motor: { col: 6, row: 11, w: 1, h: 1 }, item_WoodFrame: { col: 7, row: 11, w: 1, h: 1 },
    item_Table: { col: 0, row: 12, w: 1, h: 1 }, item_Bench: { col: 1, row: 12, w: 1, h: 1 },
    item_Window: { col: 2, row: 12, w: 1, h: 1 },
    mayor: { col: 3, row: 12, w: 1, h: 1 }, gate: { col: 4, row: 12, w: 1, h: 1 },
    plotpad: { col: 5, row: 12, w: 1, h: 1 },
  },
};
