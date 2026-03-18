import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/videoCourses.ts');
let fileContent = fs.readFileSync(filePath, 'utf-8');

const exactReplacements: Record<string, string> = {
    // English -> French mapping
    "The initial stages of eye development, showing the epiblast and early fluid-filled spaces": "Premiers stades du développement de l'œil",
    "This image probably illustrates the formation of the optic vesicle and the differentiation into retinal layers, and its connection to the brain": "Formation de la vésicule optique et différenciation de la rétine",
    "This image likely shows the development of the lens from the surface epiblast and its invagination": "Développement et invagination du cristallin",
    "This image likely shows the different layers of the eye that light passes through, matching the detailed description of light's path": "Couches de l'œil traversées par la lumière",
    "This image introduces the CGL and its role in information processing, aligning with the introduction of the CGL in the verbatim transcript": "Corps Genouillé Latéral (CGL)",
    "This image details the specific functions of the parvocellular, magnocellular, and cagnocellulaire cells, matching the verbatim text's description of these cells": "Cellules parvocellulaires et magnocellulaires",
    "This image explains the distribution of information from the CGL to visual areas and the pulvinar, directly corresponding to the verbatim text": "Distribution de l'information du CGL au pulvinar",
    "The pulvinar's connections and its role in enriching context, which is discussed in the verbatim text's description of pulvinar inputs": "Connexions du pulvinar",
    "The journey of visual information before reaching the CGL which is then explained by the text": "Parcours de l'information visuelle vers le CGL",
    "This image illustrates the multisensory integration happening in connection with the CGL, fitting the verbatim text's explanation of integration with auditory and vestibular systems": "Intégration multisensorielle (auditive et vestibulaire)",
    "This image continues with the multisensory integration, relevant to actions like saccades and head orientation": "Rôle dans les saccades et l'orientation de la tête",
    "This image directly references the Circuit de Papez and its role in memory, aligning with the verbatim text": "Circuit de Papez et mémoire",
    "This image further elaborates on the Circuit de Papez and its role in memory consolidation and retrieval, following the verbatim text's explanation": "Circuit de Papez : consolidation de la mémoire",
    "The reinterpretation of perceived information, directly matching the explanation in the verbatim text": "Réinterprétation de l'information perçue",
    "The interpretation of reality and how only a fraction is perceived directly, which is next in the verbatim text": "Interprétation de la réalité",
    "The topic by reiterating the CGL's importance in perception and interaction with the world, matching the verbatim text's conclusion": "Importance du CGL dans la perception",

    // French targeted fixes
    "Expliquer le vestige de la cavité amniotique, désignée comme la zone B": "Vestige de la cavité amniotique (zone B)",
    "Processus d'implantation avec la formation de la cavité et la mise en place de l'ectoderme/épiblaste": "Processus d'implantation : formation de la cavité",
    "Cavité amniotique devenant un espace vaporeux": "Cavité amniotique",
    "L'image la notion de croissance différentielle et de polarité de la notochorde juste après sa mise en place": "Croissance différentielle",
    "Liquide amniotique primitif enfermé dans la gouttière neurale": "Liquide amniotique primitif",
    "Cette image semble montrer une étape intermédiaire de la formation de la gouttière neurale, avant son enfermement": "Formation de la gouttière neurale",
    "Schéma général de l'œil et se place logiquement après la description des premières couches": "Schéma général de l'œil",
    "Différentes tuniques de l'œil, y compris les processus ciliaires et la rétine, et intervient après la description de ces structures": "Tuniques de l'œil, processus ciliaires et rétine",
    "L'invagination de l'ectoderme et la formation de la vésicule cristalline, correspondant à la description de l'origine du cristallin": "Invagination de l'ectoderme",
    "Début du processus épiblastique qui forme la notochorde, ce qui correspond à la description du texte verbatim": "Début du processus épiblastique",
    "Schéma général du mouvement de la crête neurale et des facteurs d'induction, ce qui correspond bien à ce paragraphe initial qui les présente": "Mouvement de la crête neurale",
    "L'image est placée après la description du 'sillon optique' et de la 'vésicule qui touche la paroi superficielle', comme indiqué dans le PDF pour la flexion céphalique": "Sillon optique et vésicule",
    "Rencontre du cerveau et du cœur, mentionnée en lien avec la flexion pontique dans le PDF, suivie de la télencéphalie": "Rencontre du cerveau et du cœur",
    "L'image est insérée après la mention des différents points d'appui (notocorde, supraocciput, base occipitale) qui sont synthétisés dans le PDF avec cette image": "Points d'appui",
    "Cette image complète l'illustration du chargement électrique de l'os": "Chargement électrique de l'os",
    "Concept de chargement des électrons et la création de charges positives et négatives sur l'os": "Création de charges sur l'os",
    "Lignes de force en profondeur, appelées poutres, en relation avec la structure osseuse": "Lignes de force (poutres)",
    "Probablement l'une des poutres mentionnées, comme la poutre canino-nasale frontale": "Poutre canino-nasale frontale",
    "Ce concept": "Schéma explicatif",
    "Ligament de Liliequist et le texte parle de son insertion et de son rôle": "Ligament de Liliequist",
    "Système ventriculaire et le texte explique l'interconnexion induite par la dynamique du ligament": "Système ventriculaire",
    "Schéma qui s'insère logiquement avant l'explication des mouvements crâniens et des lignes de forces": "Mouvements crâniens",
    "L'image et le texte décrivent les mouvements coordonnés du crâne, du sternum et du sacrum, convergents vers la ligne médiane": "Mouvements coordonnés du crâne, sternum et sacrum",
    "Cette image détaille la fente sphénoïdale et les nerfs qui la traversent": "Fente sphénoïdale",
    "Vue d'ensemble des tuniques de l'œil, directement après l'introduction des tuniques": "Vue d'ensemble des tuniques de l'œil",
    "Coupe de l'œil mettant en évidence la sclérotique et la cornée, détaillées dans le texte": "Coupe de l'œil",
    "Cette image clarifie la jonction de la conjonctive avec les autres structures de l'œil": "Jonction de la conjonctive",
    "L'anatomie de la paupière, juste après la mention du muscle releveur": "Anatomie de la paupière",
    "Ces images (24 à 28) offrent différentes perspectives sur les muscles oculomoteurs et leur insertion": "Muscles oculomoteurs",
    "Relation entre la carotide et le nerf optique, expliquant les sensations de pulsation": "Relation entre carotide et nerf optique",
    "This image likely shows the different layers of the eye that light passes through, matching the detailed description of light's path": "Couches de l'œil",
    "Parcours de la lumière jusqu'au nerf optique, correspondant au premier schéma": "Parcours de la lumière jusqu'au nerf optique",
    "Cette partie explique le rôle des cellules horizontales et amacrines, illustré par le second schéma": "Rôle des cellules horizontales et amacrines",
    "Schémas de la formation de la base du crâne, qui est introduite juste après ce texte, expliquant les mouvements embryonnaires": "Formation de la base du crâne",
    "L'image 3 montre le développement de l'hypophyse à partir de l'épithélium de surface et l'aspiration, ce qui correspond à la description dans le texte": "Développement de l'hypophyse",
    "L'image 4 est contextuelle au développement de l'infidibulum et complète l'explication de la formation de l'hypophyse postérieure": "Développement de l'infundibulum",
    "Schémas d'yeux en spirale, ce qui se connecte au paragraphe décrivant les différences vasculaires et les réflexes, juste avant l'explication des rôles posturaux": "Yeux en spirale",
    "Schéma de croisement sur une ligne lié au corps, ce qui est pertinent après la discussion des réflexes et de l'équilibre": "Croisement sur la ligne",
    "L'image concerne des axes et des angles d'intégration visuelle, correspondant à la phrase sur le rôle postural et les axes visuels": "Axes et angles d'intégration visuelle",
    "L'image qui suit est liée à une zone cérébrale spécifique, donc elle s'intègre après cette phrase générale sur les mouvements oculaires": "Mouvements oculaires",
    "Cette image est placée après l'explication des 23 degrés de liberté visuelle et son lien avec d'autres inclinaisons terrestres": "23 degrés de liberté visuelle",
    "Axes orbitaires/pyramidaux et est insérée après la mention des axes d'information et des déstabilisations oculaires": "Axes orbitaires et pyramidaux",
    "Capacité de retrouver des mémoires dans l'os, en lien avec la phrase qui fait référence aux mémoires intégrées dans les os": "Mémoires dans l'os",
};

