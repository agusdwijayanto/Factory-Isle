// Simple Cozy Tutorial System for Factory-Isle
const Tutorial = {
  key: 'factory-isle-tutorial-done',
  steps: [
    { text: 'Langkah 1: Klik tile kosong di lahan untuk membuka menu Bangun dan dirikan mesin pertamamu.' },
    { text: 'Langkah 2: Buka menu Tas (di pojok bawah) untuk melihat hasil produksi dan inventory.' },
    { text: 'Langkah 3: Kunjungi Toko atau Exchange di kota untuk menjual item dan mendapatkan koin.' }
  ],
  currentStep: 0,
  init() {
    if (localStorage.getItem(this.key) === 'true') return;
    this.renderOverlay();
  },
  renderOverlay() {
    let box = document.getElementById('tutorial-overlay');
    if (!box) {
      box = document.createElement('div');
      box.id = 'tutorial-overlay';
      document.body.appendChild(box);
    }
    const stepData = this.steps[this.currentStep];
    if (!stepData) {
      this.finish();
      return;
    }
    box.style.cssText = `
      position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
      z-index: 9999; width: min(380px, 92vw);
      background: #fffaf2; border: 2px solid #a47e62; border-radius: 12px;
      padding: 16px; box-shadow: 0 8px 24px rgba(92, 64, 51, 0.2);
      font-family: 'Nunito', system-ui, sans-serif; color: #3b271d;
    `;
    box.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span style="font-weight: 800; font-size: 15px; color: #b8860b;">Tutorial (${this.currentStep + 1}/${this.steps.length})</span>
        <button id="tut-skip" style="background: none; border: none; color: #8c6239; cursor: pointer; font-weight: 700;">Lewati</button>
      </div>
      <p style="font-size: 14px; line-height: 1.4; margin-bottom: 12px;">${stepData.text}</p>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button id="tut-next" style="background: #e6b84c; border: 1px solid #a47e62; border-radius: 8px; padding: 6px 14px; font-weight: 700; cursor: pointer; color: #3b271d;">Lanjut</button>
      </div>
    `;
    document.getElementById('tut-skip').addEventListener('click', () => this.finish());
    document.getElementById('tut-next').addEventListener('click', () => this.next());
  },
  next() {
    this.currentStep++;
    if (this.currentStep >= this.steps.length) {
      this.finish();
    } else {
      this.renderOverlay();
    }
  },
  finish() {
    localStorage.setItem(this.key, 'true');
    const box = document.getElementById('tutorial-overlay');
    if (box) box.remove();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => Tutorial.init(), 1000);
});
