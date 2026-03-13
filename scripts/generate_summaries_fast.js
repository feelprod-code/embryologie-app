import fs from 'fs';
import path from 'path';

async function fetchFromOpenRouter(apiKey, prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Embryologie App",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "openai/gpt-4o-mini",
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: `Tu es un expert en embryologie biodynamique et ostéopathie. Ton rôle est de synthétiser des retranscriptions vidéo d'enseignement.
Réponds TOUJOURS au format JSON strict :
{
    "shortSummary": "résumé très accrocheur de 2 à 3 lignes maximum qui donne très envie de regarder la vidéo, vraiment orienté bénéfice pour l'étudiant/thérapeute.",
    "fullSummary": "Un résumé plus complet de 1 ou 2 paragraphes détaillant ce qui est concrètement enseigné (théorie, pratique) et les concepts clés abordés."
}`
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    await new Promise(r => setTimeout(r, 2000 * (i + 1))); // backoff
                    continue;
                }
                console.error(`HTTP error: ${response.status}`);
                return null;
            }

            const data = await response.json();
            return JSON.parse(data.choices[0].message.content);
        } catch (e) {
            console.error("Erreur API :", e.message);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    return null;
}

// Concurrency helper
async function mapConcurrent(items, concurrency, fn) {
    const results = [];
    let i = 0;

    const workers = Array.from({ length: concurrency }).map(async (_, workerIndex) => {
        while (i < items.length) {
            const index = i++;
            results[index] = await fn(items[index], index);
        }
    });

    await Promise.all(workers);
    return results;
}

async function main() {
    const { videoCourses } = await import('../src/data/videoCourses.ts');
    console.log("Loaded", videoCourses.length, "videos");

    const mcpConfigPath = '/Users/philippeguillaume/.gemini/antigravity/mcp_config.json';
    let apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        try {
            const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
            apiKey = config.mcpServers.openrouter.env.OPENROUTER_API_KEY;
        } catch (e) {
            console.error("Could not find OpenRouter API key.");
            process.exit(1);
        }
    }

    const cacheFile = path.resolve('./scripts/summary_cache.json');
    let cache = {};
    if (fs.existsSync(cacheFile)) {
        cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    }

    let modifiedCount = 0;

    // Filter only those that need to be processed
    const toProcess = videoCourses.filter(course => !(cache[course.id] && cache[course.id].shortSummary && cache[course.id].fullSummary));

    console.log(`Remaining videos to process: ${toProcess.length}`);

    await mapConcurrent(toProcess, 10, async (course) => {
        console.log(`[PROCESS] Generating for: ${course.id} - ${course.title}...`);
        const transcriptChunk = course.transcriptMarkdown.substring(0, 4500);
        const prompt = `Voici la retranscription pour la vidéo '${course.title}':\n\n${transcriptChunk}`;

        const result = await fetchFromOpenRouter(apiKey, prompt);

        if (result) {
            cache[course.id] = result;
            // Write cache safelyish (not fully thread-safe for writing but JS is single threaded)
            fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
            console.log(`   -> Success! Short: ${result.shortSummary.substring(0, 50)}...`);
            modifiedCount++;
        } else {
            console.log(`   -> Failed to generate for ${course.id}`);
        }
    });

    console.log(`Finished processing. ${modifiedCount} new descriptions generated.`);
}

main().catch(console.error);
