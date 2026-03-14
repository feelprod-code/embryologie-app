import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('embryologie') && f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Fix j-45 - look for "A[xyz]:::meso --> B... A --> C[xyz]:::meso... D" and inject A ~~~ D
  content = content.replace(/(A \-\-> C\[(.*?)\]:::meso\\n *)D\[/gs, 'A --> C[$2]:::meso\\n  A ~~~ D\\n  D[');
  
  // Fix j-21-22
  content = content.replace(/(B \-\-> C\[(.*?)\]:::ecto\\n *)D\[/gs, 'B --> C[$2]:::ecto\\n  B ~~~ D\\n  D[');
  
  // Fix maturation-12ans
  content = content.replace(/(B\((.*?)\):::ecto\\n *)C\[/gs, 'B($2):::ecto\\n  B ~~~ C\\n  C[');
  content = content.replace(/(D\((.*?)\):::endo\\n *)E\[/gs, 'D($2):::endo\\n  D ~~~ E\\n  E[');
  content = content.replace(/(F\((.*?)\):::global\\n *)G\[/gs, 'F($2):::global\\n  F ~~~ G\\n  G[');

  // Clean up any accidentally doubled "~~~" if ran twice
  content = content.replace(/\\n *A ~~~ D\\n *A ~~~ D/g, '\\n  A ~~~ D');
  content = content.replace(/\\n *B ~~~ D\\n *B ~~~ D/g, '\\n  B ~~~ D');
  content = content.replace(/\\n *B ~~~ C\\n *B ~~~ C/g, '\\n  B ~~~ C');
  content = content.replace(/\\n *D ~~~ E\\n *D ~~~ E/g, '\\n  D ~~~ E');
  content = content.replace(/\\n *F ~~~ G\\n *F ~~~ G/g, '\\n  F ~~~ G');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated Mermaid layout in ${file}`);
  }
});

console.log("Safe Mermaid layout fixes applied.");
