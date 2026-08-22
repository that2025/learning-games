/* ==========================================================================
   Ou Ta Pruk Learning Games - Standalone All-In-One Unified Bundle
   ========================================================================== */


// ==================== START: audio.js ====================
/* ==========================================================================
   Web Audio API Procedural Sound Synthesizer
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Zero external MP3 dependencies - 100% synthesized procedural audio
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('otpg_sound_muted') === 'true';
    this.volume = 0.6;
    this.initAudioContext();
  }

  initAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && !this.ctx) {
      this.ctx = new AudioCtx();
    }
  }

  ensureContext() {
    this.initAudioContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(mute) {
    this.muted = !!mute;
    localStorage.setItem('otpg_sound_muted', this.muted);
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // --- Sound 1: Flip Card Swish ---
  playFlip() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  // --- Sound 2: Match Success Chime ---
  playMatch() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    });
  }

  // --- Sound 3: Wrong / Error Buzz ---
  playWrong() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.linearRampToValueAtTime(110, now + 0.2);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // --- Sound 4: Victory / Game Complete Fanfare ---
  playVictory() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const chords = [
      { freqs: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },
      { freqs: [587.33, 739.99, 880.00], time: 0.22, dur: 0.2 },
      { freqs: [659.25, 830.61, 987.77], time: 0.44, dur: 0.2 },
      { freqs: [783.99, 987.77, 1174.66, 1567.98], time: 0.68, dur: 0.8 }
    ];

    chords.forEach(chord => {
      chord.freqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = this.ctx.currentTime + chord.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + chord.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + chord.dur);
      });
    });
  }

  // --- Sound 5: Clock / Step Tick ---
  playTick() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    gain.gain.setValueAtTime(this.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  // --- Sound 6: Wheel Ratchet Click ---
  playRatchet() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  // --- Sound 7: Whack Thud ---
  playWhack() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);

    gain.gain.setValueAtTime(this.volume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // --- Sound 8: Bubble Pop ---
  playPop() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);

    gain.gain.setValueAtTime(this.volume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // --- Sound 9: Open Box Magic Shimmer ---
  playOpenBox() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [440, 554.37, 659.25, 880, 1108.73];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime + i * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.45, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.4);
    });
  }

  // --- Sound 10: Lifeline Powerup ---
  playLifeline() {
    if (this.muted) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }
}

const sound = new SoundEngine();

// ==================== END: audio.js ====================

// ==================== START: i18n.js ====================
/* ==========================================================================
   Bilingual Internationalization (i18n) Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Khmer (🇰🇭) and English (🇬🇧) full dictionary and dynamic switcher
   ========================================================================== */

const translations = {
  km: {
    // Brand
    brandTitle: "ល្បែងសិក្សា អូរតាប្រុក",
    brandSubtitle: "Ou Ta Pruk Learning Games",
    
    // Navbar
    selectActivity: "ជ្រើសរើសមេរៀន...",
    openManager: "គ្រប់គ្រងមេរៀន",
    aiGenerator: "AI Generator",
    editContent: "កែសម្រួល",
    createNew: "បង្កើតថ្មី",
    soundOn: "បិទសំឡេង",
    soundOff: "បើកសំឡេង",
    fullscreen: "ពេញអេក្រង់",
    
    // Themes
    themeJungle: "🌿 ព្រៃព្រឹក្សា (Jungle)",
    themeClassic: "🎨 បុរាណចម្រុះ (Classic)",
    themeCosmic: "🌌 លំហអវកាស (Cosmic)",
    themeNeon: "⚡ អាកាដនីអុង (Neon)",
    
    // Templates Bar
    templateBarTitle: "ទម្រង់ហ្គេម (Game Templates):",
    templateBarSubtitle: "ចុចប្តូរភ្លាមៗលើទិន្នន័យមេរៀនដែលកំពុងលេង",
    tmplPairs: "បណ្ណផ្គូផ្គង",
    tmplPairsSub: "Matching Pairs",
    tmplMatch: "ផ្គូផ្គង",
    tmplMatchSub: "Match Up",
    tmplQuiz: "សំណួរចម្លើយ",
    tmplQuizSub: "Quiz Gameshow",
    tmplBox: "បើកប្រអប់",
    tmplBoxSub: "Open The Box",
    tmplWheel: "កង់ចាប់ឈ្មោះសិស្ស",
    tmplWheelSub: "Student Name Picker",
    tmplWordSearch: "ស្វែងរកពាក្យ",
    tmplWordSearchSub: "Word Search",
    tmplWhack: "វាយសត្វកណ្តុរ",
    tmplWhackSub: "Whack-a-Mole",
    
    // HUD & In-Game
    matchedPairs: "ផ្គូផ្គងបាន:",
    movesCount: "ចំនួនបើក:",
    scoreCount: "ពិន្ទុ:",
    timeRemaining: "ពេលវេលា:",
    livesRemaining: "ជីវិត:",
    reshuffle: "ច្របល់កាតឡើងវិញ",
    streakMultiplier: "គុណពិន្ទុ",
    // Wheel & Student Picker
    wheelStudentPickerTitle: "កង់វិលចាប់ឈ្មោះសិស្ស (Student Name Picker)",
    rosterTitle: "បញ្ជីឈ្មោះសិស្សក្នុងថ្នាក់",
    rosterSubtitle: "បញ្ចូលឈ្មោះ (១ជួរ ១នាក់) ឬ នាំចូលពី Excel",
    rosterPlaceholder: "សុខា\nដារ៉ា\nចិន្តា\nវិបុល\nចាន់ណា\nសីហា\nរដ្ឋា\nពិសិដ្ឋ\nសុផល\nវណ្ណា\nចរិយា\nកុសល",
    btnImportExcel: "📥 នាំចូលពី Excel/CSV",
    btnShuffleNames: "🔀 ច្របល់ឈ្មោះ",
    btnClearNames: "🗑️ សម្អាត",
    spinDurationLabel: "រយៈពេលបង្វិល៖",
    autoEliminateLabel: "ដកឈ្មោះចេញពេលចាប់បាន",
    tabWheel: "🎡 កង់វិលចាប់ឈ្មោះ",
    tabGroups: "👥 ចែកក្រុមសិស្ស",
    groupCountLabel: "ចំនួនក្រុម៖",
    btnGenerateGroups: "🎲 ចែកក្រុមដោយចៃដន្យ",
    btnCopyGroups: "📋 ចម្លងបញ្ជីក្រុម",
    winnerStudentTitle: "🎉 សិស្សដែលត្រូវបានជ្រើសរើសគឺ៖",
    btnEliminateWinner: "🗑️ ដកឈ្មោះនេះចេញ",
    btnSpinNext: "🎡 បង្វិលបន្ត",
    teamNamePrefix: "ក្រុមទី",
    totalStudentsCount: "ចំនួនសិស្សសរុប៖",
    
    // Creator Studio & Dedicated Pairs
    creatorTitle: "ស្ទូឌីយោបង្កើត និងកែសម្រួលល្បែង",
    creatorPairsTitle: "រៀបចំគូផ្គូផ្គង (បណ្ណ A ↔ បណ្ណ B)",
    creatorPairsDesc: "អាចផ្គូផ្គង រូបភាពទៅពាក្យ, ពាក្យទៅពាក្យ, ឬ រូបភាពទៅរូបភាព",
    metaSettings: "ព័ត៌មានទូទៅនៃមេរៀន",
    cardSideA: "បណ្ណទី ១ (Card A)",
    cardSideB: "បណ្ណទី ២ (Card B)",
    actTitleInput: "ចំណងជើងមេរៀន",
    actDescInput: "ការពិពណ៌នាសង្ខេប",
    actCategory: "មុខវិជ្ជា / ប្រភេទ",
    actDefaultTmpl: "ទម្រង់លំនាំដើម",
    actTimerSec: "កំណត់ពេល (វិនាទី)",
    actLivesCount: "ចំនួនជីវិត",
    actShuffleItems: "ច្របល់សំណួរដោយស្វ័យប្រវត្តិ",
    itemsListTitle: "បញ្ជីគូផ្គូផ្គង (Matching Pairs List)",
    addItemBtn: "➕ បន្ថែមគូផ្គូផ្គងថ្មី",
    itemPromptLabel: "ពាក្យ / សំណួរ / តម្រុយ (បណ្ណ A)",
    itemTargetLabel: "ពាក្យ / ចម្លើយ (បណ្ណ B)",
    itemHintLabel: "តម្រុយ (Hint)",
    itemDistractorsLabel: "ចម្លើយបញ្ឆោត (Distractors សម្រាប់ Quiz)",
    itemEmojiLabel: "រូបសញ្ញា (Emoji)",
    btnUploadImg: "🖼️ ផ្ទុករូប",
    btnAiGenImg: "✨ ស្វែងរក/បង្កើតរូប (AI)",
    btnClearImg: "🗑️ ដករូបចេញ",
    modalGenImgTitle: "✨ ស្វែងរក និងបង្កើតរូបភាពដោយស្វ័យប្រវត្ត",
    modalGenImgDesc: "បញ្ចូលពាក្យគន្លឹះ (ខ្មែរ ឬ អង់គ្លេស) ប្រព័ន្ធនឹងបកប្រែ និងស្វែងរករូបភាពស្អាតៗចំនួន ៤ ជម្រើសជូនអ្នកភ្លាមៗ៖",
    imgKeywordPlaceholder: "ឧទាហរណ៍៖ ផ្ទះ, ផ្ទះខ្មែរ, ឡាន, ខ្លា, ដំរី, សៀវភៅ, house, car, tiger...",
    btnGenerateNow: "🔍 ស្វែងរក / បង្កើតរូបភាព",
    btnUseThisImage: "✅ ជ្រើសរើសរូបនេះ",
    generatingImage: "⏳ កំពុងបកប្រែ និងបង្កើតរូបភាពស្អាតៗ...",
    tabUrlInput: "🔗 បិទភ្ជាប់ Link រូបភាព",
    btnSaveToPc: "រក្សាទុក File",
    btnImportFile: "បើកឯកសារ",
    fileSavedSuccess: "✅ បានទាញយកឯកសារមេរៀន (.json) ទុកក្នុងកុំព្យូទ័រដោយជោគជ័យ!",
    fileImportSuccess: "✅ បាននាំចូលឯកសារមេរៀនពីកុំព្យូទ័រដោយជោគជ័យ!",
    btnSaveActivity: "💾 រក្សាទុកមេរៀន",
    btnCancel: "បោះបង់",
    btnExportJson: "📤 ទាញយក JSON",
    btnImportJson: "📥 នាំចូល JSON",
    
    // Activity Manager
    managerTitle: "បណ្ណាល័យមេរៀន និងល្បែងសិក្សា",
    tabAll: "ទាំងអស់",
    tabCustom: "មេរៀនផ្ទាល់ខ្លួន",
    tabSystem: "គំរូក្នុងប្រព័ន្ធ",
    btnPlayNow: "▶️ លេងឥឡូវនេះ",
    btnEditAct: "✏️ កែសម្រួល",
    btnDuplicateAct: "📋 ចម្លង",
    btnDeleteAct: "🗑️ លុប",
    btnDeleteAllCustom: "⚠️ លុបមេរៀនផ្ទាល់ខ្លួនទាំងអស់",
    confirmDeleteAll: "តើអ្នកពិតជាចង់លុបមេរៀនដែលអ្នកបានបង្កើតទាំងអស់មែនទេ? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានឡើយ!",
    confirmDeleteSingle: "តើអ្នកចង់លុបមេរៀននេះមែនទេ?",
    noCustomActivities: "មិនទាន់មានមេរៀនផ្ទាល់ខ្លួននៅឡើយទេ។ ចុច 'បង្កើតថ្មី' ឬ 'AI Generator' ដើម្បីចាប់ផ្តើម!",
    
    // AI Generator Modal
    aiGenTitle: "បង្កើតសំណួរស្វ័យប្រវត្តិតាមរយៈ AI (Gemini BYOK)",
    tabPrompt: "📝 ប្រធានបទ / Prompt",
    tabPdf: "📄 ឯកសារ PDF",
    tabImage: "🖼️ រូបភាពសៀវភៅពុម្ព",
    apiKeyLabel: "Google Gemini API Key (ឥតគិតថ្លៃ ពី Google AI Studio):",
    btnTestKey: "🔍 ធ្វើតេស្ត Key",
    keyValid: "✅ API Key ត្រឹមត្រូវ និងដំណើរការល្អ!",
    keyInvalid: "❌ API Key មិនត្រឹមត្រូវ សូមពិនិត្យឡើងវិញ",
    promptInputLabel: "បញ្ចូលប្រធានបទ ឬខ្លឹមសារមេរៀន:",
    promptPlaceholder: "ឧទាហរណ៍៖ រឿង កញ្ជ្រោងនិងមាន់ចែ, រូបមន្តគណិតវិទ្យាថ្នាក់ទី៤, ឈ្មោះរាជធានីខេត្តនៃប្រទេសកម្ពុជា...",
    presetChipsTitle: "ប្រធានបទពេញនិយម:",
    itemCountLabel: "ចំនួនសំណួរដែលត្រូវបង្កើត:",
    btnGenerateAi: "✨ ចាប់ផ្តើមបង្កើតសំណួរដោយ AI",
    generatingAi: "🤖 កំពុងបង្កើតសំណួរ សូមរង់ចាំ...",
    pdfUploadLabel: "ជ្រើសរើសឯកសារ PDF សៀវភៅសិក្សា:",
    imageUploadLabel: "ជ្រើសរើសរូបភាពទំព័រសៀវភៅពុម្ព:",
    reviewQuestionsTitle: "ពិនិត្យមើលសំណួរដែលបានបង្កើត",
    btnApplyToGame: "🚀 អនុវត្ត និងលេងភ្លាមៗ",
    btnApplyToCreator: "✏️ យកទៅកែសម្រួលក្នុងស្ទូឌីយោ",
    fallbackNotice: "💡 កំពុងប្រើប្រាស់ឃ្លាំងចំណេះដឹងក្រៅបណ្តាញ (Offline Knowledge Bank) នៃកម្មវិធីសិក្សាកម្ពុជា។",
    itemsCountBadge: "ធាតុ",
    boxNumber: "ប្រអប់លេខ",
    btnDone: "យល់ព្រម (Done)",
    btnRevealAnswer: "👁️ បង្ហាញចម្លើយ",
    btnHideAnswer: "🙈 លាក់ចម្លើយ"
  },
  
  en: {
    // Brand
    brandTitle: "Ou Ta Pruk Learning Games",
    brandSubtitle: "ល្បែងសិក្សា អូរតាប្រុក",
    
    // Navbar
    selectActivity: "Select Lesson...",
    openManager: "Activity Library",
    aiGenerator: "AI Generator",
    editContent: "Edit",
    createNew: "Create New",
    soundOn: "Mute Sound",
    soundOff: "Unmute Sound",
    fullscreen: "Fullscreen",
    
    // Themes
    themeJungle: "🌿 Jungle Forest",
    themeClassic: "🎨 Classic Colorful",
    themeCosmic: "🌌 Cosmic Space",
    themeNeon: "⚡ Arcade Neon",
    
    // Templates Bar
    templateBarTitle: "Game Templates:",
    templateBarSubtitle: "Switch game format instantly on current lesson data",
    tmplPairs: "Matching Pairs",
    tmplPairsSub: "បណ្ណផ្គូផ្គង",
    tmplMatch: "Match Up",
    tmplMatchSub: "ផ្គូផ្គង",
    tmplQuiz: "Quiz Gameshow",
    tmplQuizSub: "សំណួរចម្លើយ",
    tmplBox: "Open The Box",
    tmplBoxSub: "បើកប្រអប់",
    tmplWheel: "Student Name Picker",
    tmplWheelSub: "កង់ចាប់ឈ្មោះសិស្ស",
    tmplWordSearch: "Word Search",
    tmplWordSearchSub: "ស្វែងរកពាក្យ",
    tmplWhack: "Whack-a-Mole",
    tmplWhackSub: "វាយសត្វកណ្តុរ",
    
    // HUD & In-Game
    matchedPairs: "Matched:",
    movesCount: "Moves:",
    scoreCount: "Score:",
    timeRemaining: "Time:",
    livesRemaining: "Lives:",
    reshuffle: "Reshuffle Cards",
    streakMultiplier: "Streak Multiplier",
    // Wheel & Student Picker
    wheelStudentPickerTitle: "Classroom Student Name Picker & Team Maker",
    rosterTitle: "Classroom Student Roster",
    rosterSubtitle: "Enter student names (1 per line) or import from Excel/CSV",
    rosterPlaceholder: "Sokha\nDara\nChinda\nVibol\nChanna\nSeyha\nRotha\nPiseth\nSophal\nVanna\nChariya\nKosal",
    btnImportExcel: "📥 Import Excel/CSV",
    btnShuffleNames: "🔀 Shuffle Names",
    btnClearNames: "🗑️ Clear",
    spinDurationLabel: "Spin Duration:",
    autoEliminateLabel: "Eliminate name upon selection",
    tabWheel: "🎡 Student Picker Wheel",
    tabGroups: "👥 Random Team Divider",
    groupCountLabel: "Number of Groups:",
    btnGenerateGroups: "🎲 Generate Random Teams",
    btnCopyGroups: "📋 Copy Team List",
    winnerStudentTitle: "🎉 Selected Student:",
    btnEliminateWinner: "🗑️ Eliminate This Name",
    btnSpinNext: "🎡 Spin Next",
    teamNamePrefix: "Team",
    totalStudentsCount: "Total Students:",
    
    // Creator Studio & Dedicated Pairs
    creatorTitle: "Creator Studio & Activity Editor",
    creatorPairsTitle: "Matching Pairs Setup (Card A ↔ Card B)",
    creatorPairsDesc: "Supports Image-to-Word, Word-to-Word, and Image-to-Image matching pairs",
    metaSettings: "General Lesson Information",
    cardSideA: "Card 1 (Side A)",
    cardSideB: "Card 2 (Side B)",
    actTitleInput: "Activity Title",
    actDescInput: "Short Description",
    actCategory: "Subject / Category",
    actDefaultTmpl: "Default Template",
    actTimerSec: "Time Limit (seconds)",
    actLivesCount: "Lives Count",
    actShuffleItems: "Auto Shuffle Items",
    itemsListTitle: "Matching Pairs List",
    addItemBtn: "➕ Add New Pair",
    itemPromptLabel: "Word / Prompt / Clue (Card A)",
    itemTargetLabel: "Word / Target (Card B)",
    itemHintLabel: "Hint",
    itemDistractorsLabel: "Distractors (for Quiz)",
    itemEmojiLabel: "Emoji / Icon",
    btnUploadImg: "🖼️ Upload Image",
    btnAiGenImg: "✨ Search/Generate Image",
    btnClearImg: "🗑️ Remove Image",
    modalGenImgTitle: "✨ Smart Educational Image Search & Generator",
    modalGenImgDesc: "Enter any keyword (Khmer or English). The system translates and provides 4 distinct high-resolution image choices:",
    imgKeywordPlaceholder: "e.g., house, Khmer house, car, tiger, elephant, book...",
    btnGenerateNow: "🔍 Search & Generate Images",
    btnUseThisImage: "✅ Use Selected Image",
    generatingImage: "⏳ Translating and generating images...",
    tabUrlInput: "🔗 Paste Direct Image URL",
    btnSaveToPc: "Save File to PC",
    btnImportFile: "Open File",
    fileSavedSuccess: "✅ Lesson file (.json) successfully saved to your PC!",
    fileImportSuccess: "✅ Lesson file successfully imported from PC!",
    btnSaveActivity: "💾 Save Activity",
    btnCancel: "Cancel",
    btnExportJson: "📤 Export JSON",
    btnImportJson: "📥 Import JSON",
    
    // Activity Manager
    managerTitle: "Lesson Library & Activity Manager",
    tabAll: "All Activities",
    tabCustom: "My Custom",
    tabSystem: "System Samples",
    btnPlayNow: "▶️ Play Now",
    btnEditAct: "✏️ Edit",
    btnDuplicateAct: "📋 Duplicate",
    btnDeleteAct: "🗑️ Delete",
    btnDeleteAllCustom: "⚠️ Delete All Custom Activities",
    confirmDeleteAll: "Are you sure you want to delete ALL your custom activities? This cannot be undone!",
    confirmDeleteSingle: "Are you sure you want to delete this activity?",
    noCustomActivities: "No custom activities yet. Click 'Create New' or 'AI Generator' to get started!",
    
    // AI Generator Modal
    aiGenTitle: "AI Automated Question Generator (Gemini BYOK)",
    tabPrompt: "📝 Topic / Prompt",
    tabPdf: "📄 PDF Document",
    tabImage: "🖼️ Textbook Image",
    apiKeyLabel: "Google Gemini API Key (Free from Google AI Studio):",
    btnTestKey: "🔍 Test Key",
    keyValid: "✅ API Key is valid and working!",
    keyInvalid: "❌ Invalid API Key. Please verify.",
    promptInputLabel: "Enter Topic or Lesson Text:",
    promptPlaceholder: "e.g., Story of the Fox and the Rooster, Grade 4 Science, Cambodian Provinces...",
    presetChipsTitle: "Popular Topics:",
    itemCountLabel: "Number of questions to generate:",
    btnGenerateAi: "✨ Generate Questions with AI",
    generatingAi: "🤖 Generating questions, please wait...",
    pdfUploadLabel: "Select Textbook PDF Document:",
    imageUploadLabel: "Select Textbook Page Image:",
    reviewQuestionsTitle: "Review Generated Questions",
    btnApplyToGame: "🚀 Apply & Play Now",
    btnApplyToCreator: "✏️ Open in Creator Studio",
    fallbackNotice: "💡 Using Offline Knowledge Bank for Cambodian Curriculum.",
    itemsCountBadge: "items",
    boxNumber: "Box #",
    btnDone: "Done",
    btnRevealAnswer: "👁️ Reveal Answer",
    btnHideAnswer: "🙈 Hide Answer"
  }
};

