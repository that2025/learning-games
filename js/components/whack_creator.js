/* ==========================================================================
   🐹 Whack-a-Mole Dedicated Question & Traps Studio
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated builder for Whack-a-Mole: Questions, Correct Moles, Wrong Traps & Speed
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { dataManager } from '../data.js';
import { i18n } from '../i18n.js';

export class WhackCreatorModal {
  constructor(onSaveCallback) {
    this.onSaveCallback = onSaveCallback;
    this.modalEl = null;
    this.currentActivity = null;
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-whack-creator';
    this.modalEl.style.zIndex = '1050';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 780px;">
        <div class="modal-header" style="background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border-bottom: 1px solid rgba(236, 72, 153, 0.3);">
          <div class="modal-title-wrap">
            <span style="font-size: 1.5rem;">🐹</span>
            <div>
              <span class="modal-title" style="color: #f472b6;">រៀបចំសំណួរ & ចម្លើយល្បែងវាយកណ្តុរ</span>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.15rem;">
                កំណត់សំណួរ ចម្លើយត្រូវដែលត្រូវវាយ (Targets) និងចម្លើយខុសបញ្ឆោត (Traps)
              </div>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-whack-creator">&times;</button>
        </div>

        <div class="modal-body" style="gap: 1.15rem; max-height: 72vh; overflow-y: auto;">
          <!-- Activity General Settings -->
          <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.9rem 1.1rem;">
            <div class="form-row-2" style="margin-bottom: 0.6rem;">
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">📝 ចំណងជើងមេរៀន / ល្បែង៖</label>
                <input type="text" class="form-input" id="whack-meta-title" placeholder="ឧ. មេរៀនសត្វស្លាប និងសត្វជើង៤, វិធីបូកលេខ..." />
              </div>
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">⚡ ល្បឿនចេញកណ្តុរ (Mole Speed)៖</label>
                <select class="form-select" id="whack-meta-speed" style="font-weight: 700;">
                  <option value="1800">🐢 យឺត (Slow - 1.8s)</option>
                  <option value="1300" selected>🚶‍♂️ មធ្យម (Normal - 1.3s)</option>
                  <option value="900">⚡ លឿន (Fast - 0.9s)</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">❤️ ចំនួនជីវិត (Lives)៖</label>
                <select class="form-select" id="whack-meta-lives">
                  <option value="3" selected>❤️❤️❤️ ៣ ជីវិត (3 Lives)</option>
                  <option value="5">❤️❤️❤️❤️❤️ ៥ ជីវិត (5 Lives)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" style="font-weight: 700;">⏱️ កំណត់ពេល (វិនាទី)៖</label>
                <input type="number" class="form-input" id="whack-meta-timer" value="60" min="10" max="300" />
              </div>
            </div>
          </div>

          <!-- Section: Whack Questions List -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
              <div style="font-size: 1.05rem; font-weight: 800; color: var(--text-main); display: flex; align-items: center; gap: 0.5rem;">
                <span>🎯</span>
                <span>បញ្ជីសំណួរវាយកណ្តុរ</span>
                <span id="whack-questions-count-badge" class="arena-badge" style="background: rgba(236, 72, 153, 0.2); color: #f472b6; border-color: rgba(236, 72, 153, 0.4);">
                  0 សំណួរ
                </span>
              </div>
            </div>

            <!-- Dynamic Question Cards Container -->
            <div id="whack-questions-container" style="display: flex; flex-direction: column; gap: 1rem;">
              <!-- Inserted dynamically -->
            </div>

            <!-- Bottom Add Question Button -->
            <div style="display: flex; justify-content: center; margin-top: 1.25rem;">
              <button class="nav-btn btn-create" id="btn-add-whack-q" style="font-size: 0.95rem; font-weight: 700; padding: 0.75rem 2.5rem; width: 100%; max-width: 400px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); box-shadow: 0 4px 15px rgba(236, 72, 153, 0.35); border-radius: 12px;">
                <span style="font-size: 1.2rem;">➕</span>
                <span>បន្ថែមសំណួរវាយកណ្តុរថ្មី</span>
              </button>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; gap: 0.5rem;">
            <input type="file" id="whack-file-import" accept=".json" style="display: none;" />
            <button class="nav-btn" id="btn-whack-import-json">📥 នាំចូល JSON</button>
            <button class="nav-btn" id="btn-whack-export-json">📤 ទាញយក JSON</button>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="nav-btn" id="btn-cancel-whack-creator">បោះបង់</button>
            <button class="nav-btn btn-create" id="btn-save-whack-creator" style="background: linear-gradient(135deg, #ec4899 0%, #10b981 100%); font-weight: 700; padding: 0.55rem 1.4rem;">
              💾 រក្សាទុក & លេងភ្លាម (Save & Play)
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-close-whack-creator')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-cancel-whack-creator')?.addEventListener('click', () => this.close());

    // Add Question
    this.modalEl.querySelector('#btn-add-whack-q')?.addEventListener('click', () => {
      this.addQuestionRow();
      const rows = this.modalEl.querySelectorAll('.whack-editor-card');
      if (rows.length > 0) {
        rows[rows.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // Save
    this.modalEl.querySelector('#btn-save-whack-creator')?.addEventListener('click', () => this.save());

    // Import / Export JSON
    const fileInput = this.modalEl.querySelector('#whack-file-import');
    this.modalEl.querySelector('#btn-whack-import-json')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => this.handleImport(e));
    this.modalEl.querySelector('#btn-whack-export-json')?.addEventListener('click', () => this.handleExport());
  }

  open(activity = null) {
    this.currentActivity = activity;
    const titleInput = this.modalEl.querySelector('#whack-meta-title');
    const speedSelect = this.modalEl.querySelector('#whack-meta-speed');
    const livesSelect = this.modalEl.querySelector('#whack-meta-lives');
    const timerInput = this.modalEl.querySelector('#whack-meta-timer');
    const container = this.modalEl.querySelector('#whack-questions-container');

    container.innerHTML = '';

    if (activity) {
      const actTitle = typeof activity.title === 'object' ? (activity.title.km || activity.title.en) : activity.title;
      titleInput.value = actTitle || 'ល្បែងវាយកណ្តុរ (Whack-a-Mole)';
      speedSelect.value = activity.moleSpeed || '1300';
      livesSelect.value = activity.lives || 3;
      timerInput.value = activity.timerSec || 60;

      const items = activity.items || [];
      if (items.length > 0) {
        items.forEach(item => this.addQuestionRow(item));
      } else {
        this.addQuestionRow();
      }
    } else {
      titleInput.value = '';
      speedSelect.value = '1300';
      livesSelect.value = 3;
      timerInput.value = 60;

      // Start with 1 clean sample row or empty
      this.addQuestionRow({
        prompt: 'តើពាក្យណាជាឈ្មោះសត្វស្លាប (Birds)?',
        target: 'ក្ងោក, សេក, ចាប, មាន់, ទា',
        distractors: ['ខ្លា', 'ដំរី', 'ក្រពើ', 'ត្រី', 'ពស់']
      });
    }

    this.updateCountBadge();
    this.modalEl.classList.add('active');
    sound.playPop();
  }

  close() {
    this.modalEl.classList.remove('active');
    sound.playPop();
  }

  addQuestionRow(itemData = null) {
    const container = this.modalEl.querySelector('#whack-questions-container');
    const rowEl = document.createElement('div');
    rowEl.className = 'whack-editor-card';
    rowEl.style.cssText = 'background: rgba(15, 23, 42, 0.75); border: 1px solid var(--panel-border); border-radius: 14px; padding: 1.1rem; box-shadow: 0 4px 15px rgba(0,0,0,0.3); transition: all 0.2s ease;';

    const prompt = itemData?.prompt || '';
    
    // Support targets array, comma-separated string, or single target
    let correctStr = '';
    if (itemData?.targets && Array.isArray(itemData.targets)) {
      correctStr = itemData.targets.join(', ');
    } else if (itemData?.target) {
      correctStr = itemData.target;
    }

    // Support distractors array or comma-separated string
    let wrongStr = '';
    if (itemData?.distractors && Array.isArray(itemData.distractors)) {
      wrongStr = itemData.distractors.join(', ');
    } else if (typeof itemData?.distractors === 'string') {
      wrongStr = itemData.distractors;
    }

    rowEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.4rem;">
        <span class="whack-card-index" style="font-weight: 800; color: #38bdf8; font-size: 0.92rem;">🎯 សំណួរ</span>
        <button class="btn-delete-row" title="លុបសំណួរ" style="font-size: 1.2rem; line-height: 1; padding: 0.2rem 0.5rem; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; border-radius: 8px; cursor: pointer;">&times;</button>
      </div>

      <!-- Question Prompt Input -->
      <div class="form-group" style="margin-bottom: 0.75rem;">
        <label class="form-label" style="font-weight: 700; color: var(--text-main); font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
          <span>❓</span> <span>សំណួរ ឬប្រធានបទគោលដៅ (Question Prompt)៖</span>
        </label>
        <input type="text" class="form-input whack-q-prompt" value="${prompt}" placeholder="ឧ. តើពាក្យណាជាឈ្មោះផ្លែឈើ? ឬ តើ ៤៥ + ៣៥ = ?" />
      </div>

      <!-- Correct Targets (Moles to Hit) -->
      <div class="form-group" style="margin-bottom: 0.75rem;">
        <label class="form-label" style="font-weight: 700; color: #34d399; font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
          <span>✅</span> <span>ចម្លើយត្រូវ (កណ្តុរត្រូវវាយយកពិន្ទុ - បំបែកដោយសញ្ញាក្បៀស , )៖</span>
        </label>
        <input type="text" class="form-input whack-q-correct" value="${correctStr}" style="border-color: rgba(52, 211, 153, 0.4); background: rgba(52, 211, 153, 0.05);" placeholder="ឧ. ស្វាយ, ចេក, ក្រូច, ប៉ោម (អាចវាយពាក្យជាច្រើន)" />
        <div style="font-size: 0.75rem; color: #a7f3d0; margin-top: 0.25rem;">
          💡 កណ្តុរដែលកាន់ពាក្យទាំងនេះ នឹងលោតចេញមកឱ្យអ្នកលេងវាយយកពិន្ទុ
        </div>
      </div>

      <!-- Wrong Distractors (Traps / Moles NOT to Hit) -->
      <div class="form-group" style="margin-bottom: 0.25rem;">
        <label class="form-label" style="font-weight: 700; color: #f87171; font-size: 0.85rem; display: flex; align-items: center; gap: 0.35rem;">
          <span>❌</span> <span>ចម្លើយខុស / បញ្ឆោត (កណ្តុរហាមវាយ - បំបែកដោយសញ្ញាក្បៀស , )៖</span>
        </label>
        <input type="text" class="form-input whack-q-wrong" value="${wrongStr}" style="border-color: rgba(248, 113, 113, 0.4); background: rgba(248, 113, 113, 0.05);" placeholder="ឧ. ការ៉ុត, ស្ពៃ, ត្រកួន, ម្ទេស (អាចវាយពាក្យជាច្រើន)" />
        <div style="font-size: 0.75rem; color: #fca5a5; margin-top: 0.25rem;">
          ⚠️ បើអ្នកលេងច្រឡំវាយលើកណ្តុរដែលកាន់ពាក្យទាំងនេះ នឹងត្រូវដកជីវិត ❤️
        </div>
      </div>
    `;

    rowEl.querySelector('.btn-delete-row')?.addEventListener('click', () => {
      sound.playPop();
      rowEl.remove();
      this.updateCountBadge();
    });

    container.appendChild(rowEl);
    this.updateCountBadge();
  }

  updateCountBadge() {
    const rows = this.modalEl.querySelectorAll('.whack-editor-card');
    const badge = this.modalEl.querySelector('#whack-questions-count-badge');
    if (badge) badge.textContent = `${rows.length} សំណួរ`;

    // Re-index titles
    rows.forEach((row, i) => {
      const idxEl = row.querySelector('.whack-card-index');
      if (idxEl) idxEl.textContent = `🎯 សំណួរទី ${i + 1}`;
    });
  }

  save() {
    const title = this.modalEl.querySelector('#whack-meta-title').value.trim() || 'ល្បែងវាយកណ្តុរ (Whack-a-Mole)';
    const speed = parseInt(this.modalEl.querySelector('#whack-meta-speed').value, 10) || 1300;
    const lives = parseInt(this.modalEl.querySelector('#whack-meta-lives').value, 10) || 3;
    const timer = parseInt(this.modalEl.querySelector('#whack-meta-timer').value, 10) || 60;

    const rows = this.modalEl.querySelectorAll('.whack-editor-card');
    const items = [];

    rows.forEach(row => {
      const prompt = row.querySelector('.whack-q-prompt').value.trim();
      const correctStr = row.querySelector('.whack-q-correct').value.trim();
      const wrongStr = row.querySelector('.whack-q-wrong').value.trim();

      if (prompt || correctStr) {
        const correctList = correctStr ? correctStr.split(/[,|、]+/).map(s => s.trim()).filter(Boolean) : ['ចម្លើយត្រូវ'];
        const wrongList = wrongStr ? wrongStr.split(/[,|、]+/).map(s => s.trim()).filter(Boolean) : ['ចម្លើយខុស'];

        items.push({
          emoji: '🐹',
          prompt: prompt || 'ស្វែងរកចម្លើយត្រឹមត្រូវ',
          target: correctList[0],
          targets: correctList,
          distractors: wrongList,
          hint: ''
        });
      }
    });

    if (items.length === 0) {
      alert("សូមបញ្ចូលយ៉ាងហោចណាស់ ១ សំណួរ សម្រាប់ល្បែងវាយកណ្តុរ!");
      return;
    }

    const activityData = {
      id: this.currentActivity?.id || `whack_${Date.now()}`,
      title: { km: title, en: title },
      description: { km: 'ល្បែងវាយកណ្តុរអន្តរកម្ម', en: 'Interactive Whack-a-Mole Game' },
      category: { km: 'វាយកណ្តុរ', en: 'Whack-a-Mole' },
      defaultTemplate: 'whack',
      moleSpeed: speed,
      timerSec: timer,
      lives: lives,
      items: items
    };

    dataManager.saveActivity(activityData);

    if (this.onSaveCallback) {
      this.onSaveCallback(activityData);
    }

    sound.playVictory();
    particles.fireCelebration();
    this.close();
  }

  handleExport() {
    const title = this.modalEl.querySelector('#whack-meta-title').value.trim() || 'whack_game';
    const rows = this.modalEl.querySelectorAll('.whack-editor-card');
    const items = [];

    rows.forEach(row => {
      const prompt = row.querySelector('.whack-q-prompt').value.trim();
      const correctStr = row.querySelector('.whack-q-correct').value.trim();
      const wrongStr = row.querySelector('.whack-q-wrong').value.trim();

      if (prompt || correctStr) {
        const correctList = correctStr.split(/[,|、]+/).map(s => s.trim()).filter(Boolean);
        const wrongList = wrongStr.split(/[,|、]+/).map(s => s.trim()).filter(Boolean);

        items.push({
          emoji: '🐹',
          prompt: prompt,
          target: correctList[0] || '',
          targets: correctList,
          distractors: wrongList
        });
      }
    });

    const exportObj = {
      id: `whack_${Date.now()}`,
      title: title,
      defaultTemplate: 'whack',
      items: items
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_whack.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playPop();
  }

  handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        this.open(parsed);
        sound.playMatch();
      } catch (err) {
        alert("ឯកសារ JSON មិនត្រឹមត្រូវ!");
      }
    };
    reader.readAsText(file);
  }
}
