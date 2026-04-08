const fs = require('fs');

const diff = fs.readFileSync('tmp/vtt_diff.txt', 'utf8');
const lines = diff.split('\n');

let examples = [];
let i = 0;

while(i < lines.length && examples.length < 50) {
    if (lines[i].startsWith('-') && !lines[i].startsWith('---') && lines[i].trim() !== '-') {
        if (lines[i+1] && lines[i+1].startsWith('+') && !lines[i+1].startsWith('+++') && lines[i+1].trim() !== '+') {
            const before = lines[i].substring(1).trim();
            const after = lines[i+1].substring(1).trim();
            
            // Only keep if it's not just an empty line addition or timecode (-->)
            if (before.length > 5 && after.length > 5 && !before.includes('-->') && before !== after) {
                examples.push(`- L'IA a lu : "${before}"\n+ Corrigé : "${after}"\n`);
            }
            i += 2;
            continue;
        }
    }
    i++;
}

fs.writeFileSync('tmp/diff_examples.txt', examples.join('\n'));
