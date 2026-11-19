// Inti UI: pembantu DOM, suara, ikon, dan panel dasar (toast, HUD,
// buka/tutup panel). Pecahan 13-ui.js (v16).
// Panel, HUD, tutorial, dan suara. Semua aksi di sini nyata.
const $ = (id) => document.getElementById(id);
const HINT_HOME = 'Ketuk petak untuk berjalan. Ketuk pohon, bijih, atau mesin untuk bekerja.';
let toastTimer = 0;
let buildTab = 'machines';
let inspectKey = null; // petak yang sedang diperiksa
let lastTutText = '';

// Suara WebAudio tanpa aset: nada pendek per kejadian.
const SFXImpl = {
  ctx: null,
  ensure() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { /* tanpa suara */ }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  tone(freq, dur, type, delay = 0) {
    if (!S.settings.sound) return;
    const c = this.ensure();
    if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.12, c.currentTime + delay);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + dur);
    o.connect(g).connect(c.destination);
    o.start(c.currentTime + delay); o.stop(c.currentTime + delay + dur);
  },
  play(name) {
    if (name === 'chop') this.tone(180, 0.06, 'square');
    else if (name === 'coin') { this.tone(1320, 0.07, 'sine'); this.tone(1760, 0.09, 'sine', 0.06); }
    else if (name === 'success') { this.tone(660, 0.09, 'sine'); this.tone(880, 0.12, 'sine', 0.08); }
    else if (name === 'error') this.tone(140, 0.15, 'sawtooth');
    else if (name === 'place') this.tone(220, 0.08, 'triangle');
    else if (name === 'craft') { this.tone(520, 0.08, 'sine'); this.tone(780, 0.1, 'sine', 0.07); }
  },
};
SFX = SFXImpl;
document.addEventListener('pointerdown', () => SFXImpl.ensure(), { once: true });

function el(tag, text, cls) {
  const e = document.createElement(tag);
  if (text !== undefined) e.textContent = text;
  if (cls) e.className = cls;
  return e;
}
function bufText(buf) {
  const parts = Object.entries(buf).map(([id, n]) => n + ' ' + ITEMS[id].name);
  return parts.length ? parts.join(', ') : 'kosong';
}

// Ikon item dari atlas untuk panel DOM. Atlas bisa belum siap saat panel
// pertama dibuka: kembalikan null supaya panel jatuh ke teks nama saja.
function iconEl(itemId) {
  try {
    if (Atlas.canvas) return Atlas.iconCanvas('item_' + itemId, 28);
  } catch (_) { /* abaikan */ }
  return null;
}
function chipWithIcon(itemId, n) {
  const span = document.createElement('span');
  span.className = 'chip icon-chip';
  const icon = iconEl(itemId);
  if (icon) span.appendChild(icon);
  span.appendChild(document.createTextNode(ITEMS[itemId].name + ' ' + n));
  return span;
}
let lastBufSig = '';

const UI = {
  toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 1800);
  },
  setHint(text) { $('hint').textContent = text; },

  refreshHUD() {
    $('money').textContent = adminOn() ? '∞' : '$' + fmt(S.money);
    // Label saklar Mode Admin ikut keadaan (refreshHUD dipanggil tiap aksi).
    const at = $('admin-toggle');
    if (at) { at.textContent = adminOn() ? 'Mode Admin: ON' : 'Mode Admin: OFF'; at.classList.toggle('on', adminOn()); }
    $('mapname').textContent = MAP_NAMES[S.map] || 'Kota';
    $('btn-tas').textContent = 'TAS (' + carriedTotal() + ')';
    // Bangun hanya di lahan: tombol disembunyikan di kota.
    $('btn-build').classList.toggle('hidden', S.map !== 'plot');
    if (S.map !== 'plot') {
      this.closePanel('build-menu');
      if (S.placing) this.cancelPlacing();
    }
  },

  // Satu panel dalam satu waktu: membuka panel lain menutup panel inspect/storage.
  openPanel(id) {
    ['build-menu', 'inspect-panel', 'storage-panel', 'shop-panel', 'tas-panel',
     'burger-menu', 'admin-panel', 'settings-panel', 'help-panel', 'mayor-panel', 'train-panel', 'plot-panel', 'badge-panel'].forEach((p) => {
      if (p !== id) $(p).classList.add('hidden');
    });
    if (id !== 'inspect-panel' && id !== 'storage-panel') { inspectKey = null; S.selected = null; }
    $(id).classList.remove('hidden');
  },
  closePanel(id) { $(id).classList.add('hidden'); },
  closeAll() {
    ['build-menu', 'inspect-panel', 'storage-panel', 'shop-panel', 'tas-panel',
     'burger-menu', 'admin-panel', 'settings-panel', 'help-panel', 'mayor-panel', 'train-panel', 'plot-panel', 'badge-panel'].forEach((id) => this.closePanel(id));
    S.selected = null; inspectKey = null;
    if (S.placing) this.cancelPlacing();
  },
  closeMachine() { this.closePanel('inspect-panel'); S.selected = null; inspectKey = null; },
};
