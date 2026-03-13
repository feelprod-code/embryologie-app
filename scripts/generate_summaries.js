import fs from 'fs';
import path from 'path';

async function fetchFromOpenRouter(apiKey, prompt) {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "http://localhost:3000", // Optional, for including your app on openrouter.ai rankings.
                "X-Title": "Embryologie App", // Optional. Shows in rankings on openrouter.ai.
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
    "shortSummary": "résumé accrocheur de 2 à 3 lignes maximum (environ 150 caractères au total) qui donne très envie de regarder la vidéo, orienté bénéfice pour l'étudiant/thérapeute",
    "fullSummary": "Un résumé complet d'environ 1 à 2 paragraphes détaillant ce qui est enseigné dans cette session et les concepts clés abordés."
}`
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ]
            })
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (e) {
        console.error("Erreur API :", e);
        return null;
    }
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

    for (const course of videoCourses) {
        if (cache[course.id] && cache[course.id].shortSummary && cache[course.id].fullSummary) {
            console.log(`[SKIP] Already cached: ${course.id} - ${course.title}`);
            continue;
        }

        console.log(`[PROCESS] Generating for: ${course.id} - ${course.title}...`);
        const transcriptChunk = course.transcriptMarkdown.substring(0, 4000); // 4000 chars is enough to summarize
        const prompt = `Voici la retranscription pour la vidéo '${course.title}':\n\n${transcriptChunk}`;

        const result = await fetchFromOpenRouter(apiKey, prompt);

        if (result) {
            cache[course.id] = result;
            fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
            console.log(`   -> Success! Short: ${result.shortSummary.substring(0, 50)}...`);
            modifiedCount++;

            // tiny sleep to avoid rate limits
            await new Promise(r => setTimeout(r, 700));
        } else {
            console.log(`   -> Failed to generate for ${course.id}`);
        }
    }

    console.log(`Finished processing. ${modifiedCount} new descriptions generated.`);
}

main().catch(console.error);
