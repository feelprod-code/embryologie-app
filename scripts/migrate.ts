import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Knowledge directories
const knowledgeDir = path.join(projectRoot, 'knowledge');
const conceptsDir = path.join(knowledgeDir, 'concepts');
const playbooksDir = path.join(knowledgeDir, 'playbooks');
const referencesDir = path.join(knowledgeDir, 'references');

// Ensure directories exist
fs.mkdirSync(knowledgeDir, { recursive: true });
fs.mkdirSync(conceptsDir, { recursive: true });
fs.mkdirSync(playbooksDir, { recursive: true });
fs.mkdirSync(referencesDir, { recursive: true });

async function runMigration() {
    console.log("Démarrage de la migration vers OKF...");

    // 1. Charger les modules
    const { detailedStages } = await import(path.join(projectRoot, 'src/data/embryologie.ts'));
    const { videoCourses } = await import(path.join(projectRoot, 'src/data/videoCourses.ts'));
    const { podcastsData } = await import(path.join(projectRoot, 'src/data/podcasts.ts'));

    console.log(`Données trouvées :
- Stades : ${detailedStages.length}
- Vidéos : ${videoCourses.length}
- Podcasts : ${podcastsData.length}`);

    const nowStr = new Date().toISOString();

    // 2. Création de log.md
    const logContent = `---
type: log
title: "Journal de connaissances"
description: "Journal de suivi de l'évolution de la base de connaissances OKF"
timestamp: ${nowStr}
---
# Journal d'évolution de la base de connaissances OKF

- **${nowStr.slice(0, 10)}** : Initialisation de la base OKF. Migration automatisée de ${detailedStages.length} stades d'embryologie, ${videoCourses.length} cours vidéos, et ${podcastsData.length} podcasts.
`;
    fs.writeFileSync(path.join(knowledgeDir, 'log.md'), logContent);
    console.log("Généré: log.md");

    // 3. Génération des Concepts (Stades de Marc Damoiseaux)
    for (const stage of detailedStages) {
        const fileName = `stage_${stage.id}.md`;
        
        let markdown = `---
type: concept
title: "${stage.title}"
description: "${stage.generalDescription.replace(/"/g, '\\"')}"
tags: ["stage", "embryologie", "${stage.dayLabel}"]
timestamp: ${nowStr}
---
# ${stage.title} (${stage.dayLabel} - ${stage.period})

${stage.generalDescription}

## Événements clé
`;

        for (const event of stage.events) {
            markdown += `* **[${event.layer}] ${event.movement}** : ${event.description}\n`;
        }

        if (stage.practicalIntegration) {
            markdown += `\n## Pratique Clinique & Intégration\n`;
            markdown += `* **Fulcrums** : ${stage.practicalIntegration.fulcrums}\n`;
            markdown += `* **Palpation générale** : ${stage.practicalIntegration.generalPalpation}\n`;
            markdown += `* **Posture du thérapeute** : ${stage.practicalIntegration.therapistPosture}\n`;
            markdown += `* **Aspect psychosomatique** : ${stage.practicalIntegration.psychosomatic}\n`;
        }

        fs.writeFileSync(path.join(conceptsDir, fileName), markdown);
    }
    console.log(`Généré ${detailedStages.length} fiches de concepts de stades.`);

    // 4. Génération des Références (Transcriptions de Vidéos)
    for (const course of videoCourses) {
        const fileName = `course_${course.id}.md`;
        
        let markdown = `---
type: reference
title: "${course.title}"
description: "${(course.shortSummary || '').replace(/"/g, '\\"')}"
tags: ["video", "course", "${course.categoryId}"]
videoId: "${course.id}"
duration: "${course.duration}"
timestamp: ${nowStr}
---
# ${course.title} (Catégorie: ${course.categoryId})

${course.fullSummary || ''}

## Retranscription
${course.transcriptMarkdown}
`;

        fs.writeFileSync(path.join(referencesDir, fileName), markdown);
    }
    console.log(`Généré ${videoCourses.length} transcriptions vidéos.`);

    // 5. Génération des Références (Podcasts)
    for (const podcast of podcastsData) {
        const fileName = `podcast_${podcast.id || podcast.title.replace(/\s+/g, '_').toLowerCase()}.md`;
        
        let markdown = `---
type: reference
title: "${podcast.title}"
description: "${(podcast.description || '').replace(/"/g, '\\"')}"
tags: ["podcast"]
timestamp: ${nowStr}
---
# ${podcast.title}

${podcast.description || ''}

## Retranscription
${podcast.transcript || ''}
`;

        fs.writeFileSync(path.join(referencesDir, fileName), markdown);
    }
    console.log(`Généré ${podcastsData.length} transcriptions de podcasts.`);

    // 6. Génération de l'index.md de cartographie générale
    let indexContent = `---
type: index
title: "Cartographie générale OKF - Embryo"
description: "Index central pour le routage de l'IA"
timestamp: ${nowStr}
---
# Cartographie Générale OKF - Embryo

## Concepts (Stades Embryologiques)
`;

    for (const stage of detailedStages) {
        indexContent += `* [${stage.dayLabel} : ${stage.title}](file://./concepts/stage_${stage.id}.md)\n`;
    }

    indexContent += `\n## Références Cours Vidéos\n`;
    for (const course of videoCourses) {
        indexContent += `* [${course.title} (Catégorie: ${course.categoryId})](file://./references/course_${course.id}.md)\n`;
    }

    indexContent += `\n## Références Podcasts\n`;
    for (const podcast of podcastsData) {
        const pId = podcast.id || podcast.title.replace(/\s+/g, '_').toLowerCase();
        indexContent += `* [${podcast.title}](file://./references/podcast_${pId}.md)\n`;
    }

    fs.writeFileSync(path.join(knowledgeDir, 'index.md'), indexContent);
    console.log("Généré: index.md");

    console.log("Migration vers OKF terminée avec succès !");
}

runMigration().catch(err => {
    console.error("Erreur de migration :", err);
});
