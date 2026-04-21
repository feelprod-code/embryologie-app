import re
import json

def parse_vtt_time(time_str):
    time_str = time_str.replace(',', '.')
    parts = time_str.split(':')
    if len(parts) == 3:
        h, m, s = int(parts[0]), int(parts[1]), float(parts[2])
        return h * 3600 + m * 60 + s
    elif len(parts) == 2:
        m, s = int(parts[0]), float(parts[1])
        return m * 60 + s
    return 0

def analyze_vtt(vtt_file):
    with open(vtt_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    blocks = []
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if '-->' in line:
            start_str, end_str = line.split('-->')
            start = parse_vtt_time(start_str.strip())
            end = parse_vtt_time(end_str.strip().split()[0])
            i += 1
            text = ""
            while i < len(lines) and lines[i].strip() != "":
                text += re.sub(r'<[^>]+>', '', lines[i]).strip() + " "
                i += 1
            if text.strip() and text.strip() != "WEBVTT":
                blocks.append({"start": start, "end": end, "text": text.strip()})
        else:
            i += 1
    
    # Baseline for analysis (15 chars/sec)
    print(f"Analysis for {vtt_file}:")
    total_text = 0
    total_duration = 0
    for idx, b in enumerate(blocks):
        duration = b['end'] - b['start']
        text_len = len(b['text'])
        total_text += text_len
        total_duration += duration
        est_natural = text_len / 15.0
        rate = est_natural / duration if duration > 0 else 1.0
        clamped_rate = max(0.85, min(1.35, rate))
        if rate < 0.85:
            print(f"  Block {idx+1}: {duration:.2f}s | Text: {text_len} chars | Rate: {rate:.2f} (SLOW -> Clamped to 0.85)")
        elif rate > 1.35:
            print(f"  Block {idx+1}: {duration:.2f}s | Text: {text_len} chars | Rate: {rate:.2f} (FAST -> Clamped to 1.35)")
            
    avg_speed = total_text / total_duration if total_duration > 0 else 0
    print(f"Overall Avg Speed: {avg_speed:.2f} chars/sec")
    print("-" * 30)

analyze_vtt("public/vtt/9928d1d298f329797032bb5abd4e3e59_en.vtt") # Video 1
analyze_vtt("public/vtt/50b5c488080885643ba4424c9d7681f6_en.vtt") # Video 2
