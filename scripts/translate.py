import re
import json
import os
import requests
import time
from typing import List, Dict, Any

OPENROUTER_API_KEY = os.environ.get("VITE_OPENROUTER_API_KEY") 
if not OPENROUTER_API_KEY:
    try:
        from dotenv import load_dotenv
        load_dotenv("../.env")
        OPENROUTER_API_KEY = os.environ.get("VITE_OPENROUTER_API_KEY")
    except:
        pass

if not OPENROUTER_API_KEY:
    print("VITE_OPENROUTER_API_KEY not found in env or .env file.")
    exit(1)


def translate_text(text: str, target_lang: str) -> str:
    if not text or len(text.strip()) == 0:
        return text

    system_prompt = f"You are a professional medical translator. Translate the following French medical and embryology text into {target_lang}. Preserve all markdown formatting exactly as it is (like #, ##, **, >). ONLY OUTPUT THE TRANSLATED TEXT AND ABSOLUTELY NOTHING ELSE. NO INTRODUCTIONS. NO EXPLANATIONS."

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Embryo App Translator",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "google/gemini-2.5-flash",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ],
        "temperature": 0.3
    }

    try:
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Translation error: {e}")
        return text # fallback to original on error

def process_file(source_file: str, dest_file_en: str, dest_file_es: str, array_name: str):
    print(f"Reading {source_file}...")
    with open(source_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Use a highly specific regex or just let a custom script extraction handle it.
    # Since these are pure typescript arrays at the bottom of the files, we'll extract them.
    # We will build a simple AST-like parser since we know the format.
    pass

# Due to complexity of parsing TS, let's write a JS script instead using ts-node or similar.
