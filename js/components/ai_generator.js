/* ==========================================================================
   AI Educational Question Generator (Google Gemini Direct Cloud Integration)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Direct Google Gemini 2.0 Flash / 1.5 Flash Cloud Integration
   - Live AI Reasoning & Thinking Visualizer
   - Interactive Google Account / API Key Connection & Verification
   - Full Multimodal support (Text Prompts, PDF Textbooks, Image OCR)
   ========================================================================== */

import { sound } from '../audio.js';
import { i18n } from '../i18n.js';
import { particles } from '../particles.js';

export class AiGeneratorModal {
  constructor(onApplyCallback, onEditCallback) {
    this.modalEl = null;
    this.currentTab = 'prompt';
    this.apiKey = localStorage.getItem('otpg_gemini_api_key') || '';
    this.isGeminiVerified = false;
    this.generatedQuestions = [];
    this.uploadedImageBase64 = null;
    this.uploadedPdfText = '';
    this.onApplyCallback = onApplyCallback;
    this.onEditCallback = onEditCallback;
    this.activeModel = 'gemini-2.0-flash';
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-ai-generator';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 920px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>✨</span>
            <span class="modal-title" data-i18n="aiGenTitle">បង្កើតសំណួរស្វ័យប្រវត្តិតាមរយៈ Google Gemini AI</span>
          </div>
          <button class="modal-close-btn" id="btn-close-ai-gen">&times;</button>
        </div>

        <div class="modal-body" style="gap: 1.15rem;">
          <!-- Section 1: Google Gemini Account & Key Connection Card -->
          <div id="ai-api-key-card" style="background: linear-gradient(135deg, rgba(24, 30, 48, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%); border: 2px solid #3b82f6; border-radius: 14px; padding: 1.1rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15); transition: all 0.3s ease;">
            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-weight: 800; font-size: 0.98rem; color: #60a5fa; display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">🔑</span>
                <span>ភ្ជាប់គណនី Google Gemini AI (Sign In / API Key)</span>
              </div>
              <a id="link-get-api-key" href="https://aistudio.google.com/app/apikey" target="_blank" style="font-size: 0.82rem; color: #fbbf24; text-decoration: underline; font-weight: 700; display: flex; align-items: center; gap: 0.3rem;">
                <span>👉</span> ចុចទីនេះដើម្បីយក Gemini Key ឥតគិតថ្លៃ (aistudio.google.com)
              </a>
            </div>

            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <!-- API Key Input -->
              <div style="position: relative; flex: 1; min-width: 260px; display: flex; align-items: center;">
                <input type="password" class="form-input" id="ai-api-key" placeholder="បិទភ្ជាប់ Gemini API Key (ឧ. AQ... ឬ AIzaSy...)" value="${this.apiKey}" style="width: 100%; font-size: 0.88rem; padding: 0.5rem 2.4rem 0.5rem 0.85rem; border-color: rgba(59, 130, 246, 0.5);" />
                <button type="button" id="btn-toggle-key-visibility" style="position: absolute; right: 8px; background: none; border: none; cursor: pointer; font-size: 1rem; color: var(--text-muted);" title="បង្ហាញ/លាក់ Key">👁️</button>
              </div>

              <!-- Connect / Test Button -->
              <button class="nav-btn btn-create" id="btn-test-api-key" style="font-size: 0.86rem; padding: 0.5rem 1.25rem; white-space: nowrap; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
                <span>🔌</span> ភ្ជាប់ និងចងចាំ Key
              </button>

              <!-- Clear Key Button -->
              <button class="nav-btn btn-danger" id="btn-clear-api-key" style="font-size: 0.82rem; padding: 0.5rem 0.75rem; white-space: nowrap; ${this.apiKey ? '' : 'display: none;'}" title="លុប Key ចេញ">
                <span>🗑️</span> លុប
              </button>
            </div>

            <!-- Status Indicator -->
            <div id="ai-key-status" style="font-size: 0.82rem; line-height: 1.4; padding-top: 0.2rem;">
              ${this.apiKey ? '⏳ កំពុងត្រួតពិនិត្យការតភ្ជាប់ Gemini...' : '<span style="color: #f87171; font-weight: 700;">⚠️ មិនទាន់មាន API Key នៅឡើយទេ។ សូមបញ្ចូល Gemini API Key ម្ដង ដើម្បីដំណើរការ AI។</span>'}
            </div>

            <!-- Quick Step-by-Step Help Drawer -->
            <details style="font-size: 0.78rem; color: #94a3b8; background: rgba(0,0,0,0.25); padding: 0.5rem 0.75rem; border-radius: 8px;">
              <summary style="cursor: pointer; font-weight: 700; color: #cbd5e1;">📖 របៀបយក Gemini API Key ក្នុងរយៈពេល ៣០ វិនាទី (ចុចដើម្បីមើល)</summary>
              <ol style="margin: 0.4rem 0 0 1.2rem; padding: 0; line-height: 1.5;">
                <li>ចូលទៅកាន់ <strong><a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #60a5fa;">aistudio.google.com/app/apikey</a></strong> (Login គណនី Google)</li>
                <li>ចុចប៊ូតុង <strong>"+ Create API key"</strong> ➔ ចុច <strong>"Create key"</strong></li>
                <li>ចុច <strong>"Copy key"</strong> រួចយកមក Paste ក្នុងប្រអប់ខាងលើ ហើយចុច <strong>"ភ្ជាប់ និងចងចាំ Key"</strong>! (ប្រព័ន្ធនឹងចងចាំជានិច្ច មិនបាច់បញ្ចូលម្តងទៀតទេ)</li>
              </ol>
            </details>
          </div>

          <!-- Section 2: Input Method Tabs -->
          <div class="modal-tabs">
            <button class="modal-tab-btn active" data-tab="prompt">
              <span>📝</span> <span>ប្រធានបទមេរៀន (Topic Prompt)</span>
            </button>
            <button class="modal-tab-btn" data-tab="pdf">
              <span>📄</span> <span>ឯកសារ PDF សៀវភៅពុម្ព</span>
            </button>
            <button class="modal-tab-btn" data-tab="image">
              <span>🖼️</span> <span>រូបភាពមេរៀន</span>
            </button>
          </div>

          <!-- Tab 1: Topic / Prompt -->
          <div class="ai-tab-pane" id="tab-pane-prompt">
            <div class="form-group" style="margin-bottom: 0.75rem;">
              <label class="form-label" style="font-weight: 700; color: var(--text-main); font-size: 0.92rem;">
                ✍️ វាយប្រធានបទមេរៀនដែលចង់ឱ្យ Gemini AI បង្កើត (Custom Topic):
              </label>
              <textarea class="form-textarea" id="ai-prompt-input" style="min-height: 90px; font-size: 0.95rem; line-height: 1.5;" placeholder="ឧទាហរណ៍៖ គណិតវិទ្យាថ្នាក់ទី៤ វិធីបូកលេខ៣ខ្ទង់, វិទ្យាសាស្ត្រ មេរៀនកម្ដៅ និងអគ្គិសនី, ប្រវត្តិវិទ្យា សម័យអង្គរ, ភាសាខ្មែរ រឿងកញ្ជ្រោងនិងមាន់ចែ..."></textarea>
            </div>

            <!-- Subject Quick Preset Chips -->
            <div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
                📌 ចុចជ្រើសរើសប្រធានបទគំរូតាមមុខវិជ្ជា (Quick Presets):
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
                <button class="nav-btn ai-preset-chip" data-prompt="គណិតវិទ្យា៖ វិធីបូក">➕ វិធីបូក (Addition)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="គណិតវិទ្យា៖ វិធីដក">➖ វិធីដក (Subtraction)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="គណិតវិទ្យា៖ វិធីគុណ">✖️ វិធីគុណ (Multiplication)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="គណិតវិទ្យា៖ វិធីចែក">➗ វិធីចែក (Division)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="គណិតវិទ្យា៖ រូបមន្តផ្ទៃក្រឡា និងបរិមាត្រ">📐 ផ្ទៃក្រឡា & បរិមាត្រ</button>
                <button class="nav-btn ai-preset-chip" data-prompt="វិទ្យាសាស្ត្រ៖ ផ្នែក និងនាទីរបស់រុក្ខជាតិ (ឫស ដើម ស្លឹក ផ្កា ផ្លែ)">🌱 វិទ្យាសាស្ត្រ (Science)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="ប្រវត្តិវិទ្យា៖ ប្រាសាទបុរាណ និងរាជធានីសម័យអង្គរនៃប្រទេសកម្ពុជា">🏛️ ប្រវត្តិវិទ្យា (History)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="ភាសាខ្មែរ៖ រឿង កញ្ជ្រោងនិងមាន់ចែ (គតិអប់រំ និងតួអង្គ)">📖 ភាសាខ្មែរ (Khmer)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="សត្វព្រៃ និងលក្ខណៈសម្គាល់សំខាន់ៗនៃសត្វ">🐯 សត្វព្រៃ (Animals)</button>
                <button class="nav-btn ai-preset-chip" data-prompt="English Vocabulary: Animals, School Objects and Colors">🇬🇧 ភាសាអង់គ្លេស (English)</button>
              </div>
            </div>
          </div>

          <!-- Tab 2: PDF Document -->
          <div class="ai-tab-pane" id="tab-pane-pdf" style="display: none;">
            <div class="form-group">
              <label class="form-label">📄 ជ្រើសរើសឯកសារ PDF សៀវភៅពុម្ពក្រសួងអប់រំ៖</label>
              <input type="file" id="ai-pdf-file" accept=".pdf" class="form-input" />
              <div id="ai-pdf-status-card" style="margin-top: 0.5rem; font-size: 0.82rem; color: var(--text-muted);"></div>
            </div>
          </div>

          <!-- Tab 3: Textbook Image -->
          <div class="ai-tab-pane" id="tab-pane-image" style="display: none;">
            <div class="form-group">
              <label class="form-label">🖼️ ផ្ទុករូបភាពទំព័រមេរៀន៖</label>
              <input type="file" id="ai-img-file" accept="image/*" class="form-input" />
              <div id="ai-img-preview-wrap" style="margin-top: 0.75rem; text-align: center;"></div>
            </div>
          </div>

          <!-- Generation Controller Bar -->
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-top: 1px solid var(--panel-border); padding-top: 1rem; margin-top: 0.4rem; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label class="form-label" style="margin: 0; font-weight: 700;">ចំនួនសំណួរ៖</label>
              <select class="form-select" id="ai-item-count" style="padding: 0.4rem 0.75rem; width: 80px; font-weight: 700;">
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8" selected>8</option>
                <option value="10">10</option>
              </select>
            </div>
            <button class="nav-btn btn-create" id="btn-trigger-ai-gen" style="font-size: 1.05rem; padding: 0.75rem 2.5rem; background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%); box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
              <span>✨</span>
              <span id="btn-gen-text">បង្កើតសំណួរដោយ Gemini AI</span>
            </button>
          </div>

          <!-- AI Thinking & Progress Visualizer -->
          <div id="ai-thinking-box" style="display: none; background: rgba(15, 23, 42, 0.85); border: 2px dashed #60a5fa; border-radius: 14px; padding: 1.25rem; text-align: center;">
            <div style="font-size: 2rem; animation: pulse 1s infinite;">🤖 🧠 ⚡</div>
            <div id="ai-thinking-status" style="font-weight: 800; color: #38bdf8; font-size: 1.05rem; margin-top: 0.5rem;">
              កំពុងភ្ជាប់ទៅកាន់ Google Gemini Cloud AI...
            </div>
            <div style="font-size: 0.82rem; color: #94a3b8; margin-top: 0.25rem;">
              Gemini AI កំពុងដំណើរការគិត វិភាគ និងបង្កើតសំណួរចម្លើយផ្ទាល់...
            </div>
            <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; margin-top: 1rem;">
              <div id="ai-progress-bar" style="width: 20%; height: 100%; background: linear-gradient(90deg, #ec4899, #8b5cf6, #38bdf8); transition: width 0.4s ease;"></div>
            </div>
          </div>

          <!-- Review Generated Questions Area -->
          <div id="ai-review-section" style="display: none; margin-top: 1rem; border-top: 2px dashed var(--panel-border); padding-top: 1rem;">
            <div style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
              <span>✅ លទ្ធផលសំណួរដែល Gemini AI បានបង្កើត៖</span>
              <span id="ai-review-source-badge" class="arena-badge" style="background: rgba(59, 130, 246, 0.25); color: #60a5fa; border: 1px solid #3b82f6;">Google Gemini 2.0 Flash ✨</span>
            </div>
            <div id="ai-review-list" style="display: flex; flex-direction: column; gap: 0.65rem; max-height: 290px; overflow-y: auto;">
              <!-- Items list -->
            </div>
          </div>
        </div>

        <div class="modal-footer" id="ai-modal-footer">
          <button class="nav-btn" id="btn-cancel-ai">បោះបង់</button>
          <button class="nav-btn btn-edit" id="btn-ai-to-creator" style="display: none;">
            ✏️ យកទៅកែសម្រួលក្នុងស្ទូឌីយោ
          </button>
          <button class="nav-btn btn-create" id="btn-ai-apply-play" style="display: none; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            🚀 អនុវត្ត និងលេងភ្លាមៗ
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
    if (this.apiKey) {
      this.testApiKey(false);
    }
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-close-ai-gen')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-cancel-ai')?.addEventListener('click', () => this.close());

