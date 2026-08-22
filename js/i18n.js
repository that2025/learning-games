/* ==========================================================================
   Bilingual Internationalization (i18n) Engine
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Khmer (🇰🇭) and English (🇬🇧) full dictionary and dynamic switcher
   ========================================================================== */

export const translations = {
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
    
    // Scorecard & Victory
    victoryTitle: "🎉 អបអរសាទរ! អ្នកបានឈ្នះហើយ!",
    gameOverTitle: "💀 អស់ជីវិតហើយ! ព្យាយាមម្តងទៀត!",
    finalScore: "ពិន្ទុសរុប",
    accuracyRate: "ភាពត្រឹមត្រូវ",
    timeSpent: "រយៈពេលលេង",
    bestStreak: "ពិន្ទុបន្តបន្ទាប់ខ្ពស់បំផុត",
    playAgain: "🔄 លេងម្តងទៀត",
    btnClose: "✕ បិទ",
    
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
    
    // Scorecard & Victory
    victoryTitle: "🎉 Congratulations! Victory!",
    gameOverTitle: "💀 Game Over! Try Again!",
    finalScore: "Final Score",
    accuracyRate: "Accuracy Rate",
    timeSpent: "Time Spent",
    bestStreak: "Best Streak",
    playAgain: "🔄 Play Again",
    btnClose: "✕ Close",
    
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

export const i18n = new I18nManager();
