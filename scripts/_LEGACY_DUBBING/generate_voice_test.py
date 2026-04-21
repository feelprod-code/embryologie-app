import os
from google.cloud import texttospeech
import re

# Set credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "gen-lang-client-0754661614-09b6668250b7.json"

# Initialize the client
client = texttospeech.TextToSpeechClient()

TEXT = "Embryology will lead you to seek honesty in your feelings. And that can be unsettling because we'll have to go into another context which is not a context where will can intervene. That is, I cannot have a pure voluntary act, I must be in an act of participation."

def text_to_ssml(text, rate=1.0, pitch="0st", voice_type="Chirp3"):
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    text = re.sub(r'([\.!?;])\s+', r'\1 <break time="500ms"/> ', text)
    text = re.sub(r'(,)\s+', r'\1 <break time="200ms"/> ', text)
    
    pitch_attr = f' pitch="{pitch}"' if "Studio" not in voice_type else ""
    return f'<speak><prosody rate="{rate:.2f}"{pitch_attr}>{text}</prosody></speak>'

def generate_sample(name, ssml, voice_name):
    print(f"Generating {name} with {voice_name}...")
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml)
    
    parts = voice_name.split("-")
    lang_code = f"{parts[0]}-{parts[1]}"
    
    voice = texttospeech.VoiceSelectionParams(language_code=lang_code, name=voice_name)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)
    
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    output_path = f"public/audio/test_voice_{name}.wav"
    with open(output_path, "wb") as out:
        out.write(response.audio_content)
    print(f"Saved to {output_path}")

# Variation A: Current Marc (Alnilam, -4st, Slow 1.0)
ssml_a = text_to_ssml(TEXT, rate=0.95, pitch="-4st", voice_type="Chirp3")
generate_sample("A_current", ssml_a, "en-US-Chirp3-HD-Alnilam")

# Variation B: Clearer Marc (Alnilam, -2st, Natural 1.05)
ssml_b = text_to_ssml(TEXT, rate=1.05, pitch="-2st", voice_type="Chirp3")
generate_sample("B_brisk", ssml_b, "en-US-Chirp3-HD-Alnilam")

# Variation C: Studio Voice (English Studio-O, very high end)
ssml_c = text_to_ssml(TEXT, rate=1.00, pitch="0st", voice_type="Studio")
generate_sample("C_studio", ssml_c, "en-US-Studio-Q") # Studio Q is quite deep and natural
