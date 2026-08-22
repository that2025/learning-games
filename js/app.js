/* ==========================================================================
   Main Application Controller & Engine Orchestrator
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Orchestrates 7 game engines, navbar actions, modal lifecycles, and i18n
   ========================================================================== */

import { dataManager, SAMPLE_ACTIVITIES } from './data.js';
import { sound } from './audio.js';
import { particles } from './particles.js';
import { i18n } from './i18n.js';

// Game Engines
import { MatchingPairsGame } from './games/pairs.js';
import { MatchUpGame } from './games/match.js';
import { QuizGame } from './games/quiz.js';
import { OpenBoxGame } from './games/box.js';
import { RandomWheelGame } from './games/wheel.js';
import { WordSearchGame } from './games/wordsearch.js';
import { WhackGame } from './games/whack.js';

// Components & Modals
import { CreatorStudioModal } from './components/creator.js';
import { WhackCreatorModal } from './components/whack_creator.js';
import { ActivityManagerModal } from './components/activity_manager.js';
import { AiGeneratorModal } from './components/ai_generator.js';
import { ScorecardModal } from './components/leaderboard.js';

class AppController {
  constructor() {
    this.currentActivity = null;
    this.whackActivity = this.loadWhackActivity();
    this.currentTemplate = 'pairs';
    this.currentTheme = localStorage.getItem('otpg_theme') || 'jungle';
    this.activeGameInstance = null;

    // Component Modals
    this.creatorModal = null;
    this.whackCreatorModal = null;
    this.managerModal = null;
    this.aiModal = null;
    this.scorecardModal = null;
  }

