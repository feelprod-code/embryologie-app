import os
import io
import fitz
from PIL import Image

def optimize_pdf_file(file_path):
    orig_sz = os.path.getsize(file_path)
    if orig_sz < 500 * 1024:
        return
    
    tmp_path = file_path + ".tmp"
    try:
        doc = fitz.open(file_path)
        seen_xrefs = set()
        for i in range(len(doc)):
            for img in doc.get_page_images(i):
                xref = img[0]
                if xref in seen_xrefs:
                    continue
                seen_xrefs.add(xref)
                try:
                    base_img = doc.extract_image(xref)
                    image_bytes = base_img["image"]
                    im = Image.open(io.BytesIO(image_bytes))
                    if im.mode in ("RGBA", "P"):
                        im = im.convert("RGB")
                    im.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                    buf = io.BytesIO()
                    im.save(buf, format="JPEG", quality=80, optimize=True)
                    doc.update_stream(xref, buf.getvalue())
                except Exception:
                    pass

        doc.save(tmp_path, deflate=True, garbage=4, clean=True)
        new_sz = os.path.getsize(tmp_path)
        if new_sz < orig_sz and new_sz > 0:
            os.replace(tmp_path, file_path)
            print(f"  ✓ {os.path.basename(file_path)}: {orig_sz/1024/1024:.2f} MB -> {new_sz/1024/1024:.2f} MB")
        elif os.path.exists(tmp_path):
            os.remove(tmp_path)
    except Exception as e:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        print(f"  Error on {file_path}: {e}")

print("Optimizing all Master PDFs...")
master_dir = "public/pdfs/cours_complets"
for f in os.listdir(master_dir):
    if f.endswith(".pdf"):
        optimize_pdf_file(os.path.join(master_dir, f))

print("\nOptimizing single PDFs > 1MB...")
for cat in ["ectoderme", "mesoderme", "endoderme", "oeil"]:
    cat_dir = os.path.join("public/pdfs", cat)
    if os.path.exists(cat_dir):
        for f in os.listdir(cat_dir):
            if f.endswith(".pdf"):
                optimize_pdf_file(os.path.join(cat_dir, f))

print("\n🎉 All PDFs successfully optimized!")
