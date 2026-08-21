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
      imgHtml = `<img src="${box.image || box.imagePrompt}" style="max-height: 150px; border-radius: 12px; margin: 0.5rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid var(--panel-border);" alt="box visual" onerror="this.style.display='none';" />`;
    }

    const boxTitle = `${i18n.t('boxNumber')} #${box.boxNum}`;

    modalWrap.innerHTML = `
      <div class="modal-window" style="max-width: 560px; text-align: center;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>🎁</span>
            <span class="modal-title">${boxTitle}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-box-modal">&times;</button>
        </div>
        <div class="modal-body box-modal-content" style="gap: 1.1rem; padding: 1.5rem 1.25rem;">
          ${box.emoji ? `<div class="box-modal-emoji" style="font-size: 3.5rem; line-height: 1;">${box.emoji}</div>` : ''}
          ${imgHtml}
          <div class="box-modal-title" style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); line-height: 1.5;">
            ${box.prompt}
          </div>

          <!-- Answer Section with Reveal / Hide Toggle Button -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; margin: 0.35rem 0;">
            <button class="nav-btn btn-ai" id="btn-toggle-reveal-answer" style="font-size: 0.95rem; padding: 0.6rem 1.5rem; border-radius: 10px; font-weight: 700; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); transition: all 0.25s ease;">
              <span>👁️</span> <span>${i18n.t('btnRevealAnswer')}</span>
            </button>

            <div class="box-modal-answer" id="box-reveal-target" style="display: none; width: 100%; font-size: 1.05rem; padding: 0.85rem 1.25rem; border-radius: 12px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; color: #34d399; animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
              <strong style="color: #6ee7b7;">${i18n.t('itemTargetLabel')}:</strong> <span style="font-weight: 800; font-size: 1.15rem; color: #fff;">${box.target}</span>
            </div>
          </div>

          ${box.hint ? `<div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 0.4rem 0.8rem; border-radius: 8px;">💡 ${box.hint}</div>` : ''}
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="nav-btn btn-create" id="btn-done-box-modal" style="font-size: 0.95rem; padding: 0.55rem 2rem; font-weight: 700;">
            <span>✅</span> <span>${i18n.t('btnDone')}</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    let isRevealed = false;
    const revealBtn = modalWrap.querySelector('#btn-toggle-reveal-answer');
    const answerEl = modalWrap.querySelector('#box-reveal-target');

    revealBtn?.addEventListener('click', () => {
      isRevealed = !isRevealed;
      if (isRevealed) {
        sound.playMatch();
        particles.fireConfetti();
        answerEl.style.display = 'block';
        revealBtn.innerHTML = `<span>🙈</span> <span>${i18n.t('btnHideAnswer')}</span>`;
        revealBtn.className = 'nav-btn';
        revealBtn.style.background = 'rgba(255, 255, 255, 0.12)';
        revealBtn.style.boxShadow = 'none';
      } else {
        sound.playPop();
        answerEl.style.display = 'none';
        revealBtn.innerHTML = `<span>👁️</span> <span>${i18n.t('btnRevealAnswer')}</span>`;
        revealBtn.className = 'nav-btn btn-ai';
        revealBtn.style.background = '';
        revealBtn.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.35)';
      }
    });

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
