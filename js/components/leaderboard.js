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

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 500px; text-align: center;">
        <div class="modal-body" style="padding: 2.25rem 1.75rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
          <div id="scorecard-icon" style="font-size: 3.8rem; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));">🏆</div>
          <div id="scorecard-title" style="font-size: 1.4rem; font-weight: 800; color: var(--text-main);">
            ${i18n.t('victoryTitle')}
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; margin: 0.5rem 0;">
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('finalScore')}</div>
              <div id="scorecard-score" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-secondary);">0</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('accuracyRate')}</div>
              <div id="scorecard-accuracy" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">100%</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('timeSpent')}</div>
              <div id="scorecard-time" style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">00:00</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('bestStreak')}</div>
              <div id="scorecard-streak" style="font-size: 1.25rem; font-weight: 700; color: #f43f5e;">🔥 0</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: center; gap: 1rem;">
          <button class="nav-btn btn-create" id="btn-scorecard-play-again" style="padding: 0.6rem 1.5rem; font-size: 0.95rem;">
            ${i18n.t('playAgain')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
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
