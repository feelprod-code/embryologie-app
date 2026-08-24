import os
import io
import pypdf
from PIL import Image

def compress_pdf(input_path, output_path, quality=65, max_size=1000):
    print(f"Compressing {input_path} (orig: {os.path.getsize(input_path)/1024/1024:.2f} MB)...")
    reader = pypdf.PdfReader(input_path)
    writer = pypdf.PdfWriter()

    for i, page in enumerate(reader.pages):
        for img in page.images:
            try:
                raw_bytes = img.data
                im = Image.open(io.BytesIO(raw_bytes))
                if im.mode in ("RGBA", "P"):
                    im = im.convert("RGB")
                im.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
                buf = io.BytesIO()
                im.save(buf, format="JPEG", quality=quality, optimize=True)
                buf.seek(0)
                img.replace(Image.open(buf))
            except Exception as e:
                pass
        writer.add_page(page)

    writer.compress_identical_objects()
    with open(output_path, "wb") as f:
        writer.write(f)

    new_size = os.path.getsize(output_path) / 1024 / 1024
    print(f"-> Output: {new_size:.2f} MB")

master_dir = "public/pdfs/cours_complets"
for f in os.listdir(master_dir):
    if f.endswith(".pdf") and not f.startswith("tmp_"):
        p = os.path.join(master_dir, f)
        tmp = os.path.join(master_dir, "tmp_" + f)
        compress_pdf(p, tmp)
        if os.path.exists(tmp) and os.path.getsize(tmp) > 0:
            os.replace(tmp, p)
