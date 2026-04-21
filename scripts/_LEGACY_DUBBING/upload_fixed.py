import os
import urllib.request
import urllib.error

# Config Supabase
SUPABASE_URL = "https://eqcjgucfpmhvxkckokwb.supabase.co"
SERVICE_ROLE_KEY = ""
try:
    with open(".env.local", "r") as f:
        for line in f:
            if line.startswith("VITE_SUPABASE_SERVICE_ROLE_KEY="):
                SERVICE_ROLE_KEY = line.split("=", 1)[1].strip().strip('"')
                break
except Exception:
    pass

def upload_wav(file_path, file_name):
    print(f"Uploading {file_name} to Supabase bucket 'podcasts'...")
    upload_url = f"{SUPABASE_URL}/storage/v1/object/podcasts/{file_name}"
    
    with open(file_path, 'rb') as audio_file:
        data = audio_file.read()
    
    # Try PUT first to overwrite
    req = urllib.request.Request(upload_url, data=data, method="PUT")
    req.add_header('apikey', SERVICE_ROLE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_ROLE_KEY}')
    req.add_header('Content-Type', 'audio/wav')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                print(f"Successfully uploaded {file_name}!")
            else:
                print(f"Unexpected status code for {file_name}: {response.status}")
    except Exception as e:
         print(f"Error uploading {file_name}: {e}")

# Upload regenerated videos
# Video 1: 9928d1d298f329797032bb5abd4e3e59
# Video 2: 50b5c488080885643ba4424c9d7681f6
upload_wav("public/audio/video_9928d1d298f329797032bb5abd4e3e59_en.wav", "video_9928d1d298f329797032bb5abd4e3e59_en.wav")
upload_wav("public/audio/video_50b5c488080885643ba4424c9d7681f6_en.wav", "video_50b5c488080885643ba4424c9d7681f6_en.wav")
