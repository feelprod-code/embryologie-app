import os
import pypdf

master_dir = "public/pdfs/cours_complets"
for f in os.listdir(master_dir):
    if f.endswith(".pdf") and not f.startswith("opt_"):
        p = os.path.join(master_dir, f)
        tmp = os.path.join(master_dir, "opt_" + f)
        print(f"Compressing {f}...")
        try:
            reader = pypdf.PdfReader(p)
            writer = pypdf.PdfWriter()
            for page in reader.pages:
                writer.add_page(page)
                writer.pages[-1].compress_content_streams()
            writer.compress_identical_objects()
            with open(tmp, "wb") as fp:
                writer.write(fp)
            orig_size = os.path.getsize(p) / 1024 / 1024
            new_size = os.path.getsize(tmp) / 1024 / 1024
            print(f"  {f}: {orig_size:.2f} MB -> {new_size:.2f} MB")
            if new_size < orig_size and new_size > 0:
                os.replace(tmp, p)
            elif os.path.exists(tmp):
                os.remove(tmp)
        except Exception as e:
            print(f"  Error on {f}: {e}")
            if os.path.exists(tmp):
                os.remove(tmp)
