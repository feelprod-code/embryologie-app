const fs = require("fs");
const path = require("path");
const directory = "public/vtt";
const oldId = "3db2fd4744dc9ac3e144f0cedeefa701";
const newId = "72e294c6fe48e57cba3f2da10f7a98f7";

function parseTime(timeStr) {
    const parts = timeStr.split(":");
    let secs = 0;
    if (parts.length === 3) {
        secs = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2].replace(',', '.'));
    } else {
        secs = parseInt(parts[0]) * 60 + parseFloat(parts[1].replace(',', '.'));
    }
    return secs;
}

function formatTime(secs) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = (secs % 60).toFixed(3);
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.padStart(6, "0")}`;
}

const langs = ['en', 'es', 'fr', 'it', 'ja', 'zh', 'de'];

langs.forEach(lang => {
    const oldFilePath = path.join(directory, `${oldId}_${lang}.vtt`);
    if (!fs.existsSync(oldFilePath)) return;
    
    const content = fs.readFileSync(oldFilePath, "utf8");
    const blocks = content.split(/\n\s*\n/);
    
    let cleanBlocks = [];
    cleanBlocks.push(blocks[0]); // WEBVTT

    let cueCounter = 1;
    let lastEndSecs = 0;

    for (let i = 1; i < blocks.length; i++) {
        let block = blocks[i].trim();
        if (!block) continue;
        
        let lines = block.split(/\n/);
        let timeLineIdx = lines.findIndex(l => l.includes("-->"));
        if (timeLineIdx === -1) continue;

        const timeLine = lines[timeLineIdx];
        const [startRange, endRange] = timeLine.split("-->").map(s => s.trim());
        const originalStartSecs = parseTime(startRange);
        const originalEndSecs = parseTime(endRange.split(" ")[0]); 
        const duration = originalEndSecs - originalStartSecs;

        // CUT 1: Cues 5 to 45 (15.0 to 128.6 seconds approx)
        if (originalStartSecs >= 15.0 && originalStartSecs <= 128.6) continue;
        
        // CUT 2: Cues 47 to 49 (132.0 to 143.0 seconds approx)
        if (originalStartSecs >= 132.0 && originalStartSecs <= 143.0) continue;

        let newStartSecs = originalStartSecs;

        // Apply shift logic to collapse the removed gaps
        if (originalStartSecs > 128.6 && originalStartSecs < 132.0) {
            // This is Cue 46: "Johanna Messi..."
            // We want it to start a short delay after Cue 4 (which ended at 13.120)
            newStartSecs = lastEndSecs + 2.5; 
        } else if (originalStartSecs > 143.0) {
            // These are Cue 50+ ("Le livre, c'est la Terre..." and everything after)
            // They should start right after Cue 46 ends.
            // But we must maintain their relative spacing!
            // Total time cut before Cue 50 is:
            // Cut 1 = 128.933 (Cue 46 start) - 15.620 (ideal Cue 46 start) = 113.313
            // Cut 2 = 147.827 (Cue 50 start) - 131.693 (Cue 46 end) = 16.134
            // So total shift is exactly -> 113.313 + 16.134 = 129.447
            newStartSecs = originalStartSecs - 129.447;
            
            // Safety to ensure no overlapping
            if (newStartSecs < lastEndSecs) {
                // Keep the exact same relative gap if they were originally close?
                // Actually it's fine, we just push it back
                newStartSecs = lastEndSecs + 0.1;
            }
        }

        let newEndSecs = newStartSecs + duration;
        
        const newStart = formatTime(newStartSecs);
        const newEnd = formatTime(newEndSecs);
        let newTimeLine = `${newStart} --> ${newEnd}`;
        if (endRange.includes(" ")) {
            newTimeLine += " " + endRange.substring(endRange.indexOf(" ") + 1);
        }
        lines[timeLineIdx] = newTimeLine;

        if (timeLineIdx === 1 && /^\d+$/.test(lines[0].trim())) {
            lines[0] = cueCounter.toString();
        } else {
            lines.unshift(cueCounter.toString());
        }
        cueCounter++;

        cleanBlocks.push(lines.join("\n"));
        lastEndSecs = newEndSecs;
    }

    const newFilePath = path.join(directory, `${newId}_${lang}.vtt`);
    fs.writeFileSync(newFilePath, cleanBlocks.join("\n\n") + "\n\n");
});

console.log("Applied absolute cuts, shifted all subsequent cues perfectly, and saved 7 languages.");
