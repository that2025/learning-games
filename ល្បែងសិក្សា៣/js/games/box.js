/* ==========================================================================
   📦 Open The Box Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   3D gift boxes with unboxing audio, interactive question modal, and answer reveal
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { DataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class OpenBoxGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.boxes = [];
    this.openedCount = 0;
    this.score = 0;
    this.moves = 0;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.initGame();
  }

  initGame() {
    this.container.innerHTML = '';
    this.openedCount = 0;
    this.score = 0;
    this.moves = 0;

    let items = [...(this.activity.items || [])];
    if (this.activity.shuffle !== false) {
      items = DataManager.shuffleArray(items);
    }
    this.boxes = items.map((item, idx) => ({
      ...item,
      boxNum: idx + 1,
      opened: false
    }));

    this.render();
    this.updateHUD();
  }

  render() {
    const grid = document.createElement('div');
    grid.className = 'boxes-grid-container';

    this.boxes.forEach((box, index) => {
      const boxEl = document.createElement('div');
      boxEl.className = 'box-item';
      boxEl.dataset.index = index;

      boxEl.innerHTML = `
        <span class="box-number">#${box.boxNum}</span>
      `;

      boxEl.addEventListener('click', () => this.handleBoxClick(boxEl, index));
      grid.appendChild(boxEl);
    });

    this.container.appendChild(grid);
  }

  handleBoxClick(boxEl, index) {
    const box = this.boxes[index];
    if (box.opened) {
      // Re-open modal if already opened
      this.showBoxModal(box, index, boxEl, false);
      return;
    }

    sound.playOpenBox();
    boxEl.classList.add('opened');
    box.opened = true;
    this.openedCount++;
    this.moves++;
    this.score += 150;
    this.updateHUD();

    this.showBoxModal(box, index, boxEl, true);
  }

  showBoxModal(box, index, boxEl, isFirstOpen) {
    // Create floating modal
    const modalWrap = document.createElement('div');
    modalWrap.className = 'modal-overlay active';

    let imgHtml = '';
    if (box.image || box.imagePrompt) {
      imgHtml = `<img src="${box.image || box.imagePrompt}" style="max-height: 140px; border-radius: 10px; margin: 0.5rem 0;" alt="box visual" />`;
    }

    modalWrap.innerHTML = `
      <div class="modal-window" style="max-width: 540px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>🎁</span>
            <span class="modal-title">${i18n.t('boxNumber')} ${box.boxNum}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-box-modal">&times;</button>
        </div>
        <div class="modal-body box-modal-content">
          ${box.emoji ? `<div class="box-modal-emoji">${box.emoji}</div>` : ''}
          ${imgHtml}
          <div class="box-modal-title">${box.prompt}</div>
          <div class="box-modal-answer" id="box-reveal-target">
            <strong>${i18n.t('itemTargetLabel')}:</strong> ${box.target}
          </div>
          ${box.hint ? `<div style="font-size: 0.85rem; color: var(--text-muted);">💡 ${box.hint}</div>` : ''}
        </div>
        <div class="modal-footer">
          <button class="nav-btn btn-create" id="btn-done-box-modal">✅ ${i18n.t('btnDone') || 'យល់ព្រម (Done)'}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    const closeModal = () => {
      sound.playPop();
      modalWrap.remove();
      if (this.openedCount === this.boxes.length) {
        setTimeout(() => this.handleGameComplete(), 400);
      }
    };

    modalWrap.querySelector('#btn-close-box-modal')?.addEventListener('click', closeModal);
    modalWrap.querySelector('#btn-done-box-modal')?.addEventListener('click', closeModal);
  }

  updateHUD() {
    const matchedEl = document.getElementById('hud-stat-matched');
    if (matchedEl) {
      matchedEl.textContent = `${this.openedCount} / ${this.boxes.length}`;
    }

    const movesEl = document.getElementById('hud-stat-moves');
    if (movesEl) {
      movesEl.textContent = `${this.moves}`;
    }

    const scoreEl = document.getElementById('hud-stat-score');
    if (scoreEl) {
      scoreEl.textContent = `${this.score}`;
    }
  }

  handleGameComplete() {
    sound.playVictory();
    particles.fireCelebration();

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        totalItems: this.boxes.length,
        accuracy: 100,
        timeSpent: this.moves * 5,
        moves: this.moves,
        won: true
      });
    }
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