  loadWhackActivity() {
    try {
      const saved = localStorage.getItem('otpg_whack_custom_activity');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {
      id: 'whack_isolated_activity',
      title: { km: 'ល្បែងវាយសត្វកណ្តុរ', en: 'Whack-a-Mole' },
      description: { km: 'ល្បែងវាយកណ្តុរអន្តរកម្ម', en: 'Interactive Whack-a-Mole' },
      category: { km: 'វាយកណ្តុរ', en: 'Whack-a-Mole' },
      defaultTemplate: 'whack',
      moleSpeed: 1300,
      lives: 3,
      timerSec: 60,
      items: [] // 0 questions by default
    };
  }

  init() {
    // 1. Initialize Particles
    particles.init();

    // 2. Set Theme & Language
    this.applyTheme(this.currentTheme);
    i18n.updateDOM();

    // 3. Load initial activity
    const allActivities = dataManager.getAllActivities();
    this.currentActivity = allActivities[0] || SAMPLE_ACTIVITIES[0];
    this.currentTemplate = this.currentActivity.defaultTemplate || 'pairs';

    // 4. Initialize Modals
    this.initModals();

    // 5. Bind Navbar & Toolbar Events
    this.bindDOMEvents();

    // 6. Populate Activity Selector Dropdown
    this.populateActivityDropdown();

    // 7. Mount Initial Game Engine
    this.loadGame(this.currentTemplate);
  }

  initModals() {
    this.creatorModal = new CreatorStudioModal((savedAct) => {
      this.currentActivity = savedAct;
      this.populateActivityDropdown();
      this.loadGame(this.currentTemplate);
    });

    this.whackCreatorModal = new WhackCreatorModal((savedAct) => {
      this.whackActivity = savedAct;
      try {
        localStorage.setItem('otpg_whack_custom_activity', JSON.stringify(savedAct));
      } catch (e) {}
      this.currentTemplate = 'whack';
      this.loadGame('whack');
    });

    this.managerModal = new ActivityManagerModal(
      (selectedAct) => {
        this.currentActivity = selectedAct;
        this.currentTemplate = selectedAct.defaultTemplate || 'pairs';
        this.populateActivityDropdown();
        this.loadGame(this.currentTemplate);
      },
      (editAct) => {
        if (editAct.defaultTemplate === 'whack') {
          this.whackCreatorModal.open(this.whackActivity);
        } else {
          this.creatorModal.open(editAct);
        }
      }
    );

    this.aiModal = new AiGeneratorModal(
      (aiAct) => {
        const saved = dataManager.saveActivity(aiAct);
        this.currentActivity = saved;
        this.populateActivityDropdown();
        this.loadGame(this.currentTemplate);
      },
      (aiAct) => {
        if (this.currentTemplate === 'whack') {
          this.whackCreatorModal.open(this.whackActivity);
        } else {
          this.creatorModal.open(aiAct);
        }
      }
    );

    this.scorecardModal = new ScorecardModal(
      () => this.restartCurrentGame(),
      () => this.managerModal.open()
    );

    // Custom Event from Whack game
    document.addEventListener('open-whack-creator', () => {
      this.whackCreatorModal.open(this.whackActivity);
    });
  }

  bindDOMEvents() {
    // Language Toggle
    const btnLang = document.getElementById('btn-toggle-lang');
    if (btnLang) {
      this.updateLangButtonLabel(btnLang);
      btnLang.addEventListener('click', () => {
        sound.playPop();
        const newLang = i18n.toggleLang();
        this.updateLangButtonLabel(btnLang);
        this.updateArenaHeader();
        this.populateActivityDropdown();
      });
    }

    // Theme Selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = this.currentTheme;
      themeSelect.addEventListener('change', (e) => {
        this.applyTheme(e.target.value);
        sound.playPop();
      });
    }

    // Sound Toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      this.updateSoundButtonLabel(btnSound);
      btnSound.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        this.updateSoundButtonLabel(btnSound);
        if (!isMuted) sound.playPop();
      });
    }

    // Fullscreen Toggle
    const btnFullscreen = document.getElementById('btn-toggle-fullscreen');
    btnFullscreen?.addEventListener('click', () => {
      sound.playPop();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });

    // Navbar Quick Activity Select Dropdown
    const actSelect = document.getElementById('activity-select');
    actSelect?.addEventListener('change', (e) => {
      sound.playPop();
      const act = dataManager.getActivityById(e.target.value);
      if (act) {
        this.currentActivity = act;
        this.loadGame(this.currentTemplate);
      }
    });

    // Open Activity Manager Button
    document.getElementById('btn-open-activity-manager')?.addEventListener('click', () => {
      sound.playPop();
      this.managerModal.open();
    });

    // Top CTA: AI Generator
    document.getElementById('btn-nav-ai-gen')?.addEventListener('click', () => {
      sound.playPop();
      this.aiModal.open();
    });

    // Top CTA: Edit
    document.getElementById('btn-nav-edit-act')?.addEventListener('click', () => {
      sound.playPop();
      if (this.currentTemplate === 'whack') {
        this.whackCreatorModal.open(this.whackActivity);
      } else {
        this.creatorModal.open(this.currentActivity);
      }
    });

    // Top CTA: Create New
    document.getElementById('btn-nav-create-act')?.addEventListener('click', () => {
      sound.playPop();
      if (this.currentTemplate === 'whack') {
        this.whackCreatorModal.open(null);
      } else {
        this.creatorModal.open(null);
      }
    });

    // Save File to PC (Export JSON)
    const exportFile = () => this.exportCurrentActivityToFile();
    document.getElementById('btn-nav-export-file')?.addEventListener('click', exportFile);
    document.getElementById('tb-btn-export-file')?.addEventListener('click', exportFile);

    // Open / Import File from PC (Import JSON)
    const navFileInput = document.getElementById('nav-file-import-json');
    const triggerImport = () => navFileInput?.click();
    document.getElementById('btn-nav-import-file')?.addEventListener('click', triggerImport);
    document.getElementById('tb-btn-import-file')?.addEventListener('click', triggerImport);
    navFileInput?.addEventListener('change', (e) => this.handleImportFile(e));

    // Template Switcher Bar Buttons
    document.querySelectorAll('.template-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tmpl = btn.dataset.template;
        if (tmpl && tmpl !== this.currentTemplate) {
          sound.playPop();
          this.loadGame(tmpl);
        }
      });
    });

    // In-Game Action Bar (Bottom Toolbar)
    document.getElementById('tb-btn-ai')?.addEventListener('click', () => {
      sound.playPop();
      this.aiModal.open();
    });

    document.getElementById('tb-btn-edit')?.addEventListener('click', () => {
      sound.playPop();
      if (this.currentTemplate === 'whack') {
        this.whackCreatorModal.open(this.whackActivity);
      } else {
        this.creatorModal.open(this.currentActivity);
      }
    });

    document.getElementById('tb-btn-duplicate')?.addEventListener('click', () => {
      sound.playMatch();
      const dup = dataManager.duplicateActivity(this.currentActivity.id);
      if (dup) {
        this.currentActivity = dup;
        this.populateActivityDropdown();
        this.loadGame(this.currentTemplate);
      }
    });

    document.getElementById('tb-btn-delete')?.addEventListener('click', () => {
      if (confirm(i18n.t('confirmDeleteSingle'))) {
        sound.playWrong();
        dataManager.deleteActivity(this.currentActivity.id);
        const remaining = dataManager.getAllActivities();
        this.currentActivity = remaining[0] || SAMPLE_ACTIVITIES[0];
        this.populateActivityDropdown();
        this.loadGame(this.currentTemplate);
      }
    });

    document.getElementById('tb-btn-shuffle')?.addEventListener('click', () => {
      sound.playPop();
      this.restartCurrentGame(true);
    });

    document.getElementById('tb-btn-restart')?.addEventListener('click', () => {
      sound.playPop();
      this.restartCurrentGame(false);
    });

    // Reshuffle from HUD
    document.getElementById('btn-hud-reshuffle')?.addEventListener('click', () => {
      sound.playPop();
      this.restartCurrentGame(true);
    });

    // Listen for custom activity list events
    window.addEventListener('activitylistchanged', () => {
      this.populateActivityDropdown();
    });
  }

  applyTheme(themeName) {
    this.currentTheme = themeName;
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('otpg_theme', themeName);
    const select = document.getElementById('theme-select');
    if (select) select.value = themeName;
  }

  updateLangButtonLabel(btn) {
    if (!btn) return;
    const current = i18n.getLang();
    btn.innerHTML = current === 'km' ? '🇰🇭 ភាសាខ្មែរ' : '🇬🇧 English';
  }

  updateSoundButtonLabel(btn) {
    if (!btn) return;
    btn.innerHTML = sound.isMuted() ? '🔇' : '🔊';
    btn.setAttribute('title', sound.isMuted() ? i18n.t('soundOff') : i18n.t('soundOn'));
  }

  populateActivityDropdown() {
    const select = document.getElementById('activity-select');
    if (!select) return;
    select.innerHTML = '';

    const all = dataManager.getAllActivities();
    all.forEach(act => {
      const opt = document.createElement('option');
      opt.value = act.id;
      const title = typeof act.title === 'object' ? (act.title[i18n.getLang()] || act.title.km) : act.title;
      opt.textContent = `${act.isSample ? '⭐' : '✏️'} ${title}`;
      if (this.currentActivity && act.id === this.currentActivity.id) {
        opt.selected = true;
      }
      select.appendChild(opt);
    });

    this.updateArenaHeader();
  }

  updateArenaHeader() {
    if (!this.currentActivity) return;

    const titleEl = document.getElementById('arena-act-title');
    const descEl = document.getElementById('arena-act-desc');
    const catBadge = document.getElementById('arena-cat-badge');
    const countBadge = document.getElementById('arena-items-badge');
    const deleteBtn = document.getElementById('tb-btn-delete');
    const hudReshuffleBtn = document.getElementById('btn-hud-reshuffle');

    if (this.currentTemplate === 'wheel') {
      const isKm = i18n.getLang() === 'km';
      if (titleEl) titleEl.textContent = isKm ? '🎡 កង់វិលចាប់ឈ្មោះសិស្ស & ចែកក្រុម' : '🎡 Classroom Student Name Picker & Team Divider';
      if (descEl) descEl.textContent = isKm ? 'បង្វិលចាប់ឈ្មោះសិស្សដោយចៃដន្យ នាំចូលពី Excel/CSV និងបែងចែកក្រុមសិស្ស' : 'Randomly pick student names, import from Excel/CSV, and divide classroom teams';
      if (catBadge) catBadge.textContent = isKm ? '👥 ឧបករណ៍ថ្នាក់រៀន (Classroom Tool)' : '👥 Classroom Tool';
      
      const roster = JSON.parse(localStorage.getItem('otpg_student_roster') || '[]');
      const count = roster.length || 12;
      if (countBadge) countBadge.textContent = isKm ? `${count} នាក់ (Students)` : `${count} Students`;
      if (hudReshuffleBtn) hudReshuffleBtn.style.display = 'none';
      if (deleteBtn) deleteBtn.style.display = 'none';
      return;
    }

    if (this.currentTemplate === 'whack') {
      const isKm = i18n.getLang() === 'km';
      const whackTitle = typeof this.whackActivity.title === 'object' 
        ? (this.whackActivity.title[i18n.getLang()] || this.whackActivity.title.km) 
        : this.whackActivity.title;
      const whackDesc = typeof this.whackActivity.description === 'object'
        ? (this.whackActivity.description[i18n.getLang()] || this.whackActivity.description.km)
        : this.whackActivity.description;

      if (titleEl) titleEl.textContent = `🐹 ${whackTitle || 'ល្បែងវាយសត្វកណ្តុរ (Whack-a-Mole)'}`;
      if (descEl) descEl.textContent = whackDesc || (isKm ? 'វាយតែកណ្តុរដែលកាន់ចម្លើយត្រឹមត្រូវ (ហាមវាយកណ្តុរដែលកាន់ចម្លើយខុស)' : 'Hit only moles holding correct answers');
      if (catBadge) catBadge.textContent = isKm ? '🐹 វាយកណ្តុរ (Whack-a-Mole)' : '🐹 Whack-a-Mole';
      
      const count = this.whackActivity.items ? this.whackActivity.items.length : 0;
      if (countBadge) countBadge.textContent = `${count} សំណួរ`;
      if (hudReshuffleBtn) hudReshuffleBtn.style.display = 'none';
      if (deleteBtn) deleteBtn.style.display = 'none';
      return;
    }

    if (hudReshuffleBtn) hudReshuffleBtn.style.display = 'inline-flex';

    const title = typeof this.currentActivity.title === 'object' 
      ? (this.currentActivity.title[i18n.getLang()] || this.currentActivity.title.km) 
      : this.currentActivity.title;

    const desc = typeof this.currentActivity.description === 'object'
      ? (this.currentActivity.description[i18n.getLang()] || this.currentActivity.description.km)
      : this.currentActivity.description;

    const cat = typeof this.currentActivity.category === 'object'
      ? (this.currentActivity.category[i18n.getLang()] || this.currentActivity.category.km)
      : (this.currentActivity.category || 'ទូទៅ');

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (catBadge) catBadge.textContent = cat;
    if (countBadge) {
      const count = this.currentActivity.items ? this.currentActivity.items.length : 0;
      countBadge.textContent = `${count} ${i18n.t('itemsCountBadge') || 'ធាតុ'}`;
    }

    // Hide or show delete button depending on whether activity is custom
    if (deleteBtn) {
      deleteBtn.style.display = this.currentActivity.isSample ? 'none' : 'inline-flex';
    }
  }

  loadGame(templateType) {
    this.currentTemplate = templateType;

    // Update active tab button in templates bar
    document.querySelectorAll('.template-card-btn').forEach(btn => {
      if (btn.dataset.template === templateType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Destroy active game engine if running
    if (this.activeGameInstance) {
      this.activeGameInstance.destroy();
      this.activeGameInstance = null;
    }

    const arenaStage = document.getElementById('arena-stage-container');
    if (!arenaStage) return;
    arenaStage.innerHTML = '';

    // Instantiate appropriate game engine
    switch (templateType) {
      case 'pairs':
        this.activeGameInstance = new MatchingPairsGame();
        break;
      case 'match':
        this.activeGameInstance = new MatchUpGame();
        break;
      case 'quiz':
        this.activeGameInstance = new QuizGame();
        break;
      case 'box':
        this.activeGameInstance = new OpenBoxGame();
        break;
      case 'wheel':
        this.activeGameInstance = new RandomWheelGame();
        break;
      case 'wordsearch':
        this.activeGameInstance = new WordSearchGame();
        break;
      case 'whack':
        this.activeGameInstance = new WhackGame();
        break;
      default:
        this.activeGameInstance = new MatchingPairsGame();
        break;
    }

    // Mount engine with appropriate activity (isolated whackActivity for whack, currentActivity for others)
    const targetActivity = (templateType === 'whack') ? this.whackActivity : this.currentActivity;
    this.activeGameInstance.mount(arenaStage, targetActivity, (results) => {
      this.handleGameCompletion(results);
    });

    this.updateArenaHeader();
  }

  restartCurrentGame(forceShuffle = false) {
    if (this.currentTemplate === 'whack') {
      if (forceShuffle && this.whackActivity) {
        this.whackActivity.shuffle = true;
      }
    } else {
      if (forceShuffle && this.currentActivity) {
        this.currentActivity.shuffle = true;
      }
    }
    this.loadGame(this.currentTemplate);
  }

  exportCurrentActivityToFile() {
    const actToExport = (this.currentTemplate === 'whack') ? this.whackActivity : this.currentActivity;
    if (!actToExport) return;

    const rawTitle = typeof actToExport.title === 'object' 
      ? (actToExport.title.km || actToExport.title.en || 'មេរៀន') 
      : (actToExport.title || 'មេរៀន');

    const cleanTitle = rawTitle.replace(/\s+/g, '_').replace(/[\\/:*?"<>|]/g, '');

    const exportData = {
      id: actToExport.id || `custom-${Date.now()}`,
      title: actToExport.title,
      description: actToExport.description || '',
      category: actToExport.category || 'ទូទៅ',
      defaultTemplate: actToExport.defaultTemplate || this.currentTemplate || 'pairs',
      timerSec: actToExport.timerSec || 60,
      lives: actToExport.lives || 3,
      moleSpeed: actToExport.moleSpeed || 1300,
      shuffle: true,
      items: actToExport.items || []
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanTitle}_outapruk.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    sound.playMatch();
    particles.fireConfetti();
    alert(`✅ បានទាញយកឯកសារ "${cleanTitle}_outapruk.json" ទុកក្នុងកុំព្យូទ័រដោយជោគជ័យ!\n(Saved to your computer)`);
  }

  handleImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);

        if (!imported || (!imported.items && !imported.title)) {
          throw new Error("ទម្រង់ឯកសារមិនត្រឹមត្រូវ (Invalid lesson format)");
        }

        // Ensure proper ID
        imported.id = imported.id || `imported-${Date.now()}`;
        imported.isSample = false;

        const saved = dataManager.saveActivity(imported);
        this.currentActivity = saved;
        this.populateActivityDropdown();

        // Switch to the imported activity's preferred template or current template
        const targetTmpl = saved.defaultTemplate || this.currentTemplate || 'pairs';
        this.loadGame(targetTmpl);

        sound.playVictory();
        particles.fireCelebration();

        const title = typeof saved.title === 'object' ? (saved.title.km || saved.title.en) : saved.title;
        alert(`✅ បានបើកឯកសារមេរៀន "${title}" ដោយជោគជ័យ!\n(Lesson loaded and ready to play)`);
      } catch (err) {
        sound.playWrong();
        alert(`❌ កំហុសក្នុងការអានឯកសារ JSON: ${err.message}`);
      }

      // Reset file input so same file can be re-imported if needed
      e.target.value = '';
    };

    reader.readAsText(file);
  }

  handleGameCompletion(results) {
    if (this.scorecardModal) {
      this.scorecardModal.show(results);
    }
  }
}

// Bootstrap on DOM ready or immediately if already loaded
function startApp() {
  if (window.__APP_INITIALIZED__) return;
  window.__APP_INITIALIZED__ = true;
  try {
    const app = new AppController();
    app.init();
    window.__APP__ = app;
  } catch (err) {
    console.error("AppController initialization error:", err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
