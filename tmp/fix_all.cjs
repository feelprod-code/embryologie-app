const fs = require('fs');
const path = require('path');

// Extract the raw text from write_fr.cjs
const writeFrContent = fs.readFileSync('tmp/write_fr.cjs', 'utf8');
const userSrtStart = writeFrContent.indexOf('const userSrt = `') + 'const userSrt = `'.length;
const userSrtEnd = writeFrContent.indexOf('`;', userSrtStart);
let rawSrt = writeFrContent.substring(userSrtStart, userSrtEnd);

// Fix French typos in the raw SRT string
rawSrt = rawSrt.replace("je suis en mirage", "je suis un mirage");
rawSrt = rawSrt.replace("Yonah Messie", "Joanna Macy");
rawSrt = rawSrt.replace("Andreas Messy", "Joanna Macy");
rawSrt = rawSrt.replace("Jonas Messy", "Joanna Macy");
rawSrt = rawSrt.replace("un notion", "une notion");
rawSrt = rawSrt.replace("un moment tanné", "momentanée"); // Note: already replaced in current live file but we're acting on raw source
rawSrt = rawSrt.replace("si l'observe bien", "si on les observe bien");
rawSrt = rawSrt.replace("féménologie", "phénoménologie");

// Format to VTT carefully: replace comma with dot ONLY on timecode lines
const lines = rawSrt.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('-->')) {
        lines[i] = lines[i].replace(/,/g, '.');
    }
}
const finalVtt = "WEBVTT\n\n" + lines.join('\n');
fs.writeFileSync('public/vtt/72e294c6fe48e57cba3f2da10f7a98f7_fr.vtt', finalVtt, 'utf8');
console.log("Fixed French VTT!");

// Now fix the translations for Joanna Macy in other languages
const langs = ['en', 'es', 'it', 'de', 'ja', 'zh'];
langs.forEach(lang => {
    const p = path.join('public/vtt', `72e294c6fe48e57cba3f2da10f7a98f7_${lang}.vtt`);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        
        // English
        content = content.replace(/Yona Messi/g, 'Joanna Macy');
        content = content.replace(/Andreas Messi/g, 'Joanna Macy');
        content = content.replace(/Jonas Messi/g, 'Joanna Macy');
        // Spanish / Italian / German
        content = content.replace(/Yonah Messie/g, 'Joanna Macy');
        content = content.replace(/Andreas Messy/g, 'Joanna Macy');
        content = content.replace(/Jonas Messy/g, 'Joanna Macy');
        // Any other loose variation
        content = content.replace(/Messi/g, 'Macy');
        content = content.replace(/Yona/g, 'Joanna');
        content = content.replace(/Andreas/g, 'Joanna');
        content = content.replace(/Jonas/g, 'Joanna');
        
        fs.writeFileSync(p, content, 'utf8');
        console.log("Fixed", lang);
    }
});
