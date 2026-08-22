# 📜 PROMPT មេសម្រាប់បង្កើតកម្មវិធី «ល្បែងសិក្សា អូរតាប្រុក» (Master Prompt for Recreating Ou Ta Pruk Learning Games)

> **របៀបប្រើប្រាស់ (How to Use):**
> 1. Copy អត្ថបទ Prompt ខាងក្រោមនេះទាំងអស់។
> 2. ភ្ជាប់ជាមួយរូបភាព Screenshot នៃកម្មវិធី (ដែលបាន Screenshot ពីអេក្រង់របស់អ្នក)។
> 3. បិទភ្ជាប់ (Paste) ទៅកាន់ AI (Gemini, Claude, ChatGPT, ឬ Antigravity) នៅលើកុំព្យូទ័រណាក៏បាន។
> 4. AI នឹងបង្កើតកូដកម្មវិធីនេះឡើងវិញទាំងស្រុង ១០០% យ៉ាងសុក្រឹត និងដំណើរការល្អលើ GitHub Pages!

---

```markdown
You are an expert full-stack web developer and educational game designer. Build a complete, production-ready, beautiful Single-Page Web Application (SPA) called "ល្បែងសិក្សា អូរតាប្រុក (Ou Ta Pruk Learning Games)" — a modern Wordwall-like interactive educational suite in Khmer & English with AI quiz generation, 7 distinct game modes, rich themes, audio synthesizer, and curriculum tools.

The application must run 100% client-side without any backend servers (pure Vanilla HTML5, modern CSS3, and ES6 JavaScript). It must be fully deployable to GitHub Pages, Netlify, or run locally via `python -m http.server 8000`.

---

### 🎨 1. VISUAL DESIGN, THEMES & AUDIO SYNTHESIZER

1. **Modern Typography**:
   - Khmer Primary: `'Kantumruy Pro', sans-serif`
   - Khmer Decorative/Brand: `'Moul', cursive`
   - Latin/Numbers: `'Plus Jakarta Sans', sans-serif`
   - Load from Google Fonts CDN.

2. **4 Dynamic Switchable Themes** (Controlled via `body[data-theme="..."]`):
   - 🌿 **Jungle Forest** (`jungle`): Deep emerald/forest dark background (`#062316` to `#0b3b27`), emerald accent (`#10b981`), amber gold (`#f59e0b`).
   - 🎨 **Classic Colorful** (`classic`): Vibrant educational dark slate (`#0f172a` to `#1e293b`), bright blue (`#3b82f6`), indigo (`#6366f1`).
   - 🌌 **Cosmic Space** (`cosmic`): Deep midnight nebula (`#090d16` to `#131b2e`), cyan (`#06b6d4`), galactic purple (`#a855f7`).
   - ⚡ **Arcade Neon** (`neon`): High-energy cyberpunk dark (`#0a0a0f`), glowing neon green (`#22c55e`), hot pink (`#ec4899`), neon yellow (`#eab308`).

3. **Sticky Top Navigation Bar**:
   - Brand logo and title ("ល្បែងសិក្សា អូរតាប្រុក / Ou Ta Pruk Learning Games").
   - Lesson Quick Selector dropdown with 📚 Activity Library button.
   - 🇰🇭/🇬🇧 Bilingual language switcher button.
   - Theme dropdown selector.
   - 🔊 Audio Mute/Unmute button.
   - ⛶ Fullscreen toggle button.
   - 📂 Open Lesson File (`.json`), 💾 Save Lesson File (`.json`).
   - ✨ AI Generator button (glowing gradient CTA).

4. **Audio Synthesizer Engine (`audio.js`)**:
   - Zero external audio files (100% Web Audio API synthesized sound effects).
   - SFX: `pop` (gentle click), `flip` (card swoosh), `match` (harmonious high chime), `wrong` (low buzz), `openBox` (mystery fanfare), `ratchet` (wheel tick), `whack` (wooden mallet impact), `victory` (triumphant brass celebration chord).
   - Global volume and mute state saved to `localStorage`.

5. **Particle Confetti Celebration (`particles.js`)**:
   - Fullscreen interactive HTML5 canvas particle engine.
   - Functions: `fireConfetti()` (burst on card match / answer reveal), `fireCelebration()` (grand victory multi-angle confetti stream).

---

### 🌐 2. BILINGUAL INTERNATIONALIZATION (i18n)

- Full bidirectional dictionary supporting Khmer (`km`) and English (`en`).
- Seamless realtime switching without page reload.
- Remembers language in `localStorage.getItem('otpg_lang')`.
- Dynamic DOM binding using `data-i18n`, `data-i18n-placeholder`, `data-i18n-title`.

---

### 🎮 3. THE 7 COMPLETE INTERACTIVE GAME ENGINES

All 7 game engines dynamically mount into `#game-arena-container` and adapt to the current lesson's dataset:

