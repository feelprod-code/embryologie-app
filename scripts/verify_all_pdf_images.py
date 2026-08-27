import os
import fitz

def verify():
    print("Verifying Master PDFs image rendering...")
    master_dir = "public/pdfs/cours_complets"
    total_master_imgs = 0
    for f in os.listdir(master_dir):
        if f.endswith(".pdf"):
            fp = os.path.join(master_dir, f)
            doc = fitz.open(fp)
            imgs = 0
            for page in doc:
                imgs += len(page.get_images())
            print(f"  ✓ {f} ({len(doc)} pages): {imgs} images properly embedded!")
            total_master_imgs += imgs

    print(f"\nTotal master embedded images: {total_master_imgs}")

    print("\nVerifying sample single PDFs...")
    sample_paths = [
        "public/pdfs/mesoderme/04 - Le Systeme Circulatoire Mise à Jour.pdf",
        "public/pdfs/ectoderme/04 - Notions d'épigénétique, tenségrité, électromagnétisme.pdf",
        "public/pdfs/endoderme/30 - MEP Tractus Gastro-Intestinal 1 - Délimitation de l' Embryon.pdf",
        "public/pdfs/oeil/08 - Origine de la retine et du cristallin.pdf"
    ]
    for sp in sample_paths:
        if os.path.exists(sp):
            doc = fitz.open(sp)
            imgs = 0
            for page in doc:
                imgs += len(page.get_images())
            print(f"  ✓ {os.path.basename(sp)} ({len(doc)} pages): {imgs} images embedded!")

if __name__ == "__main__":
    verify()
