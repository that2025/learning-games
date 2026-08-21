import urllib.request
import json

key = 'AQ.Ab8RN6IniRJqpP81VhGvZBMeBc5I73pi6iZV4PNIG1Q1ZwbXkA'
models = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-lite-latest', 'gemini-3.1-flash-lite', 'gemma-4-26b-a4b-it']

prompt = """You are an expert Cambodian curriculum educational quiz generator.
User Requested Topic: "សត្វស្រុក".
Target Count: Exactly 8 questions.
Output: Strict JSON format ONLY.
Structure:
{
  "title": "សត្វស្រុក",
  "category": "Animals",
  "items": [
    {
      "emoji": "🐕",
      "prompt": "តើសត្វមួយណាជាសត្វស្រុក?",
      "target": "ឆ្កែ",
      "hint": "សត្វចាំផ្ទះ",
      "distractors": ["ខ្លា", "ដំរីព្រៃ", "សត្វតោ"]
    }
  ]
}"""

for m in models:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={key}'
    payload = {
        'contents': [{'parts': [{'text': prompt}]}],
        'generationConfig': {'temperature': 0.3, 'responseMimeType': 'application/json'}
    }
    req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            text = data['candidates'][0]['content']['parts'][0]['text']
            print(f'SUCCESS with {m}:')
            print(text[:300])
            break
    except urllib.error.HTTPError as e:
        print(f'FAILED with {m} HTTP {e.code}: {e.read().decode("utf-8")[:150]}')
    except Exception as e:
        print(f'FAILED with {m}: {e}')
