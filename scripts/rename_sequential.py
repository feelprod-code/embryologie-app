import os
import re

# Dossiers contenant le vrac
vracc_folders = [
    "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder/Ectoderme/Vracc_Phase1",
    "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder/Ectoderme/Vracc_Phase2",
    "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder/Endoderme/Vracc_Phase3",
    "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder/Mesoderme/Vracc_Phase4"
]

def extract_page_number(filename):
    """Extrait le numéro de page du nom de fichier pour un tri fiable."""
    match = re.search(r"_page(\d+)_", filename)
    if match:
        return int(match.group(1))
    return 999999

print("Renumérotation chronologique en cours...")

total_renamed = 0

for folder in vracc_folders:
    if not os.path.exists(folder):
        print(f"Dossier non trouvé: {folder}")
        continue
        
    print(f"\nTraitement du dossier: {os.path.basename(folder)}")
    
    # Lister les fichiers (uniquement les images)
    files = [f for f in os.listdir(folder) if os.path.isfile(os.path.join(folder, f)) and not f.startswith('.')]
    
    # Trier par numéro de page extrait du nom
    files.sort(key=extract_page_number)
    
    # Renommer les fichiers
    for index, filename in enumerate(files):
        old_path = os.path.join(folder, filename)
        
        # Obtenir l'extension
        _, ext = os.path.splitext(filename)
        
        # Nouveau nom formaté: 001_..., 002_...
        # On garde l'ancien nom pour avoir le contexte de la page et la taille
        new_filename = f"{index + 1:03d}_{filename}"
        new_path = os.path.join(folder, new_filename)
        
        os.rename(old_path, new_path)
        total_renamed += 1
        
    print(f"  -> {len(files)} fichiers renommés séquentiellement.")

print(f"\nTerminé ! {total_renamed} fichiers renommés.")
