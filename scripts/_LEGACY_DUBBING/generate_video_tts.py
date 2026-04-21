import urllib.request
import urllib.error
import re
import os
import json
import base64
import time
import os
import wave
import subprocess

API_KEY = os.environ.get("GEMINI_API_KEY", "")
VOICE_PROFILES = {
    "fr": "Puck",
    "en": "Puck",
    "es": "Puck",
    "de": "Puck",
    "it": "Puck",
    "ja": "Puck",
    "zh": "Puck"
}

FFMPEG_BIN = "./scripts/ffmpeg"

def parse_vtt_time(time_str):
    time_str = time_str.replace(',', '.')
    parts = time_str.split(':')
    if len(parts) == 3:
        return int(parts[0]) * 3600 + int(parts[1]) * 60 + float(parts[2])
    elif len(parts) == 2:
        return int(parts[0]) * 60 + float(parts[2])
    return 0

def get_wav_duration(wav_path):
    try:
        with wave.open(wav_path, 'r') as w:
            frames = w.getnframes()
            rate = w.getframerate()
            return frames / float(rate)
    except:
        return 0

def create_silence(duration_sec, output_path):
    # Generates a mono 24khz silence 
    subprocess.run([
        FFMPEG_BIN, "-y", "-f", "lavfi", "-i", f"anullsrc=r=24000:cl=mono", 
        "-t", str(duration_sec), "-c:a", "pcm_s16le", output_path
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def adjust_speed_and_format(input_path, output_path, target_duration):
    actual_duration = get_wav_duration(input_path)
    if actual_duration <= 0:
        return False
        
    if actual_duration > target_duration:
        ratio = actual_duration / target_duration
        # ffmpeg atempo supports mostly 0.5 to 100.0
        subprocess.run([
            FFMPEG_BIN, "-y", "-i", input_path,
            "-filter:a", f"atempo={ratio},aresample=24000,aformat=sample_fmts=s16:channel_layouts=mono",
            output_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        # Just normalize the format to be safe for concatenation
        subprocess.run([
            FFMPEG_BIN, "-y", "-i", input_path,
            "-filter:a", "aresample=24000,aformat=sample_fmts=s16:channel_layouts=mono",
            output_path
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return True

def process_vtt(vtt_file, lang, output_wav):
    print(f"Processing VTT: {vtt_file} ({lang})")
    with open(vtt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    blocks = []
    i = 0
    while i < len(lines):
        if '-->' in lines[i]:
            start_str, end_str = lines[i].split('-->')
            start = parse_vtt_time(start_str.strip())
            # Ensure we strip out positioning data from VTT end time
            end = parse_vtt_time(end_str.strip().split()[0])
            i += 1
            text = ""
            while i < len(lines) and lines[i].strip() != "":
                clean_line = re.sub(r'<[^>]+>', '', lines[i]) # strip html
                text += clean_line.strip() + " "
                i += 1
            if text.strip() and text.strip() != "WEBVTT":
                blocks.append({"start": start, "end": end, "text": text.strip()})
        else:
            i += 1

    if not blocks:
        print("No valid TTS blocks found.")
        return

    work_dir = f"public/vtt/temp_{os.path.basename(vtt_file)}"
    os.makedirs(work_dir, exist_ok=True)
    
    current_time = 0.0
    concat_list_path = os.path.join(work_dir, "concat.txt")
    concat_files = []
    
    for idx, block in enumerate(blocks):
        print(f"[{idx+1}/{len(blocks)}] {block['start']}s -> {block['end']}s : {block['text'][:50]}...")
        
        # 1. Manage silence gap
        if block['start'] > current_time:
            gap = block['start'] - current_time
            silence_file = os.path.join(work_dir, f"gap_{idx}.wav")
            create_silence(gap, silence_file)
            concat_files.append(silence_file)
            current_time = block['start']
            
        # 2. Generate Audio chunk
        chunk_raw = os.path.join(work_dir, f"raw_{idx}.wav")
        chunk_processed = os.path.join(work_dir, f"proc_{idx}.wav")
        
        target_duration = block['end'] - block['start']
        
        # Call Gemini if not cached
        if not os.path.exists(chunk_raw) or os.path.getsize(chunk_raw) < 1000:
            voiceName = VOICE_PROFILES.get(lang, "Puck")
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
                                with open(chunk_raw, 'wb') as fo: 
                                    fo.write(base64.b64decode(part['inlineData']['data']))
                                success = True
                                time.sleep(1) # Base rate limit padding
                except urllib.error.HTTPError as e:
                    if e.code == 429:
                        print("Rate limit reached. Waiting 30s...")
                        time.sleep(30)
                    else:
                        print(f"HTTP Error {e.code}")
                        success = True
                except Exception as e:
                    print(f"Error {e}")
                    success = True
        
        # Process Speed and Format
        if os.path.exists(chunk_raw) and os.path.getsize(chunk_raw) > 1000:
            adjust_speed_and_format(chunk_raw, chunk_processed, target_duration)
            concat_files.append(chunk_processed)
            # Advance current time by the actual post-processed length
            actual_len = get_wav_duration(chunk_processed)
            current_time += actual_len
        else:
            # Fallback if API totally failed
            current_time = block['end']

    # Write concat instructions
    with open(concat_list_path, 'w') as cw:
        for cf in concat_files:
            cw.write(f"file '{os.path.abspath(cf)}'\n")
            
    # Assemble the final video audio track!
    print(f"Assemblage final vers {output_wav}")
    subprocess.run([
        FFMPEG_BIN, "-y", "-f", "concat", "-safe", "0", "-i", concat_list_path,
        "-c", "copy", output_wav
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    print(f"Terminé pour {output_wav} !")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python generate_video_tts.py <vtt_file> <lang> <output_wav>")
        sys.exit(1)
    process_vtt(sys.argv[1], sys.argv[2], sys.argv[3])
