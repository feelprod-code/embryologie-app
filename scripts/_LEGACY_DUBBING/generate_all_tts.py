import os
import re
import wave
import ast
import time
from google.cloud import texttospeech

# Set credentials to the JSON file we just downloaded
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gen-lang-client-0754661614-09b6668250b7.json"

client = texttospeech.TextToSpeechClient()

# Mapping languages to specific Google Cloud TTS voice profiles
# Neural2 is premium, Wavenet is fallback
VOICE_MAP = {
    "es": {"Philippe Guillaume": "es-ES-Neural2-F", "Marc Damoiseaux": "es-ES-Neural2-G", "Default": "es-ES-Neural2-F"},
    "ja": {"Philippe Guillaume": "ja-JP-Neural2-C", "Marc Damoiseaux": "ja-JP-Neural2-D", "Default": "ja-JP-Neural2-C"},
    "zh": {"Philippe Guillaume": "cmn-CN-Wavenet-C", "Marc Damoiseaux": "cmn-CN-Wavenet-B", "Default": "cmn-CN-Wavenet-C"},
    "de": {"Philippe Guillaume": "de-DE-Neural2-D", "Marc Damoiseaux": "de-DE-Neural2-B", "Default": "de-DE-Neural2-D"}, # Adjusted fallback to known Wavenet if Neural doesn't exist later
    "it": {"Philippe Guillaume": "it-IT-Neural2-C", "Marc Damoiseaux": "it-IT-Neural2-A", "Default": "it-IT-Neural2-C"},
    "en": {"Philippe Guillaume": "en-US-Neural2-D", "Marc Damoiseaux": "en-US-Neural2-J", "Default": "en-US-Neural2-D"}
}

LANGUAGES = ["en", "es", "ja", "zh", "de", "it"]
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
    print(f"\n--- Generating podcast for {lang.upper()} using Google Cloud TTS ---")
    ts_file_path = f"src/data/podcasts_{lang}.ts"
    if not os.path.exists(ts_file_path):
        print(f"Skipping {lang}: File {ts_file_path} not found.")
        continue

    with open(ts_file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract transcript
    match = re.search(r'"transcript"\s*:\s*("(?:\\.|[^"\\])*"|`[\s\S]*?`)', content, re.DOTALL)
    if not match:
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

    if not blocks:
        continue
    
    chunks_dir = os.path.join(OUTPUT_BASE_DIR, f"chunks_{lang}_wav")
    os.makedirs(chunks_dir, exist_ok=True)

    chunk_files = []
    for i, block in enumerate(blocks):
        pad_index = str(i).zfill(4)
        out_file = os.path.join(chunks_dir, f"chunk_{pad_index}.wav")
        chunk_files.append(out_file)
        
        if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
            continue
            
        speaker = block['speaker']
        text = block['text']
        
        # Get voice
        voice_map = VOICE_MAP.get(lang, VOICE_MAP["en"])
        voice_name = voice_map.get("Default")
        for k, v in voice_map.items():
            if k in speaker:
                voice_name = v
                break
                
        # Split voice name backwards to get language code
        parts = voice_name.split("-")
        lang_code = f"{parts[0]}-{parts[1]}"
        
        # Ensure we always get valid standard fallback if Neural fails
        if "de-" in lang_code and "Neural2-D" in voice_name:
            voice_name = "de-DE-Neural2-F" # Male fallback

        print(f"[{pad_index}/{len(blocks)}] Generating text for {lang.upper()} using {voice_name}...")
        
        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=lang_code,
            name=voice_name
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.LINEAR16
        )
        
        try:
            response = client.synthesize_speech(
                input=synthesis_input, voice=voice, audio_config=audio_config
            )
            with open(out_file, "wb") as out:
                out.write(response.audio_content)
        except Exception as e:
            # Fallback to standard if premium voice doesn't exist
            print(f"Error {e}. Trying Wavenet fallback.")
            try: 
                fallback_name = lang_code + "-Wavenet-B"
                voice.name = fallback_name
                response = client.synthesize_speech(
                    input=synthesis_input, voice=voice, audio_config=audio_config
                )
                with open(out_file, "wb") as out:
                    out.write(response.audio_content)
            except Exception as e2:
                print(f"Fallback also failed: {e2}")

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

print("All podcasts generated via Google Cloud API!")
