import re
import os

files = [
    "src/data/videoCourses.ts",
    "src/data/videoCourses_en.ts",
    "src/data/videoCourses_es.ts",
    "src/data/videoCourses_it.ts",
    "src/data/videoCourses_de.ts",
    "src/data/videoCourses_zh.ts",
    "src/data/videoCourses_ja.ts",
]

for filepath in files:
    if not os.path.exists(filepath):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split between ectoderme / mesoderme / endoderme / oeil
    # We locate all items with categoryId: "mesoderme"
    # Find all object blocks inside the array
    lines = content.split("\n")
    new_lines = []
    
    in_meso = False
    meso_index = 0
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Check if line starts an object for mesoderme
        if 'categoryId: "mesoderme"' in line or "categoryId: 'mesoderme'" in line:
            in_meso = True
        
        new_lines.append(line)
        i += 1

print("Analyzing structure for precise AST / regex replacement...")
