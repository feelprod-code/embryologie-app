import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src/data');
const files = fs.readdirSync(dataDir).filter(f => f.startsWith('embryologie') && f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // j-45
  content = content.replace(
    /A \-\-> [C|C\[|C\(][^\n]+\n {2}D/g,
    match => {
      const parts = match.split('\n  D');
      return parts[0] + '\n  A ~~~ D\n  D' + parts[1];
    }
  );

  // j-21-22
  content = content.replace(
    /B \-\-> [C|C\[|C\(][^\n]+\n {2}D/g,
    match => {
        const parts = match.split('\n  D');
        return parts[0] + '\n  B ~~~ D\n  D' + parts[1];
    }
  );

  // maturation-12ans
  content = content.replace(
    /A\[[^\n]+ \-\-> B\([^\n]+\n {2}C/g,
    match => {
        const parts = match.split('\n  C');
        return parts[0] + '\n  B ~~~ C\n  C' + parts[1];
    }
  );
  content = content.replace(
    /\n {2}C\[[^\n]+ \-\-> D\([^\n]+\n {2}E/g,
    match => {
        const parts = match.split('\n  E');
        return parts[0] + '\n  D ~~~ E\n  E' + parts[1];
    }
  );
  content = content.replace(
    /\n {2}E\[[^\n]+ \-\-> F\([^\n]+\n {2}G/g,
    match => {
        const parts = match.split('\n  G');
        return parts[0] + '\n  F ~~~ G\n  G' + parts[1];
    }
  );


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed ${file}`);
  }
}
