import fitz  # PyMuPDF
import os
from PIL import Image
import io

# Chemins des dossiers
pdf_dir = "pdfs_cours"
output_dir = "../src/assets/schemas"

# S'assurer que le dossier de sortie existe
os.makedirs(output_dir, exist_ok=True)

print(f"Extraction des images depuis {pdf_dir} vers {output_dir}...")

# Parcourir tous les fichiers PDF
pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]

if len(pdf_files) == 0:
    print(f"Aucun fichier PDF trouvé dans '{pdf_dir}'.")
    exit(1)

total_images_extracted = 0

for pdf_file in pdf_files:
    pdf_path = os.path.join(pdf_dir, pdf_file)
    print(f"\nTraitement de : {pdf_file}")
    
    # Ouvrir le PDF
    pdf_document = fitz.open(pdf_path)
    
    # Nom de base pour les images (sans l'extension .pdf)
    base_name = os.path.splitext(pdf_file)[0][:15].replace(" ", "_").replace("'", "")
    
    pdf_img_count = 0
    
    for page_number in range(len(pdf_document)):
        page = pdf_document[page_number]
        # Obtenir les images de la page
        image_list = page.get_images(full=True)
        
        if image_list:
            print(f"  Page {page_number + 1}: {len(image_list)} image(s) trouvée(s)")
            
            for image_index, img in enumerate(image_list):
                xref = img[0]
                
                # Extraire l'image
                try:
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]
                    
                    # Ignorer les toutes petites images (souvent des logos, puces, traits)
                    # Charger avec PIL pour vérifier la taille
                    image = Image.open(io.BytesIO(image_bytes))
                    width, height = image.size
                    
                    if width < 100 or height < 100:
                        continue # Ignorer les petites images
                        
                    # Nommer et sauvegarder
                    image_filename = f"{base_name}_p{page_number+1}_{image_index+1}.{image_ext}"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    # Convertir en RGB si nécessaire, et sauvegarder en webp/png/jpg selon l'original
                    image.save(image_path)
                    
                    pdf_img_count += 1
                    print(f"    -> Sauvée : {image_filename} ({width}x{height})")
                except Exception as e:
                    print(f"    Erreur lors de l'extraction de l'image {xref}: {e}")
    
    print(f"Total pour {pdf_file} : {pdf_img_count} images extraites.")
    total_images_extracted += pdf_img_count
    
print(f"\nTerminé ! {total_images_extracted} images extraites au total dans {output_dir}")
