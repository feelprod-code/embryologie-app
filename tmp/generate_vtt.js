const fs = require('fs');
const path = require('path');

const transcriptRaw = fs.readFileSync('tmp/user_transcript.txt', 'utf8');
const blockRegex = /(\d{2}:\d{2})\n([\s\S]*?)(?=\n\d{2}:\d{2}|\n*$)/g;
let match;
const transcriptBlocks = [];

function parseMinSec(str) {
    const p = str.split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
}

while ((match = blockRegex.exec(transcriptRaw)) !== null) {
    let timeRaw = match[1];
    let txt = match[2].replace(/\n/g, ' ').trim();
    transcriptBlocks.push({
        time: parseMinSec(timeRaw),
        text: txt
    });
}

for (let i = 0; i < transcriptBlocks.length; i++) {
    transcriptBlocks[i].endTime = (i < transcriptBlocks.length - 1) ? transcriptBlocks[i+1].time : transcriptBlocks[i].time + 30;
}

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = (secs % 60).toFixed(3);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.padStart(6, "0")}`;
}

let vttLines = ["WEBVTT\n"];
let cueIndex = 1;

transcriptBlocks.forEach(block => {
    // split text into short phrases (approximated by punctuation)
    let phrases = block.text.split(/(?<=[.?!,])\s+/);
    if(phrases.length === 0) return;
    
    // further split long phrases
    let finalPhrases = [];
    phrases.forEach(p => {
        if(p.length > 80) {
            let half = Math.floor(p.length / 2);
            let spacePivot = p.indexOf(' ', half);
            if(spacePivot !== -1) {
                finalPhrases.push(p.substring(0, spacePivot).trim());
                finalPhrases.push(p.substring(spacePivot).trim());
            } else {
                finalPhrases.push(p);
            }
        } else {
            finalPhrases.push(p);
        }
    });

    phrases = finalPhrases.filter(p => p.length > 0);
    
    let durationPerPhrase = (block.endTime - block.time) / phrases.length;
    
    phrases.forEach((phrase, idx) => {
        let start = block.time + idx * durationPerPhrase;
        let end = start + durationPerPhrase - 0.1; // 0.1s gap
        
        vttLines.push(`${cueIndex}`);
        vttLines.push(`${formatTime(start)} --> ${formatTime(end)}`);
        // if phrase is long, split on two lines aesthetically
        if (phrase.length > 40) {
            let mid = Math.floor(phrase.length / 2);
            let spaceMatch = phrase.indexOf(' ', mid);
            if (spaceMatch !== -1) {
                vttLines.push(phrase.substring(0, spaceMatch).trim());
                vttLines.push(phrase.substring(spaceMatch).trim());
            } else {
                vttLines.push(phrase);
            }
        } else {
            vttLines.push(phrase);
        }
        vttLines.push("");
        cueIndex++;
    });
});

fs.writeFileSync('public/vtt/72e294c6fe48e57cba3f2da10f7a98f7_fr.vtt', vttLines.join('\n'));
console.log("Generated clean French VTT intelligently mapped to 30s blocks");
