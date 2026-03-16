import os

base_dir = "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder"

print("Ajout des préfixes Ecto/Meso/Endo/Podcast...")

total_renamed = 0

for root, dirs, files in os.walk(base_dir):
    # Relatif au dossier de base, ex: Ectoderme/Vracc_Phase1
    rel_path = os.path.relpath(root, base_dir)
    
    # Ignorer la racine elle-même
    if rel_path == '.':
        continue
        
    # Extraire le nom du dossier parent de plus haut niveau (Ectoderme, Mesoderme, Endoderme, etc.)
    top_folder = rel_path.split(os.sep)[0]
    
    # Créer un préfixe lisible et court
    prefix = ""
    if "Ectoderme" in top_folder:
        prefix = "Ectoderme_"
    elif "Mesoderme" in top_folder:
        prefix = "Mesoderme_"
    elif "Endoderme" in top_folder:
        prefix = "Endoderme_"
    elif "Podcast" in top_folder:
        prefix = "Podcast_"
    else:
        prefix = top_folder + "_" # Fallback générique
    
    image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    for filename in image_files:
        old_path = os.path.join(root, filename)
        
        # Éviter de rajouter le préfixe s'il y est déjà !
        if filename.startswith(prefix):
            continue
            
        new_name = f"{prefix}{filename}"
        new_path = os.path.join(root, new_name)
        
        os.rename(old_path, new_path)
        print(f"  -> Renommé : {filename} en {new_name}")
        total_renamed += 1

print(f"\nTerminé ! {total_renamed} fichiers préfixés avec succès.")