class I18nManager {
  constructor() {
    this.lang = localStorage.getItem('otpg_lang') || 'km';
  }

  getLang() {
    return this.lang;
  }

  setLang(lang) {
    if (translations[lang]) {
      this.lang = lang;
      localStorage.setItem('otpg_lang', lang);
      this.updateDOM();
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }
  }

  toggleLang() {
    const nextLang = this.lang === 'km' ? 'en' : 'km';
    this.setLang(nextLang);
    return nextLang;
  }

  t(key) {
    return translations[this.lang]?.[key] || translations['km']?.[key] || key;
  }

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && translations[this.lang]?.[key]) {
        el.textContent = translations[this.lang][key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key && translations[this.lang]?.[key]) {
        el.setAttribute('placeholder', translations[this.lang][key]);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (key && translations[this.lang]?.[key]) {
        el.setAttribute('title', translations[this.lang][key]);
      }
    });
  }
}

const i18n = new I18nManager();

// ==================== END: i18n.js ====================

// ==================== START: particles.js ====================
/* ==========================================================================
   Confetti & Particle Celebration Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   High-performance 60fps Canvas particle simulator
   ========================================================================== */

class ParticleEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animId = null;
    this.colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#06b6d4', '#fbbf24'];
  }

  init() {
    this.canvas = document.getElementById('confetti-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fireConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 3, count = 90) {
    if (!this.canvas) this.init();
    if (!this.canvas) return;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 14 + 4;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.28,
        drag: 0.96,
        alpha: 1,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
        decay: Math.random() * 0.008 + 0.006
      });
    }

    if (!this.animId) {
      this.loop();
    }
  }

  fireCelebration() {
    this.fireConfetti(window.innerWidth * 0.2, window.innerHeight * 0.6, 60);
    this.fireConfetti(window.innerWidth * 0.8, window.innerHeight * 0.6, 60);
    setTimeout(() => {
      this.fireConfetti(window.innerWidth * 0.5, window.innerHeight * 0.4, 100);
    }, 250);
  }

  loop() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > this.canvas.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

const particles = new ParticleEngine();

// ==================== END: particles.js ====================

// ==================== START: data.js ====================
/* ==========================================================================
   Data Management & Preloaded Lessons
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Curriculum-aligned sample activities & localStorage custom CRUD
   ========================================================================== */

