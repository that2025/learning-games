/* ==========================================================================
   Data Management & Preloaded Lessons
   Ou Ta Pruk Educational Games (ល្បែងសិក្សាអូរតាប្រុក)
   Curriculum-aligned sample activities & localStorage custom CRUD
   ========================================================================== */

export const SAMPLE_ACTIVITIES = [
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

export class DataManager {
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

export function shuffleArray(array) {
  return DataManager.shuffleArray(array);
}

export const dataManager = new DataManager();
