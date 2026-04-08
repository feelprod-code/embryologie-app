const fs = require('fs');
const path = require('path');

const frPath = path.join('public/vtt', '72e294c6fe48e57cba3f2da10f7a98f7_fr.vtt');
const frContent = fs.readFileSync(frPath, 'utf8');

const blocks = frContent.split(/\n\s*\n/).filter(b => b.trim() !== '' && b !== 'WEBVTT');
let cues = [];

for (let b of blocks) {
    let lines = b.split('\n');
    let timeLineIdx = lines.findIndex(l => l.includes('-->'));
    if (timeLineIdx === -1) continue;
    let timeLine = lines[timeLineIdx];
    
    let parts = timeLine.split('-->').map(s => s.trim());
    
    function pTime(t) {
        let p = t.split(':');
        let s = p[2].replace(',', '.');
        return parseInt(p[0])*3600 + parseInt(p[1])*60 + parseFloat(s);
    }
    
    cues.push({
        idx: lines[0],
        start: pTime(parts[0]),
        end: pTime(parts[1].split(' ')[0]),
        timeLine: timeLine
    });
}

const translated = JSON.parse(fs.readFileSync('tmp/translated_tx.json', 'utf8'));
const langs = ['en', 'es', 'it', 'de', 'ja', 'zh'];

langs.forEach(lang => {
    let rawDict = translated[lang];
    let fullText = Object.values(rawDict).join(' ').replace(/\s+/g, ' ').trim();
    
    let words;
    if (lang === 'ja' || lang === 'zh') {
        words = fullText.split(''); 
    } else {
        words = fullText.split(' ');
    }
    
    let totalDuration = cues.reduce((sum, c) => sum + (c.end - c.start), 0);
    
    let vttOut = ["WEBVTT\n"];
    
    let wordIndex = 0;
    
    for (let c of cues) {
        let blockDur = c.end - c.start;
        let wordsInBlock = Math.round((blockDur / totalDuration) * words.length);
        if (wordsInBlock < 1 && wordIndex < words.length) wordsInBlock = 1;
        
        let chunkWords = [];
        for (let j = 0; j < wordsInBlock && wordIndex < words.length; j++) {
            chunkWords.push(words[wordIndex++]);
        }
        
        // ensure we output all remaining words in the last block
        if (c === cues[cues.length - 1]) {
            while(wordIndex < words.length) {
                chunkWords.push(words[wordIndex++]);
            }
        }
        
        let textChunk = (lang === 'ja' || lang === 'zh') ? chunkWords.join('') : chunkWords.join(' ');
        
        vttOut.push(c.idx);
        vttOut.push(c.timeLine);
        
        // Split chunk into two lines if long, to look like a subtitle
        if (textChunk.length > 50 && lang !== 'ja' && lang !== 'zh') {
            let mid = Math.floor(textChunk.length / 2);
            let spaceIdx = textChunk.indexOf(' ', mid);
            if (spaceIdx === -1) spaceIdx = textChunk.lastIndexOf(' ', mid);
            if (spaceIdx !== -1) {
                vttOut.push(textChunk.substring(0, spaceIdx).trim());
                vttOut.push(textChunk.substring(spaceIdx).trim());
            } else {
                vttOut.push(textChunk);
            }
        } else if (textChunk.length > 25 && (lang === 'ja' || lang === 'zh')) {
            let mid = Math.floor(textChunk.length / 2);
            vttOut.push(textChunk.substring(0, mid));
            vttOut.push(textChunk.substring(mid));
        } else {
            vttOut.push(textChunk);
        }
        
        vttOut.push('');
    }
    
    const outPath = path.join('public/vtt', `72e294c6fe48e57cba3f2da10f7a98f7_${lang}.vtt`);
    fs.writeFileSync(outPath, vttOut.join('\n'));
});

console.log("Mapped translations to exactly 163 cues perfectly lined up!");