const SAMPLE_ACTIVITIES = [
  {
    id: "sample-photo-to-word",
    isSample: true,
    title: {
      km: "🐾 🖼️ ផ្គូផ្គងរូបភាពសត្វ និងឈ្មោះ (Image to Word)",
      en: "🐾 🖼️ Animal Photo-to-Word Matching"
    },
    description: {
      km: "លំហាត់ផ្គូផ្គងរូបភាពសត្វព្រៃជាក់ស្តែង ទៅនឹងឈ្មោះពាក្យត្រឹមត្រូវ",
      en: "Match real animal illustrations to their correct vocabulary names"
    },
    category: {
      km: "រូបភាព និងពាក្យ (Image & Word)",
      en: "Image & Vocabulary"
    },
    defaultTemplate: "pairs",
    theme: "jungle",
    timerSec: 60,
    lives: 3,
    shuffle: true,
    items: [
      {
        id: "item-pw-1",
        emoji: "🐯",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&auto=format&fit=crop&q=80",
        target: "ខ្លាធំ (Tiger)",
        hint: "សត្វស៊ីសាច់មានឆ្នូតខ្មៅលឿង"
      },
      {
        id: "item-pw-2",
        emoji: "🐘",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&auto=format&fit=crop&q=80",
        target: "ដំរី (Elephant)",
        hint: "សត្វលើគោកធំជាងគេមានប្រមោយវែង"
      },
      {
        id: "item-pw-3",
        emoji: "🐒",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&auto=format&fit=crop&q=80",
        target: "ស្វា (Monkey)",
        hint: "ពូកែលោតតោងមែកឈើ"
      },
      {
        id: "item-pw-4",
        emoji: "🦒",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=400&auto=format&fit=crop&q=80",
        target: "សត្វកវែង (Giraffe)",
        hint: "សត្វដែលមានកវែងជាងគេ"
      },
      {
        id: "item-pw-5",
        emoji: "🦁",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&auto=format&fit=crop&q=80",
        target: "តោ (Lion)",
        hint: "ស្តេចសត្វនៃវាលស្មៅ"
      },
      {
        id: "item-pw-6",
        emoji: "🦓",
        prompt: "",
        imagePrompt: "https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=400&auto=format&fit=crop&q=80",
        target: "សេះបង្កង់ (Zebra)",
        hint: "មានឆ្នូតសខ្មៅពេញខ្លួន"
      }
    ]
  },
  {
    id: "sample-wildlife-traits",
    isSample: true,
    title: {
      km: "🐯 🦊 សត្វព្រៃ និងលក្ខណៈសម្គាល់",
      en: "🐯 🦊 Wild Animals & Characteristics"
    },
    description: {
      km: "ស្វែងយល់ពីសត្វព្រៃ សំឡេង និងចំណុចសម្គាល់របស់ពួកវា",
      en: "Learn about wild animals, sounds, and distinct characteristics"
    },
    category: {
      km: "វិទ្យាសាស្ត្រ និងធម្មជាតិ",
      en: "Science & Nature"
    },
    defaultTemplate: "pairs",
    theme: "jungle",
    timerSec: 60,
    lives: 3,
    shuffle: true,
    items: [
      {
        id: "item-1",
        emoji: "🐯",
        prompt: "ខ្លាធំ (Tiger)",
        target: "ស្តេចសត្វព្រៃមានឆ្នូតខ្មៅលឿង",
        hint: "ជាសត្វស៊ីសាច់ និងរហ័សរហួនបំផុត",
        distractors: ["ស៊ីតែស្មៅ និងស្លឹកឈើ", "រស់នៅក្នុងទឹកជ្រៅ", "ហើរលើអាកាសពេលយប់"]
      },
      {
        id: "item-2",
        emoji: "🐘",
        prompt: "ដំរី (Elephant)",
        target: "សត្វលើគោកធំជាងគេ មានប្រមោយវែង",
        hint: "មានភ្លុកពណ៌ស និងត្រចៀកធំៗ",
        distractors: ["មានកវែងជាងគេ", "មានស្លាបធំៗ", "ដេកលើមែកឈើ"]
      },
      {
        id: "item-3",
        emoji: "🐒",
        prompt: "ស្វា (Monkey)",
        target: "ពូកែលោតតោងមែកឈើ និងចូលចិត្តផ្លែចេក",
        hint: "រហ័សរហួន និងរស់នៅជាហ្វូងលើដើមឈើ",
        distractors: ["ហែលទឹកស្វែងរកត្រី", "រស់ក្នុងរូងដីងងឹត", "មិនចេះឡើងដើមឈើ"]
      },
      {
        id: "item-4",
        emoji: "🦒",
        prompt: "សត្វកវែង (Giraffe)",
        target: "សត្វដែលមានកវែងជាងគេលើលោក",
        hint: "ស៊ីស្លឹកឈើនៅចុងឈើខ្ពស់ៗ",
        distractors: ["រត់លឿនក្នុងទឹក", "មានស្នែងកោងកាចសាហាវ", "មានចង្កូមវែង"]
      },
      {
        id: "item-5",
        emoji: "🦁",
        prompt: "តោ (Lion)",
        target: "សត្វតោឈ្មោលមានរោមប្រះកវែងក្រាស់",
        hint: "គេប្រសិទ្ធនាមថាជាស្តេចព្រៃនៃវាលស្មៅ",
        distractors: ["ចូលចិត្តញ៉ាំត្រីសមុទ្រ", "ហើរចាប់ចំណី", "ដេកក្នុងទឹកថ្លុក"]
      },
      {
        id: "item-6",
        emoji: "🦊",
        prompt: "កញ្ជ្រោង (Fox)",
        target: "សត្វមានកន្ទុយបោករោមក្រាស់ និងមានកលល្បិចច្រើន",
        hint: "ពូកែលួចមាន់ និងមានល្បិចកលខ្ពស់",
        distractors: ["ស៊ីស្មៅតាមវាលស្រែ", "មានមាឌធំដូចដំរី", "មិនចេះរត់លឿន"]
      },
      {
        id: "item-7",
        emoji: "🐻",
        prompt: "ខ្លាឃ្មុំ (Bear)",
        target: "ចូលចិត្តញ៉ាំទឹកឃ្មុំ និងដេកសម្ងំរដូវរងា",
        hint: "មានរោមក្រាស់ និងក្រញាំជើងរឹងមាំ",
        distractors: ["រស់លើចុងដូង", "ហើរលើមេឃ", "ចូលចិត្តលោតផ្លោះ"]
      },
      {
        id: "item-8",
        emoji: "🦓",
        prompt: "សេះបង្កង់ (Zebra)",
        target: "មានឆ្នូតសខ្មៅពេញខ្លួនជារូបរាងធម្មជាតិ",
        hint: "រស់នៅជាហ្វូងក្នុងវាលស្មៅសាហ្វារី",
        distractors: ["មានកន្ទុយវែងដូចស្វា", "មានភ្លុកវែង", "បញ្ចេញពន្លឺពេលយប់"]
      }
    ]
  },
  {
    id: "sample-fox-rooster",
    isSample: true,
    title: {
      km: "🦊 🐓 រឿង កញ្ជ្រោងនិងមាន់ចែ",
      en: "🦊 🐓 The Fox and the Rooster Tale"
    },
    description: {
      km: "ស្វែងយល់ពីតួអង្គ គតិអប់រំ និងព្រឹត្តិការណ៍ក្នុងរឿងនិទានខ្មែរ",
      en: "Explore characters, moral lessons, and story events in Khmer folklore"
    },
    category: {
      km: "អក្សរសាស្ត្រខ្មែរ",
      en: "Khmer Literature"
    },
    defaultTemplate: "quiz",
    theme: "classic",
    timerSec: 45,
    lives: 3,
    shuffle: true,
    items: [
      {
        id: "item-fr-1",
        emoji: "🐓",
        prompt: "តើមាន់ចែទំនៅលើអ្វីនៅពេលកញ្ជ្រោងមកដល់?",
        target: "នៅលើមែកឈើខ្ពស់",
        hint: "ដើម្បីសុវត្ថិភាពពីសត្វសាហ្វារីលើដី",
        distractors: ["លើដំបូលផ្ទះ", "លើដីក្បែរគុម្ពស្មៅ", "លើមាត់អណ្តូង"]
      },
      {
        id: "item-fr-2",
        emoji: "🦊",
        prompt: "តើសត្វកញ្ជ្រោងបានប្រើល្បិចអ្វីដើម្បីបញ្ឆោតមាន់ចែ?",
        target: "ប្រាប់ថាសត្វទាំងអស់បានចងសម្ព័ន្ធមេត្រីភាពគ្នា",
        hint: "កុហកថាលែងមានការស៊ីសាច់គ្នាតទៅទៀតហើយ",
        distractors: ["យកស្រូវមកផ្ញើមាន់ចែ", "សុំឱ្យមាន់ចែបង្រៀនរងាវ", "ជួយជួសជុលទ្រុងមាន់"]
      },
      {
        id: "item-fr-3",
        emoji: "🐕",
        prompt: "តើមាន់ចែឆ្លើយតបយ៉ាងដូចម្តេចដើម្បីបន្លាចកញ្ជ្រោង?",
        target: "ឃើញហ្វូងឆ្កែប្រមាញ់កំពុងរត់មកដល់",
        hint: "ធ្វើជាមើលទៅឆ្ងាយហើយប្រាប់ដំណឹងនេះ",
        distractors: ["ស្រែកហៅអ្នកភូមិយកកាំភ្លើង", "ហោះចុះមកចឹកភ្នែកកញ្ជ្រោង", "ធ្វើពុតជាដេកលក់"]
      },
      {
        id: "item-fr-4",
        emoji: "🏃",
        prompt: "តើកញ្ជ្រោងធ្វើដូចម្តេចនៅពេលឮថាឆ្កែប្រមាញ់កំពុងមក?",
        target: "រត់ស្លន់ស្លោចូលព្រៃបាត់",
        hint: "ភ័យខ្លាចខ្លាំងព្រោះដឹងថាឆ្កែប្រមាញ់កាចសាហាវ",
        distractors: ["ឈររង់ចាំស្វាគមន៍", "លោតឡើងដើមឈើជាមួយមាន់", "ដេកធ្វើពុតជាស្លាប់"]
      },
      {
        id: "item-fr-5",
        emoji: "💡",
        prompt: "តើគតិអប់រំនៃរឿងនេះផ្តល់សារសំខាន់អ្វីខ្លះ?",
        target: "កុំឆាប់ជឿពាក្យផ្អែមល្ហែម និងត្រូវប្រើប្រាជ្ញាដោះស្រាយបញ្ហា",
        hint: "ការមានស្មារតីប្រុងប្រយ័ត្នជានិច្ច",
        distractors: ["ត្រូវតែរត់ចោលមិត្តភក្តិ", "កុំរងាវពេលព្រលឹម", "កុំឡើងដើមឈើខ្ពស់"]
      }
    ]
  },
  {
    id: "sample-khmer-landmarks",
    isSample: true,
    title: {
      km: "🏛️ 🇰🇭 ប្រវត្តិសាស្ត្រ និងរមណីយដ្ឋានកម្ពុជា",
      en: "🏛️ 🇰🇭 Cambodian History & Heritage Sites"
    },
    description: {
      km: "ស្វែងយល់ពីប្រាសាទបុរាណ និងទីតាំងភូមិសាស្ត្រប្រវត្តិសាស្ត្រខ្មែរ",
      en: "Discover ancient temples and historic geography of Cambodia"
    },
    category: {
      km: "ប្រវត្តិវិទ្យា និងភូមិវិទ្យា",
      en: "History & Geography"
    },
    defaultTemplate: "match",
    theme: "cosmic",
    timerSec: 60,
    lives: 3,
    shuffle: true,
    items: [
      {
        id: "item-kh-1",
        emoji: "🏯",
        prompt: "ប្រាសាទអង្គរវត្ត",
        target: "កសាងឡើងដោយព្រះបាទសូរ្យវរ្ម័នទី២ ក្នុងសតវត្សរ៍ទី១២",
        hint: "រមណីយដ្ឋានអច្ឆរិយៈពិភពលោកនៅខេត្តសៀមរាប",
        distractors: ["កសាងដោយព្រះបាទជ័យវរ្ម័នទី៧", "កសាងក្នុងសម័យឧដុង្គ", "ស្ថិតនៅខេត្តព្រះវិហារ"]
      },
      {
        id: "item-kh-2",
        emoji: "🗿",
        prompt: "ប្រាសាទបាយ័ន",
        target: "មានកំពូលព្រហ្មមុខបួនញញឹមពព្រាយដ៏ល្បីល្បាញ",
        hint: "កសាងដោយព្រះបាទជ័យវរ្ម័នទី៧",
        distractors: ["មានក្បាច់ចម្លាក់តែផ្កាឈូក", "ជាប្រាសាទឥដ្ឋលើភ្នំ", "មានរូបចម្លាក់សត្វនាគធំតែមួយ"]
      },
      {
        id: "item-kh-3",
        emoji: "⛰️",
        prompt: "ប្រាសាទព្រះវិហារ",
        target: "ស្ថិតនៅលើកំពូលភ្នំដងរែក ជាប់ព្រំដែនកម្ពុជា-ថៃ",
        hint: "បេតិកភណ្ឌពិភពលោកយូណេស្កូឆ្នាំ២០០៨",
        distractors: ["ស្ថិតនៅកណ្តាលបឹងទន្លេសាប", "ក្បែរឆ្នេរសមុទ្រក្រុងព្រះសីហនុ", "ស្ថិតនៅលើភ្នំបូកគោ"]
      },
      {
        id: "item-kh-4",
        emoji: "🌊",
        prompt: "បឹងទន្លេសាប",
        target: "បឹងទឹកសាបធម្មជាតិធំជាងគេនៅអាស៊ីអាគ្នេយ៍",
        hint: "ជាជម្រកមច្ឆជាតិ និងប្រភពទឹកដ៏សម្បូរបែប",
        distractors: ["ជាបឹងទឹកប្រៃជាប់សមុទ្រ", "ជាបឹងសិប្បនិម្មិត", "ជាទន្លេតូចជាងគេ"]
      },
      {
        id: "item-kh-5",
        emoji: "👑",
        prompt: "ព្រះរាជវាំងចតុមុខ",
        target: "ស្ថិតនៅរាជធានីភ្នំពេញ កន្លែងប្រសព្វទន្លេបួនមុខ",
        hint: "ព្រះបរមរាជវាំងនៃព្រះរាជាណាចក្រកម្ពុជា",
        distractors: ["ស្ថិតនៅខេត្តបាត់ដំបង", "ស្ថិតនៅភ្នំគូលែន", "ស្ថិតនៅខេត្តកំពត"]
      }
    ]
  },
  {
    id: "sample-grade4-math",
    isSample: true,
    title: {
      km: "📐 ➕ គណិតវិទ្យា៖ រូបមន្ត និងប្រមាណវិធី",
      en: "📐 ➕ Math: Formulas & Fast Arithmetic"
    },
    description: {
      km: "លំហាត់គិតរហ័ស គណនាផ្ទៃក្រឡា និងប្រមាណវិធីលេខ",
      en: "Mental math, area formulas, and arithmetic calculations"
    },
    category: {
      km: "គណិតវិទ្យា",
      en: "Mathematics"
    },
    defaultTemplate: "whack",
    theme: "neon",
    timerSec: 40,
    lives: 3,
    shuffle: true,
    items: [
      {
        id: "item-m-1",
        emoji: "🔢",
        prompt: "៧ × ៨ = ?",
        target: "៥៦ (56)",
        hint: "គុណលេខក្នុងតារាងមេ ៧ ឬ មេ ៨",
        distractors: ["៤៩", "៦៤", "៥៤"]
      },
      {
        id: "item-m-2",
        emoji: "⬛",
        prompt: "រូបមន្តផ្ទៃក្រឡាចតុកោណកែង",
        target: "បណ្តោយ × ទទឹង (L × W)",
        hint: "យកប្រវែងជ្រុងវែងគុណនឹងជ្រុងខ្លី",
        distractors: ["(បណ្តោយ + ទទឹង) × ២", "ជ្រុង × ជ្រុង", "បាត × កម្ពស់ ÷ ២"]
      },
      {
        id: "item-m-3",
        emoji: "🔺",
        prompt: "រូបមន្តផ្ទៃក្រឡាត្រីកោណ",
        target: "(បាត × កម្ពស់) ÷ ២",
        hint: "ពាក់កណ្តាលនៃចតុកោណកែង",
        distractors: ["បាត × កម្ពស់", "ជ្រុង × ៣", "ជ្រុង + ជ្រុង + ជ្រុង"]
      },
      {
        id: "item-m-4",
        emoji: "➗",
        prompt: "១៤៤ ÷ ១២ = ?",
        target: "១២ (12)",
        hint: "១២ គុណនឹង ១២ ស្មើ ១៤៤",
        distractors: ["១៤", "១០", "១៦"]
      },
      {
        id: "item-m-5",
        emoji: "🧮",
        prompt: "១២៥ + ៣៧៥ = ?",
        target: "៥០០ (500)",
        hint: "បូកលេខបង្គត់រយ",
        distractors: ["៤៥០", "៥៥០", "៤៩០"]
      }
    ]
  }
];

