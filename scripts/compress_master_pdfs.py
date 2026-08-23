import os
import fitz  # PyMuPDF
from PIL import Image
import io

def compress_pdf(input_path, output_path, max_image_res=150, image_quality=80):
    print(f"Compressing {input_path}...")
    doc = fitz.open(input_path)
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        
        for img_index, img_info in enumerate(image_list):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            try:
                img = Image.open(io.BytesIO(image_bytes))
                # Check if resize is needed
                w, h = img.size
                if max(w, h) > 1600:
                    scale = 1600 / max(w, h)
                    img = img.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
                
                # Convert RGBA to RGB for JPEG compression
                if img.mode in ("RGBA", "P"):
                    img = img.convert("RGB")
                
                out_buffer = io.BytesIO()
                img.save(out_buffer, format="JPEG", quality=image_quality, optimize=True)
                new_image_bytes = out_buffer.getvalue()
                
                # If compressed is smaller, update image
                if len(new_image_bytes) < len(image_bytes):
                    page.replace_image(xref, stream=new_image_bytes)
            except Exception as e:
                # Keep original if processing fails
                pass
                
    doc.save(output_path, garbage=4, deflate=True, clean=True)
    doc.close()
    
    orig_size = os.path.getsize(input_path) / (1024 * 1024)
    new_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"Done: {orig_size:.2f} MB -> {new_size:.2f} MB")

master_dir = "/Users/philippeguillaume/ANTIGRAVITY/embryologie-app/public/pdfs/cours_complets"
for fname in os.listdir(master_dir):
    if fname.endswith(".pdf"):
        fpath = os.path.join(master_dir, fname)
        size_mb = os.path.getsize(fpath) / (1024 * 1024)
        if size_mb > 40:
            temp_path = fpath.replace(".pdf", "-opt.pdf")
            compress_pdf(fpath, temp_path)
            os.replace(temp_path, fpath)
