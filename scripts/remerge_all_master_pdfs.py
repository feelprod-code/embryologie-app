import os
import pypdf
from PIL import Image
import io

LANG_MASTER_CONFIG = {
    "fr": {
        "base": "public/pdfs",
        "out_dir": "public/pdfs/cours_complets",
        "titles": {
            "ectoderme": "L-Ectoderme-Recueil-Integral.pdf",
            "mesoderme": "Le-Mesoderme-Recueil-Integral.pdf",
            "endoderme": "L-Endoderme-Recueil-Integral.pdf",
            "oeil": "L-Oeil-Recueil-Integral.pdf"
        }
    },
    "en": {
        "base": "public/pdfs/en",
        "out_dir": "public/pdfs/en/cours_complets",
        "titles": {
            "ectoderme": "The-Ectoderm-Complete-Handbook.pdf",
            "mesoderme": "The-Mesoderm-Complete-Handbook.pdf",
            "endoderme": "The-Endoderm-Complete-Handbook.pdf",
            "oeil": "The-Eye-Complete-Handbook.pdf"
        }
    },
    "de": {
        "base": "public/pdfs/de",
        "out_dir": "public/pdfs/de/cours_complets",
        "titles": {
            "ectoderme": "Das-Ektoderm-Gesamthandbuch.pdf",
            "mesoderme": "Das-Mesoderm-Gesamthandbuch.pdf",
            "endoderme": "Das-Entoderm-Gesamthandbuch.pdf",
            "oeil": "Das-Auge-Gesamthandbuch.pdf"
        }
    },
    "es": {
        "base": "public/pdfs/es",
        "out_dir": "public/pdfs/es/cours_complets",
        "titles": {
            "ectoderme": "El-Ectodermo-Manual-Integral.pdf",
            "mesoderme": "El-Mesodermo-Manual-Integral.pdf",
            "endoderme": "El-Endodermo-Manual-Integral.pdf",
            "oeil": "El-Ojo-Manual-Integral.pdf"
        }
    },
    "it": {
        "base": "public/pdfs/it",
        "out_dir": "public/pdfs/it/cours_complets",
        "titles": {
            "ectoderme": "L-Ectoderma-Manuale-Integrale.pdf",
            "mesoderme": "Il-Mesoderma-Manuale-Integrale.pdf",
            "endoderme": "L-Endoderma-Manuale-Integrale.pdf",
            "oeil": "L-Occhio-Manuale-Integrale.pdf"
        }
    },
    "ja": {
        "base": "public/pdfs/ja",
        "out_dir": "public/pdfs/ja/cours_complets",
        "titles": {
            "ectoderme": "外胚葉-完全講義録.pdf",
            "mesoderme": "中胚葉-完全講義録.pdf",
            "endoderme": "内胚葉-完全講義録.pdf",
            "oeil": "眼-完全講義録.pdf"
        }
    },
    "zh": {
        "base": "public/pdfs/zh",
        "out_dir": "public/pdfs/zh/cours_complets",
        "titles": {
            "ectoderme": "外胚层-研讨会完整汇编.pdf",
            "mesoderme": "中胚层-研讨会完整汇编.pdf",
            "endoderme": "内胚层-研讨会完整汇编.pdf",
            "oeil": "眼睛-研讨会完整汇编.pdf"
        }
    }
}

def merge_and_compress(lang, cat, base_dir, out_dir, master_name):
    cat_dir = os.path.join(base_dir, cat)
    if not os.path.exists(cat_dir):
        return

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, master_name)
    
    files = sorted([f for f in os.listdir(cat_dir) if f.endswith(".pdf") and f[:2].isdigit()])
    print(f"[{lang.upper()}] Merging {len(files)} files for {cat} -> {master_name}...")

    writer = pypdf.PdfWriter()
    for f in files:
        fp = os.path.join(cat_dir, f)
        reader = pypdf.PdfReader(fp)
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
                except Exception:
                    pass
            new_page.compress_content_streams()

    writer.compress_identical_objects()
    with open(out_path, "wb") as out_fp:
        writer.write(out_fp)

    sz = os.path.getsize(out_path) / (1024 * 1024)
    print(f"  ✓ [{lang.upper()}] {master_name}: {sz:.2f} MB")

def main():
    # Only ectoderme and mesoderme contained the courses mentioning Blechschmidt
    target_cats = ["ectoderme", "mesoderme"]
    for lang, conf in LANG_MASTER_CONFIG.items():
        for cat in target_cats:
            master_name = conf["titles"][cat]
            merge_and_compress(lang, cat, conf["base"], conf["out_dir"], master_name)

if __name__ == "__main__":
    main()