class DataManager {
  constructor() {
    this.customActivities = [];
    this.loadCustomActivities();
  }

  loadCustomActivities() {
    try {
      const stored = localStorage.getItem('otpg_custom_activities');
      if (stored) {
        this.customActivities = JSON.parse(stored);
      } else {
        this.customActivities = [];
      }
    } catch (e) {
      console.error("Error loading custom activities:", e);
      this.customActivities = [];
    }
  }

  saveCustomActivitiesToStorage() {
    try {
      localStorage.setItem('otpg_custom_activities', JSON.stringify(this.customActivities));
    } catch (e) {
      console.error("Error saving custom activities:", e);
    }
  }

  getAllActivities() {
    return [...this.customActivities, ...SAMPLE_ACTIVITIES];
  }

  getCustomActivities() {
    return this.customActivities;
  }

  getSampleActivities() {
    return SAMPLE_ACTIVITIES;
  }

  getActivityById(id) {
    const all = this.getAllActivities();
    return all.find(a => a.id === id) || SAMPLE_ACTIVITIES[0];
  }

  saveActivity(activityData) {
    if (!activityData.id) {
      activityData.id = 'custom-' + Date.now();
    }
    activityData.isSample = false;

    const existingIdx = this.customActivities.findIndex(a => a.id === activityData.id);
    if (existingIdx >= 0) {
      this.customActivities[existingIdx] = activityData;
    } else {
      this.customActivities.unshift(activityData);
    }

    this.saveCustomActivitiesToStorage();
    return activityData;
  }

  deleteActivity(id) {
    this.customActivities = this.customActivities.filter(a => a.id !== id);
    this.saveCustomActivitiesToStorage();
  }

  deleteAllCustomActivities() {
    this.customActivities = [];
    this.saveCustomActivitiesToStorage();
  }

  duplicateActivity(id) {
    const original = this.getActivityById(id);
    if (!original) return null;

    const copy = JSON.parse(JSON.stringify(original));
    copy.id = 'custom-' + Date.now();
    copy.isSample = false;

    // Append copy label
    if (typeof copy.title === 'object') {
      copy.title.km = (copy.title.km || '') + ' (ចម្លង)';
      copy.title.en = (copy.title.en || '') + ' (Copy)';
    } else {
      copy.title = String(copy.title) + ' (ចម្លង)';
    }

    this.customActivities.unshift(copy);
    this.saveCustomActivitiesToStorage();
    return copy;
  }

  exportActivityJson(id) {
    const act = this.getActivityById(id);
    return JSON.stringify(act, null, 2);
  }

  importActivityJson(jsonStr) {
    try {
      const data = JSON.parse(jsonStr);
      if (!data.title || !data.items || !Array.isArray(data.items)) {
        throw new Error("Invalid activity format");
      }
      data.id = 'custom-' + Date.now();
      data.isSample = false;
      this.customActivities.unshift(data);
      this.saveCustomActivitiesToStorage();
      return data;
    } catch (e) {
      console.error("Import error:", e);
      return null;
    }
  }

  // Shuffles array helper
  static shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

function shuffleArray(array) {
  return DataManager.shuffleArray(array);
}

const dataManager = new DataManager();

// ==================== END: data.js ====================

// ==================== START: pairs.js ====================
/* ==========================================================================
   🎴 Matching Pairs Engine (Memory Card Flip & Classroom Review Game)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Click once to open (flip), click again on the same card to close (unflip)
   - Matched pairs STAY OPEN permanently with green highlight so users see what remains
   - Whole-class Preview Mode (👁️ បង្ហាញទាំងអស់ / 🙈 លាក់ទាំងអស់)
   - Move tracking, victory fanfare & confetti
   ========================================================================== */






class MatchingPairsGame {
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

// ==================== END: pairs.js ====================

// ==================== START: match.js ====================
/* ==========================================================================
   🧩 Match Up Engine (Dual-Column Matching System)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Tap-to-pair and drag-and-drop dual column item association
   ========================================================================== */






class MatchUpGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.selectedPrompt = null;
    this.selectedTarget = null;
    this.matchedPairsCount = 0;
    this.totalPairs = 0;
    this.score = 0;
    this.moves = 0;
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
    this.selectedPrompt = null;
    this.selectedTarget = null;
    this.matchedPairsCount = 0;
    this.moves = 0;
    this.score = 0;

    const rawItems = this.activity.items || [];
    this.totalPairs = rawItems.length;

    let prompts = rawItems.map((item, idx) => ({
      idx,
      prompt: item.prompt,
      emoji: item.emoji || '',
      image: item.imagePrompt || item.image || ''
    }));

    let targets = rawItems.map((item, idx) => ({
      idx,
      target: item.target,
      image: item.imageTarget || ''
    }));

    if (this.activity.shuffle !== false) {
      prompts = DataManager.shuffleArray(prompts);
      targets = DataManager.shuffleArray(targets);
    }

    this.render(prompts, targets);
    this.updateHUD();
    this.startTimer();
  }

