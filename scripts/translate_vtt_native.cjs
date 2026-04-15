const fs = require('fs');
const path = require('path');

// Try to get token from env
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
const match = envContent.match(/VITE_OPENROUTER_API_KEY=["']?([^"'\n\r]+)["']?/);
const apiKey = match ? match[1].trim() : process.env.VITE_OPENROUTER_API_KEY;

if(!apiKey) {
    console.error("No API KEY");
    process.exit(1);
}

function parseVTT(content) {
    const blocks = [];
    const lines = content.split('\n');
    let currentBlock = null;
    let textLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === 'WEBVTT' || line === '') continue;

        if (line.includes('-->')) {
            if (currentBlock) {
                currentBlock.text = textLines.join(' ');
                blocks.push(currentBlock);
            }
            const parts = line.split('-->');
            currentBlock = { start: parts[0].trim(), end: parts[1].trim(), text: '' };
            textLines = [];
        } else if (currentBlock) {
            textLines.push(line);
        }
    }
    if (currentBlock) {
        currentBlock.text = textLines.join(' ');
        blocks.push(currentBlock);
    }
    return blocks;
}

function stringifyVTT(blocks) {
    let result = 'WEBVTT\n\n';
    for (const b of blocks) {
        result += `${b.start} --> ${b.end}\n${b.text}\n\n`;
    }
    return result;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function translateTextBlocks(texts, targetLang) {
    const sysPrompt = `Tu es un traducteur expert. Traduis ce tableau de sous-titres vers le ${targetLang}. Garde le ton clinique et précis (ostéopathie, embryologie). Garde strictement le même nombre d'éléments. Reponds UNIQUEMENT avec du JSON pur : { "translations": ["trad1", "trad2", ...] }`;

    const res = await fetch(`https://openrouter.ai/api/v1/chat/completions`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
                { role: "system", content: sysPrompt },
                { role: "user", content: JSON.stringify(texts) }
            ],
            temperature: 0.1,
            response_format: { type: "json_object" }
        })
    });

    const data = await res.json();
    try {
        const rawText = data.choices[0].message.content;
        const parsed = JSON.parse(rawText.replace(/^```json/, '').replace(/```$/, '').trim());
        return parsed.translations || parsed;
    } catch(e) {
        console.log(JSON.stringify(data));
        throw e;
    }
}

async function run() {
    const dir = path.join(__dirname, '../public/vtt');
    const sourceFile = '8f890e7f51588216db016b73a8a97a14_fr.vtt';
    const sourcePath = path.join(dir, sourceFile);

    const langs = [
        { suffix: '_en.vtt', name: "anglais" },
        { suffix: '_es.vtt', name: "espagnol" },
        { suffix: '_de.vtt', name: "allemand" },
        { suffix: '_it.vtt', name: "italien" },
        { suffix: '_ja.vtt', name: "japonais" },
        { suffix: '_zh.vtt', name: "chinois mandarin" },
    ];

    const content = fs.readFileSync(sourcePath, 'utf8');
    const blocks = parseVTT(content);
    
    for (const lang of langs) {
        const targetPath = path.join(dir, `8f890e7f51588216db016b73a8a97a14${lang.suffix}`);
        console.log(`Translating to ${lang.name}...`);
        
        let translatedBlocks = [];
        const CHUNK_SIZE = 30;
        for (let i = 0; i < blocks.length; i += CHUNK_SIZE) {
            const chunk = blocks.slice(i, i + CHUNK_SIZE);
            const texts = chunk.map(b => b.text);
            try {
                const tr = await translateTextBlocks(texts, lang.name);
                for(let k=0; k<chunk.length; k++) {
                    translatedBlocks.push({ ...chunk[k], text: tr[k] || chunk[k].text });
                }
            } catch(e) {
                console.error("Failed chunk", e);
                chunk.forEach(b => translatedBlocks.push(b));
            }
            await delay(1500);
        }
        fs.writeFileSync(targetPath, stringifyVTT(translatedBlocks));
        console.log(`Done ${lang.name}`);
    }
}

run();
