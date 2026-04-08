const fs = require('fs');
const path = require('path');

const directory = 'public/vtt';
const oldId = '3db2fd4744dc9ac3e144f0cedeefa701';
const newId = '72e294c6fe48e57cba3f2da10f7a98f7';

// Parse transcript to extract blocks
const transcriptRaw = fs.readFileSync('tmp/user_transcript.txt', 'utf8');
const blockRegex = /(\d{2}:\d{2})\n([\s\S]*?)(?=\n\d{2}:\d{2}|\n*$)/g;
let match;
const transcriptBlocks = [];
let fullText = "";

function parseMinSec(str) {
    const p = str.split(':');
    return parseInt(p[0]) * 60 + parseInt(p[1]);
}

while ((match = blockRegex.exec(transcriptRaw)) !== null) {
    let timeRaw = match[1];
    let txt = match[2].replace(/\n/g, ' ').trim();
    transcriptBlocks.push({
        time: parseMinSec(timeRaw),
        text: txt,
        startChar: fullText.length
    });
    fullText += txt + " ";
}
fullText = fullText.trim();
const normalize = s => s.toLowerCase().replace(/[^a-z0-9àáâãäåèéêëìíîïòóôõöùúûüçœæ]/g, '');

for (let i = 0; i < transcriptBlocks.length; i++) {
    transcriptBlocks[i].endChar = transcriptBlocks[i].startChar + transcriptBlocks[i].text.length;
    transcriptBlocks[i].endTime = (i < transcriptBlocks.length - 1) ? transcriptBlocks[i+1].time : transcriptBlocks[i].time + 30; // approx
}

// Parse French VTT to find matching cues
let frFile = path.join(directory, oldId + '_fr.vtt');
let frContent = fs.readFileSync(frFile, 'utf8');
let frBlocks = frContent.split(/\n\s*\n/);
let cues = [];

for (let i = 1; i < frBlocks.length; i++) {
    let b = frBlocks[i].trim();
    if (!b) continue;
    let lines = b.split('\n');
    let timeLineIdx = lines.findIndex(l => l.includes('-->'));
    if (timeLineIdx !== -1) {
        let textLines = lines.slice(timeLineIdx + 1);
        let txt = textLines.join(' ');
        cues.push({
            origIndex: i, // reference
            text: txt,
            norm: normalize(txt)
        });
    }
}

// Find matches in full text
let keptIndices = [];
let keptCues = [];
let lastSearchIndex = 0;

cues.forEach((cue) => {
    // If the cue is too short, skip matching to avoid false positives
    if (cue.norm.length < 5) return; 
    
    let regexStr = cue.norm.split('').join('[^a-z0-9àáâãäåèéêëìíîïòóôõöùúûüçœæ]*');
    let regex = new RegExp(regexStr, 'i');
    let searchDomain = fullText.substring(Math.max(0, lastSearchIndex - 50));
    let rMatch = searchDomain.match(regex);
    
    if (rMatch) {
        let actualIndex = Math.max(0, lastSearchIndex - 50) + rMatch.index;
        keptIndices.push(cue.origIndex);
        
        // Determine time mapping
        let block = transcriptBlocks.find(b => actualIndex >= b.startChar && actualIndex < b.endChar);
        if (!block) block = transcriptBlocks[transcriptBlocks.length - 1];
        
        let fraction = (actualIndex - block.startChar) / Math.max(1, (block.endChar - block.startChar));
        let interpolatedTime = block.time + fraction * (block.endTime - block.time);
        
        keptCues.push({
            origIndex: cue.origIndex,
            newStart: interpolatedTime,
            newEnd: interpolatedTime + 3 
        });
        
        lastSearchIndex = actualIndex + rMatch[0].length;
    }
});

// Since gapless and avoiding overlaps is better:
for (let i = 0; i < keptCues.length; i++) {
    if (i < keptCues.length - 1) {
        keptCues[i].newEnd = Math.min(keptCues[i].newStart + 4, keptCues[i+1].newStart - 0.1); 
    }
    // Also sanity check against block ends
    if (keptCues[i].newEnd <= keptCues[i].newStart) keptCues[i].newEnd = keptCues[i].newStart + 1.5;
}

// Now generate the 7 languages!
const langs = ['en', 'es', 'fr', 'it', 'ja', 'zh', 'de'];

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = (secs % 60).toFixed(3);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.padStart(6, "0")}`;
}

langs.forEach(lang => {
    let oldFilePath = path.join(directory, `${oldId}_${lang}.vtt`);
    let newFilePath = path.join(directory, `${newId}_${lang}.vtt`);
    if (!fs.existsSync(oldFilePath)) return;
    
    let content = fs.readFileSync(oldFilePath, 'utf8');
    let blocks = content.split(/\n\s*\n/);
    
    let newBlocks = [];
    newBlocks.push(blocks[0]); // WEBVTT
    
    let counter = 1;
    keptCues.forEach(kept => {
        let block = blocks[kept.origIndex];
        if (!block) return;
        
        let lines = block.trim().split('\n');
        let timeLineIdx = lines.findIndex(l => l.includes('-->'));
        if (timeLineIdx === -1) return;
        
        lines[timeLineIdx] = `${formatTime(kept.newStart)} --> ${formatTime(kept.newEnd)}`;
        if (timeLineIdx === 1 && /^\d+$/.test(lines[0].trim())) {
            lines[0] = counter.toString();
        } else {
            lines.unshift(counter.toString());
        }
        counter++;
        newBlocks.push(lines.join('\n'));
    });
    
    fs.writeFileSync(newFilePath, newBlocks.join('\n\n') + '\n\n');
});

console.log("Successfully generated dynamically interpolated VTT files from the transcript text over " + langs.length + " languages. Kept " + keptCues.length + " cues.");
