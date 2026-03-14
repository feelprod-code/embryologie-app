import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('embryologie_') && f.endsWith('.ts') && f !== 'embryologie_en.ts');

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Pattern 1: j-21-22
  // We match the graph, classdefs, and split between the diencephalic expansion (ecto) and apical mesoderm (meso)
  let m21 = content.match(/"mermaidCode":\s*"graph TD\\n\\nclassDef.*?\n  A\[.*?\]:::global(.*?)\]:::ecto\\n  D\[(.*?)\]:::meso"/s);
  if (m21) {
    let p1 = m21[0].substring(0, m21[0].indexOf(`\\n  D[`));
    p1 = p1.replace(/"mermaidCode":\s*"/, '');
    let p2 = m21[0].substring(m21[0].indexOf(`classDef ecto`), m21[0].indexOf(`\\n  A[`));
    p2 = `graph TD\\n\\n` + p2 + `\\n  D[` + m21[2] + `]:::meso`;
    let replacement = `"mermaidCode": [\n            "${p1}",\n            "${p2}"\n        ]`;
    content = content.replace(m21[0], replacement);
  }

  // Pattern 2: j-45
  let m45 = content.match(/"mermaidCode":\s*"graph TD\\n\\nclassDef.*?\n  A\[.*?\]:::meso(.*?)\]:::meso\\n  D\[(.*?)\]:::ecto"/s);
  if (m45) {
    let p1 = m45[0].substring(0, m45[0].indexOf(`\\n  D[`));
    p1 = p1.replace(/"mermaidCode":\s*"/, '');
    let p2 = m45[0].substring(m45[0].indexOf(`classDef ecto`), m45[0].indexOf(`\\n  A[`));
    p2 = `graph TD\\n\\n` + p2 + `\\n  D[` + m45[2] + `]:::ecto`;
    let replacement = `"mermaidCode": [\n            "${p1}",\n            "${p2}"\n        ]`;
    content = content.replace(m45[0], replacement);
  }

  // Pattern 3: maturation 12ans (4 parts)
  let m12 = content.match(/"mermaidCode":\s*"graph TD\\n\\nclassDef.*?\\n  A\[(.*?)\]:::ecto\\n  C\[(.*?)\]:::endo\\n  E\[(.*?)\]:::global\\n  G\[(.*?)\]:::global"/s);
  if (m12) {
    let baseStyles = m12[0].substring(m12[0].indexOf(`classDef ecto`), m12[0].indexOf(`\\n  A[`));
    let replacement = `"mermaidCode": [\n            "graph TD\\n\\n${baseStyles}\\n  A[${m12[1]}]:::ecto",\n            "graph TD\\n\\n${baseStyles}\\n  C[${m12[2]}]:::endo",\n            "graph TD\\n\\n${baseStyles}\\n  E[${m12[3]}]:::global",\n            "graph TD\\n\\n${baseStyles}\\n  G[${m12[4]}]:::global"\n        ]`;
    content = content.replace(m12[0], replacement);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated arrays in ${file}`);
  }
});
console.log("Translation array updates complete.");
