const fs = require('fs');

const langs = ['en', 'es', 'it', 'de', 'ja', 'zh'];
const oldId = '3db2fd4744dc9ac3e144f0cedeefa701';
const newId = '72e294c6fe48e57cba3f2da10f7a98f7';

const translated = JSON.parse(fs.readFileSync('tmp/translated_tx.json', 'utf8'));

function parseMinSec(str) {
    const p = str.split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
}

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = (secs % 60).toFixed(3);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.padStart(6, "0")}`;
}

langs.forEach(lang => {
    let transcriptBlocks = [];
    const rawBlocks = translated[lang];
    if(!rawBlocks) return;

    for (let timeCode in rawBlocks) {
        transcriptBlocks.push({
            time: parseMinSec(timeCode),
            text: rawBlocks[timeCode]
        });
    }

    // Sort by time just to be safe
    transcriptBlocks.sort((a,b) => a.time - b.time);

    for (let i = 0; i < transcriptBlocks.length; i++) {
        // Last block spans until 5:55 = 355 seconds!
        // At 05:27 (327 seconds) the last block starts. 
        // 355 - 327 = 28 seconds duration
        transcriptBlocks[i].endTime = (i < transcriptBlocks.length - 1) ? transcriptBlocks[i+1].time : transcriptBlocks[i].time + 28; 
    }

    let vttLines = ["WEBVTT\n"];
    let cueIndex = 1;

    transcriptBlocks.forEach(block => {
        let phrases;
        
        if (lang === 'ja' || lang === 'zh') {
            // Asian punctuation split
            phrases = block.text.split(/(?<=[。！？，、])/);
        } else {
            // Latin punctuation split
            phrases = block.text.split(/(?<=[.?!,])\s+/);
        }
        
        if(phrases.length === 0) return;
        
        let finalPhrases = [];
        phrases.forEach(p => {
            if (lang !== 'ja' && lang !== 'zh' && p.length > 80) {
                let half = Math.floor(p.length / 2);
                let spacePivot = p.indexOf(' ', half);
                if(spacePivot !== -1) {
                    finalPhrases.push(p.substring(0, spacePivot).trim());
                    finalPhrases.push(p.substring(spacePivot).trim());
                } else {
                    finalPhrases.push(p);
                }
            } else if ((lang === 'ja' || lang === 'zh') && p.length > 40) {
                let half = Math.floor(p.length / 2);
                finalPhrases.push(p.substring(0, half));
                finalPhrases.push(p.substring(half));
            } else {
                finalPhrases.push(p);
            }
        });

        phrases = finalPhrases.filter(p => p.trim().length > 0);
        
        let durationPerPhrase = (block.endTime - block.time) / Math.max(1, phrases.length);
        
        phrases.forEach((phrase, idx) => {
            let start = block.time + idx * durationPerPhrase;
            let end = start + durationPerPhrase - 0.1; 
            
            vttLines.push(`${cueIndex}`);
            vttLines.push(`${formatTime(start)} --> ${formatTime(end)}`);
            
            if (lang !== 'ja' && lang !== 'zh' && phrase.length > 40) {
                let mid = Math.floor(phrase.length / 2);
                let spaceMatch = phrase.indexOf(' ', mid);
                if (spaceMatch !== -1) {
                    vttLines.push(phrase.substring(0, spaceMatch).trim());
                    vttLines.push(phrase.substring(spaceMatch).trim());
                } else {
                    vttLines.push(phrase.trim());
                }
            } else {
                vttLines.push(phrase.trim());
            }
            vttLines.push("");
            cueIndex++;
        });
    });

    fs.writeFileSync(`public/vtt/${newId}_${lang}.vtt`, vttLines.join('\n'));
});

console.log("Generated VTT successfully for " + langs.length + " languages.");
