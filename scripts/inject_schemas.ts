import * as fs from 'fs';
import * as path from 'path';

const SRC_DESKTOP = '/Users/philippeguillaume/Desktop/Tri_Images_Embryo/2_Images_A_Garder';
const DEST_PUBLIC = path.join(process.cwd(), 'public', 'images', 'schemas');
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

const categories = {
  'Ectoderme': 'ectoderme',
  'Endoderme': 'endoderme',
  'Mesoderme': 'mesoderme'
};

const schemasByVideo: Record<string, string[]> = {};

// 1. Traverse and Copy
for (const [folderName, categoryId] of Object.entries(categories)) {
  const layerPath = path.join(SRC_DESKTOP, folderName);
  if (!fs.existsSync(layerPath)) continue;

  const subDirs = fs.readdirSync(layerPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name.match(/^[a-z]+-\d+$/))
    .map(dirent => dirent.name);

  for (const videoId of subDirs) {
    const videoDir = path.join(layerPath, videoId);
    const files = fs.readdirSync(videoDir).filter(f => f.match(/\.(png|jpe?g)$/i));
    
    if (files.length > 0) {
      schemasByVideo[videoId] = files.sort(); // Sort alphabetically/chronologically
      
      const destDir = path.join(DEST_PUBLIC, categoryId, videoId);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      for (const file of files) {
        fs.copyFileSync(path.join(videoDir, file), path.join(destDir, file));
      }
    }
  }
}

console.log(`Copié les schémas pour ${Object.keys(schemasByVideo).length} vidéos vers /public/images/schemas/`);

// 2. Inject in videoCourses*.ts files
const filesToUpdate = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('videoCourses') && f.endsWith('.ts'));

filesToUpdate.forEach(fileName => {
  const filePath = path.join(DATA_DIR, fileName);
  let content = fs.readFileSync(filePath, 'utf8');
  let modifications = 0;

  for (const [videoId, schemas] of Object.entries(schemasByVideo)) {
    const schemasStr = JSON.stringify(schemas);
    
    // Pattern to find: id: "ecto-01", 
    // and replace or insert schemas array right after it.
    
    // Check if schemas: [...] already exists for this video ID
    const regexWithSchemas = new RegExp(`(id:\\s*["']${videoId}["'],\\s*)schemas:\\s*\\[.*?\\],`);
    if (regexWithSchemas.test(content)) {
      content = content.replace(regexWithSchemas, `$1schemas: ${schemasStr},`);
      modifications++;
    } else {
      const regexWithoutSchemas = new RegExp(`(id:\\s*["']${videoId}["'],)`);
      if (regexWithoutSchemas.test(content)) {
        content = content.replace(regexWithoutSchemas, `$1\n    schemas: ${schemasStr},`);
        modifications++;
      }
    }
  }

  if (modifications > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Mis à jour ${modifications} vidéos dans ${fileName}`);
  }
});

console.log('Terminé ! L\'application est maintenant prête à afficher les schémas.');
