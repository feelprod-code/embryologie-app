import os
import re

PATTERNS = [
    re.compile(r'\b[eE]ric\s+[bB]le[c]?[h]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b', re.IGNORECASE),
    re.compile(r'\b[eE]rich\s+[bB]le[c]?[h]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b', re.IGNORECASE),
    re.compile(r'\b[bB]le[c]?[h]?[-_]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b', re.IGNORECASE),
]

def scan_files():
    base_dir = "."
    matches = []
    
    for root, dirs, files in os.walk(base_dir):
        if "node_modules" in root or ".git" in root or "dist" in root:
            continue
        for file in files:
            if file.endswith((".ts", ".tsx", ".js", ".json", ".md", ".txt", ".cjs", ".mjs")):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        lines = f.readlines()
                    for idx, line in enumerate(lines):
                        for p in PATTERNS:
                            m = p.search(line)
                            if m:
                                word = m.group(0)
                                if any(x in word.lower() for x in ["blech", "blesh", "blek"]):
                                    matches.append((path, idx + 1, word, line.strip()[:140]))
                                    break
                except Exception as e:
                    pass
    
    print(f"Total occurrences found: {len(matches)}")
    for p, l, w, ctx in matches:
        print(f"{p}:{l} -> [{w}] {ctx}")

if __name__ == "__main__":
    scan_files()
