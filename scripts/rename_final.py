import os

base_dir = "/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder"

print("Renumérotation finale de 1 à X...")

total_renamed = 0

for root, dirs, files in os.walk(base_dir):
    # Filtrer pour ne garder que les fichiers images
    image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    if not image_files:
        continue
        
    print(f"\nDossier: {os.path.relpath(root, base_dir)}")
    
    # Trier alphabétiquement (cela respectera l'ordre chronologique des préfixes 001_, etc.)
    image_files.sort()
    
    for i, filename in enumerate(image_files):
        old_path = os.path.join(root, filename)
        ext = os.path.splitext(filename)[1]
        
        # Nouveau nom : 1.png, 2.jpg...
        # On utilise f"{i+1}" pour avoir 1, 2, 3... (sans les zéros si 1 à X est préféré)
        new_name = f"{i+1}{ext}"
        new_path = os.path.join(root, new_name)
        
        if old_path != new_path:
            # On passe par un nom temporaire pour éviter d'écraser l'image 1.png 
            # si on veut renommer par exemple 001_xxx.png en 1.png et qu'un 1.png existe déjà
            temp_path = os.path.join(root, f"temp_{i+1}_{new_name}")
            os.rename(old_path, temp_path)
            os.rename(temp_path, new_path)
            print(f"  -> Renommé : {filename[:25]}... en {new_name}")
            total_renamed += 1

print(f"\nTerminé ! {total_renamed} fichiers renumérotés au total dans les différents dossiers.")