#### 1. 🃏 Matching Pairs (បណ្ណផ្គូផ្គង)
- 3D CSS flip cards (`preserve-3d`, `backface-visibility: hidden`, dynamic z-index to prevent bleed).
- Matches Card A (Image/Prompt) with Card B (Word/Target).
- Matched cards freeze with green glow and checkmark.
- "👁️ បង្ហាញបណ្ណទាំងអស់ (Preview All)" toggle button to reveal cards for memorization.
- "🔀 ច្របល់បណ្ណឡើងវិញ (Reshuffle Deck)" button.
- Clean image error fallback to emoji without broken image icons.

#### 2. 🧩 Match Up (ផ្គូផ្គង)
- Split interactive columns (Left: Items/Images, Right: Shuffled Target Answers).
- Click to connect or drag to match.
- **Solved state**: Matched pairs display an animated red strikethrough line (`strikeThrough` animation), dimmed opacity (`0.45`), checkmark badge `✅`, and thumbnail image preview.

#### 3. 🎯 Quiz Gameshow (សំណួរចម្លើយ)
- Big screen gameshow question card with timer countdown, score, lives, and streak multiplier (🔥 x1.5, x2.0, x3.0).
- 4 multiple choice buttons (A, B, C, D) with randomized distractors + correct target.
- Instant animated feedback (green bounce for correct, red shake for wrong).

#### 4. 🎁 Open The Box (បើកប្រអប់អាថ៌កំបាំង)
- 3D gift boxes with unboxing sound and box number badges (`#1`, `#2`...).
- Clicking a box opens an interactive modal showing the box number `🎁 ប្រអប់លេខ #X`, emoji/image, and question prompt.
- **CRITICAL**: The answer is **hidden by default** so students can think and answer.
- Includes button: `👁️ បង្ហាញចម្លើយ` (Reveal Answer). Clicking it plays a chime sound, throws confetti, and pops in the green answer box `ពាក្យ / ចម្លើយ: [ចម្លើយ]`, toggling to `🙈 លាក់ចម្លើយ` (Hide Answer).
- Modal footer includes `✅ យល់ព្រម (Done)` button.

#### 5. 🎡 Student Wheel Picker & Team Maker (កង់ចាប់ឈ្មោះសិស្ស & ចែកក្រុម)
- **Tab 1 (🎡 Wheel Picker)**:
  - High-res HTML5 Canvas roulette wheel with golden rim rivets, center star hub, ratchet tick sound, pointer wobble, and winner fanfare modal (with "🗑️ ដកឈ្មោះចេញ" and "🎡 បង្វិលបន្ត" options).
  - **Customizable Duration**: Direct number input + unit selector (`វិនាទី (s)` / `នាទី (min)`) + quick preset chips (`⚡ 3s`, `⚡ 5s`, `⏱️ 10s`, `⏱️ 15s`, `⏳ 30s`, `⏳ 1 នាទី`) + synchronized range slider. Remembers duration in `localStorage`.
- **Tab 2 (👥 Group Maker)**:
  - Random team generator (2, 3, 4, 5, 6, 8 teams) with cute animal mascots (`🐯 ក្រុមខ្លា`, `🐘 ក្រុមដំរី`, `🦁 ក្រុមតោ`, `🦅 ក្រុមឥន្ទ្រី`...).
  - **Manual Trigger Only**: Displays welcome placeholder on tab switch; only generates teams when clicking `🎲 ចែកក្រុមដោយចៃដន្យ` button! Includes 1-click clipboard copy button.
- **Roster Management**:
  - Multi-line textarea for student names.
  - Excel/CSV import via SheetJS (`.xlsx`, `.xls`, `.csv`, `.txt`).
  - Shuffle, Clear, and auto-saves to `localStorage`.

#### 6. 🔠 Word Search Grid (ស្វែងរកពាក្យក្នុងតារាង)
- 8x8 Khmer syllable/cluster matrix with drag/touch selection ribbon and audio feedback.
- **CRITICAL KHMER UNICODE PRESERVATION**:
  - Fully preserves all Khmer consonants, sub-consonants (ជើង `្` U+17D2), dependent vowels (`ា`, `ែ`, `ី`, `ោ`...), and diacritics (`ំ`, `ះ`, `់`...).
  - NEVER use `[^\p{L}\p{N}\s]` which destroys Khmer combining marks (`\p{M}`). Use punctuation-only removal `/[\[\]{}"',.!?;:()]/g`.
  - Syllable segmentation dictionary for educational words (`ខ្លាធំ` ➔ `['ខ្លា', 'ធំ']`, `សាលារៀន` ➔ `['សា', 'លា', 'រៀន']`, `ឆ្កែ` ➔ `['ឆ្កែ']`, `ឆ្មា` ➔ `['ឆ្មា']`, `គោ` ➔ `['គោ']`...) with `Intl.Segmenter` fallback.
