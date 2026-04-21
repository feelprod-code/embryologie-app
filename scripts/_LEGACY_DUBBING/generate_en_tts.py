import urllib.request
import urllib.error
import re
import os
import ast
import json
import base64
import time
import wave

API_KEY = os.environ.get("GEMINI_API_KEY", "")
VOICE_PROFILES = {"Philippe Guillaume": "Puck", "Marc Damoiseaux": "Aoede", "Default": "Puck"}

lang = "en"
OUTPUT_BASE_DIR = "public/audio"
ts_file_path = f"src/data/podcasts_{lang}.ts"

def concatenate_wavs(wav_files, output_file):
    if not wav_files: return
    data = []
    params = None
    for f in wav_files:
        try:
            with wave.open(f, 'rb') as w:
                if params is None: params = w.getparams()
                if w.getparams() == params: data.append(w.readframes(w.getnframes()))
        except: pass
    if not data: return
    try:
        with wave.open(output_file, 'wb') as output_w:
            output_w.setparams(params)
            for d in data: output_w.writeframes(d)
    except: pass

print(f"Generating podcast for {lang.upper()}")
with open(ts_file_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'"transcript"\s*:\s*("(?:\\.|[^"\\])*"|`[\s\S]*?`)', content, re.DOTALL)
if match:
    raw_str = match.group(1)
    if raw_str.startswith('`'): transcript = raw_str[1:-1]
    else:
        try: transcript = ast.literal_eval(raw_str)
        except: transcript = raw_str[1:-1].replace('\\n', '\n').replace('\\"', '"')
    
    blocks = []
    pattern = re.compile(r'(\d{2}:\d{2})\s+(.*?)\n([\s\S]*?)(?=(?:\d{2}:\d{2}\s+)|$)', re.MULTILINE)
    for m in pattern.finditer(transcript):
        speaker = m.group(2).strip()
        text = m.group(3).strip()
        if text: blocks.append({"timestamp": m.group(1).strip(), "speaker": speaker, "text": text})

    if blocks:
        chunks_dir = os.path.join(OUTPUT_BASE_DIR, f"chunks_{lang}_wav")
        os.makedirs(chunks_dir, exist_ok=True)
        chunk_files = []
        for i, block in enumerate(blocks):
            pad_index = str(i).zfill(4)
            out_file = os.path.join(chunks_dir, f"chunk_{pad_index}.wav")
            chunk_files.append(out_file)
            
            if os.path.exists(out_file) and os.path.getsize(out_file) > 1000: continue
            print(f"[{pad_index}/{len(blocks)}] Generating text for {block['speaker']}...")
            
            voiceName = VOICE_PROFILES.get("Default")
            for k, v in VOICE_PROFILES.items():
                if k in block['speaker']: voiceName = v; break
                
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key={API_KEY}"
            data_str = json.dumps({"contents": [{"parts": [{"text": block['text']}]}], "generationConfig": {"speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voiceName}}}}}).encode('utf-8')
            req = urllib.request.Request(url, data=data_str, headers={'Content-Type': 'application/json'})
            
            success = False
            while not success:
                try:
                    with urllib.request.urlopen(req) as resp:
                        res = json.loads(resp.read().decode('utf-8'))
                        if 'candidates' in res:
                            part = res['candidates'][0]['content']['parts'][0]
                            if 'inlineData' in part:
                                with open(out_file, 'wb') as fo: fo.write(base64.b64decode(part['inlineData']['data']))
                                success = True; time.sleep(1)
                except urllib.error.HTTPError as e:
                    if e.code == 429: time.sleep(30)
                    else: success = True
                except: success = True
                
        final_output = os.path.join(OUTPUT_BASE_DIR, f"podcast_tdt_{lang}.wav")
        valid_chunks = [cf for cf in chunk_files if os.path.exists(cf) and os.path.getsize(cf) > 1000]
        if valid_chunks:
            concatenate_wavs(valid_chunks, final_output)
            print("Done")
