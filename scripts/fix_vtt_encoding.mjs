import fs from 'fs';
import path from 'path';

const vttDir = path.join(process.cwd(), 'public', 'vtt');

const replacements = {
    'Ã©': 'é',
    'Ã\xa0': 'à',
    'Ã¨': 'è',
    'Ã¹': 'ù',
    'Ã§': 'ç',
    'Å“': 'œ',
    'Ãª': 'ê',
    'Ã¢': 'â',
    'Ã®': 'î',
    'Ã´': 'ô',
    'Ã»': 'û',
    'Ã‰': 'É',
    'Ã€': 'À',
    'Ã‡': 'Ç',
    'Â«': '«',
    'Â»': '»',
    'â€™': '’',
    'Ã¯': 'ï',
    'Ã¤': 'ä',
    'Ã¶': 'ö',
    'Ã¼': 'ü',
    'ÃŸ': 'ß'
};

const files = fs.readdirSync(vttDir).filter(f => f.endsWith('.vtt'));
let count = 0;

for (const file of files) {
    const filePath = path.join(vttDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const [corrupted, fixed] of Object.entries(replacements)) {
        // some might have trailing spaces or be part of a word. We just do global replace.
        content = content.split(corrupted).join(fixed);
    }

    // There's a special tricky case with 'Ã ' which is 'C3 A0' where the A0 is a non-breaking space.
    // It's covered by 'Ã\xa0' above.

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        count++;
    }
}

console.log(`Replaced text in ${count} files.`);
