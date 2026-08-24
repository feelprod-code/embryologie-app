import os
import pypdf

pdf_dir = "public/pdfs"
master_dir = "public/pdfs/cours_complets"
os.makedirs(master_dir, exist_ok=True)

categories = {
    "ectoderme": "L-Ectoderme-Recueil-Integral.pdf",
    "mesoderme": "Le-Mesoderme-Recueil-Integral.pdf",
    "endoderme": "L-Endoderme-Recueil-Integral.pdf",
    "oeil": "L-Oeil-Recueil-Integral.pdf"
}

for cat, master_name in categories.items():
    cat_dir = os.path.join(pdf_dir, cat)
    if not os.path.exists(cat_dir):
        continue
    
    files = sorted([f for f in os.listdir(cat_dir) if f.endswith(".pdf") and f[:2].isdigit()])
    print(f"\nMerging {len(files)} single PDFs for {cat} -> {master_name}...")
    
    writer = pypdf.PdfWriter()
    for f in files:
        fp = os.path.join(cat_dir, f)
        reader = pypdf.PdfReader(fp)
        for page in reader.pages:
            writer.add_page(page)
            
    writer.compress_identical_objects()
    out_path = os.path.join(master_dir, master_name)
    with open(out_path, "wb") as out_fp:
        writer.write(out_fp)
        
    sz = os.path.getsize(out_path) / 1024 / 1024
    print(f"✓ {master_name} generated via PyPDF merge: {sz:.2f} MB!")
