import os
import re
import fitz  # PyMuPDF
import json
import shutil
from PIL import Image
import io

base_source = "/Users/philippeguillaume/ANTIGRAVITY/Cerveau_GravityClaw/COURS D'EMBRYOLOGIE/Le Mésoderme"
app_root = "/Users/philippeguillaume/ANTIGRAVITY/embryologie-app"
meso_dest_dir = os.path.join(app_root, "public/pdfs/mesoderme")
master_dest_path = os.path.join(app_root, "public/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf")
mapping_file = os.path.join(app_root, "src/data/pdfFileMapping.json")

# Clean destination folder
shutil.rmtree(meso_dest_dir, ignore_errors=True)
os.makedirs(meso_dest_dir, exist_ok=True)

# List source files
files = [f for f in os.listdir(base_source) if f.endswith('.pdf')]
clean_files = [f for f in files if "originale" not in f.lower()]

def get_file_num(f):
    m = re.match(r'^(\d+)', f)
    return int(m.group(1)) if m else 999

# Sort source files in their original order
sorted_src_files = sorted(clean_files, key=lambda x: (get_file_num(x), x))
print(f"Found {len(sorted_src_files)} mesoderme source PDFs.")

def clean_title(filename):
    name = os.path.splitext(filename)[0]
    name = re.sub(r'^\d+[\s\-_:]*', '', name)
    name = name.replace('_', ' ').strip()
    return name

merged_doc = fitz.open()
toc = []
current_page = 1
meso_mapping = {}

for idx, f in enumerate(sorted_src_files):
    new_num = idx + 1
    new_id = f"meso-{str(new_num).zfill(2)}"
    title_str = clean_title(f)
    
    formatted_filename = f"{str(new_num).zfill(2)} - {title_str}.pdf"
    dest_path = os.path.join(meso_dest_dir, formatted_filename)
    src_path = os.path.join(base_source, f)
    
    # Copy file with sequential name
    shutil.copy2(src_path, dest_path)
    
    # Open and insert into master doc
    single_doc = fitz.open(src_path)
    start_page = current_page
    num_pages = len(single_doc)
    merged_doc.insert_pdf(single_doc)
    
    toc_title = f"{str(new_num).zfill(2)}. {title_str}"
    toc.append([1, toc_title, start_page])
    
    current_page += num_pages
    
    relative_url = f"/pdfs/mesoderme/{formatted_filename}"
    meso_mapping[new_id] = {
        "pdfUrl": relative_url,
        "filename": formatted_filename,
        "title": toc_title,
        "totalPages": num_pages
    }
    print(f"[{new_id}] {toc_title} ({num_pages} p.) -> {relative_url}")

total_master_pages = len(merged_doc)
merged_doc.set_toc(toc)

# Save uncompressed master
temp_master = master_dest_path.replace(".pdf", "-temp.pdf")
merged_doc.save(temp_master, garbage=4, deflate=True)
merged_doc.close()

# Add Master Course mapping
master_id = f"meso-{str(len(sorted_src_files) + 1).zfill(2)}"
meso_mapping[master_id] = {
    "pdfUrl": "/pdfs/cours_complets/Le-Mesoderme-Recueil-Integral.pdf",
    "filename": "Le-Mesoderme-Recueil-Integral.pdf",
    "title": f"Le Mésoderme — Manuel Intégral du Séminaire (01 à {len(sorted_src_files)})",
    "totalPages": total_master_pages,
    "isGlobal": True
}

# Compress master doc
print(f"Compressing master PDF {temp_master}...")
doc = fitz.open(temp_master)
for page_num in range(len(doc)):
    page = doc[page_num]
    image_list = page.get_images(full=True)
    for img_info in image_list:
        xref = img_info[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        try:
            img = Image.open(io.BytesIO(image_bytes))
            w, h = img.size
            if max(w, h) > 1600:
                scale = 1600 / max(w, h)
                img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            out_buf = io.BytesIO()
            img.save(out_buf, format="JPEG", quality=80, optimize=True)
            new_bytes = out_buf.getvalue()
            if len(new_bytes) < len(image_bytes):
                page.replace_image(xref, stream=new_bytes)
        except:
            pass

doc.save(master_dest_path, garbage=4, deflate=True, clean=True)
doc.close()
if os.path.exists(temp_master):
    os.remove(temp_master)

print(f"Master PDF saved to {master_dest_path} ({total_master_pages} pages, {os.path.getsize(master_dest_path)/(1024*1024):.2f} MB)")

# Update master pdfFileMapping.json
with open(mapping_file, "r", encoding="utf-8") as f:
    full_mapping = json.load(f)

# Replace all meso entries
for k in list(full_mapping.keys()):
    if k.startswith("meso-"):
        del full_mapping[k]

full_mapping.update(meso_mapping)

with open(mapping_file, "w", encoding="utf-8") as f:
    json.dump(full_mapping, f, indent=2, ensure_ascii=False)

print(f"Updated {mapping_file} with {len(full_mapping)} total items.")
