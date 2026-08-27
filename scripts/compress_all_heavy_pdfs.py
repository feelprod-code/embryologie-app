import os
import pypdf
from PIL import Image
import io

def compress_pdf_file(file_path):
    orig_size = os.path.getsize(file_path) / (1024 * 1024)
    if orig_size < 30.0:
        return
    
    print(f"Optimizing {file_path} ({orig_size:.2f} MB)...")
    tmp_path = file_path + ".tmp.pdf"
    
    try:
        reader = pypdf.PdfReader(file_path)
        writer = pypdf.PdfWriter()
        
        for page in reader.pages:
            new_page = writer.add_page(page)
            for img in new_page.images:
                try:
                    pil_img = Image.open(io.BytesIO(img.data))
                    if pil_img.mode in ("RGBA", "P"):
                        pil_img = pil_img.convert("RGB")
                    
                    max_dim = 1000
                    if max(pil_img.size) > max_dim:
                        pil_img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                    
                    buf = io.BytesIO()
                    pil_img.save(buf, format="JPEG", quality=65, optimize=True)
                    img.replace(img.image, data=buf.getvalue())
                except Exception as img_err:
                    pass
            
            new_page.compress_content_streams()
            
        writer.compress_identical_objects()
        
        with open(tmp_path, "wb") as f_out:
            writer.write(f_out)
            
        new_size = os.path.getsize(tmp_path) / (1024 * 1024)
        print(f"  -> Reduced {orig_size:.2f} MB to {new_size:.2f} MB")
        
        if new_size < orig_size and new_size > 0:
            os.replace(tmp_path, file_path)
        elif os.path.exists(tmp_path):
            os.remove(tmp_path)
            
    except Exception as e:
        print(f"  Error optimizing {file_path}: {e}")
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

def main():
    base_dir = "public/pdfs"
    for root, _, files in os.walk(base_dir):
        for f in files:
            if f.endswith(".pdf"):
                full_path = os.path.join(root, f)
                compress_pdf_file(full_path)

if __name__ == "__main__":
    main()
