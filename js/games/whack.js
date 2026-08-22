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
    this.lives = this.activity.lives || 3;
    this.moleSpeed = parseInt(this.activity.moleSpeed, 10) || 1400;
    this.hitCount = 0;
    this.holes = [];

    let items = [...(this.activity.items || [])];
    if (this.activity.shuffle !== false) {
      items = DataManager.shuffleArray(items);
    }
    this.questions = items;
    this.targetHits = Math.max(items.length * 2, 8);

    this.render();
    this.setupHammerCursor();
    this.startMoleSpawner();
    this.updateHUD();
  }

  render() {
    const arena = document.createElement('div');
    arena.className = 'whack-arena-container';

    if (this.questions.length === 0) {
      arena.innerHTML = `
        <div style="background: rgba(15, 23, 42, 0.7); border: 2px dashed rgba(236, 72, 153, 0.5); border-radius: 18px; padding: 2.5rem 1.5rem; text-align: center; max-width: 620px; margin: 2rem auto; box-shadow: 0 8px 30px rgba(0,0,0,0.4);">
          <div style="font-size: 3.5rem; animation: bounce 2s infinite;">🐹 🔨</div>
          <div style="font-size: 1.4rem; font-weight: 800; color: #f472b6; margin-top: 0.85rem;">
            ល្បែងវាយសត្វកណ្តុរ (Whack-a-Mole)
          </div>
          <div style="font-size: 0.92rem; color: #cbd5e1; margin-top: 0.6rem; line-height: 1.6;">
            ល្បែងនេះគឺដាច់ដោយឡែកពីគេ! សូមចុចប៊ូតុងខាងក្រោម ដើម្បីបង្កើតសំណួរ ចម្លើយត្រូវ (Targets) និងចម្លើយខុសបញ្ឆោត (Traps) ដោយខ្លួនឯង។
          </div>
          <button class="nav-btn btn-create" id="btn-whack-first-create" style="margin-top: 1.5rem; font-size: 1.05rem; font-weight: 800; padding: 0.85rem 2.5rem; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4); border-radius: 14px; cursor: pointer;">
            ➕ បង្កើតសំណួរវាយកណ្តុរឥឡូវនេះ
          </button>
        </div>
      `;
      this.container.appendChild(arena);
      arena.querySelector('#btn-whack-first-create')?.addEventListener('click', () => {
        sound.playPop();
        document.dispatchEvent(new CustomEvent('open-whack-creator', { detail: this.activity }));
      });
      return;
    }

    // Target Prompt Header
    const currentQ = this.questions[this.currentQuestionIdx % Math.max(1, this.questions.length)];
    const promptText = currentQ ? currentQ.prompt : 'សូមរៀបចំសំណួរវាយកណ្តុរ';

    arena.innerHTML = `
      <div class="whack-top-hud" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; background: rgba(15, 23, 42, 0.6); padding: 0.85rem 1.25rem; border-radius: 14px; border: 1px solid var(--panel-border); margin-bottom: 1.25rem;">
        <div style="flex: 1; min-width: 260px;">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span style="color: #38bdf8; font-weight: 800; font-size: 0.88rem;">🎯 ស្វែងរកចម្លើយសម្រាប់ (Target):</span>
            <button class="nav-btn" id="btn-open-whack-editor" style="font-size: 0.78rem; font-weight: 700; padding: 0.3rem 0.75rem; background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%); border: 1px solid #ec4899; color: #f472b6; border-radius: 8px; cursor: pointer; box-shadow: 0 2px 8px rgba(236, 72, 153, 0.25);">
              🐹 រៀបចំសំណួរវាយកណ្តុរ
            </button>
          </div>
          <div id="whack-current-prompt" style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-top: 0.35rem; line-height: 1.4; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
            ${promptText}
          </div>
        </div>
        <div class="whack-lives-container" id="whack-lives-wrap" style="font-size: 1.4rem; letter-spacing: 2px;">
          ${'❤️'.repeat(Math.max(0, this.lives))}
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

    // Bind Whack Editor Button
    arena.querySelector('#btn-open-whack-editor')?.addEventListener('click', () => {
      sound.playPop();
      document.dispatchEvent(new CustomEvent('open-whack-creator', { detail: this.activity }));
    });

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
        const isOverModal = e.target && e.target.closest && e.target.closest('.modal-overlay.active, .modal-window');
        if (isOverModal) {
          this.hammerEl.style.display = 'none';
        } else {
          this.hammerEl.style.display = 'block';
          this.hammerEl.style.left = `${e.clientX}px`;
          this.hammerEl.style.top = `${e.clientY}px`;
        }
      }
    };

    this.clickHandler = (e) => {
      const isOverModal = e.target && e.target.closest && e.target.closest('.modal-overlay.active, .modal-window');
      if (isOverModal) return;

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

    const intervalTime = Math.max(800, this.moleSpeed || 1400);
    this.popupInterval = setInterval(() => {
      this.popMole();
    }, intervalTime);
  }

  clearMoleSpawner() {
    if (this.popupInterval) {
      clearInterval(this.popupInterval);
      this.popupInterval = null;
    }
  }

  popMole() {
    if (this.holes.length === 0 || this.questions.length === 0) return;
    const randomHoleIdx = Math.floor(Math.random() * this.holes.length);
    const hole = this.holes[randomHoleIdx];
    const mole = hole.querySelector('.whack-mole');
    const moleText = mole.querySelector('.whack-mole-text');

    if (mole.classList.contains('up')) return;

    const currentQ = this.questions[this.currentQuestionIdx % this.questions.length];
    const isCorrect = Math.random() > 0.45; // 55% chance correct target

    // Extract target options
    let targetOptions = [];
    if (currentQ.targets && Array.isArray(currentQ.targets) && currentQ.targets.length > 0) {
      targetOptions = currentQ.targets;
    } else if (currentQ.target) {
      targetOptions = currentQ.target.split(/[,|、]+/).map(s => s.trim()).filter(Boolean);
    }
    if (targetOptions.length === 0) targetOptions = [currentQ.target || 'ត្រូវ'];

    // Extract distractor options
    let distractorOptions = [];
    if (currentQ.distractors && Array.isArray(currentQ.distractors) && currentQ.distractors.length > 0) {
      distractorOptions = currentQ.distractors;
    } else if (typeof currentQ.distractors === 'string' && currentQ.distractors) {
      distractorOptions = currentQ.distractors.split(/[,|、]+/).map(s => s.trim()).filter(Boolean);
    }

    if (distractorOptions.length === 0) {
      // Fallback to other questions targets
      const others = this.questions.filter((_, i) => i !== (this.currentQuestionIdx % this.questions.length));
      distractorOptions = others.map(o => o.target).filter(Boolean);
      if (distractorOptions.length === 0) distractorOptions = ['ខុស'];
    }

    let label = '';
    if (isCorrect) {
      label = targetOptions[Math.floor(Math.random() * targetOptions.length)];
      mole.dataset.isCorrect = 'true';
    } else {
      label = distractorOptions[Math.floor(Math.random() * distractorOptions.length)];
      mole.dataset.isCorrect = 'false';
    }

    moleText.textContent = label.length > 20 ? label.substring(0, 18) + '...' : label;
    mole.classList.remove('hit');
    mole.classList.add('up');

    // Mole stays up for (moleSpeed * 0.85) then retreats
    const stayUpTime = Math.max(650, Math.round((this.moleSpeed || 1400) * 0.85));
    setTimeout(() => {
      if (mole.classList.contains('up') && !mole.classList.contains('hit')) {
        mole.classList.remove('up');
      }
    }, stayUpTime);
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
      if (promptEl && nextQ) promptEl.textContent = nextQ.prompt;

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