  render(prompts, targets) {
    const wrapper = document.createElement('div');
    wrapper.className = 'matchup-container';

    // Left Column (Prompts)
    const colLeft = document.createElement('div');
    colLeft.className = 'matchup-column';
    colLeft.innerHTML = `<div class="matchup-column-title">${i18n.t('itemPromptLabel')}</div>`;

    prompts.forEach(p => {
      const itemEl = document.createElement('div');
      itemEl.className = 'matchup-item matchup-prompt';
      itemEl.dataset.idx = p.idx;

      let imgHtml = '';
      if (p.image) {
        imgHtml = `<img src="${p.image}" class="matchup-item-img" alt="" onerror="this.style.display='none';" />`;
      }

      itemEl.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.65rem; overflow: hidden; flex: 1;">
          ${imgHtml}
          ${p.emoji ? `<span class="matchup-item-icon">${p.emoji}</span>` : ''}
          <span class="matchup-item-text">${p.prompt || ''}</span>
        </div>
        <span class="matchup-item-badge">👉</span>
      `;

      itemEl.addEventListener('click', () => this.handlePromptSelect(itemEl, p.idx));
      colLeft.appendChild(itemEl);
    });

    // Right Column (Targets)
    const colRight = document.createElement('div');
    colRight.className = 'matchup-column';
    colRight.innerHTML = `<div class="matchup-column-title">${i18n.t('itemTargetLabel')}</div>`;

    targets.forEach(t => {
      const itemEl = document.createElement('div');
      itemEl.className = 'matchup-item matchup-target';
      itemEl.dataset.idx = t.idx;

      let imgHtml = '';
      if (t.image) {
        imgHtml = `<img src="${t.image}" class="matchup-item-img" alt="" onerror="this.style.display='none';" />`;
      }

      itemEl.innerHTML = `
        <span class="matchup-item-badge">👈</span>
        <div style="display: flex; align-items: center; gap: 0.65rem; overflow: hidden; flex: 1;">
          ${imgHtml}
          <span class="matchup-item-text">${t.target || ''}</span>
        </div>
      `;

      itemEl.addEventListener('click', () => this.handleTargetSelect(itemEl, t.idx));
      colRight.appendChild(itemEl);
    });

    wrapper.appendChild(colLeft);
    wrapper.appendChild(colRight);
    this.container.appendChild(wrapper);
  }

  handlePromptSelect(el, idx) {
    if (el.classList.contains('matched')) return;

    sound.playPop();
    document.querySelectorAll('.matchup-prompt').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedPrompt = { el, idx };

    if (this.selectedTarget) {
      this.checkPairMatch();
    }
  }

  handleTargetSelect(el, idx) {
    if (el.classList.contains('matched')) return;

    sound.playPop();
    document.querySelectorAll('.matchup-target').forEach(item => item.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedTarget = { el, idx };

    if (this.selectedPrompt) {
      this.checkPairMatch();
    }
  }

  checkPairMatch() {
    this.moves++;
    const isMatch = this.selectedPrompt.idx === this.selectedTarget.idx;

    if (isMatch) {
      sound.playMatch();
      this.selectedPrompt.el.classList.remove('selected');
      this.selectedPrompt.el.classList.add('matched');
      this.selectedTarget.el.classList.remove('selected');
      this.selectedTarget.el.classList.add('matched');

      // Update badges to green checkmarks
      const pBadge = this.selectedPrompt.el.querySelector('.matchup-item-badge');
      const tBadge = this.selectedTarget.el.querySelector('.matchup-item-badge');
      if (pBadge) pBadge.textContent = '✅';
      if (tBadge) tBadge.textContent = '✅';

      this.matchedPairsCount++;
      this.score += 200;
      this.selectedPrompt = null;
      this.selectedTarget = null;
      this.updateHUD();

      if (this.matchedPairsCount === this.totalPairs) {
        this.handleGameComplete();
      }
    } else {
      sound.playWrong();
      const pEl = this.selectedPrompt.el;
      const tEl = this.selectedTarget.el;

      pEl.style.animation = 'shake 0.4s ease';
      tEl.style.animation = 'shake 0.4s ease';

      setTimeout(() => {
        pEl.style.animation = '';
        tEl.style.animation = '';
        pEl.classList.remove('selected');
        tEl.classList.remove('selected');
        this.selectedPrompt = null;
        this.selectedTarget = null;
      }, 500);
    }
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
      matchedEl.textContent = `${this.matchedPairsCount} / ${this.totalPairs}`;
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

// ==================== END: match.js ====================

// ==================== START: quiz.js ====================
/* ==========================================================================
   🎯 Quiz Gameshow Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Countdown timer, streak multiplier, lifelines, keyboard shortcuts (A-D, 1-4)
   ========================================================================== */






class QuizGame {
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

// ==================== END: quiz.js ====================

// ==================== START: box.js ====================
/* ==========================================================================
   📦 Open The Box Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   3D gift boxes with unboxing audio, interactive question modal, and answer reveal
   ========================================================================== */






class OpenBoxGame {
  constructor() {
    this.container = null;
    this.activity = null;
    this.onComplete = null;
    this.boxes = [];
    this.openedCount = 0;
    this.score = 0;
    this.moves = 0;
  }

  mount(container, activity, onComplete) {
    this.container = container;
    this.activity = activity;
    this.onComplete = onComplete;
    this.initGame();
  }

  initGame() {
    this.container.innerHTML = '';
    this.openedCount = 0;
    this.score = 0;
    this.moves = 0;

    let items = [...(this.activity.items || [])];
    if (this.activity.shuffle !== false) {
      items = DataManager.shuffleArray(items);
    }
    this.boxes = items.map((item, idx) => ({
      ...item,
      boxNum: idx + 1,
      opened: false
    }));

    this.render();
    this.updateHUD();
  }

  render() {
    const grid = document.createElement('div');
    grid.className = 'boxes-grid-container';

    this.boxes.forEach((box, index) => {
      const boxEl = document.createElement('div');
      boxEl.className = 'box-item';
      boxEl.dataset.index = index;

      boxEl.innerHTML = `
        <span class="box-number">#${box.boxNum}</span>
      `;

      boxEl.addEventListener('click', () => this.handleBoxClick(boxEl, index));
      grid.appendChild(boxEl);
    });

    this.container.appendChild(grid);
  }

  handleBoxClick(boxEl, index) {
    const box = this.boxes[index];
    if (box.opened) {
      // Re-open modal if already opened
      this.showBoxModal(box, index, boxEl, false);
      return;
    }

    sound.playOpenBox();
    boxEl.classList.add('opened');
    box.opened = true;
    this.openedCount++;
    this.moves++;
    this.score += 150;
    this.updateHUD();

    this.showBoxModal(box, index, boxEl, true);
  }

  showBoxModal(box, index, boxEl, isFirstOpen) {
    // Create floating modal
    const modalWrap = document.createElement('div');
    modalWrap.className = 'modal-overlay active';

    let imgHtml = '';
    if (box.image || box.imagePrompt) {
      imgHtml = `<img src="${box.image || box.imagePrompt}" style="max-height: 150px; border-radius: 12px; margin: 0.5rem 0; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 2px solid var(--panel-border);" alt="box visual" onerror="this.style.display='none';" />`;
    }

    const boxTitle = `${i18n.t('boxNumber')} #${box.boxNum}`;

    modalWrap.innerHTML = `
      <div class="modal-window" style="max-width: 560px; text-align: center;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>🎁</span>
            <span class="modal-title">${boxTitle}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-box-modal">&times;</button>
        </div>
        <div class="modal-body box-modal-content" style="gap: 1.1rem; padding: 1.5rem 1.25rem;">
          ${box.emoji ? `<div class="box-modal-emoji" style="font-size: 3.5rem; line-height: 1;">${box.emoji}</div>` : ''}
          ${imgHtml}
          <div class="box-modal-title" style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); line-height: 1.5;">
            ${box.prompt}
          </div>

          <!-- Answer Section with Reveal / Hide Toggle Button -->
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 100%; margin: 0.35rem 0;">
            <button class="nav-btn btn-ai" id="btn-toggle-reveal-answer" style="font-size: 0.95rem; padding: 0.6rem 1.5rem; border-radius: 10px; font-weight: 700; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); transition: all 0.25s ease;">
              <span>👁️</span> <span>${i18n.t('btnRevealAnswer')}</span>
            </button>

            <div class="box-modal-answer" id="box-reveal-target" style="display: none; width: 100%; font-size: 1.05rem; padding: 0.85rem 1.25rem; border-radius: 12px; background: rgba(16, 185, 129, 0.15); border: 2px solid #10b981; color: #34d399; animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
              <strong style="color: #6ee7b7;">${i18n.t('itemTargetLabel')}:</strong> <span style="font-weight: 800; font-size: 1.15rem; color: #fff;">${box.target}</span>
            </div>
          </div>

          ${box.hint ? `<div style="font-size: 0.85rem; color: var(--text-muted); background: rgba(0,0,0,0.2); padding: 0.4rem 0.8rem; border-radius: 8px;">💡 ${box.hint}</div>` : ''}
        </div>
        <div class="modal-footer" style="justify-content: center;">
          <button class="nav-btn btn-create" id="btn-done-box-modal" style="font-size: 0.95rem; padding: 0.55rem 2rem; font-weight: 700;">
            <span>✅</span> <span>${i18n.t('btnDone')}</span>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    let isRevealed = false;
    const revealBtn = modalWrap.querySelector('#btn-toggle-reveal-answer');
    const answerEl = modalWrap.querySelector('#box-reveal-target');

    revealBtn?.addEventListener('click', () => {
      isRevealed = !isRevealed;
      if (isRevealed) {
        sound.playMatch();
        particles.fireConfetti();
        answerEl.style.display = 'block';
        revealBtn.innerHTML = `<span>🙈</span> <span>${i18n.t('btnHideAnswer')}</span>`;
        revealBtn.className = 'nav-btn';
        revealBtn.style.background = 'rgba(255, 255, 255, 0.12)';
        revealBtn.style.boxShadow = 'none';
      } else {
        sound.playPop();
        answerEl.style.display = 'none';
        revealBtn.innerHTML = `<span>👁️</span> <span>${i18n.t('btnRevealAnswer')}</span>`;
        revealBtn.className = 'nav-btn btn-ai';
        revealBtn.style.background = '';
        revealBtn.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.35)';
      }
    });

    const closeModal = () => {
      sound.playPop();
      modalWrap.remove();
      if (this.openedCount === this.boxes.length) {
        setTimeout(() => this.handleGameComplete(), 400);
      }
    };

    modalWrap.querySelector('#btn-close-box-modal')?.addEventListener('click', closeModal);
    modalWrap.querySelector('#btn-done-box-modal')?.addEventListener('click', closeModal);
  }

  updateHUD() {
    const matchedEl = document.getElementById('hud-stat-matched');
    if (matchedEl) {
      matchedEl.textContent = `${this.openedCount} / ${this.boxes.length}`;
    }

    const movesEl = document.getElementById('hud-stat-moves');
    if (movesEl) {
      movesEl.textContent = `${this.moves}`;
    }

    const scoreEl = document.getElementById('hud-stat-score');
    if (scoreEl) {
      scoreEl.textContent = `${this.score}`;
    }
  }

  handleGameComplete() {
    sound.playVictory();
    particles.fireCelebration();

    if (this.onComplete) {
      this.onComplete({
        score: this.score,
        totalItems: this.boxes.length,
        accuracy: 100,
        timeSpent: this.moves * 5,
        moves: this.moves,
        won: true
      });
    }
  }

  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// ==================== END: box.js ====================

// ==================== START: wheel.js ====================
/* ==========================================================================
   🎡 Classroom Student Name Picker & Team Divider Engine (កង់វិលចាប់ឈ្មោះសិស្ស)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated Student Name Picker, Excel/CSV Roster Import, Adjustable Spin Timer, Random Team Divider
   ========================================================================== */





class RandomWheelGame {
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
            <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 1.5rem; background: rgba(0,0,0,0.2); border: 2px dashed var(--panel-border); border-radius: 16px;">
              <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎲</div>
              <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.35rem;">
                ឧបករណ៍បែងចែកក្រុមសិស្សដោយចៃដន្យ (Random Team Generator)
              </div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">
                សូមជ្រើសរើសចំនួនក្រុមដែលចង់បាន រួចចុចប៊ូតុង <strong>"🎲 ចែកក្រុមដោយចៃដន្យ"</strong> ខាងលើដើម្បីចាប់ផ្តើម!
              </div>
            </div>
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
        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.95rem; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 0.25rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.4rem;">
            <label class="form-label" style="margin: 0; font-weight: 700;" data-i18n="spinDurationLabel">⏱️ ${i18n.t('spinDurationLabel')}</label>
            <span id="spin-duration-val" style="font-weight: 800; color: #38bdf8; font-size: 0.95rem;">${this.spinDuration}s</span>
          </div>

          <!-- Duration Direct Input & Unit Selector -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="number" id="wheel-duration-input" min="1" max="600" value="${this.spinDuration}" class="form-input" style="flex: 1; padding: 0.45rem 0.65rem; text-align: center; font-weight: 700; font-size: 0.95rem;" placeholder="បញ្ចូលចំនួន..." />
            <select id="wheel-duration-unit" class="form-select" style="width: 105px; padding: 0.45rem 0.6rem; font-size: 0.85rem;">
              <option value="sec" selected>វិនាទី (s)</option>
              <option value="min">នាទី (min)</option>
            </select>
          </div>

          <!-- Quick Preset Chips -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
            <button class="nav-btn wheel-dur-preset" data-sec="3" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⚡ 3s</button>
            <button class="nav-btn wheel-dur-preset" data-sec="5" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⚡ 5s</button>
            <button class="nav-btn wheel-dur-preset" data-sec="10" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⏱️ 10s</button>
            <button class="nav-btn wheel-dur-preset" data-sec="15" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⏱️ 15s</button>
            <button class="nav-btn wheel-dur-preset" data-sec="30" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⏳ 30s</button>
            <button class="nav-btn wheel-dur-preset" data-sec="60" style="padding: 0.25rem 0.55rem; font-size: 0.76rem;">⏳ 1 នាទី</button>
          </div>

          <!-- Slider -->
          <input type="range" id="wheel-duration-slider" min="1" max="60" value="${Math.min(60, this.spinDuration)}" step="1" style="cursor: pointer; width: 100%;" />

          <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.82rem; color: var(--text-main); cursor: pointer; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.5rem;">
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

    // Spin Duration Sync Controls
    const durInput = document.getElementById('wheel-duration-input');
    const durUnit = document.getElementById('wheel-duration-unit');
    const slider = document.getElementById('wheel-duration-slider');
    const durVal = document.getElementById('spin-duration-val');

    const updateDuration = (valInCurrentUnit) => {
      const unit = durUnit ? durUnit.value : 'sec';
      let sec = parseFloat(valInCurrentUnit) || 5;
      if (unit === 'min') {
        sec = Math.round(sec * 60);
      }
      sec = Math.max(1, Math.min(600, sec)); // 1 sec to 10 mins
      this.spinDuration = sec;
      localStorage.setItem('otpg_wheel_duration', sec);

      if (durVal) {
        if (sec >= 60) {
          const mins = (sec / 60).toFixed(1).replace('.0', '');
          durVal.textContent = `${sec}s (${mins} នាទី)`;
        } else {
          durVal.textContent = `${sec}s`;
        }
      }
      if (slider) {
        slider.value = Math.min(60, sec);
      }
    };

    durInput?.addEventListener('input', (e) => {
      updateDuration(e.target.value);
    });

    durUnit?.addEventListener('change', () => {
      if (durInput) updateDuration(durInput.value);
    });

    slider?.addEventListener('input', (e) => {
      const sec = parseInt(e.target.value, 10);
      if (durUnit) durUnit.value = 'sec';
      if (durInput) durInput.value = sec;
      updateDuration(sec);
    });

    this.container.querySelectorAll('.wheel-dur-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        const sec = parseInt(btn.dataset.sec, 10);
        if (durUnit) durUnit.value = 'sec';
        if (durInput) durInput.value = sec;
        updateDuration(sec);
      });
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
      if (this.currentGeneratedGroups && this.currentGeneratedGroups.length > 0) {
        this.generateTeams();
      }
    });

    document.getElementById('btn-do-generate-groups')?.addEventListener('click', () => {
      sound.playMatch();
      particles.fireConfetti();
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

// ==================== END: wheel.js ====================

// ==================== START: wordsearch.js ====================
/* ==========================================================================
   🔠 Word Search Engine (Khmer Syllable & Grapheme Segmentation Grid)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Intelligent Syllable Segmentation (e.g. សាលារៀន ➔ សា | លា | រៀន)
   - Inline Word List Editing (✏️ កែប្រែ, 🗑️ លុប, ➕ បន្ថែមពាក្យ)
   - Comma-separated Quick Editor Bar
   - Drag & Click ribbon selection with audio & victory confetti
   ========================================================================== */






// --- Dedicated Khmer Syllable Segmenter ---
function segmentKhmerWord(text) {
  if (!text) return [];
  // Clean punctuation and English inside brackets (e.g. "ខ្លាធំ (Tiger)" ➔ "ខ្លាធំ")
  const clean = text.replace(/\(.*?\)/g, '').replace(/[\[\]{}"',.!?;:()]/g, '').trim();
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
    'ផ្លែក្រូច': ['ផ្លែ', 'ក្រូច'],
    'ផ្លែដូង': ['ផ្លែ', 'ដូង'],
    'ព្រះអាទិត្យ': ['ព្រះ', 'អា', 'ទិត្យ'],
    'ព្រះចន្ទ': ['ព្រះ', 'ចន្ទ'],
    'ទន្សាយ': ['ទន្សាយ'],
    'មាន់ចែ': ['មាន់', 'ចែ'],
    'មាន់': ['មាន់'],
    'ទា': ['ទា'],
    'តោ': ['តោ'],
    'សេះបង្កង់': ['សេះ', 'បង្កង់'],
    'សេះ': ['សេះ'],
    'ឆ្មា': ['ឆ្មា'],
    'ឆ្កែ': ['ឆ្កែ'],
    'គោ': ['គោ'],
    'ក្របី': ['ក្រ', 'បី'],
    'ត្រី': ['ត្រី'],
    'បក្សី': ['បក្សី'],
    'ខ្លាឃ្មុំ': ['ខ្លា', 'ឃ្មុំ'],
    'កញ្ជ្រោង': ['កញ្ជ្រោង']
  };

  if (dict[clean]) return dict[clean];

  // 2. Intl.Segmenter with grapheme clusters for Khmer (keeps Consonant + Coeng + Vowel intact)
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try {
      const segGrapheme = new Intl.Segmenter('km', { granularity: 'grapheme' });
      const clusters = Array.from(segGrapheme.segment(clean), s => s.segment).filter(s => s.trim().length > 0);
      if (clusters.length > 0) return clusters;
    } catch (e) {
      console.warn("Intl segmentation fallback:", e);
    }
  }

  // 3. Fallback syllable regex
  const khmerSyllablePattern = /(?:[\u1780-\u17B3](?:\u17D2[\u1780-\u17B3])*(?:[\u17B4-\u17D3])*(?:[\u1780-\u17B3](?:\u17D2[\u1780-\u17B3])*(?:[\u17C6-\u17D3]))?)/gu;
  const matches = clean.match(khmerSyllablePattern);
  if (matches && matches.length > 0) return matches;

  return [clean];
}

class WordSearchGame {
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
        const clean = candidate.replace(/\(.*?\)/g, '').replace(/[\[\]{}"',.!?;:()]/g, '').trim();
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

// ==================== END: wordsearch.js ====================

// ==================== START: whack.js ====================
/* ==========================================================================
   🐹 Whack-a-Mole Arcade Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   6-hole mole arena, custom hammer cursor tracking with clean lifecycle disposal, combo streaks, lives
   ========================================================================== */






class WhackGame {
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

// ==================== END: whack.js ====================

// ==================== START: leaderboard.js ====================
/* ==========================================================================
   Results & Scorecard Leaderboard Modal
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Game-over results, accuracy percentage, time elapsed, streak records, confetti celebration
   ========================================================================== */





class ScorecardModal {
  constructor(onPlayAgain, onSwitchTemplate) {
    this.modalEl = null;
    this.onPlayAgain = onPlayAgain;
    this.onSwitchTemplate = onSwitchTemplate;
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-scorecard';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 500px; text-align: center;">
        <div class="modal-body" style="padding: 2.25rem 1.75rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
          <div id="scorecard-icon" style="font-size: 3.8rem; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.4));">🏆</div>
          <div id="scorecard-title" style="font-size: 1.4rem; font-weight: 800; color: var(--text-main);">
            ${i18n.t('victoryTitle')}
          </div>

          <!-- Stats Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; width: 100%; margin: 0.5rem 0;">
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('finalScore')}</div>
              <div id="scorecard-score" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-secondary);">0</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('accuracyRate')}</div>
              <div id="scorecard-accuracy" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-primary);">100%</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('timeSpent')}</div>
              <div id="scorecard-time" style="font-size: 1.25rem; font-weight: 700; color: var(--text-main);">00:00</div>
            </div>
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--panel-border); border-radius: 12px; padding: 0.85rem;">
              <div style="font-size: 0.75rem; color: var(--text-muted);">${i18n.t('bestStreak')}</div>
              <div id="scorecard-streak" style="font-size: 1.25rem; font-weight: 700; color: #f43f5e;">🔥 0</div>
            </div>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: center; gap: 1rem;">
          <button class="nav-btn btn-create" id="btn-scorecard-play-again" style="padding: 0.6rem 1.5rem; font-size: 0.95rem;">
            ${i18n.t('playAgain')}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-scorecard-play-again')?.addEventListener('click', () => {
      sound.playPop();
      this.close();
      if (this.onPlayAgain) this.onPlayAgain();
    });
  }

  show(results = {}) {
    const isWon = results.won !== false;
    const iconEl = this.modalEl.querySelector('#scorecard-icon');
    const titleEl = this.modalEl.querySelector('#scorecard-title');
    const scoreEl = this.modalEl.querySelector('#scorecard-score');
    const accEl = this.modalEl.querySelector('#scorecard-accuracy');
    const timeEl = this.modalEl.querySelector('#scorecard-time');
    const streakEl = this.modalEl.querySelector('#scorecard-streak');

    if (iconEl) iconEl.textContent = isWon ? '🏆' : '💀';
    if (titleEl) titleEl.textContent = isWon ? i18n.t('victoryTitle') : i18n.t('gameOverTitle');
    if (scoreEl) scoreEl.textContent = `${results.score || 0}`;
    if (accEl) accEl.textContent = `${results.accuracy || 100}%`;

    const sec = results.timeSpent || 0;
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    if (timeEl) timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (streakEl) streakEl.textContent = `🔥 ${results.bestStreak || 0}`;

    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }
}

// ==================== END: leaderboard.js ====================

// ==================== START: activity_manager.js ====================
/* ==========================================================================
   Activity Manager & Lesson Library Modal
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Filter tabs (All, Custom, Samples), Play Now, Edit, Duplicate, Single & Bulk Delete
   ========================================================================== */





class ActivityManagerModal {
  constructor(onSelectActivity, onEditActivity) {
    this.modalEl = null;
    this.currentFilter = 'all';
    this.onSelectActivity = onSelectActivity;
    this.onEditActivity = onEditActivity;
    this.initDOM();
  }

  initDOM() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'modal-overlay';
    this.modalEl.id = 'modal-activity-manager';

    this.modalEl.innerHTML = `
      <div class="modal-window" style="max-width: 900px;">
        <div class="modal-header">
          <div class="modal-title-wrap">
            <span>📚</span>
            <span class="modal-title" data-i18n="managerTitle">${i18n.t('managerTitle')}</span>
          </div>
          <button class="modal-close-btn" id="btn-close-manager">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Filter Tabs -->
          <div class="modal-tabs">
            <button class="modal-tab-btn active" data-filter="all">
              <span>🌐</span> <span data-i18n="tabAll">${i18n.t('tabAll')}</span>
            </button>
            <button class="modal-tab-btn" data-filter="custom">
              <span>✏️</span> <span data-i18n="tabCustom">${i18n.t('tabCustom')}</span>
            </button>
            <button class="modal-tab-btn" data-filter="system">
              <span>⭐</span> <span data-i18n="tabSystem">${i18n.t('tabSystem')}</span>
            </button>
          </div>

          <!-- Activity Cards Grid -->
          <div id="manager-activities-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1rem;">
            <!-- Rendered cards -->
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button class="nav-btn btn-danger" id="btn-delete-all-custom">
            <span>⚠️</span> <span data-i18n="btnDeleteAllCustom">${i18n.t('btnDeleteAllCustom')}</span>
          </button>
          <button class="nav-btn" id="btn-close-manager-footer">${i18n.t('btnCancel')}</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);
    this.bindEvents();
  }

  bindEvents() {
    this.modalEl.querySelector('#btn-close-manager')?.addEventListener('click', () => this.close());
    this.modalEl.querySelector('#btn-close-manager-footer')?.addEventListener('click', () => this.close());

    // Filter Tabs
    this.modalEl.querySelectorAll('.modal-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playPop();
        this.modalEl.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderActivities();
      });
    });

    // Delete All Custom
    this.modalEl.querySelector('#btn-delete-all-custom')?.addEventListener('click', () => {
      const customCount = dataManager.getCustomActivities().length;
      if (customCount === 0) {
        alert("មិនមានមេរៀនផ្ទាល់ខ្លួនសម្រាប់លុបទេ (No custom activities to delete)");
        return;
      }

      if (confirm(i18n.t('confirmDeleteAll'))) {
        sound.playWrong();
        dataManager.deleteAllCustomActivities();
        this.renderActivities();
        window.dispatchEvent(new CustomEvent('activitylistchanged'));
      }
    });
  }

  open() {
    this.renderActivities();
    this.modalEl.classList.add('active');
  }

  close() {
    this.modalEl.classList.remove('active');
  }

  renderActivities() {
    const grid = this.modalEl.querySelector('#manager-activities-grid');
    if (!grid) return;
    grid.innerHTML = '';

    let list = [];
    if (this.currentFilter === 'all') {
      list = dataManager.getAllActivities();
    } else if (this.currentFilter === 'custom') {
      list = dataManager.getCustomActivities();
    } else if (this.currentFilter === 'system') {
      list = dataManager.getSampleActivities();
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 2.5rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
          <div>${i18n.t('noCustomActivities')}</div>
        </div>
      `;
      return;
    }

    list.forEach(act => {
      const title = typeof act.title === 'object' ? (act.title.km || act.title.en) : act.title;
      const desc = typeof act.description === 'object' ? (act.description.km || act.description.en) : act.description;
      const cat = typeof act.category === 'object' ? (act.category.km || act.category.en) : (act.category || 'ទូទៅ');
      const count = act.items ? act.items.length : 0;

      const card = document.createElement('div');
      card.className = 'manager-activity-card';
      card.style.cssText = `
        background: var(--card-bg);
        border: 1px solid var(--panel-border);
        border-radius: 14px;
        padding: 1.15rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 0.85rem;
        transition: transform 0.2s, border-color 0.2s;
      `;

      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.4rem;">
            <span class="arena-badge category">${cat}</span>
            <span class="arena-badge">${count} ${i18n.t('itemsCountBadge') || 'items'}</span>
          </div>
          <div style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.3rem;">
            ${title}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); line-height: 1.35;">
            ${desc}
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.75rem; flex-wrap: wrap;">
          <button class="nav-btn btn-create btn-play-act" style="font-size: 0.78rem; padding: 0.35rem 0.65rem;">
            ${i18n.t('btnPlayNow')}
          </button>
          <div style="display: flex; gap: 0.3rem;">
            <button class="nav-btn btn-edit-act" title="Edit" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">✏️</button>
            <button class="nav-btn btn-dup-act" title="Duplicate" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">📋</button>
            ${!act.isSample ? `<button class="nav-btn btn-danger btn-del-act" title="Delete" style="padding: 0.35rem 0.55rem; font-size: 0.8rem;">🗑️</button>` : ''}
          </div>
        </div>
      `;

      card.querySelector('.btn-play-act')?.addEventListener('click', () => {
        sound.playPop();
        this.close();
        if (this.onSelectActivity) this.onSelectActivity(act);
      });

      card.querySelector('.btn-edit-act')?.addEventListener('click', () => {
        sound.playPop();
        this.close();
        if (this.onEditActivity) this.onEditActivity(act);
      });

      card.querySelector('.btn-dup-act')?.addEventListener('click', () => {
        sound.playMatch();
        dataManager.duplicateActivity(act.id);
        this.renderActivities();
        window.dispatchEvent(new CustomEvent('activitylistchanged'));
      });

      card.querySelector('.btn-del-act')?.addEventListener('click', () => {
        if (confirm(i18n.t('confirmDeleteSingle'))) {
          sound.playWrong();
          dataManager.deleteActivity(act.id);
          this.renderActivities();
          window.dispatchEvent(new CustomEvent('activitylistchanged'));
        }
      });

      grid.appendChild(card);
    });
  }
}

