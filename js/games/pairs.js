/* ==========================================================================
   🎴 Matching Pairs Engine (Memory Card Flip & Classroom Review Game)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Click once to open (flip), click again on the same card to close (unflip)
   - Matched pairs STAY OPEN permanently with green highlight so users see what remains
   - Whole-class Preview Mode (👁️ បង្ហាញទាំងអស់ / 🙈 លាក់ទាំងអស់)
   - Move tracking, victory fanfare & confetti
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { DataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class MatchingPairsGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairsSet = new Set();
    this.totalPairs = 0;
    this.moves = 0;
    this.score = 0;
    this.isLocked = false;
    this.isPreviewMode = false;
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
    this.flippedCards = [];
    this.matchedPairsSet.clear();
    this.moves = 0;
    this.score = 0;
    this.isLocked = false;
    this.isPreviewMode = false;

    const rawItems = this.activity.items || [];
    this.totalPairs = rawItems.length;

    // Generate dual cards for each item (Card A: Prompt / Image, Card B: Target / Meaning)
    let cardDeck = [];
    rawItems.forEach((item, index) => {
      // Card 1 (Side A)
      cardDeck.push({
        id: `card-${index}-a`,
        pairId: index,
        type: 'prompt',
        text: item.prompt || '',
        emoji: item.emoji || '',
        image: item.imagePrompt || item.image || ''
      });

      // Card 2 (Side B)
      cardDeck.push({
        id: `card-${index}-b`,
        pairId: index,
        type: 'target',
        text: item.target || '',
        emoji: item.emoji || '',
        image: item.imageTarget || ''
      });
    });

    if (this.activity.shuffle !== false) {
      cardDeck = DataManager.shuffleArray(cardDeck);
    }
    this.cards = cardDeck;

    this.render();
    this.updateHUD();
    this.startTimer();
  }

  render() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
    `;

    // 1. Top Classroom Action Bar (Preview All Toggle & Remaining Counter)
    const controlBar = document.createElement('div');
    controlBar.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      padding: 0.65rem 1.25rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    `;

    const remainingPairs = this.totalPairs - this.matchedPairsSet.size;

    controlBar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <span class="arena-badge" id="pairs-matched-badge" style="background: rgba(16, 185, 129, 0.25); border-color: #10b981; color: #6ee7b7;">
          ✅ ផ្គូផ្គងរួច: ${this.matchedPairsSet.size} / ${this.totalPairs} គូ
        </span>
        <span class="arena-badge" id="pairs-remaining-badge" style="background: rgba(245, 158, 11, 0.2); border-color: #f59e0b; color: #fef08a;">
          🎴 នៅសល់: ${remainingPairs} គូ
        </span>
      </div>

      <div style="display: flex; gap: 0.5rem;">
        <button class="nav-btn btn-ai" id="btn-toggle-preview-all" style="padding: 0.4rem 0.95rem; font-size: 0.84rem;">
          👁️ បង្ហាញបណ្ណទាំងអស់ (Preview All)
        </button>
        <button class="nav-btn" id="btn-pairs-reshuffle" style="padding: 0.4rem 0.95rem; font-size: 0.84rem;">
          🔀 ច្របល់បណ្ណឡើងវិញ
        </button>
      </div>
    `;

    wrap.appendChild(controlBar);

    // 2. Cards Grid Container
    const grid = document.createElement('div');
    grid.className = 'pairs-grid-container';
    grid.id = 'pairs-cards-grid';

    this.cards.forEach((card, index) => {
      const cardEl = document.createElement('div');
      cardEl.className = 'pair-card';
      cardEl.dataset.index = index;
      cardEl.dataset.pairId = card.pairId;
      cardEl.dataset.id = card.id;

      let frontContentHtml = '';
      if (card.image) {
        frontContentHtml += `
          <div class="pair-card-img-wrap">
            <img class="pair-card-img" src="${card.image}" alt="" loading="lazy" onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';" />
            <div class="pair-card-emoji" style="display:none;">${card.emoji || '🐾'}</div>
          </div>
        `;
      }
      if (card.emoji && !card.image) {
        frontContentHtml += `<div class="pair-card-emoji">${card.emoji}</div>`;
      }
      if (card.text && card.text.trim()) {
        const isLarge = !card.image;
        frontContentHtml += `<div class="pair-card-text ${isLarge ? 'large' : ''}">${card.text}</div>`;
      }

      cardEl.innerHTML = `
        <div class="pair-card-face pair-card-back">
          <div class="pair-card-back-pattern">🎴</div>
          <div class="pair-card-back-label">${i18n.t('tmplPairs')}</div>
        </div>
        <div class="pair-card-face pair-card-front">
          ${frontContentHtml}
        </div>
      `;

      cardEl.addEventListener('click', () => this.handleCardClick(cardEl, card));
      grid.appendChild(cardEl);
    });

    wrap.appendChild(grid);
    this.container.appendChild(wrap);

    // Bind Top Action Bar Events
    controlBar.querySelector('#btn-toggle-preview-all')?.addEventListener('click', () => this.togglePreviewMode());
    controlBar.querySelector('#btn-pairs-reshuffle')?.addEventListener('click', () => {
      sound.playPop();
      this.initGame();
    });
  }

  handleCardClick(cardEl, card) {
    if (this.isLocked) return;

    // If card is already matched, keep it permanently open (do not toggle)
    if (cardEl.classList.contains('matched')) return;

    // 1. If user clicks the SAME currently opened card ➔ Close it (Toggle off)
    if (cardEl.classList.contains('flipped')) {
      // Find and remove from flippedCards array
      const indexInFlipped = this.flippedCards.findIndex(item => item.el === cardEl);
      if (indexInFlipped !== -1) {
        sound.playFlip();
        cardEl.classList.remove('flipped');
        this.flippedCards.splice(indexInFlipped, 1);
        return;
      }
    }

    // 2. Open the clicked card (Flip it)
    sound.playFlip();
    cardEl.classList.add('flipped');
    this.flippedCards.push({ el: cardEl, data: card });

    // 3. When 2 cards are flipped open
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.updateHUD();
      this.checkMatch();
    }
  }

  checkMatch() {
    this.isLocked = true;
    const [card1, card2] = this.flippedCards;

    // Both cards must belong to the same pair index and be opposing types (prompt ↔ target)
    const isPairMatch = (card1.data.pairId === card2.data.pairId) && (card1.data.id !== card2.data.id);

    if (isPairMatch) {
      // ✅ SUCCESS MATCH: Keep both cards PERMANENTLY OPEN
      setTimeout(() => {
        sound.playMatch();
        particles.fireConfetti();

        card1.el.classList.add('matched');
        card2.el.classList.add('matched');

        // Ensure both stay flipped open
        card1.el.classList.add('flipped');
        card2.el.classList.add('flipped');

        this.matchedPairsSet.add(card1.data.pairId);
        this.score += 150;
        this.flippedCards = [];
        this.isLocked = false;
        this.updateStatusBadges();
        this.updateHUD();

        // Check if all pairs are solved
        if (this.matchedPairsSet.size === this.totalPairs) {
          this.handleGameComplete();
        }
      }, 350);
    } else {
      // ❌ NOT A MATCH: Give brief time to see, then flip both closed
      setTimeout(() => {
        sound.playWrong();
        card1.el.classList.remove('flipped');
        card2.el.classList.remove('flipped');
        this.flippedCards = [];
        this.isLocked = false;
      }, 950);
    }
  }

  togglePreviewMode() {
    this.isPreviewMode = !this.isPreviewMode;
    sound.playPop();

    const btn = this.container.querySelector('#btn-toggle-preview-all');
    const allCards = this.container.querySelectorAll('.pair-card');

    if (this.isPreviewMode) {
      if (btn) btn.innerHTML = '🙈 លាក់បណ្ណដើម្បីលេង (Hide & Start Game)';
      allCards.forEach(c => c.classList.add('flipped'));
      this.isLocked = true; // Lock memory matching while previewing
    } else {
      if (btn) btn.innerHTML = '👁️ បង្ហាញបណ្ណទាំងអស់ (Preview All)';
      allCards.forEach(c => {
        // Keep matched cards open, hide unmatched cards
        if (!c.classList.contains('matched')) {
          c.classList.remove('flipped');
        }
      });
      this.flippedCards = [];
      this.isLocked = false;
    }
  }

  updateStatusBadges() {
    const matchedBadge = this.container.querySelector('#pairs-matched-badge');
    const remainingBadge = this.container.querySelector('#pairs-remaining-badge');
    const remainingPairs = this.totalPairs - this.matchedPairsSet.size;

    if (matchedBadge) matchedBadge.textContent = `✅ ផ្គូផ្គងរួច: ${this.matchedPairsSet.size} / ${this.totalPairs} គូ`;
    if (remainingBadge) remainingBadge.textContent = `🎴 នៅសល់: ${remainingPairs} គូ`;
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
      matchedEl.textContent = `${this.matchedPairsSet.size} / ${this.totalPairs}`;
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
