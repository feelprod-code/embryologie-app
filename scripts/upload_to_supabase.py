import os
import glob
import urllib.request
import urllib.error

SUPABASE_URL = "https://eqcjgucfpmhvxkckokwb.supabase.co"
# Automatically pull the service role key from .env.local
SERVICE_ROLE_KEY = ""
try:
    with open(".env.local", "r") as f:
        for line in f:
            if line.startswith("VITE_SUPABASE_SERVICE_ROLE_KEY="):
                SERVICE_ROLE_KEY = line.split("=", 1)[1].strip().strip('"')
                break
except Exception as e:
    print(f"Error reading .env.local: {e}")

if not SERVICE_ROLE_KEY:
    try:
        with open("../../.env", "r") as f:
            for line in f:
                if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
                    SERVICE_ROLE_KEY = line.split("=", 1)[1].strip().strip('"')
                    break
    except:
        pass

if not SERVICE_ROLE_KEY:
    print("Could not find VITE_SUPABASE_SERVICE_ROLE_KEY in .env.local")
    exit(1)

audio_files = glob.glob("public/audio/podcast_tdt_*.wav")
if not audio_files:
    print("No .wav files found in public/audio/ to upload.")
    exit(0)

for file_path in audio_files:
    file_name = os.path.basename(file_path)
    print(f"Uploading {file_name} to Supabase storage...")
    
    upload_url = f"{SUPABASE_URL}/storage/v1/object/podcasts/{file_name}"
    
    with open(file_path, 'rb') as audio_file:
        data = audio_file.read()
    
    req = urllib.request.Request(upload_url, data=data, method="POST")
    req.add_header('apikey', SERVICE_ROLE_KEY)
    req.add_header('Authorization', f'Bearer {SERVICE_ROLE_KEY}')
    req.add_header('Content-Type', 'audio/wav')
    
    try:
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                print(f"Successfully uploaded {file_name}!")
            else:
                print(f"Unexpected status code for {file_name}: {response.status}")
    except urllib.error.HTTPError as e:
        if e.code == 400 and "Duplicate" in e.read().decode('utf-8'): # Supabase duplicate error usually 400
             print(f"{file_name} already exists. To overwrite, we should use PUT. Doing PUT now...")
             req = urllib.request.Request(upload_url, data=data, method="PUT")
             req.add_header('apikey', SERVICE_ROLE_KEY)
             req.add_header('Authorization', f'Bearer {SERVICE_ROLE_KEY}')
             req.add_header('Content-Type', 'audio/wav')
             try:
                 with urllib.request.urlopen(req) as resp_put:
                     print(f"Successfully updated/overwritten {file_name}!")
             except Exception as e_put:
                 print(f"Failed to PUT {file_name}: {e_put}")
                 if hasattr(e_put, 'read'):
                    print(e_put.read().decode('utf-8'))
        else:
            print(f"Failed to upload {file_name}: HTTP {e.code}")
            try:
                print(e.read().decode('utf-8'))
            except:
                pass
    except Exception as e:
         print(f"Error uploading {file_name}: {e}")

print("Upload task finished.")
