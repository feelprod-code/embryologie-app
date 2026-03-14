import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('embryologie') && f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // j-45
  // Current format approx:
  // mermaidCode: `graph TD\n${colors}\n  A[Rapprochement Côtes Mi-ligne]:::meso --> B(Suture de l'Angle de Louis J45):::meso\n  A --> C[Fermeture du Médiastin]:::meso\n  A ~~~ D\n  D[Redressement Axial]:::global --> E(Tension Dure-Mérienne):::ecto\n  E --> F[Modélisation du Desmocrâne]:::ecto`
  let match45 = content.match(/mermaidCode:\s*`graph TD\\n\$\{colors\}\\n\s*A(.*?)A ~~~ D\\n\s*D(.*?ecto)`/s);
  if (match45) {
      let replacement = `mermaidCode: [\n            \`graph TD\\n\${colors}\\n  A\${match45[1].trim()}\`,\n            \`graph TD\\n\${colors}\\n  D\${match45[2].trim()}\`\n        ]`;
      content = content.replace(match45[0], replacement);
  }

  // j-21-22
  let match21 = content.match(/mermaidCode:\s*`graph TD\\n\$\{colors\}\\n\s*A(.*?)B ~~~ D\\n\s*D(.*?\]:::meso)`/s);
  if (match21) {
      let replacement = `mermaidCode: [\n            \`graph TD\\n\${colors}\\n  A\${match21[1].trim()}\`,\n            \`graph TD\\n\${colors}\\n  D\${match21[2].trim()}\`\n        ]`;
      content = content.replace(match21[0], replacement);
  }

  // maturation-12ans
  let match12 = content.match(/mermaidCode:\s*`graph TD\\n\$\{colors\}\\n\s*A(.*?)B ~~~ C\\n\s*C(.*?)D ~~~ E\\n\s*E(.*?)F ~~~ G\\n\s*G(.*?)`/s);
  if (match12) {
      let replacement = `mermaidCode: [\n            \`graph TD\\n\${colors}\\n  A\${match12[1].trim()}\`,\n            \`graph TD\\n\${colors}\\n  C\${match12[2].trim()}\`,\n            \`graph TD\\n\${colors}\\n  E\${match12[3].trim()}\`,\n            \`graph TD\\n\${colors}\\n  G\${match12[4].trim()}\`\n        ]`;
      content = content.replace(match12[0], replacement);
  }

  // Fallback for unmodified strings
  let baseMatch45 = content.match(/mermaidCode:\s*`graph TD\\n\$\{colors\}\\n\s*A(.*?)C\[.*?\].*?\\n\s*D(.*?ecto)`/s);
  if (baseMatch45 && !match45) {
      let replacement = `mermaidCode: [\n            \`graph TD\\n\${colors}\\n  A\${baseMatch45[1]}C[...]:::meso\`,\n            \`graph TD\\n\${colors}\\n  D\${baseMatch45[2]}\`\n        ]`;
      // Instead of complex exact string replacement, let's just do it directly with index
  }


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated arrays in ${file}`);
  }
});

console.log("Array Mermaid layout fixes applied.");
