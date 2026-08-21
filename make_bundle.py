import os
import re

DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Combine CSS
css_files = [
    os.path.join(DIR, 'css', 'themes.css'),
    os.path.join(DIR, 'css', 'main.css'),
    os.path.join(DIR, 'css', 'games.css')
]

combined_css = ''
for f in css_files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8') as file:
            combined_css += f'/* --- {os.path.basename(f)} --- */\n' + file.read() + '\n\n'

with open(os.path.join(DIR, 'bundle.css'), 'w', encoding='utf-8') as file:
    file.write(combined_css)
print("Created bundle.css")

# Also copy games.css, main.css, themes.css to root so any link works
for f in css_files:
    if os.path.exists(f):
        base = os.path.basename(f)
        with open(f, 'r', encoding='utf-8') as src:
            with open(os.path.join(DIR, base), 'w', encoding='utf-8') as dst:
                dst.write(src.read())

print("Copied root CSS files.")