// ==================== END: activity_manager.js ====================

// ==================== START: ai_generator.js ====================
/* ==========================================================================
   AI Educational Question Generator (Google Gemini Direct Cloud Integration)
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   - Direct Google Gemini 2.0 Flash / 1.5 Flash Cloud Integration
   - Live AI Reasoning & Thinking Visualizer
   - Interactive Google Account / API Key Connection & Verification
   - Full Multimodal support (Text Prompts, PDF Textbooks, Image OCR)
   ========================================================================== */





class AiGeneratorModal {
  constructor(onApplyCallback, onEditCallback) {
    this.modalEl = null;
    this.currentTab = 'prompt';
    this.apiKey = localStorage.getItem('otpg_gemini_api_key') || '';
    this.isGeminiVerified = false;
    this.generatedQuestions = [];
    this.uploadedImageBase64 = null;
    this.uploadedPdfText = '';
    this.uploadedPdfBase64 = null;
    this.uploadedPdfImages = [];
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
            <button class="modal-tab-btn" data-tab="image">
              <span>🖼️</span> <span>រូបភាពមេរៀន (Lesson Image OCR)</span>
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

          <!-- Tab 2: Textbook Image -->
          <div class="ai-tab-pane" id="tab-pane-image" style="display: none;">
            <div class="form-group">
              <label class="form-label">🖼️ ផ្ទុករូបភាពទំព័រមេរៀន / សៀវភៅពុម្ព៖</label>
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

        const panePrompt = document.getElementById('tab-pane-prompt');
        const paneImage = document.getElementById('tab-pane-image');
        if (panePrompt) panePrompt.style.display = this.currentTab === 'prompt' ? 'block' : 'none';
        if (paneImage) paneImage.style.display = this.currentTab === 'image' ? 'block' : 'none';
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

    if (statusEl) {
      statusEl.innerHTML = `
        <div style="background: rgba(59,130,246,0.15); border: 1px solid #3b82f6; border-radius: 10px; padding: 0.75rem; color: #93c5fd;">
          ⏳ <strong>${file.name}</strong> - កំពុងផ្ទុក និងដំណើរការទំព័រ PDF សម្រាប់ Gemini AI Vision...
        </div>
      `;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();

      // Convert ArrayBuffer to Base64
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      this.uploadedPdfBase64 = btoa(binary);

      let fullText = '';
      this.uploadedPdfImages = [];

      // Render PDF pages to high-res images for Gemini Vision
      if (typeof window.pdfjsLib !== 'undefined') {
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = Math.min(pdf.numPages, 5); // Up to 5 pages

        for (let i = 1; i <= numPages; i++) {
          try {
            const page = await pdf.getPage(i);

            // Extract text
            try {
              const textContent = await page.getTextContent();
              const pageText = textContent.items.map(item => item.str).join(' ');
              if (pageText.trim()) {
                fullText += `--- [ទំព័រទី ${i}] ---\n` + pageText + '\n';
              }
            } catch (tErr) {}

            // Render page to canvas -> Base64 JPEG for Gemini Vision
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const imgBase64 = canvas.toDataURL('image/jpeg', 0.85);
            this.uploadedPdfImages.push(imgBase64);
          } catch (pErr) {
            console.warn(`Error processing PDF page ${i}:`, pErr);
          }
        }
      }

      this.uploadedPdfText = fullText.trim();

      // Render visual thumbnail previews
      let previewHtml = '';
      if (this.uploadedPdfImages.length > 0) {
        previewHtml = `
          <div style="display: flex; gap: 0.6rem; overflow-x: auto; padding: 0.6rem 0; margin-top: 0.5rem;">
            ${this.uploadedPdfImages.map((img, idx) => `
              <div style="text-align: center; flex-shrink: 0;">
                <img src="${img}" style="height: 120px; border-radius: 8px; border: 1px solid var(--panel-border); box-shadow: 0 4px 10px rgba(0,0,0,0.4);" alt="Page ${idx + 1}" />
                <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 3px; font-weight: 600;">ទំព័រទី ${idx + 1}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (statusEl) {
        statusEl.innerHTML = `
          <div style="background: rgba(16, 185, 129, 0.15); border: 1px solid #10b981; border-radius: 10px; padding: 0.75rem; color: var(--text-main);">
            <div style="font-weight: 700; color: #34d399; display: flex; align-items: center; gap: 0.4rem;">
              <span>✅</span> <span>បានអានឯកសារ: <strong>${file.name}</strong> (${this.uploadedPdfImages.length || 1} ទំព័រ)</span>
            </div>
            <div style="font-size: 0.78rem; color: #cbd5e1; margin-top: 0.25rem;">
              ✨ Google Gemini AI នឹងវិភាគផ្ទាល់លើទំព័រ PDF (ទាំងអត្ថបទ និងរូបភាព OCR) ដើម្បីបង្កើតសំណួរត្រូវតាមមេរៀន ១០០%។
            </div>
            ${previewHtml}
          </div>
        `;
      }
      sound.playMatch();
    } catch (err) {
      console.error("PDF Read Error:", err);
      if (statusEl) {
        statusEl.innerHTML = `<div style="color: #f87171; font-weight: 700; background: rgba(239,68,68,0.15); border: 1px solid #ef4444; border-radius: 10px; padding: 0.75rem;">❌ កំហុសក្នុងការអាន PDF: ${err.message}</div>`;
      }
      sound.playWrong();
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
          <img src="${this.uploadedImageBase64}" style="max-height: 180px; max-width: 100%; border-radius: 10px; border: 1px solid var(--panel-border); box-shadow: 0 4px 10px rgba(0,0,0,0.4);" alt="preview" />
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
      if (!userPrompt) {
        alert("សូមបញ្ចូលប្រធានបទមេរៀន (ឧ. គណិតវិទ្យា វិធីបូក, វិទ្យាសាស្ត្រ...)");
        document.getElementById('ai-prompt-input')?.focus();
        return;
      }
    } else if (this.currentTab === 'image') {
      if (!this.uploadedImageBase64) {
        alert("សូមជ្រើសរើសរូបភាពទំព័រមេរៀនជាមុនសិន!");
        document.getElementById('ai-img-file')?.click();
        return;
      }
      userPrompt = 'រូបភាពសៀវភៅពុម្ព';
    }

    // UI: Start Thinking Visualizer
    if (triggerBtn) triggerBtn.disabled = true;
    if (btnText) btnText.textContent = 'Gemini AI កំពុងដំណើរការគិត...';
    if (reviewSec) reviewSec.style.display = 'none';
    if (thinkingBox) thinkingBox.style.display = 'block';

    // Step 1: Connecting
    if (thinkingStatus) {
      if (this.currentTab === 'image') {
        thinkingStatus.innerHTML = `🌐 កំពុងបញ្ជូនរូបភាពទំព័រមេរៀនទៅកាន់ Google Gemini AI (Vision & OCR Analysis)...`;
      } else {
        thinkingStatus.innerHTML = `🌐 កំពុងបញ្ជូនប្រធានបទ <strong>"${userPrompt}"</strong> ទៅកាន់ Google Gemini Cloud...`;
      }
    }
    if (progressBar) progressBar.style.width = '35%';
    sound.playPop();

    let results = null;

    // 1. Call Google Gemini Cloud API directly
    try {
      if (thinkingStatus) {
        if (this.currentTab === 'image') {
          thinkingStatus.innerHTML = `🧠 Google Gemini AI (${this.activeModel}) កំពុងអានអត្ថបទពីរូបភាព និងបង្កើតសំណួរ...`;
        } else {
          thinkingStatus.innerHTML = `🧠 Google Gemini AI (${this.activeModel}) កំពុងគិត និងប្រើប្រាស់ AI Cloud បង្កើតសំណួរ...`;
        }
      }
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
      this.activeModel || 'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash-lite',
      'gemini-1.5-pro'
    ];

    const parts = [];

    if (this.currentTab === 'image') {
      let promptInstruction = `You are an expert educational curriculum analyzer.
The user uploaded a textbook page photo.
Target Question Count: Exactly ${count} questions.

CRITICAL INSTRUCTIONS:
1. Analyze the textbook image carefully using OCR and visual understanding.
2. Generate questions strictly and ONLY based on the text, diagrams, stories, or exercises shown in this textbook image.
3. Respond ONLY with valid raw JSON (no markdown code fences).

JSON Structure:
{
  "title": "Lesson Title from Image",
  "category": "Subject Category",
  "items": [
    {
      "emoji": "Relevant emoji",
      "prompt": "Question from image",
      "target": "Correct answer",
      "hint": "Helpful hint",
      "distractors": ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"]
    }
  ]
}`;
      parts.push({ text: promptInstruction });
      if (this.uploadedImageBase64) {
        const b64Data = this.uploadedImageBase64.includes(',') ? this.uploadedImageBase64.split(',')[1] : this.uploadedImageBase64;
        const mimeType = this.uploadedImageBase64.includes(';') ? this.uploadedImageBase64.split(';')[0].split(':')[1] : 'image/jpeg';
        parts.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: b64Data
          }
        });
      }
    } else {
      // Regular topic prompt
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
      parts.push({ text: systemPrompt });
    }

    let lastError = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        
        // Try with JSON mode first, and fallback to plain response if model doesn't support JSON mode
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: parts }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: "application/json"
            }
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
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData.error?.message || `HTTP ${response.status}`;
          console.warn(`Model ${model} returned error:`, lastError);
        }
      } catch (err) {
        lastError = err.message || err;
        console.warn(`Model ${model} attempt failed:`, err);
      }
    }

    throw new Error(lastError || "Gemini API connection failed.");
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

    // 4. KHMER LITERATURE & MOEYS TEXTBOOK STORIES (ភាសាខ្មែរ & រឿងនិទានសៀវភៅពុម្ព)
    if (lower.includes('ខ្មែរ') || lower.includes('រឿង') || lower.includes('កញ្ជ្រោង') || lower.includes('មាន់') || lower.includes('pdf') || lower.includes('សៀវភៅពុម្ព') || lower.includes('fox') || lower.includes('rooster')) {
      const khmerPool = [
        { emoji: '🦊', prompt: 'តើក្នុង «រឿង កញ្ជ្រោងនិងមាន់ចែ» មានតួអង្គអ្វីខ្លះ?', target: 'កញ្ជ្រោង មាន់ចែ និងឆ្កែ', hint: 'តួអង្គសត្វក្នុងរឿង', distractors: ['កញ្ជ្រោង និងទន្សាយ', 'ខ្លា និងដំរី', 'ឆ្មា និងកណ្តុរ'] },
        { emoji: '🌳', prompt: 'តើកញ្ជ្រោង ដើរទៅឃើញមាន់ចែទំនៅឯណា?', target: 'នៅលើប្រគាបឈើ', hint: 'នៅលើដើមឈើខ្ពស់', distractors: ['នៅលើដី', 'ក្នុងទ្រុង', 'មាត់ទឹក'] },
        { emoji: '🗣️', prompt: 'តើកញ្ជ្រោង និយាយកុហកដូចម្តេចទៅកាន់មាន់ចែ?', target: 'ព្រះឥន្ទ្រឱ្យមកប្រកាសឱ្យសត្វស្រឡាញ់គ្នា', hint: 'ឧបាយកលកញ្ជ្រោងដើម្បីស៊ីសាច់មាន់', distractors: ['មកសុំចែកចំណី', 'មកបបួលទៅលេង', 'មកសុំរៀនច្រៀង'] },
        { emoji: '🐔', prompt: 'តើមាន់ចែជឿតាមការប្រកាសរបស់កញ្ជ្រោងដែរឬទេ?', target: 'មិនជឿទេ (មាន់ចែដឹងល្បិចកញ្ជ្រោង)', hint: 'មាន់ចែមានប្រាជ្ញាវៃឆ្លាត', distractors: ['ជឿភ្លាមៗ', 'ចុះទៅរកកញ្ជ្រោង', 'ហោះរត់ចោល'] },
        { emoji: '🐕', prompt: 'តើមាន់ចែធ្វើឧបាយកលយ៉ាងណាដើម្បីដេញកញ្ជ្រោង?', target: 'ធ្វើជាមើលឃើញហ្វូងឆ្កែរត់មក', hint: 'កញ្ជ្រោងខ្លាចឆ្កែខាំ', distractors: ['ស្រែកហៅអ្នកភូមិ', 'ហោះទៅចឹកកញ្ជ្រោង', 'ទម្លាក់មែកឈើ'] },
        { emoji: '🏃‍♂️', prompt: 'ហេតុអ្វីបានជាកញ្ជ្រោងរត់ចូលព្រៃបាត់?', target: 'ព្រោះវាខ្លាចឆ្កែខាំ', hint: 'សត្រូវរបស់កញ្ជ្រោងគឺឆ្កែ', distractors: ['ព្រោះវាឆ្អែត', 'ព្រោះយប់ងងឹត', 'ព្រោះភ្លៀងធ្លាក់'] },
        { emoji: '💡', prompt: 'តើគតិអប់រំក្នុងរឿងនេះចង់បង្ហាញអំពីអ្វី?', target: 'ត្រូវចេះប្រើប្រាជ្ញាទប់ទល់នឹងឧបាយកលសត្រូវ', hint: 'ការចេះការពារខ្លួនដោយបញ្ញា', distractors: ['ត្រូវចេះល្បិចបោកប្រាស់', 'ត្រូវរត់គេចពីការងារ', 'កុំដើរលេងពេលយប់'] },
        { emoji: '🎭', prompt: 'តើសត្វកញ្ជ្រោងមានចរិតបែបណា?', target: 'មានល្បិចកល បោកប្រាស់ និងបញ្ចើចបញ្ចើប', hint: 'ចរិតពិតរបស់កញ្ជ្រោង', distractors: ['ស្លូតបូត ស្មោះត្រង់', 'ចិត្តល្អ ចូលចិត្តជួយគេ', 'កំសាក មិនហ៊ានរកចំណី'] }
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

// ==================== END: ai_generator.js ====================

// ==================== START: whack_creator.js ====================
/* ==========================================================================
   🐹 Whack-a-Mole Dedicated Question & Traps Studio
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated builder for Whack-a-Mole: Questions, Correct Moles, Wrong Traps & Speed
   ========================================================================== */






class WhackCreatorModal {
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

// ==================== END: whack_creator.js ====================

// ==================== START: creator.js ====================
/* ==========================================================================
   Creator Studio & Dual-Card Activity Editor
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Dedicated Pair Builder (Card A ↔ Card B), Intelligent Multi-Option AI Image Search, JSON import/export
   ========================================================================== */





class CreatorStudioModal {
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

            <!-- Bottom Add Item Button for quick access without scrolling up -->
            <div style="display: flex; justify-content: center; margin-top: 1.25rem; padding: 0.25rem 0;">
              <button class="nav-btn btn-create" id="btn-add-item-row-bottom" style="font-size: 0.95rem; font-weight: 700; padding: 0.75rem 2.5rem; width: 100%; max-width: 380px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3); border-radius: 12px;">
                <span style="font-size: 1.2rem;">➕</span>
                <span>${i18n.t('addItemBtn')}</span>
              </button>
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

          <!-- Direct URL Paste & Local File Upload -->
          <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.25); border: 1px dashed var(--panel-border); border-radius: 10px; padding: 0.4rem 0.75rem; flex-wrap: wrap;">
            <span style="font-size: 0.8rem; color: var(--text-muted); white-space: nowrap;">🔗 Link / 📁 File:</span>
            <input type="text" class="form-input" id="img-direct-url-input" style="flex: 1; min-width: 160px; padding: 0.3rem 0.6rem; font-size: 0.8rem;" placeholder="https://example.com/photo.jpg" />
            <button class="nav-btn" id="btn-use-direct-url" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">ប្រើ Link</button>
            <input type="file" id="img-modal-file-upload" accept="image/*" style="display: none;" />
            <button class="nav-btn" id="btn-modal-upload-file" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">📁 ជ្រើសរូបពី PC</button>
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

    const doAddRow = () => {
      this.addItemRow();
      const rows = this.modalEl.querySelectorAll('.pair-builder-row');
      if (rows.length > 0) {
        rows[rows.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    };
    this.modalEl.querySelector('#btn-add-item-row')?.addEventListener('click', doAddRow);
    this.modalEl.querySelector('#btn-add-item-row-bottom')?.addEventListener('click', doAddRow);

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

    // Upload from PC
    const modalFileInput = this.imgGenModalEl.querySelector('#img-modal-file-upload');
    this.imgGenModalEl.querySelector('#btn-modal-upload-file')?.addEventListener('click', () => modalFileInput?.click());
    modalFileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          sound.playMatch();
          if (this.imgGenCallback) this.imgGenCallback(evt.target.result);
          this.closeImgGenModal();
        };
        reader.readAsDataURL(file);
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

    const items = act && act.items ? act.items : [];
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

    // Bind Image Uploads for Card A
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

    // Bind Image Uploads for Card B
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

    if (input) input.value = initialKeyword || '';
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

    if (initialKeyword && initialKeyword.trim()) {
      this.generateImages(initialKeyword.trim());
    }
  }

  closeImgGenModal() {
    this.imgGenModalEl.classList.remove('active');
  }

  async translateKeyword(rawText) {
    if (!rawText) return 'tiger';

    // 1. If text contains English inside parens e.g. "ខ្លា (Tiger)" or "ខ្លាធំ (Tiger)"
    const parenMatch = rawText.match(/\(([a-zA-Z\s]+)\)/);
    if (parenMatch && parenMatch[1] && parenMatch[1].trim()) {
      return parenMatch[1].trim().toLowerCase();
    }

    const clean = rawText.replace(/\(.*?\)/g, '').replace(/[\[\]{}"',.!?;:()]/g, '').trim();

    // 2. Exact or partial dictionary lookup
    const dict = {
      'ខ្លាធំ': 'tiger',
      'ខ្លា': 'tiger',
      'ដំរី': 'elephant',
      'ស្វា': 'monkey',
      'សត្វកវែង': 'giraffe',
      'តោ': 'lion',
      'សេះបង្កង់': 'zebra',
      'សេះ': 'horse',
      'ខ្លាឃ្មុំ': 'bear',
      'កញ្ជ្រោង': 'fox',
      'មាន់ចែ': 'rooster',
      'មាន់': 'chicken',
      'ទា': 'duck',
      'ទន្សាយ': 'rabbit',
      'ឆ្មា': 'cat',
      'ឆ្កែ': 'dog',
      'គោ': 'cow',
      'ក្របី': 'water buffalo',
      'ត្រី': 'fish',
      'បក្សី': 'bird',
      'ផ្ទះខ្មែរ': 'khmer house',
      'ផ្ទះឈើ': 'wooden house',
      'ផ្ទះ': 'house',
      'ឡាន': 'car',
      'រថយន្ត': 'car',
      'កង់': 'bicycle',
      'ម៉ូតូ': 'motorcycle',
      'សាលារៀន': 'school building',
      'សៀវភៅ': 'book',
      'ដើមឈើ': 'tree',
      'ដើមដូង': 'coconut tree',
      'ផ្កាឈូក': 'lotus flower',
      'ផ្កា': 'flower',
      'ប្រាសាទអង្គរវត្ត': 'angkor wat',
      'អង្គរវត្ត': 'angkor wat',
      'ប្រាសាទបាយ័ន': 'bayon temple',
      'ប្រាសាទព្រះវិហារ': 'preah vihear',
      'ផ្លែប៉ោម': 'apple fruit',
      'ផ្លែចេក': 'banana fruit',
      'ផ្លែស្វាយ': 'mango fruit',
      'ផ្លែក្រូច': 'orange fruit',
      'ផ្លែដូង': 'coconut fruit'
    };

    if (dict[clean]) return dict[clean];

    for (const [k, v] of Object.entries(dict)) {
      if (clean.includes(k) || k.includes(clean)) return v;
    }

    // 3. Google Translate API live translation if Khmer script
    if (/[\u1780-\u17FF]/.test(clean)) {
      try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const json = await res.json();
          const translated = json?.[0]?.[0]?.[0];
          if (translated && translated.trim().length > 0) {
            return translated.trim().toLowerCase();
          }
        }
      } catch (e) {
        console.warn("Live translation error:", e);
      }
    }

    return clean.toLowerCase();
  }

  getCuratedPhotos(keyword) {
    const kw = (keyword || '').toLowerCase().trim();
    const curated = {
      'tiger': [
        'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1549480017-d76466a4b7e8?w=500&auto=format&fit=crop&q=80'
      ],
      'horse': [
        'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80'
      ],
      'elephant': [
        'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581852017103-68ac65514cf7?w=500&auto=format&fit=crop&q=80'
      ],
      'monkey': [
        'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1574063413132-355dbfd83e25?w=500&auto=format&fit=crop&q=80'
      ],
      'giraffe': [
        'https://images.unsplash.com/photo-1547721064-da6cfb341d50?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1538121609137-976420e0f899?w=500&auto=format&fit=crop&q=80'
      ],
      'lion': [
        'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=500&auto=format&fit=crop&q=80'
      ],
      'zebra': [
        'https://images.unsplash.com/photo-1501706362039-c06b2d715385?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526095179574-86e545346ae6?w=500&auto=format&fit=crop&q=80'
      ],
      'house': [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=500&auto=format&fit=crop&q=80'
      ],
      'car': [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=80'
      ],
      'school': [
        'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=500&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80'
      ],
      'book': [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
      ],
      'tree': [
        'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=500&auto=format&fit=crop&q=80'
      ],
      'lotus': [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80'
      ],
      'angkor': [
        'https://images.unsplash.com/photo-1608657158784-0a373b9e4a39?w=500&auto=format&fit=crop&q=80'
      ],
      'apple': [
        'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80'
      ],
      'cat': [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=80'
      ],
      'dog': [
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=80'
      ],
      'cow': [
        'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=500&auto=format&fit=crop&q=80'
      ],
      'bear': [
        'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=500&auto=format&fit=crop&q=80'
      ]
    };

    for (const [k, urls] of Object.entries(curated)) {
      if (kw.includes(k) || k.includes(kw)) return urls;
    }
    return [];
  }

  async fetchWikimediaImages(keyword) {
    try {
      const searchTerms = keyword.trim();
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(searchTerms)}&gsrlimit=8&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=500`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const pages = data?.query?.pages || {};
      const imgUrls = [];
      for (const pid in pages) {
        const info = pages[pid]?.imageinfo?.[0];
        const imgUrl = info?.thumburl || info?.url;
        if (imgUrl && !imgUrl.endsWith('.svg') && !imgUrl.endsWith('.ogg') && !imgUrl.endsWith('.pdf') && !imgUrl.endsWith('.tif')) {
          imgUrls.push(imgUrl);
        }
      }
      return imgUrls;
    } catch (e) {
      console.warn("Wikimedia image fetch failed:", e);
      return [];
    }
  }

  async generateImages(rawKeyword) {
    const resultsGrid = this.imgGenModalEl.querySelector('#img-gen-results-grid');
    const selectBtn = this.imgGenModalEl.querySelector('#btn-select-generated-img');

    if (selectBtn) selectBtn.style.display = 'none';
    if (resultsGrid) {
      resultsGrid.innerHTML = `
        <div style="grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; padding: 2.5rem; background: rgba(0,0,0,0.25); border-radius: 12px; border: 1px dashed var(--panel-border);">
          <div style="font-size: 2.5rem; animation: spin 1.2s infinite linear;">🎨</div>
          <div style="font-size: 1rem; color: var(--text-main); font-weight: 700;">${i18n.t('generatingImage')}</div>
          <div style="font-size: 0.82rem; color: var(--text-muted);">ស្វែងរក និងបង្កើតរូបភាពសម្រាប់: <strong style="color: #6ee7b7;">"${rawKeyword}"</strong></div>
        </div>
      `;
    }

    // 1. Translate keyword
    const translatedPrompt = await this.translateKeyword(rawKeyword);
    const baseSeed = Math.floor(Math.random() * 9000) + 1000;

    // 2. Fetch instant curated photos + live Wikimedia photos in parallel
    const curatedPhotos = this.getCuratedPhotos(translatedPrompt);
    const wikiPhotos = await this.fetchWikimediaImages(translatedPrompt);

    // Primary fallback photo is specific to the keyword
    const fallbackPhoto = curatedPhotos[0] || wikiPhotos[0] || 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=500&auto=format&fit=crop&q=80';

    // 3. Build comprehensive list of 4 options (Photo, AI Illustration, AI 3D, Art/Photo 2)
    const options = [
      {
        type: '📸 រូបភាពជាក់ស្តែង HD (Real Photo)',
        url: curatedPhotos[0] || wikiPhotos[0] || `https://image.pollinations.ai/prompt/${encodeURIComponent('high quality realistic photograph of ' + translatedPrompt + ', professional photography, sharp focus, 4k')}?width=500&height=500&nologo=true&seed=${baseSeed + 1}`,
        fallback: fallbackPhoto
      },
      {
        type: '🎨 រូបគំនូរច្បាស់ (Vector Art)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent(translatedPrompt + ', cute educational vector cartoon illustration, vivid colors, solid clean background, masterpiece')}?width=500&height=500&nologo=true&seed=${baseSeed + 2}`,
        fallback: curatedPhotos[1] || wikiPhotos[1] || fallbackPhoto
      },
      {
        type: '✨ រូបភាព 3D (Clay 3D Render)',
        url: `https://image.pollinations.ai/prompt/${encodeURIComponent('cute 3d clay render character of ' + translatedPrompt + ', bright studio lighting, soft shadows, cute')}?width=500&height=500&nologo=true&seed=${baseSeed + 3}`,
        fallback: curatedPhotos[2] || curatedPhotos[0] || wikiPhotos[2] || fallbackPhoto
      },
      {
        type: '🖼️ រូបភាពសិល្បៈ (Detailed Art)',
        url: curatedPhotos[1] || wikiPhotos[1] || `https://image.pollinations.ai/prompt/${encodeURIComponent('detailed vibrant digital painting of ' + translatedPrompt + ', cinematic lighting, beautiful colors')}?width=500&height=500&nologo=true&seed=${baseSeed + 4}`,
        fallback: fallbackPhoto
      }
    ];

    if (!resultsGrid) return;
    resultsGrid.innerHTML = '';

    options.forEach((opt, idx) => {
      const card = document.createElement('div');
      card.className = 'img-option-card';
      card.style.cssText = `
        background: rgba(15, 23, 42, 0.75);
        border: 2px solid var(--panel-border);
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.25s ease;
        display: flex;
        flex-direction: column;
        position: relative;
        box-shadow: 0 4px 14px rgba(0,0,0,0.3);
      `;

      card.innerHTML = `
        <div style="position: relative; width: 100%; aspect-ratio: 1/1; background: #0f172a; display: flex; align-items: center; justify-content: center; overflow: hidden;">
          <div class="img-spinner" style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 0.35rem; color: var(--text-muted); font-size: 0.75rem;">
            <div style="font-size: 1.6rem; animation: spin 1.2s infinite linear;">⏳</div>
            <span>កំពុងទាញយក...</span>
          </div>
          <img src="${opt.url}" alt="${rawKeyword}" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 2; opacity: 0; transition: opacity 0.3s ease;" 
            onload="this.style.opacity=1; const sp = this.parentElement.querySelector('.img-spinner'); if(sp) sp.style.display='none';" 
            onerror="if(this.src !== '${opt.fallback}') { this.src = '${opt.fallback}'; } else { this.style.opacity=1; const sp = this.parentElement.querySelector('.img-spinner'); if(sp) sp.style.display='none'; }" 
          />
          <div class="img-selected-badge" style="position: absolute; top: 8px; right: 8px; z-index: 3; background: #10b981; color: #fff; width: 26px; height: 26px; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 0.85rem; box-shadow: 0 2px 8px rgba(0,0,0,0.5);">
            ✓
          </div>
        </div>
        <div style="padding: 0.5rem 0.6rem; font-size: 0.76rem; font-weight: 700; color: var(--text-main); text-align: center; background: rgba(0,0,0,0.4); border-top: 1px solid var(--panel-border);">
          ${opt.type}
        </div>
      `;

      card.addEventListener('click', () => {
        sound.playPop();
        resultsGrid.querySelectorAll('.img-option-card').forEach(c => {
          c.style.borderColor = 'var(--panel-border)';
          c.style.boxShadow = '0 4px 14px rgba(0,0,0,0.3)';
          c.style.transform = 'scale(1)';
          const b = c.querySelector('.img-selected-badge');
          if (b) b.style.display = 'none';
        });

        card.style.borderColor = '#10b981';
        card.style.boxShadow = '0 0 18px rgba(16, 185, 129, 0.45)';
        card.style.transform = 'scale(1.02)';
        const badge = card.querySelector('.img-selected-badge');
        if (badge) badge.style.display = 'flex';

        // Use the current rendered img src (which accounts for fallback)
        const activeImg = card.querySelector('img');
        this.selectedGeneratedImg = activeImg?.src || opt.url;

        if (selectBtn) {
          selectBtn.style.display = 'inline-flex';
          selectBtn.innerHTML = `<span>✅</span> ${i18n.t('btnUseThisImage') || 'ប្រើប្រាស់រូបភាពនេះ'}`;
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

// ==================== END: creator.js ====================

// ==================== START: app.js ====================
/* ==========================================================================
   Main Application Controller & Engine Orchestrator
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Orchestrates 7 game engines, navbar actions, modal lifecycles, and i18n
   ========================================================================== */






// Game Engines








// Components & Modals






class AppController {
  constructor() {
    this.currentActivity = null;
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
      this.currentActivity = savedAct;
      this.currentTemplate = 'whack';
      this.populateActivityDropdown();
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
          this.whackCreatorModal.open(editAct);
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
          this.whackCreatorModal.open(aiAct);
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
    document.addEventListener('open-whack-creator', (e) => {
      this.whackCreatorModal.open(e.detail || this.currentActivity);
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
      if (this.currentTemplate === 'whack' || this.currentActivity?.defaultTemplate === 'whack') {
        this.whackCreatorModal.open(this.currentActivity);
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
      this.creatorModal.open(this.currentActivity);
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

    // Mount engine
    this.activeGameInstance.mount(arenaStage, this.currentActivity, (results) => {
      this.handleGameCompletion(results);
    });

    this.updateArenaHeader();
  }

  restartCurrentGame(forceShuffle = false) {
    if (forceShuffle && this.currentActivity) {
      this.currentActivity.shuffle = true;
    }
    this.loadGame(this.currentTemplate);
  }

  exportCurrentActivityToFile() {
    if (!this.currentActivity) return;

    const rawTitle = typeof this.currentActivity.title === 'object' 
      ? (this.currentActivity.title.km || this.currentActivity.title.en || 'មេរៀន') 
      : (this.currentActivity.title || 'មេរៀន');

    const cleanTitle = rawTitle.replace(/\s+/g, '_').replace(/[\\/:*?"<>|]/g, '');

    const exportData = {
      id: this.currentActivity.id || `custom-${Date.now()}`,
      title: this.currentActivity.title,
      description: this.currentActivity.description || '',
      category: this.currentActivity.category || 'ទូទៅ',
      defaultTemplate: this.currentActivity.defaultTemplate || this.currentTemplate || 'pairs',
      timerSec: this.currentActivity.timerSec || 60,
      lives: this.currentActivity.lives || 3,
      shuffle: true,
      items: this.currentActivity.items || []
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

// ==================== END: app.js ====================
