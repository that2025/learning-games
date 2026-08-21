/* ==========================================================================
   🎡 Classroom Student Name Picker & Team Divider Engine (កង់វិលចាប់ឈ្មោះសិស្ស)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated Student Name Picker, Excel/CSV Roster Import, Adjustable Spin Timer, Random Team Divider
   ========================================================================== */

import { sound } from '../audio.js';
import { particles } from '../particles.js';
import { i18n } from '../i18n.js';

export class RandomWheelGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.canvas = null;
    this.ctx = null;
    this.students = [];
    this.eliminatedStudents = new Set();
    this.angle = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.animId = null;
    this.lastRatchetAngle = 0;
    this.spinDuration = 5; // default 5 seconds
    this.autoEliminate = false;
    this.currentTab = 'wheel'; // 'wheel' | 'groups'
    this.groupCount = 3;

    this.colors = [
      '#ef4444', '#f59e0b', '#10b981', '#06b6d4', 
      '#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', 
      '#f97316', '#84cc16', '#3b82f6', '#e11d48'
    ];

    this.teamMascots = [
      { name: 'ក្រុមខ្លា (Tiger)', emoji: '🐯', color: '#f59e0b' },
      { name: 'ក្រុមដំរី (Elephant)', emoji: '🐘', color: '#3b82f6' },
      { name: 'ក្រុមតោ (Lion)', emoji: '🦁', color: '#ef4444' },
      { name: 'ក្រុមឥន្ទ្រី (Eagle)', emoji: '🦅', color: '#10b981' },
      { name: 'ក្រុមនាគ (Dragon)', emoji: '🐉', color: '#8b5cf6' },
      { name: 'ក្រុមតារា (Star)', emoji: '⭐', color: '#ec4899' },
      { name: 'ក្រុមរន្ទះ (Lightning)', emoji: '⚡', color: '#06b6d4' },
      { name: 'ក្រុមផ្សោត (Dolphin)', emoji: '🐬', color: '#14b8a6' }
    ];
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.loadSavedRoster();
    this.initGame();
  }

  loadSavedRoster() {
    try {
      const saved = localStorage.getItem('otpg_student_roster');
      if (saved) {
        this.students = JSON.parse(saved);
      } else {
        // Default Cambodian student roster
        this.students = [
          "សុខា", "ដារ៉ា", "ចិន្តា", "វិបុល",
          "ចាន់ណា", "សីហា", "រដ្ឋា", "ពិសិដ្ឋ",
          "សុផល", "វណ្ណា", "ចរិយា", "កុសល"
        ];
      }
    } catch (e) {
      this.students = ["សុខា", "ដារ៉ា", "ចិន្តា", "វិបុល", "ចាន់ណា", "សីហា"];
    }
  }

  saveRoster() {
    try {
      localStorage.setItem('otpg_student_roster', JSON.stringify(this.students));
    } catch (e) {
      console.error("Save roster error:", e);
    }
  }

  initGame() {
    this.container.innerHTML = '';
    this.eliminatedStudents.clear();
    this.isSpinning = false;
    this.angle = 0;
    this.angularVelocity = 0;

    this.render();
    this.setupCanvas();
    this.drawWheel();
    this.updateRosterUI();
  }

  render() {
    const arena = document.createElement('div');
    arena.className = 'wheel-classroom-layout';
    arena.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 1.5rem;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      align-items: start;
    `;

    arena.innerHTML = `
      <!-- Left Side: Wheel & Group Views -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; width: 100%;">
        <!-- Mode Switcher Tabs (Wheel vs Group Divider) -->
        <div class="modal-tabs" style="width: 100%; justify-content: center; margin-bottom: 0.5rem;">
          <button class="modal-tab-btn active" id="btn-tab-wheel-mode">
            <span>🎡</span> <span data-i18n="tabWheel">${i18n.t('tabWheel')}</span>
          </button>
          <button class="modal-tab-btn" id="btn-tab-group-mode">
            <span>👥</span> <span data-i18n="tabGroups">${i18n.t('tabGroups')}</span>
          </button>
        </div>

        <!-- Mode 1: Student Picker Wheel Stage -->
        <div id="wheel-stage-pane" style="display: flex; flex-direction: column; align-items: center; gap: 1.25rem; width: 100%;">
          <div class="wheel-canvas-wrapper" style="width: 420px; height: 420px; position: relative;">
            <div class="wheel-pointer" id="wheel-pointer"></div>
            <canvas id="wheel-canvas" width="700" height="700" style="width: 100%; height: 100%; border-radius: 50%;"></canvas>
          </div>

          <button class="btn-spin-wheel" id="btn-spin-wheel" style="font-size: 1.25rem; padding: 0.85rem 3rem;">
            <span>🎡</span>
            <span id="btn-spin-text">បង្វិលចាប់ឈ្មោះ (Spin)</span>
          </button>
        </div>

        <!-- Mode 2: Random Team Divider Stage -->
        <div id="groups-stage-pane" style="display: none; width: 100%; flex-direction: column; gap: 1.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.75rem 1rem; flex-wrap: wrap; gap: 0.75rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <label class="form-label" style="margin: 0;" data-i18n="groupCountLabel">${i18n.t('groupCountLabel')}</label>
              <select class="form-select" id="select-group-count" style="padding: 0.35rem 0.75rem;">
                <option value="2">2 ក្រុម (2 Teams)</option>
                <option value="3" selected>3 ក្រុម (3 Teams)</option>
                <option value="4">4 ក្រុម (4 Teams)</option>
                <option value="5">5 ក្រុម (5 Teams)</option>
                <option value="6">6 ក្រុម (6 Teams)</option>
                <option value="8">8 ក្រុម (8 Teams)</option>
              </select>
            </div>

            <div style="display: flex; gap: 0.5rem;">
              <button class="nav-btn btn-ai" id="btn-do-generate-groups">
                <span>🎲</span> ${i18n.t('btnGenerateGroups')}
              </button>
              <button class="nav-btn" id="btn-copy-groups">
                <span>📋</span> ${i18n.t('btnCopyGroups')}
              </button>
            </div>
          </div>

          <!-- Team Cards Grid -->
          <div id="teams-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem;">
            <!-- Rendered team cards -->
          </div>
        </div>
      </div>

      <!-- Right Side: Classroom Roster & Settings Sidebar -->
      <div class="wordsearch-sidebar" style="padding: 1.25rem; gap: 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="font-size: 1rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 0.4rem;">
            <span>👨‍🎓</span>
            <span data-i18n="rosterTitle">${i18n.t('rosterTitle')}</span>
          </div>
          <span id="wheel-student-count-badge" class="arena-badge">0 នាក់</span>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted);" data-i18n="rosterSubtitle">
          ${i18n.t('rosterSubtitle')}
        </div>

        <!-- Roster Textarea -->
        <textarea class="form-textarea" id="wheel-roster-textarea" style="min-height: 200px; font-size: 0.95rem; line-height: 1.6; font-family: inherit; resize: vertical;" placeholder="${i18n.t('rosterPlaceholder')}"></textarea>

        <!-- Roster Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          <input type="file" id="wheel-excel-file" accept=".xlsx, .xls, .csv, .txt" style="display: none;" />
          <button class="nav-btn btn-create" id="btn-trigger-excel-import" style="width: 100%; justify-content: center;">
            ${i18n.t('btnImportExcel')}
          </button>
          <div style="display: flex; gap: 0.5rem;">
            <button class="nav-btn" id="btn-wheel-shuffle-roster" style="flex: 1; justify-content: center;">
              ${i18n.t('btnShuffleNames')}
            </button>
            <button class="nav-btn btn-danger" id="btn-wheel-clear-roster" style="flex: 1; justify-content: center;">
              ${i18n.t('btnClearNames')}
            </button>
          </div>
        </div>

        <!-- Wheel Settings -->
        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 10px; padding: 0.85rem; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <label class="form-label" style="margin: 0;" data-i18n="spinDurationLabel">${i18n.t('spinDurationLabel')}</label>
            <span id="spin-duration-val" style="font-weight: 700; color: var(--accent-secondary);">5s</span>
          </div>
          <input type="range" id="wheel-duration-slider" min="2" max="15" value="5" step="1" style="cursor: pointer;" />

          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-main); cursor: pointer;">
            <input type="checkbox" id="wheel-auto-eliminate-chk" style="width: 16px; height: 16px; cursor: pointer;" />
            <span data-i18n="autoEliminateLabel">${i18n.t('autoEliminateLabel')}</span>
          </label>
        </div>
      </div>
    `;

    this.container.appendChild(arena);
    this.bindEvents();
  }

  setupCanvas() {
    this.canvas = document.getElementById('wheel-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
  }

  bindEvents() {
    // Mode Switcher Tabs
    const tabWheel = document.getElementById('btn-tab-wheel-mode');
    const tabGroups = document.getElementById('btn-tab-group-mode');
    const paneWheel = document.getElementById('wheel-stage-pane');
    const paneGroups = document.getElementById('groups-stage-pane');

    tabWheel?.addEventListener('click', () => {
      sound.playPop();
      tabWheel.classList.add('active');
      tabGroups.classList.remove('active');
      paneWheel.style.display = 'flex';
      paneGroups.style.display = 'none';
      this.currentTab = 'wheel';
    });

    tabGroups?.addEventListener('click', () => {
      sound.playPop();
      tabGroups.classList.add('active');
      tabWheel.classList.remove('active');
      paneWheel.style.display = 'none';
      paneGroups.style.display = 'flex';
      this.currentTab = 'groups';
      this.generateTeams();
    });

    // Spin Button
    document.getElementById('btn-spin-wheel')?.addEventListener('click', () => this.spin());

    // Roster Textarea Live Update
    const textarea = document.getElementById('wheel-roster-textarea');
    textarea?.addEventListener('input', (e) => {
      this.parseRosterFromText(e.target.value);
    });

    // Shuffle Names
    document.getElementById('btn-wheel-shuffle-roster')?.addEventListener('click', () => {
      sound.playPop();
      this.students = this.shuffleArray(this.students);
      this.saveRoster();
      this.updateRosterUI();
      this.drawWheel();
    });

    // Clear Names
    document.getElementById('btn-wheel-clear-roster')?.addEventListener('click', () => {
      if (confirm("តើអ្នកពិតជាចង់សម្អាតបញ្ជីឈ្មោះសិស្សមែនទេ? (Clear all student names?)")) {
        sound.playWrong();
        this.students = [];
        this.eliminatedStudents.clear();
        this.saveRoster();
        this.updateRosterUI();
        this.drawWheel();
      }
    });

    // Excel / CSV File Import
    const fileInput = document.getElementById('wheel-excel-file');
    document.getElementById('btn-trigger-excel-import')?.addEventListener('click', () => fileInput?.click());
    fileInput?.addEventListener('change', (e) => this.handleExcelFileImport(e));

    // Spin Duration Slider
    const slider = document.getElementById('wheel-duration-slider');
    const durVal = document.getElementById('spin-duration-val');
    slider?.addEventListener('input', (e) => {
      this.spinDuration = parseInt(e.target.value, 10);
      if (durVal) durVal.textContent = `${this.spinDuration}s`;
    });

    // Auto Eliminate Checkbox
    const chk = document.getElementById('wheel-auto-eliminate-chk');
    chk?.addEventListener('change', (e) => {
      this.autoEliminate = e.target.checked;
    });

    // Group Divider Actions
    const selectGroup = document.getElementById('select-group-count');
    selectGroup?.addEventListener('change', (e) => {
      this.groupCount = parseInt(e.target.value, 10);
      this.generateTeams();
    });

    document.getElementById('btn-do-generate-groups')?.addEventListener('click', () => {
      sound.playPop();
      this.generateTeams();
    });

    document.getElementById('btn-copy-groups')?.addEventListener('click', () => this.copyTeamsToClipboard());
  }

  parseRosterFromText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    this.students = lines;
    this.saveRoster();
    this.updateStudentCountBadge();
    this.drawWheel();
  }

  updateRosterUI() {
    const textarea = document.getElementById('wheel-roster-textarea');
    if (textarea) {
      textarea.value = this.students.join('\n');
    }
    this.updateStudentCountBadge();
  }

  updateStudentCountBadge() {
    const badge = document.getElementById('wheel-student-count-badge');
    const active = this.getActiveStudents();
    if (badge) {
      badge.textContent = `${active.length} / ${this.students.length} នាក់`;
    }
  }

  handleExcelFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const isText = file.name.endsWith('.txt') || file.name.endsWith('.csv');

    if (isText) {
      reader.onload = (evt) => {
        const text = evt.target.result;
        this.parseRosterFromText(text);
        this.updateRosterUI();
        sound.playMatch();
        particles.fireConfetti();
      };
      reader.readAsText(file);
    } else {
      // Use SheetJS for .xlsx / .xls
      reader.onload = (evt) => {
        try {
          if (typeof window.XLSX === 'undefined') {
            alert("SheetJS XLSX library is still loading. Please try again in a moment.");
            return;
          }
          const data = new Uint8Array(evt.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

          const extractedNames = [];
          rows.forEach(row => {
            if (Array.isArray(row)) {
              row.forEach(cell => {
                if (cell && typeof cell === 'string' && cell.trim().length > 0) {
                  // Skip headers like "No", "ID", "Name"
                  const lower = cell.trim().toLowerCase();
                  if (!['no', 'id', 'name', 'ឈ្មោះ', 'ល.រ', 'gender', 'sex', 'ថ្នាក់'].includes(lower)) {
                    extractedNames.push(cell.trim());
                  }
                }
              });
            }
          });

          if (extractedNames.length > 0) {
            this.students = extractedNames;
            this.eliminatedStudents.clear();
            this.saveRoster();
            this.updateRosterUI();
            this.drawWheel();
            sound.playMatch();
            particles.fireCelebration();
          } else {
            alert("មិនអាចទាញយកឈ្មោះពី Excel បានទេ សូមពិនិត្យឯកសារ (No student names found in file)");
          }
        } catch (err) {
          alert(`កំហុសក្នុងការអាន Excel: ${err.message}`);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  getActiveStudents() {
    return this.students.filter(s => !this.eliminatedStudents.has(s));
  }

  drawWheel() {
    if (!this.ctx || !this.canvas) return;
    const active = this.getActiveStudents();
    const numSectors = active.length;
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 18;

    ctx.clearRect(0, 0, width, height);

    if (numSectors === 0) {
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px "Kantumruy Pro", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('សូមបញ្ចូលឈ្មោះសិស្ស (Add Students)', centerX, centerY);
      return;
    }

    const arc = (Math.PI * 2) / numSectors;

    for (let i = 0; i < numSectors; i++) {
      const startAngle = this.angle + i * arc;
      const endAngle = startAngle + arc;
      const studentName = active[i];
      const sectorColor = this.colors[i % this.colors.length];

      // Sector slice
      ctx.beginPath();
      ctx.fillStyle = sectorColor;
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fill();

      // Border separator line
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Student Name Label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';

      // Dynamic font size according to sector count
      let fontSize = 24;
      if (numSectors > 24) fontSize = 14;
      else if (numSectors > 16) fontSize = 17;
      else if (numSectors > 10) fontSize = 20;

      ctx.font = `bold ${fontSize}px "Kantumruy Pro", "Plus Jakarta Sans", sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.85)';
      ctx.shadowBlur = 6;

      const truncated = studentName.length > 16 ? studentName.substring(0, 14) + '...' : studentName;
      ctx.fillText(truncated, radius - 25, 0);
      ctx.restore();
    }

    // Outer Golden Rim with sparkling light rivets
    ctx.beginPath();
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#fbbf24';
    ctx.arc(centerX, centerY, radius + 7, 0, Math.PI * 2);
    ctx.stroke();

    // Golden Rivets around the rim
    const rivetCount = Math.max(12, numSectors);
    for (let r = 0; r < rivetCount; r++) {
      const rAngle = (Math.PI * 2 / rivetCount) * r;
      const rx = centerX + Math.cos(rAngle) * (radius + 7);
      const ry = centerY + Math.sin(rAngle) * (radius + 7);
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center Golden Hub Button
    ctx.beginPath();
    ctx.fillStyle = '#0f172a';
    ctx.arc(centerX, centerY, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', centerX, centerY);
  }

  spin() {
    if (this.isSpinning) return;
    const active = this.getActiveStudents();
    if (active.length === 0) {
      alert("សូមបញ្ចូលឈ្មោះសិស្សក្នុងបញ្ជីជាមុនសិន (Please add student names first)");
      return;
    }

    this.isSpinning = true;
    const spinBtn = document.getElementById('btn-spin-wheel');
    const spinText = document.getElementById('btn-spin-text');
    if (spinBtn) spinBtn.disabled = true;
    if (spinText) spinText.textContent = 'កំពុងបង្វិល...';

    // Calculate initial speed & friction based on spinDuration (seconds)
    const targetFrames = this.spinDuration * 60;
    this.friction = Math.pow(0.005, 1 / targetFrames); // Deceleration curve
    this.angularVelocity = Math.random() * 0.2 + 0.45; // Initial burst
    this.lastRatchetAngle = this.angle;

    this.loop();
  }

  loop() {
    const active = this.getActiveStudents();
    const arc = (Math.PI * 2) / Math.max(1, active.length);

    this.angle += this.angularVelocity;
    this.angularVelocity *= (this.friction || 0.988);

    // Ratchet sound tick & pointer wobble
    if (Math.abs(this.angle - this.lastRatchetAngle) >= arc) {
      sound.playRatchet();
      this.lastRatchetAngle = this.angle;

      const pointer = document.getElementById('wheel-pointer');
      if (pointer) {
        pointer.classList.add('ratchet-wobble');
        setTimeout(() => pointer.classList.remove('ratchet-wobble'), 50);
      }
    }

    this.drawWheel();

    if (this.angularVelocity > 0.0015) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.angularVelocity = 0;
      this.isSpinning = false;
      this.animId = null;

      const spinBtn = document.getElementById('btn-spin-wheel');
      const spinText = document.getElementById('btn-spin-text');
      if (spinBtn) spinBtn.disabled = false;
      if (spinText) spinText.textContent = 'បង្វិលចាប់ឈ្មោះ (Spin)';

      this.handleWinnerAnnounce();
    }
  }

  handleWinnerAnnounce() {
    const active = this.getActiveStudents();
    if (active.length === 0) return;

    // Pointer is at top 12 o'clock (3 * PI / 2)
    const normalizedAngle = (Math.PI * 2 - (this.angle % (Math.PI * 2)) + (3 * Math.PI) / 2) % (Math.PI * 2);
    const arc = (Math.PI * 2) / active.length;
    const winningIndex = Math.floor(normalizedAngle / arc) % active.length;
    const winnerName = active[winningIndex];

    sound.playVictory();
    particles.fireCelebration();

    if (this.autoEliminate) {
      this.eliminatedStudents.add(winnerName);
      this.updateStudentCountBadge();
    }

    this.showWinnerModal(winnerName);
  }

  showWinnerModal(winnerName) {
    const modalWrap = document.createElement('div');
    modalWrap.className = 'modal-overlay active';
    modalWrap.style.zIndex = '1200';

    modalWrap.innerHTML = `
      <div class="modal-window" style="max-width: 520px; text-align: center;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>🎉</span>
            <span class="modal-title">លទ្ធផលចាប់ឈ្មោះសិស្ស</span>
          </div>
          <button class="modal-close-btn" id="btn-close-wheel-modal">&times;</button>
        </div>
        <div class="modal-body" style="padding: 2.5rem 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="font-size: 3.5rem; animation: bounce 1s infinite alternate;">🏆</div>
          <div style="font-size: 0.95rem; color: var(--text-muted);" data-i18n="winnerStudentTitle">
            ${i18n.t('winnerStudentTitle')}
          </div>
          <div style="background: linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(16,185,129,0.2) 100%); border: 2px solid var(--accent-primary); border-radius: 16px; padding: 1.25rem 2.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%;">
            <div style="font-size: 2.2rem; font-weight: 800; color: #fef08a; text-shadow: 0 2px 10px rgba(0,0,0,0.6);">
              ${winnerName}
            </div>
          </div>
        </div>
        <div class="modal-footer" style="justify-content: space-between;">
          <button class="nav-btn btn-danger" id="btn-modal-eliminate-name">
            🗑️ ${i18n.t('btnEliminateWinner')}
          </button>
          <button class="nav-btn btn-create" id="btn-modal-spin-next">
            🎡 ${i18n.t('btnSpinNext')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    const closeModal = () => modalWrap.remove();

    modalWrap.querySelector('#btn-close-wheel-modal')?.addEventListener('click', closeModal);

    modalWrap.querySelector('#btn-modal-spin-next')?.addEventListener('click', () => {
      closeModal();
      this.drawWheel();
      this.updateStudentCountBadge();
      setTimeout(() => this.spin(), 300);
    });

    modalWrap.querySelector('#btn-modal-eliminate-name')?.addEventListener('click', () => {
      this.eliminatedStudents.add(winnerName);
      sound.playWrong();
      closeModal();
      this.drawWheel();
      this.updateStudentCountBadge();
    });
  }

  // --- Random Team / Group Divider Engine ---
  generateTeams() {
    const container = document.getElementById('teams-cards-grid');
    if (!container) return;
    container.innerHTML = '';

    const list = this.shuffleArray([...this.students]);
    if (list.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">សូមបញ្ចូលឈ្មោះសិស្សជាមុនសិន</div>`;
      return;
    }

    const numGroups = Math.min(this.groupCount, list.length);
    const groups = Array.from({ length: numGroups }, () => []);

    // Distribute students evenly
    list.forEach((student, idx) => {
      groups[idx % numGroups].push(student);
    });

    this.currentGeneratedGroups = groups;

    groups.forEach((members, gIdx) => {
      const mascot = this.teamMascots[gIdx % this.teamMascots.length];
      const card = document.createElement('div');
      card.style.cssText = `
        background: rgba(0,0,0,0.3);
        border: 2px solid ${mascot.color};
        border-radius: 14px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
        animation: slide-up 0.3s ease;
      `;

      card.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.4rem;">
          <div style="display: flex; align-items: center; gap: 0.4rem; font-weight: 800; font-size: 1.05rem; color: ${mascot.color};">
            <span style="font-size: 1.4rem;">${mascot.emoji}</span>
            <span>${mascot.name}</span>
          </div>
          <span class="arena-badge" style="font-size: 0.75rem;">${members.length} នាក់</span>
        </div>

        <ol style="padding-left: 1.25rem; margin: 0; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.95rem; font-weight: 600; color: var(--text-main);">
          ${members.map(m => `<li>${m}</li>`).join('')}
        </ol>
      `;

      container.appendChild(card);
    });

    sound.playPop();
  }

  copyTeamsToClipboard() {
    if (!this.currentGeneratedGroups) return;
    let text = `📋 បញ្ជីបែងចែកក្រុមសិស្ស (Ou Ta Pruk Classroom Teams)\n\n`;

    this.currentGeneratedGroups.forEach((members, gIdx) => {
      const mascot = this.teamMascots[gIdx % this.teamMascots.length];
      text += `${mascot.emoji} ${mascot.name} (${members.length} នាក់):\n`;
      members.forEach((m, idx) => {
        text += `  ${idx + 1}. ${m}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      sound.playMatch();
      alert("✅ បានចម្លងបញ្ជីក្រុមទាំងអស់ទៅក្នុង Clipboard ដោយជោគជ័យ!");
    }).catch(() => {
      alert("ចម្លងមិនបានសម្រេច");
    });
  }

  shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}
