import json
import re

mapping_path = "src/data/pdfFileMapping.json"
courses_path = "src/data/videoCourses.ts"

with open(mapping_path, "r", encoding="utf-8") as f:
    mapping = json.load(f)

with open(courses_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_meso = False
meso_idx = 0
current_meso_id = None

for line in lines:
    # Check if this line defines a meso id
    m_id = re.search(r'id:\s*["\'](meso-\d+)["\']', line)
    if m_id:
        meso_idx += 1
        current_meso_id = f"meso-{str(meso_idx).zfill(2)}"
        line = re.sub(r'id:\s*["\']meso-\d+["\']', f'id: "{current_meso_id}"', line)
        in_meso = True
        new_lines.append(line)
        continue
    
    if in_meso:
        # Check if line has title:
        m_title = re.search(r'title:\s*["\'](.*)["\']', line)
        if m_title:
            raw_title = m_title.group(1)
            if "Support Intégral" in raw_title or "Recueil" in raw_title:
                clean_title = f"{meso_idx}. Support Intégral — Recueil PDF Global (01 à {meso_idx - 1})"
            elif "BONUS" in raw_title:
                clean_title = f"{meso_idx}. BONUS - Le Mouvement Régénérateur"
            else:
                # Strip old leading numbers e.g. "3-Introduction...", "4- Mise...", "10 -Le..."
                title_body = re.sub(r'^\d+[\s\-_:]*', '', raw_title).strip()
                title_body = title_body.replace('_', ' ').strip()
                clean_title = f"{meso_idx}. {title_body}"
            
            line = re.sub(r'title:\s*["\'].*["\']', f'title: "{clean_title}"', line)
            new_lines.append(line)
            continue
        
        # Check if line has pdfUrl:
        if "pdfUrl:" in line:
            map_data = mapping.get(current_meso_id)
            if map_data:
                line = re.sub(r'pdfUrl:\s*["\'].*["\']', f'pdfUrl: "{map_data["pdfUrl"]}"', line)
            new_lines.append(line)
            continue
            
        # Check if line has pdfTotalPages:
        if "pdfTotalPages:" in line:
            map_data = mapping.get(current_meso_id)
            if map_data:
                line = re.sub(r'pdfTotalPages:\s*\d+', f'pdfTotalPages: {map_data["totalPages"]}', line)
            new_lines.append(line)
            continue

        # If next course begins or ecto/endo/oeil
        if "id: \"endo-" in line or "id: \"ecto-" in line or "id: \"oeil-" in line:
            in_meso = False
            current_meso_id = None

    new_lines.append(line)

with open(courses_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"Successfully renumbered {meso_idx} mesoderme courses!")
