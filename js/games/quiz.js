/* ==========================================================================
   🎯 Quiz Gameshow Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Countdown timer, streak multiplier, lifelines, keyboard shortcuts (A-D, 1-4)
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { DataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class QuizGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.currentIndex = 0;
    this.questions = [];
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.lives = 3;
    this.timeLimit = 20;
    this.timeRemaining = 20;
    this.timerInterval = null;
    this.lifelinesUsed = { '5050': false, 'time': false, 'hint': false };
    this.isAnsweringLocked = false;
    this.keyHandler = null;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.initGame();
  }

  initGame() {
    this.container.innerHTML = '';
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctCount = 0;
    this.lives = this.activity.lives || 3;
    this.timeLimit = this.activity.timerSec || 25;
    this.lifelinesUsed = { '5050': false, 'time': false, 'hint': false };
    this.isAnsweringLocked = false;

    let items = [...(this.activity.items || [])];
    if (this.activity.shuffle !== false) {
      items = DataManager.shuffleArray(items);
    }
    this.questions = items;

    this.renderContainer();
    this.bindKeyboardShortcuts();
    this.loadQuestion(0);
  }

  renderContainer() {
    const arena = document.createElement('div');
    arena.className = 'quiz-arena-container';

    arena.innerHTML = `
      <!-- Top Bar: Lifelines & Multipliers -->
      <div class="quiz-top-bar">
        <div class="quiz-lifelines-group">
          <button class="quiz-lifeline-btn" id="btn-ll-5050" title="50:50">
            <span>✨</span> 50:50
          </button>
          <button class="quiz-lifeline-btn" id="btn-ll-time" title="+15s">
            <span>⏳</span> +15s
          </button>
          <button class="quiz-lifeline-btn" id="btn-ll-hint" title="Hint">
            <span>💡</span> ${i18n.t('lifelineHint')}
          </button>
        </div>

        <div class="quiz-streak-badge" id="quiz-streak-badge">
          <span>🔥</span> <span id="quiz-streak-text">1.0x ${i18n.t('streakMultiplier')}</span>
        </div>
      </div>

      <!-- Timer Track -->
      <div class="quiz-timer-track">
        <div class="quiz-timer-fill" id="quiz-timer-fill"></div>
      </div>

      <!-- Question Box -->
      <div class="quiz-question-box" id="quiz-question-box">
        <div class="quiz-question-num" id="quiz-question-num">1 / ${this.questions.length}</div>
        <div class="quiz-question-text" id="quiz-question-text">Question Prompt</div>
        <div id="quiz-question-img-wrap"></div>
      </div>

      <!-- Options 2x2 Grid -->
      <div class="quiz-options-grid" id="quiz-options-grid"></div>

      <!-- Explanation Card / Hint -->
      <div id="quiz-feedback-wrap"></div>
    `;

    this.container.appendChild(arena);

    // Bind Lifeline Buttons
    document.getElementById('btn-ll-5050')?.addEventListener('click', () => this.use5050Lifeline());
    document.getElementById('btn-ll-time')?.addEventListener('click', () => this.useTimeLifeline());
    document.getElementById('btn-ll-hint')?.addEventListener('click', () => this.useHintLifeline());
  }

  loadQuestion(index) {
    if (index >= this.questions.length) {
      this.handleGameComplete(true);
      return;
    }

    this.currentIndex = index;
    this.isAnsweringLocked = false;
    const q = this.questions[index];

    // Update Question Number & Text
    const numEl = document.getElementById('quiz-question-num');
    const textEl = document.getElementById('quiz-question-text');
    const imgWrap = document.getElementById('quiz-question-img-wrap');
    const feedbackWrap = document.getElementById('quiz-feedback-wrap');

    if (numEl) numEl.textContent = `${index + 1} / ${this.questions.length}`;
    if (textEl) textEl.textContent = q.prompt;

    if (imgWrap) {
      if (q.image || q.imagePrompt) {
        imgWrap.innerHTML = `<img class="quiz-question-img" src="${q.image || q.imagePrompt}" alt="quiz visual" />`;
      } else if (q.emoji) {
        imgWrap.innerHTML = `<div style="font-size: 2.5rem; margin-top: 0.5rem;">${q.emoji}</div>`;
      } else {
        imgWrap.innerHTML = '';
      }
    }

    if (feedbackWrap) feedbackWrap.innerHTML = '';

    // Prepare 4 Options (1 Target + up to 3 distractors)
    let options = [
      { text: q.target, isCorrect: true }
    ];

    if (q.distractors && Array.isArray(q.distractors)) {
      q.distractors.forEach(d => {
        if (d && String(d).trim().length > 0) {
          options.push({ text: d, isCorrect: false });
        }
      });
    }

    // Fill with fallback options if fewer than 4
    if (options.length < 4) {
      const otherTargets = this.questions
        .filter((_, idx) => idx !== index)
        .map(other => ({ text: other.target, isCorrect: false }));
      const shuffledOthers = DataManager.shuffleArray(otherTargets);
      while (options.length < 4 && shuffledOthers.length > 0) {
        options.push(shuffledOthers.pop());
      }
    }

    options = DataManager.shuffleArray(options).slice(0, 4);

    // Render Options Grid
    const grid = document.getElementById('quiz-options-grid');
    if (grid) {
      grid.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];

      options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option-btn';
        btn.dataset.key = letters[optIdx];
        btn.dataset.correct = opt.isCorrect ? 'true' : 'false';

        btn.innerHTML = `
          <span class="quiz-option-key">${letters[optIdx]}</span>
          <span class="quiz-option-text">${opt.text}</span>
        `;

        btn.addEventListener('click', () => this.handleOptionSelect(btn, opt.isCorrect));
        grid.appendChild(btn);
      });
    }

    this.startQuestionTimer();
    this.updateHUD();
  }

  handleOptionSelect(btnEl, isCorrect) {
    if (this.isAnsweringLocked) return;
    this.isAnsweringLocked = true;
    this.clearQuestionTimer();

    const q = this.questions[this.currentIndex];
    const grid = document.getElementById('quiz-options-grid');
    const allBtns = grid ? grid.querySelectorAll('.quiz-option-btn') : [];

    if (isCorrect) {
      sound.playMatch();
      btnEl.classList.add('correct');
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.correctCount++;

      // Multiplier formula
      let mult = 1.0;
      if (this.streak >= 5) mult = 3.0;
      else if (this.streak >= 3) mult = 2.0;
      else if (this.streak >= 2) mult = 1.5;

      const earned = Math.round(100 * mult);
      this.score += earned;
      this.updateStreakBadge(mult);
      this.updateHUD();

      setTimeout(() => {
        this.loadQuestion(this.currentIndex + 1);
      }, 1200);
    } else {
      sound.playWrong();
      btnEl.classList.add('wrong');
      this.streak = 0;
      this.lives--;
      this.updateStreakBadge(1.0);
      this.updateHUD();

      // Reveal correct option
      allBtns.forEach(b => {
        if (b.dataset.correct === 'true') {
          b.classList.add('correct');
        }
      });

      // Show explanation if exists
      if (q.hint) {
        const feedbackWrap = document.getElementById('quiz-feedback-wrap');
        if (feedbackWrap) {
          feedbackWrap.innerHTML = `
            <div class="quiz-explanation-card">
              <span>💡</span>
              <div><strong>${i18n.t('itemHintLabel')}:</strong> ${q.hint}</div>
            </div>
          `;
        }
      }

      if (this.lives <= 0) {
        setTimeout(() => this.handleGameComplete(false), 1600);
      } else {
        setTimeout(() => this.loadQuestion(this.currentIndex + 1), 1600);
      }
    }
  }

  startQuestionTimer() {
    this.clearQuestionTimer();
    this.timeRemaining = this.timeLimit;
    const fillEl = document.getElementById('quiz-timer-fill');

    if (fillEl) {
      fillEl.style.width = '100%';
    }

    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (fillEl) {
        const pct = (this.timeRemaining / this.timeLimit) * 100;
        fillEl.style.width = `${Math.max(0, pct)}%`;
      }

      if (this.timeRemaining <= 5 && this.timeRemaining > 0) {
        sound.playTick();
      }

      if (this.timeRemaining <= 0) {
        this.clearQuestionTimer();
        this.handleTimeOut();
      }
    }, 1000);
  }

  clearQuestionTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  handleTimeOut() {
    if (this.isAnsweringLocked) return;
    this.isAnsweringLocked = true;
    sound.playWrong();
    this.lives--;
    this.streak = 0;
    this.updateStreakBadge(1.0);
    this.updateHUD();

    // Reveal correct option
    const grid = document.getElementById('quiz-options-grid');
    if (grid) {
      grid.querySelectorAll('.quiz-option-btn').forEach(b => {
        if (b.dataset.correct === 'true') b.classList.add('correct');
      });
    }

    if (this.lives <= 0) {
      setTimeout(() => this.handleGameComplete(false), 1400);
    } else {
      setTimeout(() => this.loadQuestion(this.currentIndex + 1), 1400);
    }
  }

  use5050Lifeline() {
    if (this.lifelinesUsed['5050'] || this.isAnsweringLocked) return;
    this.lifelinesUsed['5050'] = true;
    sound.playLifeline();

    const btn = document.getElementById('btn-ll-5050');
    if (btn) btn.disabled = true;

    const grid = document.getElementById('quiz-options-grid');
    if (!grid) return;

    const wrongBtns = Array.from(grid.querySelectorAll('.quiz-option-btn')).filter(
      b => b.dataset.correct === 'false'
    );
    const toDisable = DataManager.shuffleArray(wrongBtns).slice(0, 2);
    toDisable.forEach(b => b.classList.add('disabled-5050'));
  }

  useTimeLifeline() {
    if (this.lifelinesUsed['time'] || this.isAnsweringLocked) return;
    this.lifelinesUsed['time'] = true;
    sound.playLifeline();

    const btn = document.getElementById('btn-ll-time');
    if (btn) btn.disabled = true;

    this.timeRemaining += 15;
    this.timeLimit += 15;
  }

  useHintLifeline() {
    if (this.lifelinesUsed['hint'] || this.isAnsweringLocked) return;
    this.lifelinesUsed['hint'] = true;
    sound.playLifeline();

    const btn = document.getElementById('btn-ll-hint');
    if (btn) btn.disabled = true;

    const q = this.questions[this.currentIndex];
    const feedbackWrap = document.getElementById('quiz-feedback-wrap');
    if (feedbackWrap && q.hint) {
      feedbackWrap.innerHTML = `
        <div class="quiz-explanation-card">
          <span>💡</span>
          <div><strong>${i18n.t('itemHintLabel')}:</strong> ${q.hint}</div>
        </div>
      `;
    }
  }

  updateStreakBadge(mult) {
    const textEl = document.getElementById('quiz-streak-text');
    if (textEl) {
      textEl.textContent = `${mult.toFixed(1)}x ${i18n.t('streakMultiplier')}`;
    }
  }

  bindKeyboardShortcuts() {
    this.unbindKeyboardShortcuts();
    this.keyHandler = (e) => {
      if (this.isAnsweringLocked) return;
      const key = e.key.toUpperCase();
      let targetIndex = -1;

      if (key === 'A' || key === '1') targetIndex = 0;
      else if (key === 'B' || key === '2') targetIndex = 1;
      else if (key === 'C' || key === '3') targetIndex = 2;
      else if (key === 'D' || key === '4') targetIndex = 3;

      if (targetIndex >= 0) {
        const grid = document.getElementById('quiz-options-grid');
        if (grid) {
          const btns = grid.querySelectorAll('.quiz-option-btn');
          if (btns[targetIndex] && !btns[targetIndex].classList.contains('disabled-5050')) {
            btns[targetIndex].click();
          }
        }
      }
    };
    window.addEventListener('keydown', this.keyHandler);
  }

  unbindKeyboardShortcuts() {
    if (this.keyHandler) {
      window.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  updateHUD() {
    const matchedEl = document.getElementById('hud-stat-matched');
    if (matchedEl) {
      matchedEl.textContent = `${this.currentIndex + 1} / ${this.questions.length}`;
    }

    const scoreEl = document.getElementById('hud-stat-score');
    if (scoreEl) {
      scoreEl.textContent = `${this.score}`;
    }

    const livesEl = document.getElementById('hud-stat-moves');
    if (livesEl) {
      livesEl.innerHTML = '❤️'.repeat(Math.max(0, this.lives));
    }
  }

  handleGameComplete(won) {
    this.clearQuestionTimer();
    this.unbindKeyboardShortcuts();

    if (won) {
      sound.playVictory();
      particles.fireCelebration();
    } else {
      sound.playWrong();
    }

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        totalItems: this.questions.length,
        accuracy: Math.round((this.correctCount / Math.max(1, this.questions.length)) * 100),
        timeSpent: this.questions.length * 10,
        bestStreak: this.bestStreak,
        won: won
      });
    }
  }

  destroy() {
    this.clearQuestionTimer();
    this.unbindKeyboardShortcuts();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
