import os
import re
import urllib.request
import urllib.error
import json
import base64
import wave
import ast
import time

API_KEY = "AIzaSyBU5-swcwLGzs5g7FT2bh26B7YKgToRJZo"

# Using standard prebuilt voices for Gemini-3.1-flash-tts
VOICE_PROFILES = {
    "Philippe Guillaume": "Puck",
    "Marc Damoiseaux": "Aoede",
    "Default": "Puck"
}

LANGUAGES = ["es", "ja", "zh", "de", "it"]
OUTPUT_BASE_DIR = "public/audio"

if not os.path.exists(OUTPUT_BASE_DIR):
    os.makedirs(OUTPUT_BASE_DIR)

# Function to concatenate WAV files
def concatenate_wavs(wav_files, output_file):
    if not wav_files:
        return
    data = []
    first_valid = None
    params = None
    for f in wav_files:
        try:
            with wave.open(f, 'rb') as w:
                if params is None:
                    params = w.getparams()
                    first_valid = f
                if w.getparams() == params:
                    data.append(w.readframes(w.getnframes()))
                else:
                    print(f"Warning: {f} has different parameters, skipping...")
        except Exception as e:
            print(f"Error reading {f}: {e}")

    if not data:
        print("No valid WAV files to concatenate.")
        return

    try:
        with wave.open(output_file, 'wb') as output_w:
            output_w.setparams(params)
            for d in data:
                output_w.writeframes(d)
    except Exception as e:
        print(f"Failed to write output WAV: {e}")

for lang in LANGUAGES:
    print(f"\n--- Generating podcast for {lang.upper()} using Gemini TTS ---")
    ts_file_path = f"src/data/podcasts_{lang}.ts"
    if not os.path.exists(ts_file_path):
        print(f"Skipping {lang}: File {ts_file_path} not found.")
        continue

    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Robust matching of TS string format:
    match = re.search(r'"transcript"\s*:\s*("(?:\\.|[^"\\])*"|`[\s\S]*?`)', content, re.DOTALL)
    if not match:
        print(f"Skipping {lang}: No transcript property found.")
        continue

    raw_str = match.group(1)
    if raw_str.startswith('`'):
        transcript = raw_str[1:-1]
    else:
        try:
            transcript = ast.literal_eval(raw_str)
        except Exception:
            transcript = raw_str[1:-1].replace('\\n', '\n').replace('\\"', '"')

    blocks = []
    pattern = re.compile(r'(\d{2}:\d{2})\s+(.*?)\n([\s\S]*?)(?=(?:\d{2}:\d{2}\s+)|$)', re.MULTILINE)
    for m in pattern.finditer(transcript):
        speaker = m.group(2).strip()
        text = m.group(3).strip()
        if text: 
            blocks.append({
                "timestamp": m.group(1).strip(),
                "speaker": speaker,
                "text": text
            })

    print(f"Detected {len(blocks)} blocks for {lang}.")
    if not blocks:
        continue
    
    chunks_dir = os.path.join(OUTPUT_BASE_DIR, f"chunks_{lang}_wav")
    if not os.path.exists(chunks_dir):
        os.makedirs(chunks_dir)

    chunk_files = []
    for i, block in enumerate(blocks):
        pad_index = str(i).zfill(4)
        out_file = os.path.join(chunks_dir, f"chunk_{pad_index}.wav")
        chunk_files.append(out_file)
        
        if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            continue
            
        speaker = block['speaker']
        text = block['text']
        
        voiceName = VOICE_PROFILES.get("Default")
        for k, v in VOICE_PROFILES.items():
            if k in speaker:
                voiceName = v
                break
        
        print(f"[{pad_index}/{len(blocks)}] Generating text for {speaker}...")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key={API_KEY}"
        data_str = json.dumps({
            "contents": [{"parts": [{"text": text}]}],
            "generationConfig": {
                "speechConfig": {
                    "voiceConfig": {
                        "prebuiltVoiceConfig": {
                            "voiceName": voiceName
                        }
                    }
                }
            }
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data_str, headers={'Content-Type': 'application/json'})
        
        success = False
        while not success:
            try:
                with urllib.request.urlopen(req) as response:
                    result = json.loads(response.read().decode('utf-8'))
                    if 'candidates' in result:
                        part = result['candidates'][0]['content']['parts'][0]
                        if 'inlineData' in part:
                             audio_data = base64.b64decode(part['inlineData']['data'])
                             with open(out_file, 'wb') as f_out:
                                 f_out.write(audio_data)
                             success = True
                             time.sleep(1) # Prevent immediate rate limit blocking
                        else:
                             print(f"API returned no inlineData for block {i}.")
                             success = True
            except urllib.error.HTTPError as e:
                err_text = e.read().decode('utf-8')
                if e.code == 429:
                    print("Rate limit exceeded. Waiting 30 seconds...")
                    time.sleep(30)
                else:
                    print(f"API HTTP Error for {lang} block {i}: {e.code}\n{err_text[:200]}")
                    success = True # Stop trying on unknown errors
            except Exception as e:
                print(f"API Error for {lang} block {i}: {e}")
                success = True

    # Concatenate using wave module
    final_output = os.path.join(OUTPUT_BASE_DIR, f"podcast_tdt_{lang}.wav")
    
    print(f"Concatenating WAV files into {final_output}...")
    try:
        valid_chunks = [cf for cf in chunk_files if os.path.exists(cf) and os.path.getsize(cf) > 1000]
        if valid_chunks:
            concatenate_wavs(valid_chunks, final_output)
            print(f"Successfully created {final_output}")
    except Exception as e:
        print(f"Error concatenating: {e}")

print("All generation tasks finished.")
