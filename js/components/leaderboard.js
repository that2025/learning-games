/* ==========================================================================
   Results & Scorecard Leaderboard Modal
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Game-over results, accuracy percentage, time elapsed, streak records, confetti celebration
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { i18n } from '../i18n.js';

export class ScorecardModal {
  constructor(onPlayAgain, onSwitchTemplate) {
    this.modalEl = null;
    this.onPlayAgain = onPlayAgain;
    this.onSwitchTemplate = onSwitchTemplate;
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-scorecard';
    this.modalEl.style.zIndex = '1100';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 480px; text-align: center; position: relative; border: 1px solid var(--panel-border); box-shadow: 0 20px 50px rgba(0,0,0,0.6);">
        <!-- Top Right Close Button (X) -->
        <button class="modal-close-btn" id="btn-close-scorecard" title="បិទ (Close)" style="position: absolute; top: 12px; right: 14px; z-index: 10; font-size: 1.5rem; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; color: var(--text-main); cursor: pointer; transition: all 0.2s ease;">
          &times;
        </button>

        <div class="modal-body" style="padding: 2.25rem 1.75rem 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div id="scorecard-icon" style="font-size: 4rem; filter: drop-shadow(0 6px 16px rgba(0,0,0,0.4)); animation: bounce 1.5s infinite;">🏆</div>
          <div id="scorecard-title" style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); line-height: 1.4;">
            🎉 អបអរសាទរ! អ្នកបានឈ្នះហើយ!
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; margin: 0.35rem 0;">
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div id="scorecard-lbl-score" style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">ពិន្ទុសរុប</div>
              <div id="scorecard-score" style="font-size: 1.6rem; font-weight: 800; color: var(--accent-secondary); margin-top: 0.15rem;">0</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div id="scorecard-lbl-accuracy" style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">ភាពត្រឹមត្រូវ</div>
              <div id="scorecard-accuracy" style="font-size: 1.6rem; font-weight: 800; color: var(--accent-primary); margin-top: 0.15rem;">100%</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div id="scorecard-lbl-time" style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">រយៈពេលលេង</div>
              <div id="scorecard-time" style="font-size: 1.35rem; font-weight: 700; color: var(--text-main); margin-top: 0.15rem;">00:00</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div id="scorecard-lbl-streak" style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">ពិន្ទុបន្តបន្ទាប់</div>
              <div id="scorecard-streak" style="font-size: 1.35rem; font-weight: 700; color: #f43f5e; margin-top: 0.15rem;">🔥 0</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: center; gap: 0.85rem; padding-bottom: 1.5rem; flex-wrap: wrap;">
          <button class="nav-btn btn-secondary" id="btn-scorecard-close" style="padding: 0.65rem 1.35rem; font-size: 0.92rem; border-radius: 10px;">
            ✕ បិទ (Close)
          </button>
          <button class="nav-btn btn-create" id="btn-scorecard-play-again" style="padding: 0.65rem 1.6rem; font-size: 0.95rem; border-radius: 10px; font-weight: 800; background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);">
            🔄 លេងម្តងទៀត
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
    // Close button (X)
    this.modalEl.querySelector('#btn-close-scorecard')?.addEventListener('click', () => {
      sound.playPop();
      this.close();
    });

    // Close button in footer
    this.modalEl.querySelector('#btn-scorecard-close')?.addEventListener('click', () => {
      sound.playPop();
      this.close();
    });

    // Backdrop click
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) {
        sound.playPop();
        this.close();
      }
    });

    // Play again button
    this.modalEl.querySelector('#btn-scorecard-play-again')?.addEventListener('click', () => {
      sound.playPop();
      this.close();
      if (this.onPlayAgain) this.onPlayAgain();
    });
  }

  show(results = {}) {
    const isWon = results.won !== false;
    const iconEl = this.modalEl.querySelector('#scorecard-icon');
    const titleEl = this.modalEl.querySelector('#scorecard-title');
    const scoreEl = this.modalEl.querySelector('#scorecard-score');
    const accEl = this.modalEl.querySelector('#scorecard-accuracy');
    const timeEl = this.modalEl.querySelector('#scorecard-time');
    const streakEl = this.modalEl.querySelector('#scorecard-streak');

    const lblScore = this.modalEl.querySelector('#scorecard-lbl-score');
    const lblAcc = this.modalEl.querySelector('#scorecard-lbl-accuracy');
    const lblTime = this.modalEl.querySelector('#scorecard-lbl-time');
    const lblStreak = this.modalEl.querySelector('#scorecard-lbl-streak');
    const btnPlayAgain = this.modalEl.querySelector('#btn-scorecard-play-again');
    const btnClose = this.modalEl.querySelector('#btn-scorecard-close');

    // Dynamic translations
    if (lblScore) lblScore.textContent = i18n.t('finalScore');
    if (lblAcc) lblAcc.textContent = i18n.t('accuracyRate');
    if (lblTime) lblTime.textContent = i18n.t('timeSpent');
    if (lblStreak) lblStreak.textContent = i18n.t('bestStreak');
    if (btnPlayAgain) btnPlayAgain.textContent = i18n.t('playAgain');
    if (btnClose) btnClose.textContent = i18n.t('btnClose');

    if (iconEl) iconEl.textContent = isWon ? '🏆' : '💀';
    if (titleEl) titleEl.textContent = isWon ? i18n.t('victoryTitle') : i18n.t('gameOverTitle');
    if (scoreEl) scoreEl.textContent = `${results.score || 0}`;
    if (accEl) accEl.textContent = `${results.accuracy || 100}%`;

    const sec = results.timeSpent || 0;
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (timeEl) timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (streakEl) streakEl.textContent = `🔥 ${results.bestStreak || 0}`;

    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }
}
