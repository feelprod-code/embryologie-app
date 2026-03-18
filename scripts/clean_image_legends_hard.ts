import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/videoCourses.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');

let changedCount = 0;

const cleanContent = fileContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, legend, url) => {
    let clean = legend;

    // 1. Remove prefixes that describe the image itself
    clean = clean.replace(/^Cette image semble être une vue d'ensemble/i, 'Vue d\'ensemble');
    clean = clean.replace(/^L'image semble détailler /i, 'Détail de ');
    clean = clean.replace(/^L'image la structure /i, 'Structure ');
    clean = clean.replace(/^L'image correspond à la description de /i, 'Intégration de ');
    clean = clean.replace(/^Cette image semble être une vue récapitulative ou une visualisation finale de l'/i, 'Vue récapitulative de l\'');
    clean = clean.replace(/^This image seems to depict the effect of /i, 'Effet de ');
    clean = clean.replace(/^L'image schématique générale s'insère au début du texte, après la description initiale du /i, 'Mouvement de ');
    clean = clean.replace(/^L'image générale introduit la section sur les extrémités, et ce paragraphe conclut la discussion sur la /i, 'Relation entre ');
    clean = clean.replace(/^L'image un concept général, et ce paragraphe, traitant de la conscience de notre lien avec la Terre, préfigure l'introduction et la nécessité d'une 'nouvelle vision' qui suivra/i, 'Conscience de notre lien avec la Terre');
    clean = clean.replace(/^Cette image pourrait résumer ou introduire visuellement les aspects liés au /i, 'Aspects liés au ');
    clean = clean.replace(/^Schéma relatif à l'/i, 'Schéma de l\'');
    clean = clean.replace(/^L'image la notion de /i, 'Notion de ');
    clean = clean.replace(/^Cette image semble montrer une étape intermédiaire de la /i, 'Étape intermédiaire de la ');
    clean = clean.replace(/^This image probably illustrates the /i, '');
    clean = clean.replace(/^This image likely shows the /i, '');
    clean = clean.replace(/^L'image est placée après la description du /i, 'Sillon optique et ');
    clean = clean.replace(/^L'image est insérée après la mention des /i, 'Différents points d\'appui : ');
    clean = clean.replace(/^Cette image complète l'illustration du /i, 'Illustration du ');
    clean = clean.replace(/^L'image et le texte décrivent les /i, 'Mouvements coordonnés des ');
    clean = clean.replace(/^Cette image détaille la /i, 'Détail de la ');
    clean = clean.replace(/^Cette image peut illustrer un /i, 'Illustration d\'un ');
    clean = clean.replace(/^Cette image peut illustrer la /i, 'Illustration de la ');
    clean = clean.replace(/^Cette image peut montrer une /i, 'Vue de la ');
    clean = clean.replace(/^Cette image clarifie la /i, 'Clarification de la ');
    clean = clean.replace(/^Ces images \(\d+ à \d+\) offrent différentes perspectives sur les /i, 'Perspectives sur les ');
    clean = clean.replace(/^Cette image peut compléter l'illustration de l'/i, 'Illustration de l\'');
    clean = clean.replace(/^Cette partie explique le /i, 'Rôle du ');
    clean = clean.replace(/^This image introduces the /i, 'Introduction to the ');
    clean = clean.replace(/^This image details the /i, 'Details of the ');
    clean = clean.replace(/^This image explains the /i, 'Distribution of the ');
    clean = clean.replace(/^This image illustrates the /i, 'Multisensory integration ');
    clean = clean.replace(/^This image continues with the /i, 'Multisensory integration ');
    clean = clean.replace(/^This image directly references the /i, 'Circuit de Papez ');
    clean = clean.replace(/^This image further elaborates on the /i, 'Circuit de Papez ');
    clean = clean.replace(/^L'image \d+ montre le /i, 'Développement du ');
    clean = clean.replace(/^L'image \d+ est contextuelle au /i, 'Développement du ');
    clean = clean.replace(/^L'image concerne des /i, 'Axes et angles ');
    clean = clean.replace(/^L'image qui suit est liée à une /i, 'Zone cérébrale ');
    clean = clean.replace(/^Cette image est placée après l'explication des /i, '23 degrés de liberté ');
    clean = clean.replace(/^Schéma explicatif/i, 'Schéma');
    clean = clean.replace(/^The topic by reiterating /i, 'Importance of ');
    clean = clean.replace(/^Axes orbitaires\/pyramidaux et est insérée après la mention des /i, 'Axes orbitaires / pyramidaux - ');

    // 2. Remove trailing explanations and reasoning (usually after a comma)
    const trailingPatterns = [
        /,\s*donc l'insérer après.*/i,
        /,\s*et cette phrase marque.*/i,
        /,\s*ce qui correspond.*/i,
        /,\s*cohérent avec.*/i,
        /,\s*as described.*/i,
        /,\s*ce qui est pertinent.*/i,
        /,\s*et est insérée après.*/i,
        /,\s*en lien avec la phrase.*/i,
        /,\s*ce qui se connecte.*/i,
        /,\s*correspondant à.*/i,
        /,\s*illustré par le.*/i,
        /,\s*aligning with.*/i,
        /,\s*matching the verbatim.*/i,
        /,\s*directly corresponding.*/i,
        /,\s*which is discussed.*/i,
        /,\s*which is then explained.*/i,
        /,\s*fitting the verbatim.*/i,
        /,\s*relevant to actions.*/i,
        /,\s*following the verbatim.*/i,
        /,\s*directly matching.*/i,
        /,\s*which is next in.*/i,
        /,\s*ce qui est introduite.*/i,
        /,\s*et complète l'explication.*/i,
        /,\s*juste avant l'explication.*/i,
        /,\s*donc elle s'intègre.*/i,
        /,\s*et son lien avec.*/i,
        /,\s*qui est introduite juste.*/i,
        /,\s*ce qui est mentionné juste après.*/i,
        /,\s*ce qui correspond bien à ce paragraphe.*/i,
        /,\s*comme indiqué dans le PDF.*/i,
        /,\s*qui sont synthétisés dans le PDF.*/i,
        /,\s*expliquant les mouvements.*/i,
        /,\s*ce qui complète l'explication.*/i,
        /,\s*qui est introduite juste après ce texte.*/i,
        /,\s*et complète.*/i
    ];

    trailingPatterns.forEach(pattern => {
        clean = clean.replace(pattern, '');
    });

    // 3. Final cleanup
    clean = clean.trim();
    // Capitalize first letter if it exists
    if (clean.length > 0) {
        clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    }

    if (legend !== clean) {
        changedCount++;
        console.log(`OLD: ${legend}\nNEW: ${clean}\n`);
    }

    return `![${clean}](${url})`;
});

if (changedCount > 0) {
    fs.writeFileSync(filePath, cleanContent, 'utf-8');
    console.log(`Successfully hard-cleaned ${changedCount} legends.`);
} else {
    console.log("No dirty legends found.");
}
