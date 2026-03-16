import fitz  # PyMuPDF
import os
from PIL import Image
import io
import shutil

# Chemins des dossiers
pdf_dir = "pdfs_cours"
base_output_dir = "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder"

# Mapping des PDFs vers les dossiers
mapping = {
    "Paris octobre 2017 Phase 1 .pdf": "Ectoderme/Vracc_Phase1",
    "Paris octobre 2017 Phase 2 .pdf": "Ectoderme/Vracc_Phase2",
    "Pdf Marc Damoiseaux Phase 3.pdf": "Endoderme/Vracc_Phase3",
    "Paris Phase 4 Homme interni  dec. 2018.pdf": "Mesoderme/Vracc_Phase4"
}

print(f"Extraction Intelligente depuis {pdf_dir} vers {base_output_dir}...")

# Nettoyer l'ancien vrac
vrac_dir = "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/1_Toutes_Les_Images_Extraites"
if os.path.exists(vrac_dir):
    shutil.rmtree(vrac_dir)
    os.makedirs(vrac_dir)

total_images_extracted = 0

for pdf_file, dest_subfolder in mapping.items():
    pdf_path = os.path.join(pdf_dir, pdf_file)
    if not os.path.exists(pdf_path):
        print(f"Fichier non trouvé: {pdf_path}")
        continue
        
    print(f"\nTraitement de : {pdf_file}")
    
    # Créer le dossier de destination
    dest_dir = os.path.join(base_output_dir, dest_subfolder)
    os.makedirs(dest_dir, exist_ok=True)
    
    # Ouvrir le PDF
    pdf_document = fitz.open(pdf_path)
    
    # Nom de base propre pour les images
    base_name = pdf_file.replace(" ", "_").replace(".pdf", "")
    pdf_img_count = 0
    
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        image_list = page.get_images(full=True)
        
        if image_list:
            for image_index, img in enumerate(image_list):
                xref = img[0]
                
                try:
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Charger avec PIL pour vérifier la taille
                    image = Image.open(io.BytesIO(image_bytes))
                    width, height = image.size
                    
                    # FILTRE INTELLIGENT: On ne garde que les "grandes" images (les vrais schémas)
                    if width < 350 or height < 350:
                        continue 
                        
                    # FILTRE SPECIFIQUE: Ignorer les images hyper allongées (souvent des lignes/bords)
                    ratio = width / height if height > 0 else 0
                    if ratio > 5 or ratio < 0.2:
                        continue
                        
                    # Nommer et sauvegarder
                    image_filename = f"{base_name}_page{page_number+1}_{width}x{height}.{image_ext}"
                    image_path = os.path.join(dest_dir, image_filename)
                    
                    image.save(image_path)
                    
                    pdf_img_count += 1
                    print(f"    -> Sauvée : {dest_subfolder}/{image_filename} ({width}x{height})")
                except Exception as e:
                    pass
    
    print(f"Total pour {pdf_file} : {pdf_img_count} grand(s) schéma(s) extrait(s).")
    total_images_extracted += pdf_img_count
    
print(f"\nTerminé ! {total_images_extracted} vrais schémas triés au total.")