const regexReplacements = [
    { regex: /,?\s*en corrélation avec le texte décrivant cette évolution/gi, replacement: '' },
    { regex: /,?\s*en accord avec l'introduction/gi, replacement: '' },
    { regex: /,?\s*qui correspondent au texte/gi, replacement: '' },
    { regex: /,?\s*correspondant à la description.*$/gi, replacement: '' },
    { regex: /,?\s*ce qui correspond.*$/gi, replacement: '' },
    { regex: /,?\s*comme indiqué dans.*$/gi, replacement: '' },
    { regex: /,?\s*et intervient après.*$/gi, replacement: '' },
    { regex: /,?\s*mentionnée en lien avec.*$/gi, replacement: '' },
    { regex: /,?\s*qui sont synthétisés dans le PDF.*$/gi, replacement: '' },
    { regex: /,?\s*en relation avec la structure.*$/gi, replacement: '' },
    { regex: /,?\s*comme la poutre.*$/gi, replacement: '' },
    { regex: /,?\s*et le texte parle de.*$/gi, replacement: '' },
    { regex: /,?\s*et le texte explique.*$/gi, replacement: '' },
    { regex: /,?\s*détaillées dans le texte.*$/gi, replacement: '' },
    { regex: /,?\s*faisant suite à.*$/gi, replacement: '' },
    { regex: /,?\s*juste après la mention.*$/gi, replacement: '' },
    { regex: /,?\s*directement après l'introduction.*$/gi, replacement: '' },
    { regex: /,?\s*expliquant les sensations.*$/gi, replacement: '' },
    { regex: /,?\s*ce qui se connecte au.*$/gi, replacement: '' },
    { regex: /,?\s*juste avant l'explication.*$/gi, replacement: '' },
    { regex: /,?\s*ce qui est pertinent après.*$/gi, replacement: '' },
    { regex: /,?\s*en lien avec la phrase.*$/gi, replacement: '' },
];


let changedCount = 0;

const cleanContent = fileContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, legend, url) => {
    let clean = legend;

    // Apply exact map
    if (exactReplacements[legend]) {
        clean = exactReplacements[legend];
    } else {
        // Try falling back to case-insensitive match for exact map
        const key = Object.keys(exactReplacements).find(k => k.toLowerCase() === legend.toLowerCase());
        if (key) {
            clean = exactReplacements[key];
        } else {
            // Apply regex cleanup rules
            regexReplacements.forEach(r => {
                clean = clean.replace(r.regex, r.replacement);
            });
        }
    }

    clean = clean.trim();
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