- **Clean Word Extraction**:
  - Never crams long question prompts into the grid; extracts short words (`target`).
  - Starts with **1 sample word by default** (e.g. `[ ខ្លា - ធំ ]`), and provides an inline editor bar (`✏️ ពាក្យ/ឃ្លា៖`), add single word input (`➕ បន្ថែម`), edit/delete icons, and clear all button (`🗑️ សម្អាត`).

#### 7. 🔨 Whack-a-Mole (វាយសត្វកណ្តុរ)
- 3x3 mole burrow holes with pop-up animation, correct target vs distractors, mallet impact sound, combo streak counter, lives, and timer.

---

### ✨ 4. GOOGLE GEMINI AI DIRECT CLOUD INTEGRATION (BYOK)

1. **Direct Google Gemini API Integration (`ai_generator.js`)**:
   - Calls Google Gemini 2.0 Flash / 1.5 Flash API directly from client browser (`https://generativelanguage.googleapis.com/v1beta/models/...`).
2. **Enforce API Key Requirement**:
   - AI generation is strictly blocked if API key is not entered; prompts user with a highlighted card and direct link to `aistudio.google.com/app/apikey`.
3. **Permanent Memory**:
   - Automatically saved to `localStorage.setItem('otpg_gemini_api_key', key)` so users enter it once and never need to enter it again.
   - Includes password visibility toggle (`👁️` / `🙈`) and Clear Key button (`🗑️`).
4. **Multimodal Input Sources & Image OCR Integration**:
   - **Text Topic Prompts**: Direct custom input with quick subject preset chips (Math, Science, History, Khmer, Animals, English).
   - **Textbook Page Photo Upload (Vision & OCR)**: Direct photo/screenshot upload with visual OCR analysis via Google Gemini Multimodal Vision API.
   - **Strict Grounding**: Generates questions strictly based on user-requested curriculum topics and textbook photos.
5. **Live AI Reasoning Visualizer**:
   - Displays animated progress bar, status ticker, model badge, and review list with 1-click "🚀 Apply & Play Now" or "✏️ Open in Creator Studio".

---

### 🎨 5. CREATOR STUDIO & IMAGE GENERATOR (`creator.js`)

1. **Activity Builder**:
   - Manage title, description, category, default game template, timer, lives, auto-shuffle.
   - Add/edit/delete matching pairs (Side A / Prompt, Side B / Target, Hint, Distractors, Emoji, Image).
2. **Dedicated Whack-a-Mole Studio (`whack_creator.js`)**:
   - Custom-tailored question builder strictly for Whack-a-Mole gameplay.
   - Question Prompt input, Multi-target correct moles (e.g. `ស្វាយ, ចេក, ក្រូច, ប៉ោម`), and Multi-distractor wrong traps (e.g. `ការ៉ុត, ស្ពៃ, ត្រកួន`).
   - Mole Speed selector (🐢 Slow - 1.8s, 🚶‍♂️ Normal - 1.3s, ⚡ Fast - 0.9s), custom lives (3 / 5), and timer.
   - Dedicated direct launcher button `🐹 រៀបចំសំណួរវាយកណ្តុរ` on Whack-a-Mole game screen.
3. **Save & Export**:
   - Save to LocalStorage, Export `.json` file to PC, Import `.json` file from PC.

---

### 📚 6. ACTIVITY LIBRARY & PRELOADED CURRICULUM (`data.js`)

Preload high-quality Cambodian curriculum activities:
1. 🐯 **រូបភាពសត្វ និងឈ្មោះ (Animals Image to Word)** (Matching Pairs)
2. ➕ **គណិតវិទ្យាថ្នាក់ទី៤៖ វិធីបូក និងដក (4th Grade Math)** (Quiz Gameshow)
3. 🌱 **វិទ្យាសាស្ត្រ៖ ផ្នែក និងនាទីរបស់រុក្ខជាតិ (Plant Biology)** (Match Up)
4. 🏛️ **ប្រវត្តិវិទ្យា៖ ប្រាសាទបុរាណសម័យអង្គរ (Angkor Wat History)** (Open The Box)
5. 📖 **ភាសាខ្មែរ៖ រឿង កញ្ជ្រោងនិងមាន់ចែ (Khmer Moral Story)** (Word Search)
6. 🇬🇧 **English Vocabulary: School & Classroom** (Whack-a-Mole)

---

### 📦 7. DEPLOYMENT & BUNDLING SPECIFICATIONS

- Zero build dependencies (no webpack/vite required unless desired).
- Include `make_bundle.py` (merges CSS) and `make_js_bundle.py` (merges JS into standalone `app.bundle.js` and `app.v2.js`).
- Include `.nojekyll` and `index.html` referencing `bundle.css` and `app.v2.js` for instant GitHub Pages hosting.
```
