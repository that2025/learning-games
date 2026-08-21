/* ==========================================================================
   🔠 Word Search Engine (Khmer Syllable & Grapheme Segmentation Grid)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Intelligent Syllable Segmentation (e.g. សាលារៀន ➔ សា | លា | រៀន)
   - Inline Word List Editing (✏️ កែប្រែ, 🗑️ លុប, ➕ បន្ថែមពាក្យ)
   - Comma-separated Quick Editor Bar
   - Drag & Click ribbon selection with audio & victory confetti
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { i18n } from '../i18n.js';
import { dataManager } from '../data.js';

// --- Dedicated Khmer Syllable Segmenter ---
export function segmentKhmerWord(text) {
  if (!text) return [];
  // Clean punctuation and English inside brackets (e.g. "ខ្លាធំ (Tiger)" ➔ "ខ្លាធំ")
  const clean = text.replace(/\(.*?\)/g, '').replace(/\[.*?\]/g, '').trim();
  if (!clean) return [];

  // 1. Precise dictionary for common educational words
  const dict = {
    'សាលារៀន': ['សា', 'លា', 'រៀន'],
    'កម្ពុជា': ['កម្ពុ', 'ជា'],
    'ព្រះរាជាណាចក្រកម្ពុជា': ['ព្រះ', 'រា', 'ជា', 'ណា', 'ចក្រ', 'កម្ពុ', 'ជា'],
    'សួស្តី': ['សួ', 'ស្តី'],
    'ខ្លាធំ': ['ខ្លា', 'ធំ'],
    'ខ្លា': ['ខ្លា'],
    'ដំរី': ['ដំ', 'រី'],
    'សត្វកវែង': ['សត្វ', 'ក', 'វែង'],
    'សត្វ': ['សត្វ'],
    'ស្វា': ['ស្វា'],
    'សៀវភៅ': ['សៀវ', 'ភៅ'],
    'ផ្ទះខ្មែរ': ['ផ្ទះ', 'ខ្មែរ'],
    'ផ្ទះ': ['ផ្ទះ'],
    'ឡាន': ['ឡាន'],
    'ផ្កាឈូក': ['ផ្កា', 'ឈូក'],
    'ផ្កា': ['ផ្កា'],
    'ដើមឈើ': ['ដើម', 'ឈើ'],
    'ទង់ជាតិ': ['ទង់', 'ជាតិ'],
    'គ្រូបង្រៀន': ['គ្រូ', 'បង្រៀន'],
    'មិត្តភក្តិ': ['មិត្ត', 'ភក្តិ'],
    'ផ្លែប៉ោម': ['ផ្លែ', 'ប៉ោម'],
    'ផ្លែចេក': ['ផ្លែ', 'ចេក'],
    'ផ្លែស្វាយ': ['ផ្លែ', 'ស្វាយ'],
    'ព្រះអាទិត្យ': ['ព្រះ', 'អា', 'ទិត្យ'],
    'ព្រះចន្ទ': ['ព្រះ', 'ចន្ទ'],
    'ទន្សាយ': ['ទន្សាយ'],
    'មាន់': ['មាន់'],
    'តោ': ['តោ'],
    'សេះ': ['សេះ']
  };

  if (dict[clean]) return dict[clean];

  // 2. Intelligent Regex for Khmer Syllable & Cluster splitting
  const khmerSyllablePattern = /(?:[\u1780-\u17B3](?:\u17D2[\u1780-\u17B3])*(?:[\u17B4-\u17D3])*(?:[\u1780-\u17B3](?:\u17D2[\u1780-\u17B3])*(?:[\u17C6-\u17D3]))?)/gu;

  // Try Intl.Segmenter with word granularity
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segWord = new Intl.Segmenter('km', { granularity: 'word' });
      const words = Array.from(segWord.segment(clean), s => s.segment).filter(s => s.trim().length > 0);
      
      const syllables = [];
      for (const w of words) {
        if (dict[w]) {
          syllables.push(...dict[w]);
          continue;
        }
        const matches = w.match(khmerSyllablePattern);
        if (matches && matches.length > 0) {
          syllables.push(...matches);
        } else {
          // Fallback to grapheme cluster
          const segGrapheme = new Intl.Segmenter('km', { granularity: 'grapheme' });
          syllables.push(...Array.from(segGrapheme.segment(w), s => s.segment));
        }
      }
      if (syllables.length > 0) return syllables;
    } catch (e) {
      console.warn("Intl segmentation fallback:", e);
    }
  }

  const matches = clean.match(khmerSyllablePattern);
  if (matches && matches.length > 0) return matches;

  return Array.from(clean);
}

export class WordSearchGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.gridSize = 8;
    this.grid = [];
    this.wordsToFind = [];
    this.foundWords = new Set();
    this.selectedCells = [];
    this.isDragging = false;
    this.dragStartCell = null;
    this.score = 0;
    this.timer = 0;
    this.timerInterval = null;

    this.khmerFillers = [
      'សា', 'លា', 'រៀន', 'កា', 'ដា', 'មា', 'ពា', 'ណា', 'តា',
      'ក', 'ខ', 'គ', 'ង', 'ច', 'ឆ', 'ជ', 'ញ', 'ដ', 'ត', 'ថ', 'ទ', 'ធ', 'ន',
      'ប', 'ផ', 'ព', 'ភ', 'ម', 'យ', 'រ', 'ល', 'វ', 'ស', 'ហ', 'អ'
    ];
    this.customWordsList = false;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.customWordsList = false;
    this.initGame();
  }

  initGame() {
    this.container.innerHTML = '';
    this.foundWords.clear();
    this.selectedCells = [];
    this.isDragging = false;
    this.score = 0;

    const rawItems = this.activity?.items || [];
    
    // Smart word extraction: NEVER take long question sentences
    let wordList = [];

    for (let idx = 0; idx < rawItems.length; idx++) {
      const item = rawItems[idx];
      let candidate = '';

      // Prefer target (answer word) if prompt is a question sentence
      const isPromptQuestion = item.prompt && (item.prompt.includes('?') || item.prompt.includes('តើ') || item.prompt.length > 15);
      
      if (item.target && item.target.trim().length > 0 && item.target.trim().length <= 20) {
        candidate = item.target.trim();
      } else if (item.prompt && !isPromptQuestion && item.prompt.trim().length <= 20) {
        candidate = item.prompt.trim();
      } else if (item.word && item.word.trim().length <= 20) {
        candidate = item.word.trim();
      }

      if (candidate) {
        const clean = candidate.replace(/\(.*?\)/g, '').replace(/[^\p{L}\p{N}\s]/gu, '').trim();
        if (clean.length > 0) {
          const parts = segmentKhmerWord(clean);
          if (parts.length > 0 && parts.length <= 8) {
            wordList.push({
              id: `word-${idx}`,
              fullText: clean,
              parts: parts,
              emoji: item.emoji || '📝',
              found: false
            });
          }
        }
      }
    }

    // Start with only 1 sample word by default unless user customized it
    if (this.customWordsList) {
      this.wordsToFind = wordList.slice(0, 6);
    } else {
      this.wordsToFind = wordList.slice(0, 1);
    }

    if (this.wordsToFind.length === 0) {
      this.renderEmptyState();
      return;
    }

    this.buildGrid();
    this.render();
    this.updateHUD();
    this.startTimer();
  }

  renderEmptyState() {
    this.stopTimer();
    const emptyCard = document.createElement('div');
    emptyCard.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.25rem;
      max-width: 680px;
      margin: 1.5rem auto;
      padding: 2.25rem 2rem;
      background: rgba(0,0,0,0.35);
      border: 2px dashed var(--panel-border);
      border-radius: 20px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    emptyCard.innerHTML = `
      <div style="font-size: 3.5rem; line-height: 1;">🔠</div>
      <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-main);">
        បង្កើតតារាងស្វែងរកពាក្យ (Word Search Creator)
      </div>
      <div style="font-size: 0.92rem; color: var(--text-muted); max-width: 520px; line-height: 1.5;">
        សូមបញ្ចូលពាក្យ ឬឃ្លាដែលអ្នកចង់ស្វែងរកក្នុងតារាង ដោយប្រើសញ្ញាក្បៀស (,) ញែកពាក្យនីមួយៗ ឬចុចលើប្រធានបទគំរូខាងក្រោម៖
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: 0.65rem;">
        <input type="text" id="ws-empty-input" class="form-input" placeholder="វាយពាក្យដោយក្បៀស (,) ឧ. សាលារៀន, ផ្ទះខ្មែរ, ដំរី, ខ្លា, ឆ្មា, គោ" style="font-size: 1rem; padding: 0.75rem 1rem; text-align: center;" />
        
        <!-- Preset Chips -->
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.4rem; margin-top: 0.25rem;">
          <button class="nav-btn ws-preset-btn" data-words="ខ្លា, ដំរី, ស្វា, តោ, សេះ, ឆ្មា" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">🐯 សត្វព្រៃ</button>
          <button class="nav-btn ws-preset-btn" data-words="សាលារៀន, សៀវភៅ, ប៊ិច, តុ, កៅអី, គ្រូបង្រៀន" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">🏫 សាលារៀន</button>
          <button class="nav-btn ws-preset-btn" data-words="ផ្លែប៉ោម, ផ្លែចេក, ផ្លែស្វាយ, ផ្លែក្រូច, ផ្លែដូង" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">🍎 ផ្លែឈើ</button>
          <button class="nav-btn ws-preset-btn" data-words="ដើមឈើ, ផ្កាឈូក, ព្រះអាទិត្យ, ពពក, ភ្នំ, ទន្លេ" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">🌿 ធម្មជាតិ</button>
        </div>
      </div>

      <button class="nav-btn btn-create" id="btn-ws-submit-empty" style="font-size: 1.05rem; padding: 0.65rem 2.25rem; font-weight: 800; border-radius: 12px; margin-top: 0.5rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35);">
        <span>🚀</span> បង្កើតតារាងលេងភ្លាមៗ
      </button>
    `;

    this.container.appendChild(emptyCard);

    // Bind Preset Buttons
    emptyCard.querySelectorAll('.ws-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        const input = emptyCard.querySelector('#ws-empty-input');
        if (input) {
          input.value = btn.dataset.words;
          input.focus();
        }
      });
    });

    // Bind Submit Button
    const submitBtn = emptyCard.querySelector('#btn-ws-submit-empty');
    const inputEl = emptyCard.querySelector('#ws-empty-input');

    const handleCreate = () => {
      const val = inputEl.value.trim();
      if (!val) {
        alert("សូមបញ្ចូលពាក្យយ៉ាងហោចណាស់ ២ ពាក្យ!");
        inputEl.focus();
        return;
      }
      this.updateWordsFromCommaList(val);
    };

    submitBtn?.addEventListener('click', handleCreate);
    inputEl?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleCreate();
    });
  }

  buildGrid() {
    const size = this.gridSize;
    this.grid = Array.from({ length: size }, () => Array(size).fill(''));

    // Placement directions: Horizontal (0,1), Vertical (1,0)
    const directions = [
      { r: 0, c: 1 },
      { r: 1, c: 0 }
    ];

    this.wordsToFind.forEach(w => {
      const parts = w.parts;
      const len = parts.length;
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 150) {
        attempts++;
        const dir = directions[Math.floor(Math.random() * directions.length)];
        const maxR = size - (dir.r * (len - 1));
        const maxC = size - (dir.c * (len - 1));

        if (maxR <= 0 || maxC <= 0) continue;

        const startR = Math.floor(Math.random() * maxR);
        const startC = Math.floor(Math.random() * maxC);

        // Check if all cells are available or matching
        let canPlace = true;
        for (let i = 0; i < len; i++) {
          const r = startR + dir.r * i;
          const c = startC + dir.c * i;
          if (this.grid[r][c] !== '' && this.grid[r][c] !== parts[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          w.positions = [];
          for (let i = 0; i < len; i++) {
            const r = startR + dir.r * i;
            const c = startC + dir.c * i;
            this.grid[r][c] = parts[i];
            w.positions.push({ r, c });
          }
          placed = true;
        }
      }
    });

    // Fill empty cells with Khmer syllables/consonants
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (this.grid[r][c] === '') {
          this.grid[r][c] = this.khmerFillers[Math.floor(Math.random() * this.khmerFillers.length)];
        }
      }
    }
  }

  render() {
    const arena = document.createElement('div');
    arena.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
    `;

    // 1. Pre-filled Quick Edit Input Bar
    const currentWordsText = this.wordsToFind.map(w => w.fullText).join(', ');

    const inputBar = document.createElement('div');
    inputBar.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      border-radius: 14px;
      padding: 0.75rem 1.25rem;
      flex-wrap: wrap;
    `;

    inputBar.innerHTML = `
      <div style="font-size: 0.92rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
        <span>✏️</span>
        <span>ពាក្យ/ឃ្លា៖</span>
      </div>
      <input type="text" id="ws-custom-word-input" class="form-input" value="${currentWordsText}" style="flex: 1; min-width: 260px; padding: 0.45rem 0.85rem;" placeholder="វាយពាក្យដែលត្រូវស្វែងរក ដោយក្បៀស (,) ឧទាហរណ៍៖ សាលារៀន, ផ្ទះខ្មែរ, ដំរី, ខ្លាធំ" />
      <button class="nav-btn btn-create" id="btn-ws-generate-custom" style="padding: 0.45rem 1.1rem; font-size: 0.88rem;">
        <span>💾</span> អាប់ដេតតារាង
      </button>
      <button class="nav-btn btn-danger" id="btn-ws-clear-all" style="padding: 0.45rem 0.85rem; font-size: 0.88rem;" title="សម្អាតពាក្យ">
        <span>🗑️</span> សម្អាត
      </button>
    `;

    arena.appendChild(inputBar);

    // 2. Main Game Grid + Sidebar Container
    const mainWrap = document.createElement('div');
    mainWrap.className = 'wordsearch-container';
    mainWrap.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 1.5rem;
      align-items: start;
    `;

    // Left: Grid Viewport
    const gridWrap = document.createElement('div');
    gridWrap.className = 'wordsearch-grid-wrap';
    gridWrap.style.cssText = `
      display: flex;
      justify-content: center;
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 1.5rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;

    const gridEl = document.createElement('div');
    gridEl.id = 'wordsearch-grid-board';
    gridEl.style.cssText = `
      display: grid;
      grid-template-columns: repeat(${this.gridSize}, 1fr);
      gap: 8px;
      user-select: none;
      touch-action: none;
    `;

    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const cell = document.createElement('div');
        cell.className = 'wordsearch-cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.textContent = this.grid[r][c];

        cell.style.cssText = `
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--card-bg);
          border: 2px solid var(--panel-border);
          border-radius: 12px;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        `;

        cell.addEventListener('mousedown', () => this.handleCellStart(r, c));
        cell.addEventListener('mouseenter', () => this.handleCellMove(r, c));
        cell.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.handleCellStart(r, c);
        });

        gridEl.appendChild(cell);
      }
    }

    gridWrap.appendChild(gridEl);
    mainWrap.appendChild(gridWrap);

    // Right: Words List Sidebar with Inline Edit/Delete Buttons
    const sidebar = document.createElement('div');
    sidebar.className = 'wordsearch-sidebar';
    sidebar.style.cssText = `
      background: rgba(0,0,0,0.25);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    `;

    sidebar.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem;">
        <div style="font-size: 1rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
          <span>📋</span>
          <span>ពាក្យដែលត្រូវស្វែងរក (${this.wordsToFind.length})</span>
        </div>
        <span id="ws-found-badge" class="arena-badge">0 / ${this.wordsToFind.length}</span>
      </div>

      <div id="wordsearch-target-list" style="display: flex; flex-direction: column; gap: 0.65rem;">
        <!-- Rendered target items with inline edit controls -->
      </div>

      <!-- Add New Word Row -->
      <div style="display: flex; gap: 0.4rem; margin-top: 0.35rem;">
        <input type="text" id="ws-new-single-word-input" class="form-input" style="flex: 1; padding: 0.35rem 0.65rem; font-size: 0.85rem;" placeholder="➕ បន្ថែមពាក្យថ្មី..." />
        <button class="nav-btn btn-create" id="btn-ws-add-single-word" style="padding: 0.35rem 0.75rem; font-size: 0.82rem;">
          ➕ បន្ថែម
        </button>
      </div>

      <!-- Hint Button -->
      <button class="nav-btn btn-ai" id="btn-ws-hint" style="width: 100%; justify-content: center; margin-top: 0.35rem;">
        💡 ជំនួយរកពាក្យ (Show Hint)
      </button>
    `;

    mainWrap.appendChild(sidebar);
    arena.appendChild(mainWrap);
    this.container.appendChild(arena);

    this.renderSidebarWordList();

    // Global mouseup to finish drag
    window.addEventListener('mouseup', () => this.handleDragEnd());
    window.addEventListener('touchend', () => this.handleDragEnd());

    // Bind Top Comma-separated Input Button
    arena.querySelector('#btn-ws-generate-custom')?.addEventListener('click', () => {
      const val = arena.querySelector('#ws-custom-word-input').value.trim();
      if (val) {
        this.updateWordsFromCommaList(val);
      }
    });

    arena.querySelector('#ws-custom-word-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = e.target.value.trim();
        if (val) {
          this.updateWordsFromCommaList(val);
        }
      }
    });

    // Bind Clear All Button
    arena.querySelector('#btn-ws-clear-all')?.addEventListener('click', () => {
      sound.playPop();
      this.wordsToFind = [];
      if (this.activity) this.activity.items = [];
      this.renderEmptyState();
    });

    // Bind Add Single Word Button
    arena.querySelector('#btn-ws-add-single-word')?.addEventListener('click', () => {
      const input = arena.querySelector('#ws-new-single-word-input');
      const newWord = input?.value.trim();
      if (newWord) {
        this.addSingleWord(newWord);
        if (input) input.value = '';
      }
    });

    arena.querySelector('#ws-new-single-word-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const newWord = e.target.value.trim();
        if (newWord) {
          this.addSingleWord(newWord);
          e.target.value = '';
        }
      }
    });

    // Hint Button
    arena.querySelector('#btn-ws-hint')?.addEventListener('click', () => this.giveHint());
  }

  renderSidebarWordList() {
    const listEl = this.container.querySelector('#wordsearch-target-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.wordsToFind.forEach((w, idx) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'wordsearch-target-item';
      itemEl.id = `ws-item-${w.id}`;
      itemEl.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--panel-border);
        border-radius: 10px;
        padding: 0.5rem 0.75rem;
        transition: all 0.2s ease;
      `;

      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
          <span style="font-size: 1.15rem;">${w.emoji}</span>
          <div style="flex: 1; min-width: 0;">
            <div class="ws-word-label" style="font-weight: 700; font-size: 0.98rem; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${w.fullText}
            </div>
            <div style="font-size: 0.74rem; color: var(--accent-secondary);">
              [ ${w.parts.join(' - ')} ]
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <button class="nav-btn btn-edit-single-ws" style="padding: 0.2rem 0.45rem; font-size: 0.75rem;" title="កែប្រែពាក្យនេះ">✏️</button>
          <button class="nav-btn btn-danger btn-delete-single-ws" style="padding: 0.2rem 0.45rem; font-size: 0.75rem;" title="លុបពាក្យនេះ">&times;</button>
          <span class="ws-check-icon" style="font-size: 1.1rem; color: var(--text-muted); opacity: 0.4; margin-left: 0.2rem;">⚪</span>
        </div>
      `;

      // Inline Edit Click
      itemEl.querySelector('.btn-edit-single-ws')?.addEventListener('click', () => {
        const newText = prompt("កែសម្រួលពាក្យ (Edit Word):", w.fullText);
        if (newText && newText.trim().length > 0 && newText.trim() !== w.fullText) {
          this.editSingleWord(idx, newText.trim());
        }
      });

      // Delete Single Word Click
      itemEl.querySelector('.btn-delete-single-ws')?.addEventListener('click', () => {
        this.deleteSingleWord(idx);
      });

      listEl.appendChild(itemEl);
    });

    this.updateFoundBadge();
  }

  updateWordsFromCommaList(commaText) {
    this.customWordsList = true;
    const list = commaText.split(',').map(s => s.trim()).filter(Boolean);
    if (list.length === 0) {
      this.wordsToFind = [];
      this.renderEmptyState();
      return;
    }

    this.activity = {
      ...this.activity,
      items: list.map(text => ({
        prompt: text,
        target: text,
        emoji: '📝'
      }))
    };

    sound.playMatch();
    this.initGame();
  }

  addSingleWord(newWordText) {
    const clean = newWordText.trim();
    if (!clean) return;

    const currentList = this.wordsToFind.map(w => w.fullText);
    currentList.push(clean);

    this.updateWordsFromCommaList(currentList.join(', '));
  }

  editSingleWord(index, updatedText) {
    const currentList = this.wordsToFind.map(w => w.fullText);
    currentList[index] = updatedText;
    this.updateWordsFromCommaList(currentList.join(', '));
  }

  deleteSingleWord(index) {
    const currentList = this.wordsToFind.map(w => w.fullText);
    currentList.splice(index, 1);
    this.updateWordsFromCommaList(currentList.join(', '));
  }

  handleCellStart(r, c) {
    this.isDragging = true;
    this.dragStartCell = { r, c };
    this.selectedCells = [{ r, c }];
    sound.playPop();
    this.updateCellHighlights();
  }

  handleCellMove(r, c) {
    if (!this.isDragging || !this.dragStartCell) return;

    const startR = this.dragStartCell.r;
    const startC = this.dragStartCell.c;

    const dR = r - startR;
    const dC = c - startC;

    // Check if movement is straight horizontal or vertical
    const isHorizontal = dR === 0;
    const isVertical = dC === 0;

    if (!isHorizontal && !isVertical) return;

    const stepR = dR === 0 ? 0 : (dR > 0 ? 1 : -1);
    const stepC = dC === 0 ? 0 : (dC > 0 ? 1 : -1);
    const steps = Math.max(Math.abs(dR), Math.abs(dC));

    this.selectedCells = [];
    for (let i = 0; i <= steps; i++) {
      this.selectedCells.push({
        r: startR + stepR * i,
        c: startC + stepC * i
      });
    }

    this.updateCellHighlights();
  }

  handleDragEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.checkSelectedWord();
  }

  updateCellHighlights() {
    const cells = this.container.querySelectorAll('.wordsearch-cell');
    cells.forEach(cell => {
      const r = parseInt(cell.dataset.r, 10);
      const c = parseInt(cell.dataset.c, 10);

      const isFound = this.isCellInFoundWords(r, c);
      const isSelected = this.selectedCells.some(sc => sc.r === r && sc.c === c);

      if (isFound) {
        cell.style.background = 'rgba(16, 185, 129, 0.35)';
        cell.style.borderColor = '#10b981';
        cell.style.color = '#6ee7b7';
      } else if (isSelected) {
        cell.style.background = 'rgba(245, 158, 11, 0.4)';
        cell.style.borderColor = '#f59e0b';
        cell.style.color = '#fef08a';
      } else {
        cell.style.background = 'var(--card-bg)';
        cell.style.borderColor = 'var(--panel-border)';
        cell.style.color = 'var(--text-main)';
      }
    });
  }

  isCellInFoundWords(r, c) {
    for (const w of this.wordsToFind) {
      if (w.found && w.positions) {
        if (w.positions.some(p => p.r === r && p.c === c)) return true;
      }
    }
    return false;
  }

  checkSelectedWord() {
    if (this.selectedCells.length === 0) return;

    // Construct the selected syllables string
    const selectedSyllables = this.selectedCells.map(sc => this.grid[sc.r][sc.c]);
    const selectedJoined = selectedSyllables.join('');

    let matched = false;

    this.wordsToFind.forEach(w => {
      if (w.found) return;

      const targetJoined = w.parts.join('');
      const targetJoinedRev = [...w.parts].reverse().join('');

      if (selectedJoined === targetJoined || selectedJoined === targetJoinedRev) {
        w.found = true;
        this.foundWords.add(w.id);
        matched = true;

        sound.playMatch();
        particles.fireConfetti();

        // Update target sidebar item
        const itemEl = this.container.querySelector(`#ws-item-${w.id}`);
        if (itemEl) {
          itemEl.style.background = 'rgba(16, 185, 129, 0.25)';
          itemEl.style.borderColor = '#10b981';
          const icon = itemEl.querySelector('.ws-check-icon');
          if (icon) {
            icon.textContent = '✅';
            icon.style.opacity = '1';
          }
        }

        this.updateFoundBadge();
      }
    });

    if (!matched && this.selectedCells.length > 1) {
      sound.playWrong();
    }

    this.selectedCells = [];
    this.updateCellHighlights();

    // Check Victory
    if (this.foundWords.size === this.wordsToFind.length) {
      this.handleVictory();
    }
  }

  updateFoundBadge() {
    const badge = this.container.querySelector('#ws-found-badge');
    if (badge) {
      badge.textContent = `${this.foundWords.size} / ${this.wordsToFind.length}`;
    }
  }

  giveHint() {
    const unfound = this.wordsToFind.filter(w => !w.found);
    if (unfound.length === 0) return;

    const word = unfound[0];
    if (word.positions && word.positions.length > 0) {
      const firstPos = word.positions[0];
      const cell = this.container.querySelector(`.wordsearch-cell[data-r="${firstPos.r}"][data-c="${firstPos.c}"]`);
      if (cell) {
        sound.playPop();
        cell.style.animation = 'pulse 1s infinite alternate';
        cell.style.borderColor = '#38bdf8';
        cell.style.background = 'rgba(56, 189, 248, 0.4)';
        setTimeout(() => {
          cell.style.animation = '';
          this.updateCellHighlights();
        }, 2000);
      }
    }
  }

  handleVictory() {
    this.stopTimer();
    sound.playVictory();
    particles.fireCelebration();

    if (this.onComplete) {
      this.onComplete({
        score: this.wordsToFind.length * 100,
        moves: this.wordsToFind.length,
        timeSpent: this.timer
      });
    }
  }

  startTimer() {
    this.stopTimer();
    this.timer = 0;
    this.timerInterval = setInterval(() => {
      this.timer++;
      this.updateHUD();
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateHUD() {
    const timerEl = document.getElementById('hud-timer-val');
    const scoreEl = document.getElementById('hud-score-val');
    const movesEl = document.getElementById('hud-moves-val');

    if (timerEl) timerEl.textContent = `${this.timer}s`;
    if (scoreEl) scoreEl.textContent = `${this.foundWords.size * 100}`;
    if (movesEl) movesEl.textContent = `${this.foundWords.size} / ${this.wordsToFind.length}`;
  }

  destroy() {
    this.stopTimer();
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
