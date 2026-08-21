/* ==========================================================================
   Creator Studio & Dual-Card Activity Editor
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated Pair Builder (Card A ↔ Card B), Intelligent Multi-Option AI Image Search, JSON import/export
   ========================================================================== */

import { dataManager } from '../data.js';
import { sound } from '../audio.js';
import { i18n } from '../i18n.js';

export class CreatorStudioModal {
  constructor(onSaveCallback) {
    this.modalEl = null;
    this.imgGenModalEl = null;
    this.currentActivity = null;
    this.onSaveCallback = onSaveCallback;
    this.selectedGeneratedImg = null;
    this.initDOM();
    this.initImageGeneratorModal();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-creator-studio';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 980px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>✏️</span>
            <span class="modal-title" data-i18n="creatorTitle">${i18n.t('creatorTitle')}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-creator">&times;</button>
        </div>

        <div class="modal-body" style="gap: 1.5rem;">
          <!-- Section 1: Metadata Settings -->
          <div style="background: rgba(0,0,0,0.2); border: 1px solid var(--panel-border); border-radius: 14px; padding: 1.25rem;">
            <div style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.85rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>⚙️</span>
              <span data-i18n="metaSettings">${i18n.t('metaSettings')}</span>
            </div>

            <div class="form-row-2" style="margin-bottom: 0.85rem;">
              <div class="form-group">
                <label class="form-label" data-i18n="actTitleInput">${i18n.t('actTitleInput')}</label>
                <input type="text" class="form-input" id="creator-title" placeholder="e.g. ផ្គូផ្គងរូបភាព និងពាក្យ" />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="actCategory">${i18n.t('actCategory')}</label>
                <input type="text" class="form-input" id="creator-category" placeholder="e.g. វិទ្យាសាស្ត្រ និងធម្មជាតិ" />
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 0.85rem;">
              <label class="form-label" data-i18n="actDescInput">${i18n.t('actDescInput')}</label>
              <textarea class="form-textarea" id="creator-desc" placeholder="ការពិពណ៌នាសង្ខេបអំពីមេរៀន..."></textarea>
            </div>

            <div class="form-row-3">
              <div class="form-group">
                <label class="form-label" data-i18n="actDefaultTmpl">${i18n.t('actDefaultTmpl')}</label>
                <select class="form-select" id="creator-tmpl">
                  <option value="pairs">🎴 Matching Pairs (បណ្ណផ្គូផ្គង)</option>
                  <option value="match">🧩 Match Up (ផ្គូផ្គង)</option>
                  <option value="quiz">🎯 Quiz Gameshow (សំណួរចម្លើយ)</option>
                  <option value="box">📦 Open The Box (បើកប្រអប់)</option>
                  <option value="wheel">🎡 Random Wheel (កង់វិលចាប់ឈ្មោះ)</option>
                  <option value="wordsearch">🔠 Word Search (ស្វែងរកពាក្យ)</option>
                  <option value="whack">🐹 Whack-a-Mole (វាយសត្វកណ្តុរ)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="actTimerSec">${i18n.t('actTimerSec')}</label>
                <input type="number" class="form-input" id="creator-timer" value="60" min="10" max="300" />
              </div>
              <div class="form-group">
                <label class="form-label" data-i18n="actLivesCount">${i18n.t('actLivesCount')}</label>
                <input type="number" class="form-input" id="creator-lives" value="3" min="1" max="10" />
              </div>
            </div>
          </div>

          <!-- Section 2: Dedicated Dual-Card Pair Builder -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
                  <span>🎴</span>
                  <span data-i18n="creatorPairsTitle">${i18n.t('creatorPairsTitle')}</span>
                  <span id="creator-items-count-badge" class="arena-badge">0 items</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;" data-i18n="creatorPairsDesc">
                  ${i18n.t('creatorPairsDesc')}
                </div>
              </div>
              <button class="nav-btn btn-create" id="btn-add-item-row" style="font-size: 0.84rem; padding: 0.45rem 1rem;">
                ${i18n.t('addItemBtn')}
              </button>
            </div>

            <div id="creator-items-rows-container" style="display: flex; flex-direction: column; gap: 1.15rem; margin-top: 0.85rem;">
              <!-- Dynamic Dual-Card Rows inserted here -->
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="file" id="creator-file-import" accept=".json" style="display: none;" />
            <button class="nav-btn" id="btn-import-json-act">📥 ${i18n.t('btnImportJson') || 'នាំចូលពីកុំព្យូទ័រ'}</button>
            <button class="nav-btn" id="btn-export-json-act">📤 ${i18n.t('btnExportJson') || 'ទាញយក JSON'}</button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="nav-btn" id="btn-cancel-creator">${i18n.t('btnCancel')}</button>
            <button class="nav-btn btn-create" id="btn-save-and-download" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              💾 រក្សាទុក & ទាញយក File (PC)
            </button>
            <button class="nav-btn btn-create" id="btn-save-creator">${i18n.t('btnSaveActivity')}</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  initImageGeneratorModal() {
    this.imgGenModalEl = document.createElement('div');
    this.imgGenModalEl.className = 'modal-overlay';
    this.imgGenModalEl.id = 'modal-ai-image-generator';
    this.imgGenModalEl.style.zIndex = '1100';

    this.imgGenModalEl.innerHTML = `
      <div class="modal-window" style="max-width: 680px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>✨</span>
            <span class="modal-title" data-i18n="modalGenImgTitle">${i18n.t('modalGenImgTitle')}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-img-gen">&times;</button>
        </div>
        <div class="modal-body" style="gap: 1rem;">
          <div style="font-size: 0.84rem; color: var(--text-muted);" data-i18n="modalGenImgDesc">
            ${i18n.t('modalGenImgDesc')}
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <input type="text" class="form-input" id="img-gen-keyword" style="flex: 1;" placeholder="${i18n.t('imgKeywordPlaceholder')}" />
            <button class="nav-btn btn-ai" id="btn-do-gen-img">${i18n.t('btnGenerateNow')}</button>
          </div>

          <!-- Quick Suggestion Chips -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            <button class="nav-btn img-preset-chip" data-kw="ផ្ទះ (House)">🏠 ផ្ទះ (House)</button>
            <button class="nav-btn img-preset-chip" data-kw="ផ្ទះខ្មែរ (Khmer House)">🏡 ផ្ទះខ្មែរ (Khmer House)</button>
            <button class="nav-btn img-preset-chip" data-kw="ឡាន (Car)">🚗 ឡាន (Car)</button>
            <button class="nav-btn img-preset-chip" data-kw="ខ្លា (Tiger)">🐯 ខ្លា (Tiger)</button>
            <button class="nav-btn img-preset-chip" data-kw="ដំរី (Elephant)">🐘 ដំរី (Elephant)</button>
            <button class="nav-btn img-preset-chip" data-kw="សាលារៀន (School)">🏫 សាលារៀន</button>
            <button class="nav-btn img-preset-chip" data-kw="សៀវភៅ (Book)">📖 សៀវភៅ</button>
            <button class="nav-btn img-preset-chip" data-kw="ដើមឈើ (Tree)">🌳 ដើមឈើ</button>
            <button class="nav-btn img-preset-chip" data-kw="ផ្កាឈូក (Lotus)">🪷 ផ្កាឈូក</button>
            <button class="nav-btn img-preset-chip" data-kw="អង្គរវត្ត (Angkor Wat)">🏯 អង្គរវត្ត</button>
          </div>

          <!-- Direct URL Paste Input -->
          <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.25); border: 1px dashed var(--panel-border); border-radius: 10px; padding: 0.4rem 0.75rem;">
            <span style="font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">🔗 Direct Link:</span>
            <input type="text" class="form-input" id="img-direct-url-input" style="flex: 1; padding: 0.3rem 0.6rem; font-size: 0.8rem;" placeholder="https://example.com/photo.jpg" />
            <button class="nav-btn" id="btn-use-direct-url" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">ប្រើប្រាស់ Link</button>
          </div>

          <!-- Multi-Image Selection Grid (4 Options) -->
          <div id="img-gen-results-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; margin-top: 0.5rem; min-height: 200px;">
            <!-- Rendered 4 image options -->
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="nav-btn" id="btn-cancel-img-gen">${i18n.t('btnCancel')}</button>
          <button class="nav-btn btn-create" id="btn-select-generated-img" style="display: none;">
            ${i18n.t('btnUseThisImage')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.imgGenModalEl);
    this.bindImgGenEvents();
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-close-creator')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-cancel-creator')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-add-item-row')?.addEventListener('click', () => this.addItemRow());
    this.modalEl.querySelector('#btn-save-creator')?.addEventListener('click', () => this.save(false));
    this.modalEl.querySelector('#btn-save-and-download')?.addEventListener('click', () => this.save(true));

    // Import / Export JSON
    const fileInput = this.modalEl.querySelector('#creator-file-import');
    this.modalEl.querySelector('#btn-import-json-act')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => this.handleImportFile(e));
    this.modalEl.querySelector('#btn-export-json-act')?.addEventListener('click', () => this.handleExportFile());
  }

  bindImgGenEvents() {
    this.imgGenModalEl.querySelector('#btn-close-img-gen')?.addEventListener('click', () => this.closeImgGenModal());
    this.imgGenModalEl.querySelector('#btn-cancel-img-gen')?.addEventListener('click', () => this.closeImgGenModal());

    this.imgGenModalEl.querySelector('#btn-do-gen-img')?.addEventListener('click', () => {
      const kw = this.imgGenModalEl.querySelector('#img-gen-keyword').value.trim();
      if (kw) this.generateImages(kw);
    });

    this.imgGenModalEl.querySelector('#img-gen-keyword')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const kw = e.target.value.trim();
        if (kw) this.generateImages(kw);
      }
    });

    this.imgGenModalEl.querySelectorAll('.img-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const kw = chip.dataset.kw;
        this.imgGenModalEl.querySelector('#img-gen-keyword').value = kw;
        this.generateImages(kw);
      });
    });

    // Use Direct URL
    this.imgGenModalEl.querySelector('#btn-use-direct-url')?.addEventListener('click', () => {
      const url = this.imgGenModalEl.querySelector('#img-direct-url-input').value.trim();
      if (url) {
        sound.playMatch();
        if (this.imgGenCallback) this.imgGenCallback(url);
        this.closeImgGenModal();
      }
    });
  }

  open(activity = null) {
    this.currentActivity = activity;
    this.populateForm(activity);
    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  populateForm(act) {
    const title = act ? (typeof act.title === 'object' ? act.title.km || act.title.en : act.title) : '';
    const desc = act ? (typeof act.description === 'object' ? act.description.km || act.description.en : act.description) : '';
    const cat = act ? (typeof act.category === 'object' ? act.category.km || act.category.en : act.category) : 'រូបភាព និងពាក្យ (Image & Word)';
    const tmpl = act ? act.defaultTemplate || 'pairs' : 'pairs';
    const timer = act ? act.timerSec || 60 : 60;
    const lives = act ? act.lives || 3 : 3;

    this.modalEl.querySelector('#creator-title').value = title;
    this.modalEl.querySelector('#creator-desc').value = desc;
    this.modalEl.querySelector('#creator-category').value = cat;
    this.modalEl.querySelector('#creator-tmpl').value = tmpl;
    this.modalEl.querySelector('#creator-timer').value = timer;
    this.modalEl.querySelector('#creator-lives').value = lives;

    const rowsContainer = this.modalEl.querySelector('#creator-items-rows-container');
    rowsContainer.innerHTML = '';

    const items = act && act.items ? act.items : [
      { emoji: '🏠', prompt: '', imagePrompt: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&auto=format&fit=crop&q=80', target: 'ផ្ទះ (House)', imageTarget: '', hint: '' },
      { emoji: '🐯', prompt: '', imagePrompt: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&auto=format&fit=crop&q=80', target: 'ខ្លាធំ (Tiger)', imageTarget: '', hint: '' },
      { emoji: '🐘', prompt: '', imagePrompt: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop&q=80', target: 'ដំរី (Elephant)', imageTarget: '', hint: '' },
      { emoji: '🚗', prompt: '', imagePrompt: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80', target: 'ឡាន (Car)', imageTarget: '', hint: '' }
    ];

    items.forEach(item => this.addItemRow(item));
    this.updateRowCount();
  }

  addItemRow(itemData = null) {
    const rowsContainer = this.modalEl.querySelector('#creator-items-rows-container');
    const rowEl = document.createElement('div');
    rowEl.className = 'pair-builder-row';

    const emoji = itemData?.emoji || '📝';
    const prompt = itemData?.prompt || '';
    const imagePrompt = itemData?.imagePrompt || itemData?.image || '';
    const target = itemData?.target || '';
    const imageTarget = itemData?.imageTarget || '';
    const hint = itemData?.hint || '';
    const distractors = itemData?.distractors || ['', '', ''];

    rowEl.dataset.imageA = imagePrompt;
    rowEl.dataset.imageB = imageTarget;

    rowEl.innerHTML = `
      <div class="pair-dual-grid">
        <!-- Card 1 (Side A) -->
        <div class="pair-card-box card-side-a">
          <div class="pair-card-box-header">
            <span>🃏 ${i18n.t('cardSideA')}</span>
            <input type="text" class="form-input item-row-emoji" value="${emoji}" style="width: 44px; padding: 0.2rem; text-align: center; font-size: 1.1rem;" title="Emoji" />
          </div>

          <!-- Text Input A -->
          <input type="text" class="form-input item-row-prompt" value="${prompt}" placeholder="${i18n.t('itemPromptLabel')}" />

          <!-- Image Preview Thumbnail A -->
          <div class="pair-img-preview-thumb img-thumb-a" style="${imagePrompt ? '' : 'display: none;'}">
            <img src="${imagePrompt || ''}" alt="Card A Image" />
            <button class="btn-remove-thumb btn-clear-img-a" title="${i18n.t('btnClearImg')}">&times;</button>
          </div>

          <!-- Actions A -->
          <div class="pair-card-actions">
            <input type="file" class="file-upload-a" accept="image/*" style="display: none;" />
            <button class="nav-btn btn-upload-img-a" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
              ${i18n.t('btnUploadImg')}
            </button>
            <button class="nav-btn btn-ai btn-gen-img-a" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
              ${i18n.t('btnAiGenImg')}
            </button>
          </div>
        </div>

        <!-- Connection Link Symbol -->
        <div class="pair-link-symbol">
          ↔️
        </div>

        <!-- Card 2 (Side B) -->
        <div class="pair-card-box card-side-b">
          <div class="pair-card-box-header">
            <span>🃏 ${i18n.t('cardSideB')}</span>
          </div>

          <!-- Text Input B -->
          <input type="text" class="form-input item-row-target" value="${target}" placeholder="${i18n.t('itemTargetLabel')}" />

          <!-- Image Preview Thumbnail B -->
          <div class="pair-img-preview-thumb img-thumb-b" style="${imageTarget ? '' : 'display: none;'}">
            <img src="${imageTarget || ''}" alt="Card B Image" />
            <button class="btn-remove-thumb btn-clear-img-b" title="${i18n.t('btnClearImg')}">&times;</button>
          </div>

          <!-- Actions B -->
          <div class="pair-card-actions">
            <input type="file" class="file-upload-b" accept="image/*" style="display: none;" />
            <button class="nav-btn btn-upload-img-b" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
              ${i18n.t('btnUploadImg')}
            </button>
            <button class="nav-btn btn-ai btn-gen-img-b" style="font-size: 0.75rem; padding: 0.25rem 0.55rem;">
              ${i18n.t('btnAiGenImg')}
            </button>
          </div>
        </div>

        <!-- Delete Pair Row Button -->
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; padding-top: 1.5rem;">
          <button class="btn-delete-row" title="Delete Pair">&times;</button>
        </div>
      </div>

      <!-- Advanced Details: Hint & Distractors -->
      <details style="margin-top: 0.35rem; font-size: 0.8rem; color: var(--text-muted);">
        <summary style="cursor: pointer; user-select: none;">💡 ${i18n.t('itemHintLabel')} & ${i18n.t('itemDistractorsLabel')}</summary>
        <div class="form-row-2" style="margin-top: 0.5rem;">
          <input type="text" class="form-input item-row-hint" value="${hint}" placeholder="💡 ${i18n.t('itemHintLabel')}" />
          <input type="text" class="form-input item-row-distractors" value="${distractors.join(' | ')}" placeholder="ចម្លើយបញ្ឆោត (សម្រាប់ Quiz): ចម្លើយ១ | ចម្លើយ២ | ចម្លើយ៣" />
        </div>
      </details>
    `;

    // Bind Image Uploads & Generators for Card A
    const fileInputA = rowEl.querySelector('.file-upload-a');
    const thumbA = rowEl.querySelector('.img-thumb-a');
    const imgTagA = thumbA.querySelector('img');

    rowEl.querySelector('.btn-upload-img-a')?.addEventListener('click', () => fileInputA?.click());
    fileInputA?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          rowEl.dataset.imageA = evt.target.result;
          imgTagA.src = evt.target.result;
          thumbA.style.display = 'flex';
          sound.playPop();
        };
        reader.readAsDataURL(file);
      }
    });

    rowEl.querySelector('.btn-clear-img-a')?.addEventListener('click', () => {
      rowEl.dataset.imageA = '';
      imgTagA.src = '';
      thumbA.style.display = 'none';
      sound.playPop();
    });

    rowEl.querySelector('.btn-gen-img-a')?.addEventListener('click', () => {
      const promptVal = rowEl.querySelector('.item-row-prompt').value.trim() || rowEl.querySelector('.item-row-target').value.trim() || 'ផ្ទះ (House)';
      this.openImgGenModal(promptVal, (selectedImgUrl) => {
        rowEl.dataset.imageA = selectedImgUrl;
        imgTagA.src = selectedImgUrl;
        thumbA.style.display = 'flex';
      });
    });

    // Bind Image Uploads & Generators for Card B
    const fileInputB = rowEl.querySelector('.file-upload-b');
    const thumbB = rowEl.querySelector('.img-thumb-b');
    const imgTagB = thumbB.querySelector('img');

    rowEl.querySelector('.btn-upload-img-b')?.addEventListener('click', () => fileInputB?.click());
    fileInputB?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          rowEl.dataset.imageB = evt.target.result;
          imgTagB.src = evt.target.result;
          thumbB.style.display = 'flex';
          sound.playPop();
        };
        reader.readAsDataURL(file);
      }
    });

    rowEl.querySelector('.btn-clear-img-b')?.addEventListener('click', () => {
      rowEl.dataset.imageB = '';
      imgTagB.src = '';
      thumbB.style.display = 'none';
      sound.playPop();
    });

    rowEl.querySelector('.btn-gen-img-b')?.addEventListener('click', () => {
      const targetVal = rowEl.querySelector('.item-row-target').value.trim() || rowEl.querySelector('.item-row-prompt').value.trim() || 'Apple';
      this.openImgGenModal(targetVal, (selectedImgUrl) => {
        rowEl.dataset.imageB = selectedImgUrl;
        imgTagB.src = selectedImgUrl;
        thumbB.style.display = 'flex';
      });
    });

    // Red Delete Button
    rowEl.querySelector('.btn-delete-row')?.addEventListener('click', () => {
      sound.playPop();
      rowEl.remove();
      this.updateRowCount();
    });

    rowsContainer.appendChild(rowEl);
    this.updateRowCount();
  }

  updateRowCount() {
    const rows = this.modalEl.querySelectorAll('.pair-builder-row');
    const badge = this.modalEl.querySelector('#creator-items-count-badge');
    if (badge) badge.textContent = `${rows.length} ${i18n.t('itemsCountBadge') || 'គូ'}`;
  }

  // --- AI Multi-Option Image Generator Modal ---
  openImgGenModal(initialKeyword, onSelectCallback) {
    this.imgGenCallback = onSelectCallback;
    this.selectedGeneratedImg = null;

    const input = this.imgGenModalEl.querySelector('#img-gen-keyword');
    const resultsGrid = this.imgGenModalEl.querySelector('#img-gen-results-grid');
    const selectBtn = this.imgGenModalEl.querySelector('#btn-select-generated-img');

    if (input) input.value = initialKeyword;
    if (resultsGrid) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); font-size: 0.88rem; padding: 2rem;">
          🎨 ចុច "ស្វែងរក / បង្កើតរូបភាព" ឬ ជ្រើសរើសពាក្យគន្លឹះខាងលើ
        </div>
      `;
    }
    if (selectBtn) selectBtn.style.display = 'none';

    this.imgGenModalEl.classList.add('active');
    sound.playPop();

    if (initialKeyword) {
      this.generateImages(initialKeyword);
    }
  }

