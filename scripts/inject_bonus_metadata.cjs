const fs = require('fs');
const path = require('path');

const bonusEntryEnglish = `    {
        "id": "meso-47",
        "schemas": [],
        "categoryId": "mesoderme",
        "youtubeId": "",
        "cloudflareId": "8f890e7f51588216db016b73a8a97a14",
        "duration": "10:31",
        "title": "BONUS - Le Mouvement Régénérateur",
        "shortSummary": "Le mouvement régénérateur (création de Marc Damoiseaux) inspiré du mouvement développemental de l'embryon. Équilibrage des sphères neuro-sensorielles, rythmiques et métaboliques.",
        "fullSummary": "Le mouvement régénérateur est une pratique inspirée par le mouvement de développement embryonnaire, favorisant un rééquilibrage global du corps. À travers des gestes continus, sphériques, toroïdaux et asymétriques, ce mouvement reconnecte avec l'énergie vitale primordiale, la ligne médiane et la force fluidique présente dès notre conception. Il harmonise les trois polarités fondamentales du corps : neuro-sensorielle, rythmique cardiorespiratoire et métabolique (viscérale et pelvienne). Le système nerveux central s'apaise, le souffle retrouve son rythme profond, et les tensions organiques se relâchent. Ce processus agit comme une véritable régénération tissulaire et énergétique, ramenant le pratiquant à son essence et sa capacité d'autorégulation naturelle.",
        "transcriptMarkdown": "# Le Mouvement Régénérateur\n\nLe mouvement régénérateur (création de Marc Damoiseaux) inspiré du mouvement développemental de l'embryon. \n\n## Position Initiale\n\n- Pousse de la main droite dans la main gauche, pieds parallèles. Largeur des épaules.\n- Le dos est droit et détendu. Légère flexion des genoux.\n- Et observation des différentes lignes médianes : La ligne médiane notochordale, postérieure et antérieure.\n\nOn observe bien la sphère neuro-sensorielle, rythmique, métabolique, urogénitale. Essayez de les ressentir, de vous équilibrer.\n\n## Les Étapes du Mouvement\n\n### 1. La Sphère\n\nDans un premier temps, le mouvement, l'ovule est sphérique. Vous dessinez dans l'espace une sphère devant vous qui représente l'ovule. \n\nLa première fonction de l'ovule en création est d'accepter. À l'intérieur, c'est l'acceptation de la fécondation pour créer cet œuf, le zygote.\n\n### 2. Le Mouvement Toroïdal\n\nUne asymétrie s'installe. Dans un mouvement toroïdal qui se retourne tout le temps sur lui-même. Vous laissez ce mouvement parcourir votre corps pour faire le développement du corps.\n\n### 3. La Nidation et le Cordon Ombilical\n\nLe stade de la nidation. Au bout du 7ème jour et jusqu'au 21ème jour vient se mettre en place tous nos annexes : le cordon ombilical, le placenta, la cavité amniotique. Le mouvement est grand, protecteur.\n\n### 4. La Ligne Médiane\n\nA ce stade-là avec de l'enroulement, de la formation du cœur, il y a un appel de la ligne médiane. Sentez ce retour vers votre ligne médiane, et ça se pose dans le cœur.\n\n### 5. Rotation et Colonne Vertébrale\n\nCette asymétrie qui se met en place crée des phénomènes de rotation que ce soit avec la langue, que ce soit les bras, un membre va pousser vers le haut l'autre vers le bas. À ce stade-là notre tube neural s'est refermé. \n\nNotre colonne vertébrale, notre moelle épinière est en place. Connectez la souplesse de votre corps, de votre dos en vous relâchant.\n\n### 6. Le Cœur et le Plissement\n\nLe cœur avec toutes ces asymétries est obligé d'évoluer, il plonge, de quatre tubes il deviendra cœur. Avec ses pompes, reliez-vous avec souplesse dans ce mouvement du cœur où tout le corps se plisse pour se connecter et laisser l'énergie en place.\n\nIl bat ce cœur...\n\n### 7. Respiration et Retour\n\nLe point de recueillement, ramener sur soi, puis laisser l'expansion. Sèche, la respiration. Relâchez-vous vers la fin, et laissez couler la liberté de la vie sur votre naissance. \n\nL'important c'est de garder ce mouvement asymétrique et continuel, rien ne s'arrête jamais. Pour revenir sur l'essentiel, à la maison : l'humain. C'est vous, par la respiration. \n\nPuis laisser reposer, refermer."
    }
];`;

const dir = path.join(__dirname, '../src/data');
const files = ['videoCourses_en.ts', 'videoCourses_es.ts', 'videoCourses_de.ts', 'videoCourses_it.ts', 'videoCourses_ja.ts', 'videoCourses_zh.ts'];

for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // Don't inject if it already exists
        if (content.includes('"meso-47"')) {
            console.log("meso-47 already exists in", file);
            continue;
        }

        const insertionPointRegex = /}\s*];/;
        if (insertionPointRegex.test(content)) {
            // we remove the last ]; and append the comma, our object, and the ];
            content = content.replace(insertionPointRegex, '},\n' + bonusEntryEnglish);
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log('Injected meso-47 into', file);
        } else {
            console.log('Could not find insertion point in', file);
        }
    }
}
