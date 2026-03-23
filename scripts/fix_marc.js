import fs from 'fs';
import path from 'path';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
        replaceInDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.json') || fullPath.endsWith('.tsx') || fullPath.endsWith('.vtt')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("Marc Damoiseau") || content.includes("Marc d'Amoiseau") || content.includes("Marc Damoiso") || content.includes("Damoisceau") || content.includes("d'Amoiseau")) {
        const newContent = content.replace(/Marc Damoiseau/g, "Marc Damoiseaux")
                                  .replace(/Marc d'Amoiseau/gi, "Marc Damoiseaux")
                                  .replace(/Marc Damoisceau/gi, "Marc Damoiseaux")
                                  .replace(/Marc Damoiso/gi, "Marc Damoiseaux")
                                  // In case just 'Damoiseau' without Marc
                                  .replace(/ Damoiseau/g, " Damoiseaux");
        if (content !== newContent) {
           fs.writeFileSync(fullPath, newContent, 'utf8');
           console.log("Updated", fullPath);
        }
      }
    }
  }
}

replaceInDir('./src');
replaceInDir('./public/vtt');
console.log("Replacement complete.");
