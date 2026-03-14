import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
    console.error("Please provide GOOGLE_API_KEY environment variable.");
    process.exit(1);
}

const targetLangs = {
    'en': 'English',
    'es': 'Spanish',
    'it': 'Italian',
    'de': 'German',
    'zh': 'Chinese (Simplified)',
    'ja': 'Japanese'
};

async function translateBatch(items, targetLang) {
    if (!items || items.length === 0) return [];
    console.log(`Translating batch of ${items.length} items to ${targetLang}...`);
    
    const itemsToTranslate = items.map(item => ({
        id: item.record.id,
        shortSummary: item.record.shortSummary || "",
        fullSummary: item.record.fullSummary || ""
    }));

    const prompt = `Translate the following JSON array of osteopathy and embryology course summaries from French to ${targetLangs[targetLang]}.
CRITICAL INSTRUCTION: Ensure the translation uses precise and accurate medical and osteopathic terminology, staying faithful to the original French text.
Preserve the exact formatting and JSON structure. Return ONLY a valid JSON array of objects with the exact same 'id' and the translated 'shortSummary' and 'fullSummary' fields. Do not include markdown code block syntax like \`\`\`json.

Input:
${JSON.stringify(itemsToTranslate, null, 2)}`;
    
    const postData = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.1 }
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 30000 // 30 seconds for batch
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.candidates && parsed.candidates.length > 0 && parsed.candidates[0].content && parsed.candidates[0].content.parts.length > 0) {
                        let result = parsed.candidates[0].content.parts[0].text.trim();
                        // Remove potential enclosing backticks/code blocks from the AI response
                        if (result.startsWith('```json')) result = result.substring(7);
                        if (result.startsWith('```')) result = result.substring(3);
                        if (result.endsWith('```')) result = result.substring(0, result.length - 3);
                        result = result.trim();
                        
                        const jsonResult = JSON.parse(result);
                        resolve(jsonResult);
                    } else if (parsed.error && parsed.error.code === 429) {
                        reject(new Error('Rate limit exceeded (429)'));
                    } else {
                        console.error('Unexpected API response:', data.substring(0, 200));
                        reject(new Error('Unexpected API response'));
                    }
                } catch (e) {
                    console.error('JSON parse error in batch:', e.message);
                    reject(e);
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout (30s)'));
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

function extractSummaries(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = [];
    
    const blocks = content.split(/id:\s*"(.*?)"/);
    
    for (let i = 1; i < blocks.length; i += 2) {
        const id = blocks[i];
        const blockContent = blocks[i+1];
        
        // Use non-greedy match to get string content up to the next double quote
        const shortMatch = blockContent.match(/shortSummary:\s*"([^"]*)"/);
        const fullMatch = blockContent.match(/fullSummary:\s*"([^"]*)"/);
        
        let shortSummary = shortMatch ? shortMatch[1].replace(/\\"/g, '"') : "";
        let fullSummary = fullMatch ? fullMatch[1].replace(/\\"/g, '"') : "";
        
        if (shortSummary || fullSummary) {
            records.push({ id, shortSummary, fullSummary });
        }
    }
    
    console.log(`Extracted ${records.length} records.`);
    return records;
}

async function run() {
    console.log("Extracting French summaries from videoCourses.ts...");
    const frFile = path.join(__dirname, 'videoCourses.ts');
    
    if (!fs.existsSync(frFile)) {
        console.error(`File not found: ${frFile}`);
        process.exit(1);
    }
    
    const frExtract = extractSummaries(frFile);
    const langsToProcess = ['en', 'es', 'it', 'de', 'zh', 'ja'];
    
    for (const targetLang of langsToProcess) {
        console.log(`\n============== PROCESSING ${targetLang.toUpperCase()} ==============`);
        
        const targetFile = path.join(__dirname, `videoCourses_${targetLang}.ts`);
        if (!fs.existsSync(targetFile)) {
            console.log(`File ${targetFile} not found, skipping.`);
            continue;
        }
        
        let targetContent = fs.readFileSync(targetFile, 'utf-8');
        let modified = false;
        
        const tasks = [];
        
        for (let r = frExtract.length - 1; r >= 0; r--) {
            const record = frExtract[r];
            const searchPattern = new RegExp(`["']?id["']?:\\s*["']${record.id}["'],`);
            const match = targetContent.match(searchPattern);
            
            if (match) {
                const index = match.index;
                const substr = targetContent.substring(index);
                const transcriptMatch = substr.match(/["']?transcriptMarkdown["']?:/);
                
                if (transcriptMatch) {
                    const transcriptIndex = index + transcriptMatch.index;
                    const blockStr = targetContent.substring(index, transcriptIndex);
                    
                    const targetShortMatch = blockStr.match(/shortSummary:\s*"([^"]*)"/);
                    const targetFullMatch = blockStr.match(/fullSummary:\s*"([^"]*)"/);
                    
                    const targetShort = targetShortMatch ? targetShortMatch[1].replace(/\\"/g, '"') : "";
                    const targetFull = targetFullMatch ? targetFullMatch[1].replace(/\\"/g, '"') : "";
                    
                    if (!blockStr.includes('shortSummary') || targetShort === record.shortSummary || targetFull === record.fullSummary) {
                        tasks.push({
                            record: record,
                            targetLang: targetLang
                        });
                    } 
                }
            }
        }
        
        if (tasks.length > 0) {
            console.log(`Found ${tasks.length} missing summaries. Translating...`);
            
            const batchSize = 10;
            const results = [];
            
            for (let i = 0; i < tasks.length; i += batchSize) {
                const batch = tasks.slice(i, i + batchSize);
                console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(tasks.length / batchSize)} for ${targetLang.toUpperCase()}...`);
                
                let batchResults = [];
                let retries = 3;
                
                for (let r = 0; r < retries; r++) {
                    try {
                        const translatedItems = await translateBatch(batch, targetLang);
                        if (Array.isArray(translatedItems)) {
                            batchResults = translatedItems.map(t => ({
                                id: t.id,
                                newShort: t.shortSummary,
                                newFull: t.fullSummary
                            }));
                            break;
                        } else {
                            throw new Error("Batch translation did not return an array");
                        }
                    } catch (e) {
                        if (e.message && e.message.includes('429')) {
                            console.log(`Rate limit, waiting 5s before retry ${r+1}/${retries}...`);
                            await new Promise(res => setTimeout(res, 5000));
                        } else {
                            console.error(`Error processing batch: ${e.message}, retrying...`);
                            await new Promise(res => setTimeout(res, 2000));
                        }
                    }
                }
                
                if (batchResults.length === 0) {
                    console.log(`Failed to translate batch, skipping...`);
                    // Fallback to original text if batch translation failed completely
                    batchResults = batch.map(task => ({
                        id: task.record.id,
                        newShort: task.record.shortSummary,
                        newFull: task.record.fullSummary
                    }));
                }
                
                results.push(...batchResults);
                
                if (i + batchSize < tasks.length) {
                    await new Promise(res => setTimeout(res, 2000)); // Sleep between batches
                }
            }
            
            // Re-iterate from end to beginning to inject safely
            for (let r = frExtract.length - 1; r >= 0; r--) {
                const record = frExtract[r];
                const res = results.find(x => x.id === record.id);
                if (!res) continue;
                
                const searchPattern = new RegExp(`["']?id["']?:\\s*["']${record.id}["'],`);
                const match = targetContent.match(searchPattern);
                
                if (match) {
                    const index = match.index;
                    const substr = targetContent.substring(index);
                    const transcriptMatch = substr.match(/["']?transcriptMarkdown["']?:/);
                    
                    if (transcriptMatch) {
                        const transcriptIndex = index + transcriptMatch.index;
                        const blockStr = targetContent.substring(index, transcriptIndex);
                        
                        if (!blockStr.includes('shortSummary') && !blockStr.includes('fullSummary')) {
                            const safeShort = res.newShort ? res.newShort.replace(/"/g, '\\"').replace(/\n/g, ' ') : '';
                            const safeFull = res.newFull ? res.newFull.replace(/"/g, '\\"').replace(/\n/g, ' ') : '';

                            const shortInjection = safeShort ? `\n    "shortSummary": "${safeShort}",` : '';
                            const fullInjection = safeFull ? `\n    "fullSummary": "${safeFull}",` : '';
                            
                            targetContent = 
                                targetContent.substring(0, transcriptIndex) + 
                                shortInjection.trimStart() + (shortInjection ? '\n    ' : '') + 
                                fullInjection.trimStart() + (fullInjection ? '\n    ' : '') + 
                                targetContent.substring(transcriptIndex);
                                
                            modified = true;
                        }
                    }
                }
            }
        }
        
        if (modified) {
            fs.writeFileSync(targetFile, targetContent);
            console.log(`Saved translations for ${targetLang}`);
        } else {
            console.log(`No missing summaries found for ${targetLang}`);
        }
    }
}

run().catch(console.error);
