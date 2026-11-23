// =============================================
//   FACTORY ISLE — js/15-tutorial.js
//   =============================================

const Tutorial = {
  key: 'factory-isle-tutorial-done',
  currentStep: 0,
  steps: [
    { title: 'Selamat Datang di Factory Isle!', text: 'Mari bangun pabrik impianmu di pulau kecil ini. Klik Lanjut untuk mulai.' },
    { title: 'Bangun Mesin', text: 'Klik salah satu petak kosong di grid untuk membuka menu bangunan dan bangun mesin pertamamu.' },
    { title: 'Cek Inventory', text: 'Hasil produksi mesin akan masuk ke tas. Buka panel Tas untuk melihat barang.' },
    { title: 'Jual & Dapatkan Uang', text: 'Bawa barang ke toko atau jual langsung untuk mendapatkan koin emas.' }
  ],

  init() {
    if (localStorage.getItem(this.key)) return;
    this.createUI();
    this.showStep(0);
  },

  createUI() {
    const overlay = document.createElement('div');
    overlay.id = 'tutorial-overlay';
    overlay.innerHTML = `
      <div id="tutorial-box" class="panel">
        <h3 id="tut-title" class="panel-header"></h3>
        <p id="tut-text" style="margin-bottom: 16px; font-size: 14px; line-height: 1.5; color: var(--text-main);"></p>
        <div style="display: flex; justify-content: space-between; gap: 8px;">
          <button class="btn secondary" onclick="Tutorial.skip()">Lewati</button>
          <button class="btn primary" onclick="Tutorial.next()">Lanjut →</button>
        </div>
      </div>
    `;
    
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(10, 5, 2, 0.7);
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
    `;
    
    const box = overlay.querySelector('#tutorial-box');
    box.style.cssText = `
      max-width: 360px; width: 100%; text-align: left;
      border: 2px solid var(--border-light);
    `;

    document.body.appendChild(overlay);
  },

  showStep(index) {
    if (index >= this.steps.length) {
      this.finish();
      return;
    }
    this.currentStep = index;
    const step = this.steps[index];
    document.getElementById('tut-title').innerText = step.title;
    document.getElementById('tut-text').innerText = step.text;
  },

  next() {
    if (typeof Sound !== 'undefined') Sound.play('click');
    this.showStep(this.currentStep + 1);
  },

  skip() {
    if (typeof Sound !== 'undefined') Sound.play('click');
    this.finish();
  },

  finish() {
    localStorage.setItem(this.key, 'true');
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.remove();
  }
};

window.Tutorial = Tutorial;
document.addEventListener('DOMContentLoaded', () => Tutorial.init());
