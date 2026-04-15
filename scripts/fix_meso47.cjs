const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/data');
const files = ['videoCourses_en.ts', 'videoCourses_es.ts', 'videoCourses_de.ts', 'videoCourses_it.ts', 'videoCourses_ja.ts', 'videoCourses_zh.ts'];

for (const file of files) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Find meso-47 block
    const startIndex = content.indexOf('"meso-47"');
    if (startIndex !== -1) {
        const transcriptIndex = content.indexOf('"transcriptMarkdown": "# Le Mouvement', startIndex);
        if (transcriptIndex !== -1) {
            const arrEnd = content.indexOf('];', transcriptIndex);
            if(arrEnd !== -1) {
                const str = content.substring(transcriptIndex, arrEnd);
                // Replace the starting double quote and ending double quote with backticks
                let newStr = str.replace(/"transcriptMarkdown":\s*"/, '"transcriptMarkdown": `');
                const lastQuote = newStr.lastIndexOf('"');
                if(lastQuote !== -1) {
                    newStr = newStr.substring(0, lastQuote) + '`\n    }' + newStr.substring(lastQuote+1).replace(/\}/, ''); // adjust the brace
                }
                content = content.substring(0, transcriptIndex) + newStr + content.substring(arrEnd);
                fs.writeFileSync(filePath, content, 'utf-8');
                console.log('Fixed syntax in', file);
            }
        }
    }
}
