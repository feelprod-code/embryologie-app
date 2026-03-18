import fs from 'fs';

const oeilParsed = JSON.parse(fs.readFileSync('scripts/pdfs_cours/oeil_parsed.json', 'utf-8'));
const mesoParsed = JSON.parse(fs.readFileSync('scripts/pdfs_cours/meso_parsed.json', 'utf-8'));
let content = fs.readFileSync('src/data/videoCourses.ts', 'utf-8');

// Oeil manual map
const oeilMap = {
  "oeil-2": "2 - APPROCHE CONCEPTUELLE DU COUR",
  "oeil-3": "3 - ORIGINE V3 - cavité amniotique - LCR - zone B",
  "oeil-4": "4 - Mise en place de l’oeil",
  "oeil-5": "5 - Influence de la notochorde", 
  "oeil-7": "7- Formation de la placode optique",
  "oeil-8": "8- Origine de la rétine et du",
  "oeil-1": "1- ébauche optique à J21",
  "oeil-9": "9- Les différentes couches de l’oeil.",
  "oeil-10": "10- Rappel du mouvement développemental",
  "oeil-12": "12- L’impermanence",
  "oeil-13": "13- L’axe cranien-primitif",
  "oeil-14": "14- Les différentes couches de l’oeil (2)",
  "oeil-15": "15- Les Les crêtes neurales",
  "oeil-16": "16- Mémoires",
  "oeil-17": [
      "17- L’oeil et le mouvement de corticalisation", 
      "1- Expansion", 
      "2- Flexion céphalique", 
      "3- Flexion cervical", 
      "4- Flexion pontique", 
      "5- Télé-encéphalisation"
  ].map(k => oeilParsed[k]).join('\n\n'),
  "oeil-19": "19- Lignes de force électrique",
  "oeil-20": "20- L’oeil et le développement du crane",
  "oeil-21": "21- Le ligament lilequist’s",
  "oeil-23": "23- ANATOMIE",
  "oeil-24": "24- LE MONDE DE L’INTENTION",
  "oeil-26": "26- NEUROPHYSIO INTRO ZONE DE LA CHRISTAGALI",
  "oeil-27": "27- LES PHOTORECEPTEURS",
  "oeil-28": "28- LE CORPS GENOUILLE LATERAL",
  "oeil-31": "31- EPIPHYSE - HYPOPHYSE",
  "oeil-32": "32- INFLUENCES SUR L’OEIL"
};

for (const [vId, keyOrContent] of Object.entries(oeilMap)) {
    let newText = "";
    if (vId === "oeil-17") {
       newText = keyOrContent;
    } else {
       newText = oeilParsed[keyOrContent];
    }
    
    const safeText = newText.replace(/\`/g, '\\`').replace(/\\$/g, '$$$$');
    const regex = new RegExp(`(id:\\s*"${vId}",[\\s\\S]*?transcriptMarkdown:\\s*\\\`)([\\s\\S]*?)(\\\`\\s*(?:,|\\}))`, "g");
    
    content = content.replace(regex, (match, p1, p2, p3) => {
        return p1 + '\\n' + safeText + '\\n    ' + p3;
    });
}
console.log('Successfully injected Oeil transcripts!');

// Meso manual map
const vuePost = mesoParsed["VUE POST"];

const mesoContentMap = {
  "meso-16": mesoParsed["3 SYSTEMES VEINEUX"],
  "meso-21": vuePost.split("LE FOIE")[0].trim(),
  "meso-24": "LE FOIE\\n" + vuePost.split("LE FOIE")[1].split("LE SYSTEME REINAL")[0].trim(),
  "meso-27": "LE SYSTEME REINAL\\n" + vuePost.split("LE SYSTEME REINAL")[1].split("L’APPAREIL GENITAL  5eme semaine ?")[0].trim(),
  "meso-31": "L’APPAREIL GENITAL  5eme semaine ?\\n" + vuePost.split("L’APPAREIL GENITAL  5eme semaine ?")[1].split("L’APPAREIL GENITAL MASCULIN")[0].trim(),
  "meso-32": "L’APPAREIL GENITAL MASCULIN\\n" + vuePost.split("L’APPAREIL GENITAL MASCULIN")[1].split("L’APPAREIL GENITAL FEMININ")[0].trim(),
  "meso-33": "L’APPAREIL GENITAL FEMININ\\n" + vuePost.split("L’APPAREIL GENITAL FEMININ")[1].trim(),
  "meso-34": mesoParsed["VOIE GENITALES INFERIEURES"],
  "meso-35": mesoParsed["NEUROPORE POSTERIEUR et formation neurulation 2nd"],
  "meso-38": mesoParsed["RESUME DE LA CINETIQUE EMBRYONNAIRE"],
  "meso-41": mesoParsed["APPAREIL LOCOMOTEUR"],
  "meso-42": mesoParsed["MEP Notochorde induit la MEP du TN qui se met en place petit a petit sur l’axe L,"],
  "meso-43": mesoParsed["LES COTES J 35 a 45"],
  "meso-44": mesoParsed["LES EXTREMITES"]
};

for (const [vId, newText] of Object.entries(mesoContentMap)) {
    const rawRegex = `id:\\s*"${vId}",[\\s\\S]*?transcriptMarkdown:\\s*\\\`([\\s\\S]*?)\\\`\\s*(?:,|\\})`;
    const regex = new RegExp(`(id:\\s*"${vId}",[\\s\\S]*?transcriptMarkdown:\\s*\\\`)([\\s\\S]*?)(\\\`\\s*(?:,|\\}))`, "g");
    
    if (!regex.test(content)) {
      console.log(`Failed to match regex for ${vId}`);
    } else {
      content = content.replace(regex, (match, p1, p2, p3) => {
          const safeText = newText.replace(/\`/g, '\\`').replace(/\\$/g, '$$$$');
          return p1 + '\\n' + safeText + '\\n    ' + p3;
      });
    }
}
console.log('Successfully injected Meso transcripts!');

fs.writeFileSync('src/data/videoCourses.ts', content, 'utf-8');
console.log('Successfully saved videoCourses.ts!');
