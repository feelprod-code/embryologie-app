import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('embryologie') && f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Simple string replacements for known problematic connections
  
  // 1. Stage j-45
  content = content.replace(
    /:::meso\\n  D\[/g,
    ':::meso\\n  A ~~~ D\\n  D['
  );
  
  // 2. Stage j-21-22
  content = content.replace(
    /:::ecto\\n  D\[/g,
    ':::ecto\\n  B ~~~ D\\n  D['
  );
  
  // 3. Stage maturation-12ans
  content = content.replace(
    /:::ecto\\n  C\[/g,
    ':::ecto\\n  B ~~~ C\\n  C['
  );
  content = content.replace(
    /:::endo\\n  E\[/g,
    ':::endo\\n  D ~~~ E\\n  E['
  );
  content = content.replace(
    /:::global\\n  G\[/g,
    ':::global\\n  F ~~~ G\\n  G['
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated Mermaid layout in ${file}`);
  }
});

console.log("Mermaid layout fixes applied.");
