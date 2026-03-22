import re
import json

with open('./src/data/videoCourses.ts', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('id: "oeil-1",')
end_idx = text.find('id: "oreil-1",', start_idx)
if end_idx == -1: end_idx = text.find('id: "nerv-1",', start_idx)
if end_idx == -1: end_idx = len(text)

segment = text[start_idx:end_idx]

videos = []
blocks = segment.split('id: "oeil-')
for b in blocks[1:]:
    title_match = re.search(r'title:\s*"([^"]+)"', b)
    duration_match = re.search(r'duration:\s*"([^"]+)"', b)
    desc_match = re.search(r'shortSummary:\s*"([^"]+)"', b)
    
    if title_match:
        videos.append({
            "title": title_match.group(1),
            "time": duration_match.group(1) if duration_match else "00:00",
            "desc": (desc_match.group(1)[:80] + '...') if desc_match else "",
            "hasTranscript": True
        })

print(json.dumps(videos, indent=2))
