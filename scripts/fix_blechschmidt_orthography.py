import os
import re

REPLACEMENTS = [
    # Full name variations
    (re.compile(r'\b[eE]ric\s+[bB]le[c]?[h]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b'), "Erich Blechschmidt"),
    (re.compile(r'\b[eE]rich\s+[bB]le[c]?[h]?[s]?[c]?[h]?m[i]?[d]?[t]?[e]?\b'), "Erich Blechschmidt"),
    (re.compile(r'\b[eE]ric\s+[bB]lechschmidt\b', re.IGNORECASE), "Erich Blechschmidt"),
    
    # Surname variations (case-preserving for bold/markdown like **Blechmit**, Blech-Schmidt, etc.)
    (re.compile(r'\bBlech-Schmidt\b'), "Blechschmidt"),
    (re.compile(r'\bblech-schmidt\b'), "blechschmidt"),
    (re.compile(r'\bBlech-[sS]chmidt\b'), "Blechschmidt"),
    (re.compile(r'\bBlechmit\b'), "Blechschmidt"),
    (re.compile(r'\bblechmit\b'), "blechschmidt"),
    (re.compile(r'\bBleshmidt\b'), "Blechschmidt"),
    (re.compile(r'\bbleshmidt\b'), "blechschmidt"),
    (re.compile(r'\bBleschmidt\b'), "Blechschmidt"),
    (re.compile(r'\bbleschmidt\b'), "blechschmidt"),
    (re.compile(r'\bBleckschmidt\b'), "Blechschmidt"),
    (re.compile(r'\bbleckschmidt\b'), "blechschmidt"),
    (re.compile(r'\bBlekschmidt\b'), "Blechschmidt"),
    (re.compile(r'\bblekschmidt\b'), "blechschmidt"),
]

TARGET_EXTENSIONS = (
    ".ts", ".tsx", ".json", ".js", ".cjs", ".mjs", ".md", ".vtt", ".txt", ".html"
)

IGNORE_DIRS = {
    "node_modules", ".git", "dist", ".vercel", ".vercel-backup"
}

def fix_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return 0

    new_content = content
    for pattern, repl in REPLACEMENTS:
        new_content = pattern.sub(repl, new_content)

    if new_content != content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated: {file_path}")
        return 1
    return 0

def main():
    total_modified = 0
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file.endswith(TARGET_EXTENSIONS):
                p = os.path.join(root, file)
                total_modified += fix_file(p)
                
    print(f"\nCorrection complete. Total files updated: {total_modified}")

if __name__ == "__main__":
    main()