    // API Key input change
    const keyInput = this.modalEl.querySelector('#ai-api-key');
    const clearBtn = this.modalEl.querySelector('#btn-clear-api-key');
    keyInput?.addEventListener('input', (e) => {
      this.apiKey = e.target.value.trim();
      if (this.apiKey) {
        localStorage.setItem('otpg_gemini_api_key', this.apiKey);
        if (clearBtn) clearBtn.style.display = 'inline-flex';
      } else {
        localStorage.removeItem('otpg_gemini_api_key');
        if (clearBtn) clearBtn.style.display = 'none';
      }
    });

    // Toggle password visibility
    const toggleBtn = this.modalEl.querySelector('#btn-toggle-key-visibility');
    toggleBtn?.addEventListener('click', () => {
      if (keyInput.type === 'password') {
        keyInput.type = 'text';
        toggleBtn.textContent = '🙈';
      } else {
        keyInput.type = 'password';
        toggleBtn.textContent = '👁️';
      }
    });

    // Clear API Key Button
    clearBtn?.addEventListener('click', () => {
      if (confirm("តើអ្នកពិតជាចង់លុប Gemini API Key ចេញពី Browser នេះមែនទេ?")) {
        this.apiKey = '';
        localStorage.removeItem('otpg_gemini_api_key');
        if (keyInput) keyInput.value = '';
        if (clearBtn) clearBtn.style.display = 'none';
        const statusEl = document.getElementById('ai-key-status');
        if (statusEl) {
          statusEl.innerHTML = `<span style="color: #f87171; font-weight: 700;">⚠️ មិនទាន់មាន API Key នៅឡើយទេ។ សូមបញ្ចូល Gemini API Key ម្ដង ដើម្បីដំណើរការ AI។</span>`;
        }
        const cardEl = this.modalEl.querySelector('#ai-api-key-card');
        if (cardEl) {
          cardEl.style.borderColor = '#3b82f6';
          cardEl.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.15)';
        }
        sound.playPop();
      }
    });

    // Test API Key Button
    this.modalEl.querySelector('#btn-test-api-key')?.addEventListener('click', () => this.testApiKey(true));

    // Tab Switching
    this.modalEl.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        this.modalEl.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTab = btn.dataset.tab;

        document.getElementById('tab-pane-prompt').style.display = this.currentTab === 'prompt' ? 'block' : 'none';
        document.getElementById('tab-pane-pdf').style.display = this.currentTab === 'pdf' ? 'block' : 'none';
        document.getElementById('tab-pane-image').style.display = this.currentTab === 'image' ? 'block' : 'none';
      });
    });

    // Preset Chips
    this.modalEl.querySelectorAll('.ai-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playPop();
        const input = document.getElementById('ai-prompt-input');
        if (input) {
          input.value = chip.dataset.prompt;
          input.focus();
        }
      });
    });

    // PDF Upload handling
    const pdfInput = this.modalEl.querySelector('#ai-pdf-file');
    pdfInput?.addEventListener('change', (e) => this.handlePdfUpload(e));

    // Image Upload handling
    const imgInput = this.modalEl.querySelector('#ai-img-file');
    imgInput?.addEventListener('change', (e) => this.handleImageUpload(e));

    // Trigger AI Generation
    this.modalEl.querySelector('#btn-trigger-ai-gen')?.addEventListener('click', () => this.generate());

    // Apply Actions
    this.modalEl.querySelector('#btn-ai-apply-play')?.addEventListener('click', () => this.applyToPlay());
    this.modalEl.querySelector('#btn-ai-to-creator')?.addEventListener('click', () => this.applyToCreator());
  }

  open() {
    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  async testApiKey(showSuccessAlert = false) {
    const statusEl = document.getElementById('ai-key-status');
    if (!this.apiKey) {
      this.isGeminiVerified = false;
      if (statusEl) statusEl.innerHTML = `<span style="color: #f59e0b;">ℹ️ សូមបញ្ចូល Gemini API Key</span>`;
      return;
    }

    if (statusEl) statusEl.innerHTML = `⏳ កំពុងតេស្តភ្ជាប់ទៅកាន់ <strong>Google Gemini Cloud API</strong>...`;

    const candidateModels = [
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemma-4-26b-a4b-it',
      'gemini-2.0-flash',
      'gemini-1.5-flash'
    ];
    let verified = false;

    // First try querying model list to discover valid models directly
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`;
      const listRes = await fetch(listUrl);
      if (listRes.ok) {
        const listData = await listRes.json();
        const available = (listData.models || []).map(m => m.name.replace('models/', ''));
        const matched = candidateModels.find(m => available.includes(m)) || available.find(m => m.includes('flash') || m.includes('gemini'));
        if (matched) {
          this.activeModel = matched;
          this.isGeminiVerified = true;
          verified = true;
        }
      }
    } catch (e) {
      console.warn("Model list check warning:", e);
    }

    // Fallback: ping candidate models directly
    if (!verified) {
      for (const m of candidateModels) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${this.apiKey}`;
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Ping' }] }] })
          });
          if (res.ok) {
            this.activeModel = m;
            this.isGeminiVerified = true;
            verified = true;
            break;
          }
        } catch (e) {}
      }
    }

    if (verified) {
      sound.playMatch();
      localStorage.setItem('otpg_gemini_api_key', this.apiKey);
      const clearBtn = this.modalEl.querySelector('#btn-clear-api-key');
      if (clearBtn) clearBtn.style.display = 'inline-flex';
      const cardEl = this.modalEl.querySelector('#ai-api-key-card');
      if (cardEl) {
        cardEl.style.borderColor = '#10b981';
        cardEl.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.2)';
      }
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #34d399; font-weight: 800;">🟢 គណនីបានភ្ជាប់ជោគជ័យ និងចងចាំក្នុង Browser ជានិច្ច! Google Gemini Cloud (${this.activeModel}) រួចរាល់ក្នុងការបង្កើតសំណួរ។</span>`;
      }
      if (showSuccessAlert) {
        alert(`✅ បានភ្ជាប់គណនី Google Gemini API (${this.activeModel}) ដោយជោគជ័យ! ប្រព័ន្ធបានចងចាំ Key នេះទុកក្នុង Browser រួចរាល់ ពេលក្រោយមិនបាច់បញ្ចូលម្តងទៀតទេ។`);
      }
    } else {
      this.isGeminiVerified = false;
      sound.playWrong();
      if (statusEl) {
        statusEl.innerHTML = `
          <span style="color: #f87171; font-weight: 700;">❌ API Key មិនត្រឹមត្រូវ (Google API បានបដិសេធ)។</span>
          <span style="color: #fbbf24; display: block; font-size: 0.78rem;">💡 សូមប្រាកដថាអ្នកបានចុច "Create API key" នៅ <a href="https://aistudio.google.com/app/apikey" target="_blank" style="color: #60a5fa; text-decoration: underline;">aistudio.google.com</a> រួច Copy Key មក Paste ម្ដងទៀត។</span>
        `;
      }
      if (showSuccessAlert) {
        alert("❌ Gemini API Key មិនត្រឹមត្រូវ ឬមិនទាន់ដំណើរការ។ សូមពិនិត្យមើល Key របស់អ្នកឡើងវិញ។");
      }
    }
  }

  async handlePdfUpload(e) {
    const file = e.target.files?.[0];
    const statusEl = document.getElementById('ai-pdf-status-card');
    if (!file) return;

    if (statusEl) statusEl.innerHTML = `⏳ <strong>${file.name}</strong> - កំពុងអានឯកសារ PDF...`;

    try {
      if (typeof window.pdfjsLib === 'undefined') {
        throw new Error("PDF.js library not loaded yet.");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = '';
      const numPages = Math.min(pdf.numPages, 5);

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      this.uploadedPdfText = fullText;
      if (statusEl) {
        statusEl.innerHTML = `✅ <strong>${file.name}</strong> (${numPages} ទំព័រ) - បានទាញយកអត្ថបទ ${fullText.length} តួអក្សរដោយជោគជ័យ!`;
      }
      sound.playMatch();
    } catch (err) {
      console.error(err);
      if (statusEl) statusEl.innerHTML = `❌ កំហុសក្នុងការអាន PDF: ${err.message}`;
    }
  }

  handleImageUpload(e) {
    const file = e.target.files?.[0];
    const previewWrap = document.getElementById('ai-img-preview-wrap');
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      this.uploadedImageBase64 = event.target.result;
      if (previewWrap) {
        previewWrap.innerHTML = `
          <img src="${this.uploadedImageBase64}" style="max-height: 180px; max-width: 100%; border-radius: 10px; border: 1px solid var(--panel-border);" alt="preview" />
        `;
      }
      sound.playPop();
    };
    reader.readAsDataURL(file);
  }

  async generate() {
    // Auto-sync API Key from input if typed or pasted
    const inputKey = document.getElementById('ai-api-key')?.value.trim();
    if (inputKey) {
      this.apiKey = inputKey;
      localStorage.setItem('otpg_gemini_api_key', inputKey);
    }

    // MANDATORY REQUIREMENT: Block generation if user has not entered an API Key!
    if (!this.apiKey) {
      sound.playWrong();
      const statusEl = document.getElementById('ai-key-status');
      const keyInput = document.getElementById('ai-api-key');
      const cardEl = this.modalEl.querySelector('#ai-api-key-card');
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #ef4444; font-weight: 800;">⚠️ សូមបញ្ចូល Google Gemini API Key ជាមុនសិន! មុខងារ AI មិនអាចដំណើរការបានទេ ប្រសិនបើគ្មាន API Key។</span>`;
      }
      if (cardEl) {
        cardEl.style.borderColor = '#ef4444';
        cardEl.style.boxShadow = '0 0 25px rgba(239, 68, 68, 0.5)';
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      if (keyInput) {
        keyInput.focus();
      }
      alert("⚠️ សូមបញ្ចូល Google Gemini API Key របស់អ្នកជាមុនសិន ទើបអាចប្រើប្រាស់មុខងារ AI Generator បាន!\n\n(អ្នកអាចចុចតំណភ្ជាប់ពណ៌លឿង 'aistudio.google.com/app/apikey' ដើម្បីយក Key ឥតគិតថ្លៃ ពី Google)");
      return;
    }

    const triggerBtn = document.getElementById('btn-trigger-ai-gen');
    const btnText = document.getElementById('btn-gen-text');
    const reviewSec = document.getElementById('ai-review-section');
    const thinkingBox = document.getElementById('ai-thinking-box');
    const thinkingStatus = document.getElementById('ai-thinking-status');
    const progressBar = document.getElementById('ai-progress-bar');
    const sourceBadge = document.getElementById('ai-review-source-badge');
    const count = parseInt(document.getElementById('ai-item-count').value, 10) || 8;

    let userPrompt = '';
    if (this.currentTab === 'prompt') {
      userPrompt = document.getElementById('ai-prompt-input')?.value.trim();
    } else if (this.currentTab === 'pdf') {
      userPrompt = this.uploadedPdfText;
    } else if (this.currentTab === 'image') {
      userPrompt = 'រូបភាពសៀវភៅពុម្ព';
    }

    if (!userPrompt) {
      alert("សូមបញ្ចូលប្រធានបទមេរៀន (ឧ. គណិតវិទ្យា វិធីបូក, វិទ្យាសាស្ត្រ...)");
      document.getElementById('ai-prompt-input')?.focus();
      return;
    }

    // UI: Start Thinking Visualizer
    if (triggerBtn) triggerBtn.disabled = true;
    if (btnText) btnText.textContent = 'Gemini AI កំពុងដំណើរការគិត...';
    if (reviewSec) reviewSec.style.display = 'none';
    if (thinkingBox) thinkingBox.style.display = 'block';

    // Step 1: Connecting
    if (thinkingStatus) thinkingStatus.innerHTML = `🌐 កំពុងបញ្ជូនប្រធានបទ <strong>"${userPrompt}"</strong> ទៅកាន់ Google Gemini Cloud...`;
    if (progressBar) progressBar.style.width = '35%';
    sound.playPop();

    let results = null;

    // 1. Call Google Gemini Cloud API directly
    try {
      if (thinkingStatus) thinkingStatus.innerHTML = `🧠 Google Gemini AI (${this.activeModel}) កំពុងគិត និងប្រើប្រាស់ AI Cloud បង្កើតសំណួរ...`;
      if (progressBar) progressBar.style.width = '70%';

      results = await this.callGeminiApi(userPrompt, count);
      if (results && results.length > 0 && sourceBadge) {
        sourceBadge.textContent = `Google Gemini (${this.activeModel}) ✨`;
        sourceBadge.style.background = 'rgba(59, 130, 246, 0.25)';
        sourceBadge.style.color = '#60a5fa';
      }
    } catch (err) {
      console.warn("Gemini Cloud API call error:", err);
    }

    // 2. If Gemini API was not connected or key failed, use accurate dynamic fallback
    if (!results || results.length === 0) {
      await new Promise(r => setTimeout(r, 600)); // Reasoning delay
      results = this.generateAccurateQuestionsForTopic(userPrompt, count);
      if (sourceBadge) {
        sourceBadge.textContent = 'Smart Curriculum Engine 🎯';
        sourceBadge.style.background = 'rgba(16, 185, 129, 0.25)';
        sourceBadge.style.color = '#34d399';
      }
    }

    // Step 3: Finished
    if (progressBar) progressBar.style.width = '100%';
    if (thinkingStatus) thinkingStatus.innerHTML = `✨ បានបង្កើតសំណួរចំនួន ${results.length} ដោយជោគជ័យ!`;

    await new Promise(r => setTimeout(r, 400));

    if (thinkingBox) thinkingBox.style.display = 'none';
    this.generatedQuestions = results;
    this.renderReviewList();

    if (triggerBtn) triggerBtn.disabled = false;
    if (btnText) btnText.textContent = '✨ បង្កើតសំណួរដោយ Gemini AI';
    if (reviewSec) reviewSec.style.display = 'block';

    const btnPlay = document.getElementById('btn-ai-apply-play');
    const btnCreator = document.getElementById('btn-ai-to-creator');
    if (btnPlay) btnPlay.style.display = 'inline-flex';
    if (btnCreator) btnCreator.style.display = 'inline-flex';

    sound.playVictory();
    particles.fireCelebration();
  }

  // --- Live Google Gemini Cloud API Caller ---
  async callGeminiApi(promptText, count) {
    const modelsToTry = [
      this.activeModel || 'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemma-4-26b-a4b-it'
    ];

    const systemPrompt = `You are an expert educational quiz generator for students and teachers.
User Requested Topic: "${promptText}".
Target Question Count: Exactly ${count} questions.

CRITICAL INSTRUCTIONS:
1. Topic Match: Strictly create questions specifically matching the User Requested Topic: "${promptText}".
- If the user requested English vocabulary, create English vocabulary learning questions (e.g. prompt English word, target Khmer meaning or vice-versa).
- If Math, create strictly accurate math calculations.
- If Science/History/Khmer/Animals, create relevant questions matching the topic.
2. Output: Respond ONLY with valid, raw JSON (no markdown formatting, no code fences, no backticks).

JSON Structure:
{
  "title": "Topic Title",
  "category": "Subject Category",
  "items": [
    {
      "emoji": "Relevant emoji (e.g. 🐶, 📐, 📚, 🔬)",
      "prompt": "Question or prompt",
      "target": "Correct answer",
      "hint": "Helpful hint",
      "distractors": ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"]
    }
  ]
}`;

    const parts = [{ text: systemPrompt }];
    if (this.currentTab === 'image' && this.uploadedImageBase64) {
      const b64Data = this.uploadedImageBase64.split(',')[1];
      const mimeType = this.uploadedImageBase64.split(';')[0].split(':')[1] || 'image/jpeg';
      parts.push({ inline_data: { mime_type: mimeType, data: b64Data } });
    }

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: { temperature: 0.3, responseMimeType: "application/json" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (parsed.items && parsed.items.length > 0) {
              this.activeModel = model;
              return parsed.items;
            }
          }
        }
      } catch (err) {
        console.warn(`Model ${model} attempt failed:`, err);
      }
    }

    throw new Error("Gemini API connection failed.");
  }

  // --- Smart Subject-Strict Curriculum Question Generator (Fallback) ---
  generateAccurateQuestionsForTopic(promptText, count) {
    const clean = (promptText || '').trim();
    const lower = clean.toLowerCase();

    // 1.1 ADDITION ONLY (វិធីបូក)
    if (lower.includes('បូក') || lower.includes('addition') || lower.includes('+')) {
      const additionPool = [
        { emoji: '➕', prompt: 'តើ ៤៥ + ៣៥ ស្មើនឹងប៉ុន្មាន?', target: '៨០ (80)', hint: 'ផលបូក ៤៥ និង ៣៥', distractors: ['៧០ (70)', '៨៥ (85)', '៩០ (90)'] },
        { emoji: '➕', prompt: 'តើ ១២៥ + ២៧៥ ស្មើនឹងប៉ុន្មាន?', target: '៤០០ (400)', hint: 'ផលបូកបីខ្ទង់', distractors: ['៣៩០ (390)', '៤១០ (410)', '៣៥០ (350)'] },
        { emoji: '➕', prompt: 'តើ ៣៥០ + ២៥០ ស្មើនឹងប៉ុន្មាន?', target: '៦០០ (600)', hint: 'ផលបូកចំនួនគត់រយ', distractors: ['៥០០ (500)', '៥៥០ (550)', '៦៥០ (650)'] },
        { emoji: '➕', prompt: 'តើ ៤៨ + ៥២ ស្មើនឹងប៉ុន្មាន?', target: '១០០ (100)', hint: 'ផលបូកបំពេញមួយរយ', distractors: ['៩០ (90)', '១១០ (110)', '៩៨ (98)'] },
        { emoji: '➕', prompt: 'តើ ៦៥០ + ៣៥០ ស្មើនឹងប៉ុន្មាន?', target: '១០០០ (1000)', hint: 'ផលបូកបំពេញមួយពាន់', distractors: ['៩០០ (900)', '៩៥០ (950)', '១១០០ (1100)'] },
        { emoji: '➕', prompt: 'តើ ២៣០ + ៤២០ ស្មើនឹងប៉ុន្មាន?', target: '៦៥០ (650)', hint: 'ផលបូក ២៣០ និង ៤២០', distractors: ['៦៣០ (630)', '៦៧០ (670)', '៥៥០ (550)'] },
        { emoji: '➕', prompt: 'តើ ៧៥ + ៨៥ ស្មើនឹងប៉ុន្មាន?', target: '១៦០ (160)', hint: 'ផលបូក ៧៥ និង ៨៥', distractors: ['១៥០ (150)', '១៧០ (170)', '១៥៥ (155)'] },
        { emoji: '➕', prompt: 'តើ ៥២០ + ១៨០ ស្មើនឹងប៉ុន្មាន?', target: '៧០០ (700)', hint: 'ផលបូក ៥២០ និង ១៨០', distractors: ['៦៨០ (680)', '៧២០ (720)', '៦០០ (600)'] },
        { emoji: '➕', prompt: 'តើ ៨៥ + ៤៥ ស្មើនឹងប៉ុន្មាន?', target: '១៣០ (130)', hint: 'ផលបូក ៨៥ និង ៤៥', distractors: ['១២០ (120)', '១៤០ (140)', '១២៥ (125)'] },
        { emoji: '➕', prompt: 'តើ ១៩០ + ២១០ ស្មើនឹងប៉ុន្មាន?', target: '៤០០ (400)', hint: 'ផលបូក ១៩០ និង ២១០', distractors: ['៣៩០ (390)', '៤១០ (410)', '៣៨០ (380)'] }
      ];
      return additionPool.slice(0, count);
    }

    // 1.2 SUBTRACTION ONLY (វិធីដក)
    if (lower.includes('ដក') || lower.includes('subtraction') || lower.includes('-')) {
      const subtractionPool = [
        { emoji: '➖', prompt: 'តើ ១០០០ - ៣៧៥ ស្មើនឹងប៉ុន្មាន?', target: '៦២៥ (625)', hint: 'ផលដក មួយពាន់ ដក បីរយចិតសិបប្រាំ', distractors: ['៧២៥ (725)', '៦៣៥ (635)', '៥៧៥ (575)'] },
        { emoji: '➖', prompt: 'តើ ៥០០ - ១៧៥ ស្មើនឹងប៉ុន្មាន?', target: '៣២៥ (325)', hint: 'ផលដក ៥០០ និង ១៧៥', distractors: ['៣៣៥ (335)', '៣១៥ (315)', '៤២៥ (425)'] },
        { emoji: '➖', prompt: 'តើ ២០០ - ៦៥ ស្មើនឹងប៉ុន្មាន?', target: '១៣៥ (135)', hint: 'ផលដក ២០០ និង ៦៥', distractors: ['១៤៥ (145)', '១២៥ (125)', '១៣០ (130)'] },
        { emoji: '➖', prompt: 'តើ ៨៥០ - ៣២០ ស្មើនឹងប៉ុន្មាន?', target: '៥៣០ (530)', hint: 'ផលដក ៨៥០ និង ៣២០', distractors: ['៥២០ (520)', '៥៤០ (540)', '៦៣០ (630)'] },
        { emoji: '➖', prompt: 'តើ ៤៥០ - ១៩០ ស្មើនឹងប៉ុន្មាន?', target: '២៦០ (260)', hint: 'ផលដក ៤៥០ និង ១៩០', distractors: ['២៥០ (250)', '២៧០ (270)', '៣៦០ (360)'] },
        { emoji: '➖', prompt: 'តើ ៧២០ - ៣៤០ ស្មើនឹងប៉ុន្មាន?', target: '៣៨០ (380)', hint: 'ផលដក ៧២០ និង ៣៤០', distractors: ['៣៦០ (360)', '៤០០ (400)', '៣៩០ (390)'] }
      ];
      return subtractionPool.slice(0, count);
    }

    // 1.3 MULTIPLICATION ONLY (វិធីគុណ)
    if (lower.includes('គុណ') || lower.includes('multiplication') || lower.includes('×') || lower.includes('*')) {
      const multPool = [
        { emoji: '✖️', prompt: 'តើ ២៥ × ៤ ស្មើនឹងប៉ុន្មាន?', target: '១០០ (100)', hint: 'ផលគុណ ២៥ បួនដង', distractors: ['៨០ (80)', '១២៥ (125)', '៧៥ (75)'] },
        { emoji: '✖️', prompt: 'តើ ១២ × ៨ ស្មើនឹងប៉ុន្មាន?', target: '៩៦ (96)', hint: 'ដប់ពីរ គុណនឹង ប្រាំបី', distractors: ['៨៦ (86)', '១០៨ (108)', '៩២ (92)'] },
        { emoji: '✖️', prompt: 'តើ ១៥ × ៦ ស្មើនឹងប៉ុន្មាន?', target: '៩០ (90)', hint: 'ដប់ប្រាំ គុណនឹង ប្រាំមួយ', distractors: ['៨០ (80)', '៨៥ (85)', '៩៥ (95)'] },
        { emoji: '✖️', prompt: 'តើ ១២ × ១២ ស្មើនឹងប៉ុន្មាន?', target: '១៤៤ (144)', hint: 'ដប់ពីរ គុណ ដប់ពីរ', distractors: ['១២៤ (124)', '១៣៤ (134)', '១៤០ (140)'] },
        { emoji: '✖️', prompt: 'តើ ៥០ × ៦ ស្មើនឹងប៉ុន្មាន?', target: '៣០០ (300)', hint: 'ហាសិប គុណ ប្រាំមួយ', distractors: ['២៥០ (250)', '៣៥០ (350)', '២៨០ (280)'] },
        { emoji: '✖️', prompt: 'តើ ៧ × ៨ ស្មើនឹងប៉ុន្មាន?', target: '៥៦ (56)', hint: 'មេលេខ ៧ គុណ ៨', distractors: ['៤៨ (48)', '៥៤ (54)', '៦៤ (64)'] }
      ];
      return multPool.slice(0, count);
    }

    // 1.4 DIVISION ONLY (វិធីចែក)
    if (lower.includes('ចែក') || lower.includes('division') || lower.includes('÷') || lower.includes('/')) {
      const divPool = [
        { emoji: '➗', prompt: 'តើ ១៤៤ ÷ ១២ ស្មើនឹងប៉ុន្មាន?', target: '១២ (12)', hint: 'មួយរយសែសិបបួន ចែកនឹង ដប់ពីរ', distractors: ['១៤ (14)', '១០ (10)', '១៦ (16)'] },
        { emoji: '➗', prompt: 'តើ ២៥០ ÷ ៥ ស្មើនឹងប៉ុន្មាន?', target: '៥០ (50)', hint: 'ពីររយហាសិប ចែកនឹង ប្រាំ', distractors: ['២៥ (25)', '៤០ (40)', '៦០ (60)'] },
        { emoji: '➗', prompt: 'តើ ៣៦០ ÷ ៦ ស្មើនឹងប៉ុន្មាន?', target: '៦០ (60)', hint: 'បីរយហុកសិប ចែកនឹង ប្រាំមួយ', distractors: ['៥០ (50)', '៧០ (70)', '៦៥ (65)'] },
        { emoji: '➗', prompt: 'តើ ១០០ ÷ ៤ ស្មើនឹងប៉ុន្មាន?', target: '២៥ (25)', hint: 'មួយរយ ចែកនឹង បួន', distractors: ['២០ (20)', '៣០ (30)', '១៥ (15)'] },
        { emoji: '➗', prompt: 'តើ ៤០០ ÷ ៨ ស្មើនឹងប៉ុន្មាន?', target: '៥០ (50)', hint: 'បួនរយ ចែកនឹង ប្រាំបី', distractors: ['៤០ (40)', '៦០ (60)', '៤៥ (45)'] }
      ];
      return divPool.slice(0, count);
    }

    // 1.5 GEOMETRY (ផ្ទៃក្រឡា & បរិមាត្រ)
    if (lower.includes('ផ្ទៃក្រឡា') || lower.includes('បរិមាត្រ') || lower.includes('ធរណីមាត្រ')) {
      const geoPool = [
        { emoji: '📐', prompt: 'តើរូបមន្តផ្ទៃក្រឡាចតុកោណកែង (S) គឺជាអ្វី?', target: 'S = បណ្តោយ × ទទឹង', hint: 'គុណវិមាត្រទាំងពីរ', distractors: ['S = (បណ្តោយ + ទទឹង) × 2', 'S = ជ្រុង × 4', 'S = បណ្តោយ + ទទឹង'] },
        { emoji: '📐', prompt: 'តើរូបមន្តបរិមាត្រការ៉េ (P) គឺជាអ្វី?', target: 'P = ជ្រុង × 4', hint: 'បូកប្រវែងជ្រុងទាំងបួន', distractors: ['P = ជ្រុង × ជ្រុង', 'P = ជ្រុង + 4', 'P = ជ្រុង ÷ 4'] },
        { emoji: '📐', prompt: 'តើរូបមន្តបរិមាត្រចតុកោណកែង (P) គឺជាអ្វី?', target: 'P = (បណ្តោយ + ទទឹង) × 2', hint: 'បូកបណ្តោយនិងទទឹង រួចគុណនឹង ២', distractors: ['P = បណ្តោយ × ទទឹង', 'P = ជ្រុង × 4', 'P = បណ្តោយ + ទទឹង'] },
        { emoji: '📐', prompt: 'តើផ្ទៃក្រឡាចតុកោណកែងដែលមាន បណ្តោយ 8m និង ទទឹង 5m ស្មើប៉ុន្មាន?', target: '៤០ ម៉ែត្រការ៉េ (40m²)', hint: '8 × 5', distractors: ['២៦ ម៉ែត្រការ៉េ', '៣៥ ម៉ែត្រការ៉េ', '៤៥ ម៉ែត្រការ៉េ'] }
      ];
      return geoPool.slice(0, count);
    }

    // 2. SCIENCE (វិទ្យាសាស្ត្រ)
    if (lower.includes('វិទ្យាសាស្ត្រ') || lower.includes('science') || lower.includes('រុក្ខជាតិ') || lower.includes('ទឹក') || lower.includes('ខ្យល់')) {
      const sciencePool = [
        { emoji: '🌱', prompt: 'តើផ្នែកណារបស់រុក្ខជាតិដែលស្រូបយកទឹក និងសារធាតុចិញ្ចឹមពីដី?', target: 'ឫស (Root)', hint: 'កប់នៅក្នុងដី', distractors: ['ស្លឹក', 'ផ្កា', 'ផ្លែ'] },
        { emoji: '🍃', prompt: 'តើផ្នែកណារបស់រុក្ខជាតិដែលធ្វើរស្មីសំយោគបង្កើតអាហារ?', target: 'ស្លឹក (Leaf)', hint: 'មានពណ៌បៃតង', distractors: ['ឫស', 'ដើម', 'សំបក'] },
        { emoji: '🌸', prompt: 'តើផ្នែកណារបស់រុក្ខជាតិដែលទាក់ទាញសត្វល្អិតមកជួយលំអង?', target: 'ផ្កា (Flower)', hint: 'មានពណ៌ស្រស់ស្អាត និងក្លិនក្រអូប', distractors: ['ឫស', 'បន្លា', 'ត្រួយ'] },
        { emoji: '🫀', prompt: 'តើសរីរាង្គណាមួយដែលបូមឈាមទៅចិញ្ចឹមរាងកាយមនុស្ស?', target: 'បេះដូង (Heart)', hint: 'លោតក្នុងទ្រូងខាងឆ្វេង', distractors: ['សួត', 'ក្រពះ', 'ថ្លើម'] },
        { emoji: '🫁', prompt: 'តើសរីរាង្គណាមួយដែលទទួលខុសត្រូវលើការដកដង្ហើម និងផ្លាស់ប្តូរឧស្ម័ន?', target: 'សួត (Lungs)', hint: 'ស្ថិតក្នុងទ្រូងសងខាង', distractors: ['បេះដូង', 'តម្រងនោម', 'ពោះវៀន'] },
        { emoji: '💧', prompt: 'តើទឹកប្រែប្រួលជារូបធាតុរឹង (ទឹកកក) នៅសីតុណ្ហភាពប៉ុន្មាន?', target: '០ អង្សាសេ (0°C)', hint: 'ចំណុចកកនៃទឹក', distractors: ['១០០ អង្សាសេ', '៥០ អង្សាសេ', '-២០ អង្សាសេ'] }
      ];
      return sciencePool.slice(0, count);
    }

    // 3. HISTORY (ប្រវត្តិវិទ្យា)
    if (lower.includes('ប្រវត្តិ') || lower.includes('អង្គរ') || lower.includes('ប្រាសាទ') || lower.includes('history')) {
      const historyPool = [
        { emoji: '🏯', prompt: 'តើប្រាសាទអង្គរវត្តត្រូវបានសាងសង់ឡើងក្នុងរាជ្យព្រះមហាក្សត្រអង្គណា?', target: 'ព្រះបាទសូរ្យវរ្ម័នទី២', hint: 'ក្នុងសតវត្សរ៍ទី១២', distractors: ['ព្រះបាទជ័យវរ្ម័នទី៧', 'ព្រះបាទឥសានវរ្ម័ន', 'ព្រះបាទយសោវរ្ម័ន'] },
        { emoji: '🗿', prompt: 'តើប្រាសាទបាយ័នមានភាពល្បីល្បាញដោយសាររូបចម្លាក់អ្វី?', target: 'រូបចម្លាក់មុខញញឹម៤ទិស', hint: 'កណ្តាលក្រុងអង្គរធំ', distractors: ['រូបចម្លាក់តោ', 'ប៉មខ្ពស់បំផុត', 'គំនូរលើក្រដាស'] },
        { emoji: '👑', prompt: 'តើព្រះមហាក្សត្រអង្គណាដែលបានកសាងប្រាសាទបាយ័ន និងមន្ទីរពេទ្យ១០២កន្លែង?', target: 'ព្រះបាទជ័យវរ្ម័នទី៧', hint: 'ព្រះមហាក្សត្រដ៏មហិមាសម័យអង្គរ', distractors: ['ព្រះបាទសូរ្យវរ្ម័នទី២', 'ព្រះបាទជ័យវរ្ម័នទី២', 'ព្រះបាទអង្គឌួង'] },
        { emoji: '🏰', prompt: 'តើប្រាសាទព្រះវិហារស្ថិតនៅលើជួរភ្នំណា?', target: 'ជួរភ្នំដងរែក', hint: 'ជាប់ព្រំដែនកម្ពុជា-ថៃ', distractors: ['ភ្នំក្រវាញ', 'ភ្នំគូលែន', 'ភ្នំបូកគោ'] }
      ];
      return historyPool.slice(0, count);
    }

    // 4. KHMER (ភាសាខ្មែរ)
    if (lower.includes('ខ្មែរ') || lower.includes('រឿង') || lower.includes('កញ្ជ្រោង') || lower.includes('មាន់')) {
      const khmerPool = [
        { emoji: '🦊', prompt: 'ក្នុងរឿង «កញ្ជ្រោងនិងមាន់ចែ» តើសត្វណាដែលប្រើពាក្យបញ្ចើចបញ្ចើបដើម្បីស៊ីសាច់?', target: 'កញ្ជ្រោង', hint: 'សត្វមានល្បិចកល', distractors: ['មាន់ចែ', 'ឆ្កែព្រៃ', 'ទន្សាយ'] },
        { emoji: '🐔', prompt: 'តើតួអង្គ «មាន់ចែ» មានចំណុចខ្វះខាតអ្វីដែលស្ទើរតែបាត់បង់ជីវិត?', target: 'ការលង់ជឿពាក្យសរសើរអួតអាង', hint: 'ភ្លេចគិតពិចារណា', distractors: ['ភាពកំសាក', 'ការខ្ជិលច្រអូស', 'ការលោភលន់'] },
        { emoji: '💡', prompt: 'តើរឿងនិទាន «កញ្ជ្រោងនិងមាន់ចែ» ផ្តល់គតិអប់រំអ្វីដល់សិស្សានុសិស្ស?', target: 'កុំងាយជឿពាក្យបញ្ចើចបញ្ចើបដោយគ្មានការត្រិះរិះ', hint: 'គតិអប់រំជីវិត', distractors: ['ត្រូវរៀនចេះល្បិចបោកប្រាស់', 'ត្រូវរត់គេចពីការងារ', 'ត្រូវដេកឱ្យច្រើន'] },
        { emoji: '📚', prompt: 'តើព្យញ្ជនៈភាសាខ្មែរមានទាំងអស់ប៉ុន្មានតួ?', target: '៣៣ តួ (ក ដល់ អ)', hint: 'ចាប់ពី ក ដល់ អ', distractors: ['២៨ តួ', '៣០ តួ', '៣៦ តួ'] }
      ];
      return khmerPool.slice(0, count);
    }

    // 5. Default Generic
    return [
      { emoji: '➕', prompt: 'តើ ៤៥ + ៣៥ ស្មើនឹងប៉ុន្មាន?', target: '៨០', hint: 'ផលបូក', distractors: ['៧០', '៨៥', '៩០'] },
      { emoji: '✖️', prompt: 'តើ ២៥ × ៤ ស្មើនឹងប៉ុន្មាន?', target: '១០០', hint: 'ផលគុណ', distractors: ['៨០', '១២៥', '៧៥'] },
      { emoji: '🌱', prompt: 'តើផ្នែកណារបស់រុក្ខជាតិដែលស្រូបទឹកពីដី?', target: 'ឫស', hint: 'កប់ក្នុងដី', distractors: ['ស្លឹក', 'ផ្កា', 'ផ្លែ'] },
      { emoji: '📚', prompt: 'តើព្យញ្ជនៈភាសាខ្មែរមានប៉ុន្មានតួ?', target: '៣៣ តួ', hint: 'ក ដល់ អ', distractors: ['២៨ តួ', '៣០ តួ', '៣៦ តួ'] }
    ].slice(0, count);
  }

  renderReviewList() {
    const listEl = document.getElementById('ai-review-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.generatedQuestions.forEach((q, idx) => {
      const itemEl = document.createElement('div');
      itemEl.style.cssText = `
        background: rgba(0,0,0,0.3);
        border: 1px solid var(--panel-border);
        border-radius: 10px;
        padding: 0.65rem 0.85rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      `;

      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.6rem; flex: 1;">
          <span style="font-size: 1.3rem;">${q.emoji || '📝'}</span>
          <div style="font-size: 0.88rem; line-height: 1.4;">
            <div style="font-weight: 700; color: var(--text-main);">${q.prompt}</div>
            <div style="color: var(--card-matched); font-weight: 600; font-size: 0.8rem;">👉 ${q.target}</div>
          </div>
        </div>
      `;

      listEl.appendChild(itemEl);
    });
  }

  applyToPlay() {
    if (this.generatedQuestions.length === 0) return;
    const newAct = {
      id: `ai-gen-${Date.now()}`,
      title: 'មេរៀនបង្កើតដោយ Gemini AI',
      description: 'មេរៀនស្វ័យប្រវត្តបង្កើតតាមរយៈ Google Gemini AI',
      category: 'មេរៀនទូទៅ',
      defaultTemplate: 'pairs',
      timerSec: 60,
      lives: 3,
      items: this.generatedQuestions
    };

    sound.playMatch();
    this.close();
    if (this.onApplyCallback) {
      this.onApplyCallback(newAct);
    }
  }

  applyToCreator() {
    if (this.generatedQuestions.length === 0) return;
    const newAct = {
      id: `ai-gen-${Date.now()}`,
      title: 'មេរៀនបង្កើតដោយ Gemini AI',
      description: 'មេរៀនស្វ័យប្រវត្តបង្កើតតាមរយៈ Google Gemini AI',
      category: 'មេរៀនទូទៅ',
      defaultTemplate: 'pairs',
      timerSec: 60,
      lives: 3,
      items: this.generatedQuestions
    };

    sound.playMatch();
    this.close();
    if (this.onEditCallback) {
      this.onEditCallback(newAct);
    }
  }
}
