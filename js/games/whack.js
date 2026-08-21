/* ==========================================================================
   🐹 Whack-a-Mole Arcade Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   6-hole mole arena, custom hammer cursor tracking with clean lifecycle disposal, combo streaks, lives
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { DataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class WhackGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.hammerEl = null;
    this.mouseMoveHandler = null;
    this.clickHandler = null;
    this.popupInterval = null;
    this.holes = [];
    this.currentQuestionIdx = 0;
    this.questions = [];
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.hitCount = 0;
    this.targetHits = 8;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.initGame();
  }

  initGame() {
    this.destroy(); // Clean previous if any
    this.container.innerHTML = '';
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.hitCount = 0;
    this.holes = [];

    let items = [...(this.activity.items || [])];
    if (this.activity.shuffle !== false) {
      items = DataManager.shuffleArray(items);
    }
    this.questions = items;
    this.targetHits = Math.min(items.length * 2, 10);

    this.render();
    this.setupHammerCursor();
    this.startMoleSpawner();
    this.updateHUD();
  }

  render() {
    const arena = document.createElement('div');
    arena.className = 'whack-arena-container';

    // Target Prompt Header
    const currentQ = this.questions[this.currentQuestionIdx % this.questions.length];
    arena.innerHTML = `
      <div class="whack-top-hud">
        <div>
          <span style="color: var(--text-muted); font-size: 0.82rem;">🎯 ស្វែងរកចម្លើយសម្រាប់ (Target):</span>
          <div id="whack-current-prompt" style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-top: 0.2rem;">
            ${currentQ.prompt}
          </div>
        </div>
        <div class="whack-lives-container" id="whack-lives-wrap">
          ❤️❤️❤️
        </div>
      </div>

      <div class="whack-holes-grid">
        ${[0, 1, 2, 3, 4, 5].map(i => `
          <div class="whack-hole" data-hole="${i}">
            <div class="whack-mole" data-mole="${i}">
              <div class="whack-mole-face">🐹</div>
              <div class="whack-mole-text"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    this.container.appendChild(arena);

    // Cache hole elements
    this.holes = Array.from(this.container.querySelectorAll('.whack-hole'));
    this.holes.forEach((hole, idx) => {
      const mole = hole.querySelector('.whack-mole');
      mole.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleMoleWhack(mole, idx);
      });
    });
  }

  setupHammerCursor() {
    this.removeHammerCursor();

    this.hammerEl = document.createElement('div');
    this.hammerEl.className = 'hammer-cursor';
    this.hammerEl.innerHTML = '🔨';
    document.body.appendChild(this.hammerEl);

    this.mouseMoveHandler = (e) => {
      if (this.hammerEl) {
        this.hammerEl.style.left = `${e.clientX}px`;
        this.hammerEl.style.top = `${e.clientY}px`;
      }
    };

    this.clickHandler = () => {
      if (this.hammerEl) {
        this.hammerEl.classList.add('whacking');
        setTimeout(() => {
          if (this.hammerEl) this.hammerEl.classList.remove('whacking');
        }, 100);
      }
    };

    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mousedown', this.clickHandler);
  }

  removeHammerCursor() {
    if (this.hammerEl) {
      this.hammerEl.remove();
      this.hammerEl = null;
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
      this.mouseMoveHandler = null;
    }
    if (this.clickHandler) {
      window.removeEventListener('mousedown', this.clickHandler);
      this.clickHandler = null;
    }
  }

  startMoleSpawner() {
    this.clearMoleSpawner();
    this.popMole();

    this.popupInterval = setInterval(() => {
      this.popMole();
    }, 1600);
  }

  clearMoleSpawner() {
    if (this.popupInterval) {
      clearInterval(this.popupInterval);
      this.popupInterval = null;
    }
  }

  popMole() {
    if (this.holes.length === 0) return;
    const randomHoleIdx = Math.floor(Math.random() * this.holes.length);
    const hole = this.holes[randomHoleIdx];
    const mole = hole.querySelector('.whack-mole');
    const moleText = mole.querySelector('.whack-mole-text');

    if (mole.classList.contains('up')) return;

    const currentQ = this.questions[this.currentQuestionIdx % this.questions.length];
    const isCorrect = Math.random() > 0.45; // 55% chance correct answer

    let label = '';
    if (isCorrect) {
      label = currentQ.target;
      mole.dataset.isCorrect = 'true';
    } else {
      // Pick distractor or other target
      if (currentQ.distractors && currentQ.distractors.length > 0) {
        label = currentQ.distractors[Math.floor(Math.random() * currentQ.distractors.length)];
      } else {
        const others = this.questions.filter((_, i) => i !== (this.currentQuestionIdx % this.questions.length));
        label = others.length > 0 ? others[0].target : 'ខុស';
      }
      mole.dataset.isCorrect = 'false';
    }

    moleText.textContent = label.length > 18 ? label.substring(0, 16) + '...' : label;
    mole.classList.remove('hit');
    mole.classList.add('up');

    // Mole stays up for 1.3s then retreats
    setTimeout(() => {
      if (mole.classList.contains('up') && !mole.classList.contains('hit')) {
        mole.classList.remove('up');
      }
    }, 1300);
  }

  handleMoleWhack(mole, idx) {
    if (!mole.classList.contains('up') || mole.classList.contains('hit')) return;

    sound.playWhack();
    mole.classList.add('hit');

    const isCorrect = mole.dataset.isCorrect === 'true';

    if (isCorrect) {
      sound.playMatch();
      this.combo++;
      this.hitCount++;
      this.score += 150 * Math.min(this.combo, 4);

      // Next question prompt
      this.currentQuestionIdx++;
      const nextQ = this.questions[this.currentQuestionIdx % this.questions.length];
      const promptEl = document.getElementById('whack-current-prompt');
      if (promptEl) promptEl.textContent = nextQ.prompt;

      this.updateHUD();

      setTimeout(() => {
        mole.classList.remove('up');
        mole.classList.remove('hit');
      }, 300);

      if (this.hitCount >= this.targetHits) {
        setTimeout(() => this.handleGameComplete(true), 400);
      }
    } else {
      sound.playWrong();
      this.combo = 0;
      this.lives--;
      this.updateHUD();

      setTimeout(() => {
        mole.classList.remove('up');
        mole.classList.remove('hit');
      }, 300);

      if (this.lives <= 0) {
        setTimeout(() => this.handleGameComplete(false), 400);
      }
    }
  }

  updateHUD() {
    const matchedEl = document.getElementById('hud-stat-matched');
    if (matchedEl) {
      matchedEl.textContent = `${this.hitCount} / ${this.targetHits}`;
    }

    const movesEl = document.getElementById('hud-stat-moves');
    if (movesEl) {
      movesEl.textContent = `${this.combo}x Combo`;
    }

    const scoreEl = document.getElementById('hud-stat-score');
    if (scoreEl) {
      scoreEl.textContent = `${this.score}`;
    }

    const livesWrap = document.getElementById('whack-lives-wrap');
    if (livesWrap) {
      livesWrap.innerHTML = '❤️'.repeat(Math.max(0, this.lives)) || '💀';
    }
  }

  handleGameComplete(won) {
    this.clearMoleSpawner();
    this.removeHammerCursor();

    if (won) {
      sound.playVictory();
      particles.fireCelebration();
    } else {
      sound.playWrong();
    }

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        totalItems: this.targetHits,
        accuracy: Math.round((this.hitCount / Math.max(1, this.hitCount + (3 - this.lives))) * 100),
        timeSpent: this.hitCount * 3,
        moves: this.hitCount,
        won: won
      });
    }
  }

  destroy() {
    this.clearMoleSpawner();
    this.removeHammerCursor();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
