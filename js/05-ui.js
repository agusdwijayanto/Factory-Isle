// Panel dan HUD. Semua aksi di sini visual saja: mockup tidak punya ekonomi,
// simpan, atau research beneran.
const $ = (id) => document.getElementById(id);
const HINT_HOME = 'Seret untuk geser, cubit atau roda mouse untuk zoom, ketuk pohon atau bijih untuk panen.';
let toastTimer = 0;
let buildTab = 'machines';

const UI = {
  toast(msg) {
    const el = $('toast');
    el.textContent = msg;
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 1800);
  },

  setHint(text) { $('hint').textContent = text; },

  openBuild() {
    $('build-menu').classList.remove('hidden');
    this.renderBuildTabs();
    this.renderBuildItems();
  },
  closeBuild() { $('build-menu').classList.add('hidden'); },

  renderBuildTabs() {
    $('build-tabs').innerHTML = '';
    for (const c of CATEGORIES) {
      const b = document.createElement('button');
      b.textContent = c.name;
      if (c.id === buildTab) b.className = 'on';
      b.addEventListener('click', () => { buildTab = c.id; this.renderBuildTabs(); this.renderBuildItems(); });
      $('build-tabs').appendChild(b);
    }
  },

  renderBuildItems() {
    const box = $('build-items');
    box.innerHTML = '';
    const cat = CATEGORIES.find((c) => c.id === buildTab);
    for (const item of cat.items) {
      const b = document.createElement('button');
      b.className = 'build-item';
      const sw = document.createElement('span');
      sw.className = 'sw';
      sw.style.background = item.color;
      const label = document.createElement('span');
      label.appendChild(document.createTextNode(item.name));
      const sub = document.createElement('small');
      sub.textContent = item.sub || '';
      label.appendChild(sub);
      b.appendChild(sw); b.appendChild(label);
      b.addEventListener('click', () => this.pickBuildItem(item));
      box.appendChild(b);
    }
  },

  pickBuildItem(item) {
    if (item.machine) {
      S.placing = item.id;
      this.closeBuild();
      this.setHint('Ketuk petak rumput kosong untuk menaruh ' + item.name + '. Esc untuk batal.');
    } else {
      this.toast('Mockup: ' + item.name + ' belum bisa ditempatkan');
    }
  },

  cancelPlacing() {
    S.placing = null;
    this.setHint(HINT_HOME);
  },

  openMachine(id, gx, gy) {
    const m = MACHINES[id];
    S.selected = key(gx, gy);
    $('mp-name').textContent = m.name;
    $('mp-desc').textContent = m.desc;
    $('mp-recipe').textContent = 'Resep: ' + m.recipe;
    $('machine-panel').classList.remove('hidden');
    // Bar hijau jalan ulang tiap panel dibuka, meniru progres crafting.
    const bar = $('mp-progress');
    bar.classList.remove('run');
    void bar.offsetWidth;
    bar.classList.add('run');
  },
  closeMachine() {
    S.selected = null;
    $('machine-panel').classList.add('hidden');
  },

  closeAll() {
    this.closeBuild();
    this.closeMachine();
    $('burger-menu').classList.add('hidden');
    $('admin-panel').classList.add('hidden');
    if (S.placing) this.cancelPlacing();
  },
};

$('btn-build').addEventListener('click', () => {
  const menu = $('build-menu');
  if (menu.classList.contains('hidden')) UI.openBuild();
  else UI.closeBuild();
});
$('btn-burger').addEventListener('click', () => $('burger-menu').classList.toggle('hidden'));
$('btn-admin').addEventListener('click', () => $('admin-panel').classList.toggle('hidden'));

document.querySelectorAll('[data-close]').forEach((b) => {
  b.addEventListener('click', () => {
    // Panel mesin harus lewat closeMachine supaya sorot petaknya ikut hilang.
    if (b.dataset.close === 'machine-panel') UI.closeMachine();
    else $(b.dataset.close).classList.add('hidden');
  });
});
document.querySelectorAll('#burger-menu [data-act]').forEach((b) => {
  b.addEventListener('click', () => {
    $('burger-menu').classList.add('hidden');
    UI.toast('Mockup: ' + b.dataset.act);
  });
});
document.querySelectorAll('#admin-panel [data-admin]').forEach((b) => {
  b.addEventListener('click', () => UI.toast('[Mockup] ' + b.dataset.admin));
});
$('mp-eject').addEventListener('click', () => UI.toast('Mockup: isi mesin dikeluarkan'));
$('mp-stop').addEventListener('click', () => UI.toast('Mockup: mesin dihentikan'));
