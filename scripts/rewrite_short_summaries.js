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
                            content: `Tu es un assistant pour une académie médicale. Ton rôle est de réécrire des descriptions de vidéos pour qu'elles soient simples, ultra-directes et variées.
INTERDIT ABSOLU d'utiliser des formules d'introduction répétitives comme "Ce cours...", "Cette vidéo...", "Cette session aborde...", "Dans ce cours...".
Rentre IMMÉDIATEMENT dans le vif du sujet, de préférence avec une phrase nominale (ex: "Analyse de la chronologie...", "Présentation de...", "Principes de...", "Mécanismes de la gamétogénèse...").
Fais simple, direct, sans en faire des caisses. Aucune formulation publicitaire ou d'accroche.

Réponds TOUJOURS au format JSON strict :
{
    "shortSummary": "description très directe et variée de 1 à 2 lignes maximum."
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
    if (!fs.existsSync(cacheFile)) {
        console.log("No cache file found!");
        return;
    }

    let cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    const courses = Object.keys(cache);
    console.log(`Loaded ${courses.length} summaries to rewrite.`);

    let modifiedCount = 0;

    await mapConcurrent(courses, 10, async (courseId) => {
        const item = cache[courseId];
        const prompt = `Voici un résumé descriptif : "${item.fullSummary}".\n\nRéécris l'accroche ci-dessous dans un ton neutre et très factuel :\n"${item.shortSummary}"`;

        const result = await fetchFromOpenRouter(apiKey, prompt);

        if (result) {
            cache[courseId].shortSummary = result.shortSummary;
            fs.writeFileSync(cacheFile, JSON.stringify(cache, null, 2));
            console.log(`[${courseId}] -> ${result.shortSummary}`);
            modifiedCount++;
        } else {
            console.log(`[${courseId}] -> Failed!`);
        }
    });

    console.log(`Finished processing. ${modifiedCount} descriptions rewritten.`);
}

main().catch(console.error);
