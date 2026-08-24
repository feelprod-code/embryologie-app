import os
from PIL import Image

schemas_dir = "public/images/schemas"
total_orig = 0
total_new = 0

for root, dirs, files in os.walk(schemas_dir):
    for f in files:
        if f.lower().endswith((".png", ".jpg", ".jpeg")):
            p = os.path.join(root, f)
            orig_sz = os.path.getsize(p)
            total_orig += orig_sz
            try:
                im = Image.open(p)
                w, h = im.size
                if w > 1400 or h > 1400:
                    im.thumbnail((1400, 1400), Image.Resampling.LANCZOS)
                
                if f.lower().endswith(".png"):
                    # Optimize PNG (convert to RGBA or RGB depending on transparency)
                    if im.mode == "RGBA":
                        im.save(p, format="PNG", optimize=True)
                    else:
                        im.convert("RGB").save(p, format="JPEG", quality=85, optimize=True)
                else:
                    im.convert("RGB").save(p, format="JPEG", quality=85, optimize=True)
                
                new_sz = os.path.getsize(p)
                total_new += new_sz
            except Exception as e:
                total_new += orig_sz
                print(f"Error on {p}: {e}")

print(f"\nAll schemas optimized: {total_orig/1024/1024:.2f} MB -> {total_new/1024/1024:.2f} MB!")