  closeImgGenModal() {
    this.imgGenModalEl.classList.remove('active');
  }

  async translateKeyword(rawText) {
    if (!rawText) return 'house home';
    const clean = rawText.replace(/\(.*?\)/g, '').trim();

    // 1. Local high-speed Khmer-to-English dictionary
    const dict = {
      'ផ្ទះ': 'house modern house home building',
      'ផ្ទះខ្មែរ': 'traditional Khmer wooden house Cambodia architecture',
      'ផ្ទះឈើ': 'wooden house cottage home',
      'ឡាន': 'car modern automobile vehicle',
      'រថយន្ត': 'car vehicle automobile',
      'កង់': 'bicycle bike cycling',
      'ម៉ូតូ': 'motorcycle motorbike scooter',
      'ដើមឈើ': 'green lush tree nature',
      'ដើមដូង': 'tropical coconut palm tree',
      'ផ្កា': 'beautiful blooming colorful flower',
      'ផ្កាឈូក': 'pink lotus flower water lily',
      'សាលារៀន': 'school building classroom',
      'សៀវភៅ': 'open book reading study',
      'ប៊ិច': 'writing ballpoint pen',
      'ខ្មៅដៃ': 'wooden pencil',
      'តុ': 'wooden study desk table',
      'កៅអី': 'chair furniture',
      'ខ្លា': 'tiger big cat wild animal',
      'ខ្លាធំ': 'tiger wild predator animal',
      'ដំរី': 'asian elephant animal wildlife',
      'ស្វា': 'monkey sitting on branch',
      'សត្វកវែង': 'giraffe tall animal',
      'តោ': 'male lion predator wildlife',
      'សេះ': 'majestic running horse',
      'សេះបង្កង់': 'zebra animal stripes',
      'ខ្លាឃ្មុំ': 'grizzly bear animal',
      'កញ្ជ្រោង': 'red fox animal wildlife',
      'មាន់': 'rooster chicken farm animal',
      'មាន់ចែ': 'rooster farm bird',
      'ទា': 'swimming duck bird',
      'ទន្សាយ': 'cute fluffy rabbit bunny',
      'ឆ្មា': 'cute kitten cat pet',
      'ឆ្កែ': 'cute friendly dog puppy',
      'គោ': 'cow cattle farm animal',
      'ក្របី': 'water buffalo horn animal',
      'ត្រី': 'tropical swimming fish aquarium',
      'បក្សី': 'flying colorful bird',
      'អង្គរវត្ត': 'Angkor Wat ancient temple Siem Reap Cambodia',
      'ប្រាសាទអង្គរវត្ត': 'Angkor Wat ancient temple Siem Reap Cambodia',
      'ប្រាសាទបាយ័ន': 'Bayon temple giant stone faces Cambodia',
      'ប្រាសាទព្រះវិហារ': 'Preah Vihear temple mountain cliff Cambodia',
      'ផ្លែប៉ោម': 'fresh red delicious apple fruit',
      'ផ្លែចេក': 'yellow fresh banana fruit',
      'ផ្លែស្វាយ': 'fresh ripe mango fruit',
      'ផ្លែក្រូច': 'fresh orange fruit citrus',
      'ផ្លែដូង': 'tropical coconut fruit',
      'ព្រះអាទិត្យ': 'bright shining sun sky daylight',
      'ព្រះចន្ទ': 'glowing full moon night sky',
      'ពពក': 'fluffy white clouds blue sky',
      'ភ្នំ': 'majestic green mountain peak landscape',
      'ទន្លេ': 'clean flowing river nature landscape',
      'សមុទ្រ': 'tropical blue ocean beach sea waves'
    };

    if (dict[clean]) return dict[clean];

    // Check partial matches in dictionary
    for (const [k, v] of Object.entries(dict)) {
      if (clean.includes(k)) return v;
    }

    // 2. Fetch live translation from Google Translate API
    if (/[\u1780-\u17FF]/.test(clean)) {
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const json = await res.json();
          const translated = json?.[0]?.[0]?.[0];
          if (translated && translated.trim().length > 0) {
            return `${translated.trim()} ${clean}`;
          }
        }
      } catch (e) {
        console.warn("Live translation error:", e);
      }
    }

    return clean;
  }

  async generateImages(rawKeyword) {
    const resultsGrid = this.imgGenModalEl.querySelector('#img-gen-results-grid');
    const selectBtn = this.imgGenModalEl.querySelector('#btn-select-generated-img');

    if (selectBtn) selectBtn.style.display = 'none';
    if (resultsGrid) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 3rem;">
          <div style="font-size: 2.5rem; animation: spin 1.2s infinite linear;">🎨</div>
          <div style="font-size: 0.95rem; color: var(--text-main); font-weight: 700;">${i18n.t('generatingImage')}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">ស្វែងរកសម្រាប់: "${rawKeyword}"</div>
        </div>
      `;
    }

    // Translate keyword accurately
    const translatedPrompt = await this.translateKeyword(rawKeyword);
    const baseSeed = Math.floor(Math.random() * 9000) + 1000;

    // 4 Distinct High-Resolution Visual Options:
    const options = [
      {
        type: '🎨 រូបគំនូរច្បាស់ (Illustration)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(translatedPrompt + ', clean educational vector illustration, white background, vivid colors, masterpiece')}?width=400&height=400&nologo=true&seed=${baseSeed + 1}`
      },
      {
        type: '📷 រូបភាពពិត (Realistic Photo)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent('high quality realistic photograph of ' + translatedPrompt + ', professional photography, sharp focus, 4k')}?width=400&height=400&nologo=true&seed=${baseSeed + 2}`
      },
      {
        type: '✨ 3D Render (Modern 3D)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent('cute 3d clay render of ' + translatedPrompt + ', smooth shading, bright lighting, clean background')}?width=400&height=400&nologo=true&seed=${baseSeed + 3}`
      },
      {
        type: '🖼️ រូបភាពសិល្បៈ (Detailed Art)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent('detailed vibrant digital art of ' + translatedPrompt + ', clear subject, studio lighting')}?width=400&height=400&nologo=true&seed=${baseSeed + 4}`
      }
    ];

    if (!resultsGrid) return;
    resultsGrid.innerHTML = '';

    options.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'img-option-card';
      card.style.cssText = `
        background: rgba(0,0,0,0.35);
        border: 2px solid var(--panel-border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        position: relative;
      `;

      card.innerHTML = `
        <div style="position: relative; width: 100%; aspect-ratio: 1/1; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
          <div class="img-loading-spinner" style="font-size: 1.5rem; position: absolute;">⏳</div>
          <img src="${opt.url}" alt="${rawKeyword}" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2; opacity: 0; transition: opacity 0.3s ease;" onload="this.style.opacity=1; this.previousElementSibling.style.display='none';" onerror="this.src='https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&q=80';" />
        </div>
        <div style="padding: 0.4rem 0.6rem; font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-align: center; background: rgba(0,0,0,0.3);">
          ${opt.type}
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playPop();
        resultsGrid.querySelectorAll('.img-option-card').forEach(c => {
          c.style.borderColor = 'var(--panel-border)';
          c.style.boxShadow = 'none';
          c.style.transform = 'scale(1)';
        });

        card.style.borderColor = 'var(--accent-primary)';
        card.style.boxShadow = '0 0 16px var(--panel-border-glow)';
        card.style.transform = 'scale(1.02)';

        this.selectedGeneratedImg = opt.url;
        if (selectBtn) {
          selectBtn.style.display = 'inline-flex';
          selectBtn.onclick = () => {
            sound.playMatch();
            if (this.imgGenCallback) this.imgGenCallback(this.selectedGeneratedImg);
            this.closeImgGenModal();
          };
        }
      });

      resultsGrid.appendChild(card);
    });
  }

  save(downloadAlso = false) {
    const title = this.modalEl.querySelector('#creator-title').value.trim();
    if (!title) {
      alert("សូមបញ្ចូលចំណងជើងមេរៀន (Please enter a title)");
      return;
    }

    const desc = this.modalEl.querySelector('#creator-desc').value.trim();
    const cat = this.modalEl.querySelector('#creator-category').value.trim() || 'រូបភាព និងពាក្យ (Image & Word)';
    const tmpl = this.modalEl.querySelector('#creator-tmpl').value;
    const timer = parseInt(this.modalEl.querySelector('#creator-timer').value, 10) || 60;
    const lives = parseInt(this.modalEl.querySelector('#creator-lives').value, 10) || 3;

    const rowEls = this.modalEl.querySelectorAll('.pair-builder-row');
    const items = [];

    rowEls.forEach((row, idx) => {
      const emoji = row.querySelector('.item-row-emoji')?.value.trim() || '📝';
      const prompt = row.querySelector('.item-row-prompt')?.value.trim() || '';
      const target = row.querySelector('.item-row-target')?.value.trim() || '';
      const imagePrompt = row.dataset.imageA || '';
      const imageTarget = row.dataset.imageB || '';
      const hint = row.querySelector('.item-row-hint')?.value.trim() || '';
      const distractorStr = row.querySelector('.item-row-distractors')?.value.trim() || '';

      const hasSideA = (prompt && prompt.length > 0) || (imagePrompt && imagePrompt.length > 0);
      const hasSideB = (target && target.length > 0) || (imageTarget && imageTarget.length > 0);

      if (hasSideA && hasSideB) {
        const distractors = distractorStr ? distractorStr.split('|').map(s => s.trim()).filter(Boolean) : [];
        items.push({
          id: `item-${Date.now()}-${idx}`,
          emoji,
          prompt,
          imagePrompt,
          target,
          imageTarget,
          hint,
          distractors
        });
      }
    });

    if (items.length < 2) {
      alert("សូមបញ្ចូលយ៉ាងហោចណាស់ ២ គូផ្គូផ្គង (Please configure at least 2 matching pairs)");
      return;
    }

    const actData = {
      id: this.currentActivity?.id || `custom-${Date.now()}`,
      title: title,
      description: desc,
      category: cat,
      defaultTemplate: tmpl,
      timerSec: timer,
      lives: lives,
      shuffle: true,
      items: items
    };

    const saved = dataManager.saveActivity(actData);
    sound.playMatch();

    if (downloadAlso) {
      this.handleExportFile();
    }

    this.close();

    if (this.onSaveCallback) {
      this.onSaveCallback(saved);
    }
  }

  handleExportFile() {
    const title = this.modalEl.querySelector('#creator-title').value.trim() || 'activity';
    const rowEls = this.modalEl.querySelectorAll('.pair-builder-row');
    const items = [];

    rowEls.forEach((row, idx) => {
      const emoji = row.querySelector('.item-row-emoji')?.value.trim() || '📝';
      const prompt = row.querySelector('.item-row-prompt')?.value.trim() || '';
      const target = row.querySelector('.item-row-target')?.value.trim() || '';
      const imagePrompt = row.dataset.imageA || '';
      const imageTarget = row.dataset.imageB || '';
      const hint = row.querySelector('.item-row-hint')?.value.trim() || '';
      const distractorStr = row.querySelector('.item-row-distractors')?.value.trim() || '';

      if ((prompt || imagePrompt) && (target || imageTarget)) {
        items.push({
          id: `item-${idx}`,
          emoji,
          prompt,
          imagePrompt,
          target,
          imageTarget,
          hint,
          distractors: distractorStr ? distractorStr.split('|').map(s => s.trim()) : []
        });
      }
    });

    const exportObj = {
      title,
      description: this.modalEl.querySelector('#creator-desc').value.trim(),
      category: this.modalEl.querySelector('#creator-category').value.trim(),
      defaultTemplate: this.modalEl.querySelector('#creator-tmpl').value,
      timerSec: parseInt(this.modalEl.querySelector('#creator-timer').value, 10) || 60,
      lives: parseInt(this.modalEl.querySelector('#creator-lives').value, 10) || 3,
      items
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_outapruk.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playPop();
  }

  handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        this.populateForm(imported);
        sound.playMatch();
      } catch (err) {
        alert("កំហុសក្នុងការអានឯកសារ JSON (Invalid JSON format)");
      }
    };
    reader.readAsText(file);
  }
}
