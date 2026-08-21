import os
import re

DIR = os.path.dirname(os.path.abspath(__file__))

# Order of bundling to resolve dependencies
files_order = [
    os.path.join(DIR, 'js', 'audio.js'),
    os.path.join(DIR, 'js', 'i18n.js'),
    os.path.join(DIR, 'js', 'particles.js'),
    os.path.join(DIR, 'js', 'data.js'),
    os.path.join(DIR, 'js', 'games', 'pairs.js'),
    os.path.join(DIR, 'js', 'games', 'match.js'),
    os.path.join(DIR, 'js', 'games', 'quiz.js'),
    os.path.join(DIR, 'js', 'games', 'box.js'),
    os.path.join(DIR, 'js', 'games', 'wheel.js'),
    os.path.join(DIR, 'js', 'games', 'wordsearch.js'),
    os.path.join(DIR, 'js', 'games', 'whack.js'),
    os.path.join(DIR, 'js', 'components', 'leaderboard.js'),
    os.path.join(DIR, 'js', 'components', 'activity_manager.js'),
    os.path.join(DIR, 'js', 'components', 'ai_generator.js'),
    os.path.join(DIR, 'js', 'components', 'creator.js'),
    os.path.join(DIR, 'js', 'app.js'),
]

bundled_js = '/* ==========================================================================\n'
bundled_js += '   Ou Ta Pruk Learning Games - Standalone All-In-One Unified Bundle\n'
bundled_js += '   ========================================================================== */\n\n'

for filepath in files_order:
    if not os.path.exists(filepath):
        print(f"Warning: {filepath} not found!")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove import lines
    content = re.sub(r'import\s+[\s\S]*?from\s+[\'"].*?[\'"];?', '', content)
    
    # Replace export default or export class / const / function / let
    content = re.sub(r'export\s+default\s+', '', content)
    content = re.sub(r'export\s+(class|const|function|let|var)\s+', r'\1 ', content)
    content = re.sub(r'export\s*\{[\s\S]*?\};?', '', content)
    
    bundled_js += f'\n// ==================== START: {os.path.basename(filepath)} ====================\n'
    bundled_js += content
    bundled_js += f'\n// ==================== END: {os.path.basename(filepath)} ====================\n'

out_path = os.path.join(DIR, 'app.bundle.js')
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(bundled_js)

out_path2 = os.path.join(DIR, 'app.v2.js')
with open(out_path2, 'w', encoding='utf-8') as f:
    f.write(bundled_js)

print(f"Successfully created standalone app.bundle.js and app.v2.js ({len(bundled_js)} bytes)")
