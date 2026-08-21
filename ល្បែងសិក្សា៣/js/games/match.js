/* ==========================================================================
   🧩 Match Up Engine (Dual-Column Matching System)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Tap-to-pair and drag-and-drop dual column item association
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { DataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class MatchUpGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.selectedPrompt = null;
    this.selectedTarget = null;
    this.matchedPairsCount = 0;
    this.totalPairs = 0;
    this.score = 0;
    this.moves = 0;
    this.timer = 0;
    this.timerInterval = null;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.initGame();
  }

  initGame() {
    this.container.innerHTML = '';
    this.selectedPrompt = null;
    this.selectedTarget = null;
    this.matchedPairsCount = 0;
    this.moves = 0;
    this.score = 0;

    const rawItems = this.activity.items || [];
    this.totalPairs = rawItems.length;

    let prompts = rawItems.map((item, idx) => ({
      idx,
      prompt: item.prompt,
      emoji: item.emoji || '',
      image: item.imagePrompt || item.image || ''
    }));

    let targets = rawItems.map((item, idx) => ({
      idx,
      target: item.target,
      image: item.imageTarget || ''
    }));

    if (this.activity.shuffle !== false) {
      prompts = DataManager.shuffleArray(prompts);
      targets = DataManager.shuffleArray(targets);
    }

    this.render(prompts, targets);
    this.updateHUD();
    this.startTimer();
  }

  render(prompts, targets) {
    const wrapper = document.createElement('div');
    wrapper.className = 'matchup-container';

    // Left Column (Prompts)
    const colLeft = document.createElement('div');
    colLeft.className = 'matchup-column';
    colLeft.innerHTML = `<div class="matchup-column-title">${i18n.t('itemPromptLabel')}</div>`;

    prompts.forEach(p => {
      const itemEl = document.createElement('div');
      itemEl.className = 'matchup-item matchup-prompt';
      itemEl.dataset.idx = p.idx;

      itemEl.innerHTML = `
        ${p.emoji ? `<span class="matchup-item-icon">${p.emoji}</span>` : ''}
        <span class="matchup-item-text">${p.prompt}</span>
        <span class="matchup-item-badge">👉</span>
      `;

      itemEl.addEventListener('click', () => this.handlePromptSelect(itemEl, p.idx));
      colLeft.appendChild(itemEl);
    });

    // Right Column (Targets)
    const colRight = document.createElement('div');
    colRight.className = 'matchup-column';
    colRight.innerHTML = `<div class="matchup-column-title">${i18n.t('itemTargetLabel')}</div>`;

    targets.forEach(t => {
      const itemEl = document.createElement('div');
      itemEl.className = 'matchup-item matchup-target';
      itemEl.dataset.idx = t.idx;

      itemEl.innerHTML = `
        <span class="matchup-item-badge">👈</span>
        <span class="matchup-item-text">${t.target}</span>
      `;

      itemEl.addEventListener('click', () => this.handleTargetSelect(itemEl, t.idx));
      colRight.appendChild(itemEl);
    });

    wrapper.appendChild(colLeft);
    wrapper.appendChild(colRight);
    this.container.appendChild(wrapper);
  }

  handlePromptSelect(el, idx) {
    if (el.classList.contains('matched')) return;

    sound.playPop();
    document.querySelectorAll('.matchup-prompt').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedPrompt = { el, idx };

    if (this.selectedTarget) {
      this.checkPairMatch();
    }
  }

  handleTargetSelect(el, idx) {
    if (el.classList.contains('matched')) return;

    sound.playPop();
    document.querySelectorAll('.matchup-target').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedTarget = { el, idx };

    if (this.selectedPrompt) {
      this.checkPairMatch();
    }
  }

  checkPairMatch() {
    this.moves++;
    const isMatch = this.selectedPrompt.idx === this.selectedTarget.idx;

    if (isMatch) {
      sound.playMatch();
      this.selectedPrompt.el.classList.remove('selected');
      this.selectedPrompt.el.classList.add('matched');
      this.selectedTarget.el.classList.remove('selected');
      this.selectedTarget.el.classList.add('matched');

      this.matchedPairsCount++;
      this.score += 200;
      this.selectedPrompt = null;
      this.selectedTarget = null;
      this.updateHUD();

      if (this.matchedPairsCount === this.totalPairs) {
        this.handleGameComplete();
      }
    } else {
      sound.playWrong();
      const pEl = this.selectedPrompt.el;
      const tEl = this.selectedTarget.el;

      pEl.style.animation = 'shake 0.4s ease';
      tEl.style.animation = 'shake 0.4s ease';

      setTimeout(() => {
        pEl.style.animation = '';
        tEl.style.animation = '';
        pEl.classList.remove('selected');
        tEl.classList.remove('selected');
        this.selectedPrompt = null;
        this.selectedTarget = null;
      }, 500);
    }
  }

  startTimer() {
    this.clearInterval();
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateHUD();
    }, 1000);
  }

  clearInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateHUD() {
    const matchedEl = document.getElementById('hud-stat-matched');
    if (matchedEl) {
      matchedEl.textContent = `${this.matchedPairsCount} / ${this.totalPairs}`;
    }

    const movesEl = document.getElementById('hud-stat-moves');
    if (movesEl) {
      movesEl.textContent = `${this.moves}`;
    }

    const scoreEl = document.getElementById('hud-stat-score');
    if (scoreEl) {
      scoreEl.textContent = `${this.score}`;
    }

    const timerEl = document.getElementById('hud-stat-timer');
    if (timerEl) {
      const mins = Math.floor(this.timer / 60);
      const secs = this.timer % 60;
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
  }

  handleGameComplete() {
    this.clearInterval();
    sound.playVictory();
    particles.fireCelebration();

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        totalItems: this.totalPairs,
        accuracy: Math.round((this.totalPairs / Math.max(this.moves, this.totalPairs)) * 100),
        timeSpent: this.timer,
        moves: this.moves,
        won: true
      });
    }
  }

  destroy() {
    this.clearInterval();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
