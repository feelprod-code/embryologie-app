import os
import re

PATTERNS = [
    (re.compile(r'\b[eE]ric\s+[bB]le[c]?[h]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b'), "Eric ..."),
    (re.compile(r'\b[bB]lechmit\b', re.IGNORECASE), "Blechmit"),
    (re.compile(r'\b[bB]lech-schmidt\b', re.IGNORECASE), "Blech-Schmidt"),
    (re.compile(r'\b[bB]leshmidt\b', re.IGNORECASE), "Bleshmidt"),
    (re.compile(r'\b[bB]leschmidt\b', re.IGNORECASE), "Bleschmidt"),
    (re.compile(r'\b[bB]lek[-]?schmidt\b', re.IGNORECASE), "Blekschmidt"),
    (re.compile(r'\b[eE]ric\s+[bB]lechschmidt\b', re.IGNORECASE), "Eric Blechschmidt"),
]

def check():
    found = []
    for root, _, files in os.walk("."):
        if any(x in root for x in ["node_modules", ".git", "dist", "coverage"]):
            continue
        for f in files:
            if f.endswith((".ts", ".tsx", ".json", ".js", ".cjs", ".mjs", ".md")):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8") as fp:
                    content = fp.read()
                for p, label in PATTERNS:
                    for m in p.finditer(content):
                        found.append((path, label, m.group(0)))
    
    print(f"Total matching items to normalize: {len(found)}")
    from collections import Counter
    c = Counter((item[0], item[2]) for item in found)
    for (path, text), count in c.most_common():
        print(f"{count}x in {path} -> '{text}'")

if __name__ == "__main__":
    check()
