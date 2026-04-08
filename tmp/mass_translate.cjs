const fs = require('fs');
const path = require('path');
const https = require('https');

const mcpConfigPath = path.join(require('os').homedir(), '.gemini', 'antigravity', 'mcp_config.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
const OPENROUTER_API_KEY = mcpConfig.mcpServers.openrouter.env.OPENROUTER_API_KEY;

const VTT_DIR = path.join(__dirname, '../public/vtt');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const langs = {
    'en': 'anglais',
    'es': 'espagnol',
    'it': 'italien',
    'de': 'allemand',
    'zh': 'chinois (traduction naturelle et courante)',
    'ja': 'japonais (traduction naturelle et polie)'
};

async function translateTextWithClaude(vttContent, targetLangName) {
  const prompt = `Tu es un traducteur expert en langage médical, ostéopathique et développement personnel. 
Voici un fichier de sous-titres VTT français (voix orale d'un thérapeute). Le texte est l'original français.
Traduite TOUT LE TEXTE en : **${targetLangName}**.
- Garde l'exact format VTT des timecodes sans y toucher.
- Fais en sorte de conserver le ton clinique mais chaleureux et accessible.
- Essaie de calquer la longueur des mots pour que les sous-titres restent lisibles (ne traduis pas un mot de 3 syllabes par une explication de 15 mots).
- "Joanna Macy" ou autres noms propres doivent être traduits correctement dans les scripts asiatiques et gardés tels quels en alphabet latin.

Renvoie STRICTEMENT et UNIQUEMENT le contenu VTT traduit de bout en bout. Sans introduction, sans conclusion, sans "\`\`\`vtt". Que du texte brut de sous-titres valide qui commence par WEBVTT.

Voici le fichier français à traduire :
${vttContent}
`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "user", content: prompt }
      ]
    });

    const options = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'VTT Translator'
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (d) => { responseBody += d; });
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.choices && json.choices.length > 0) {
            resolve(json.choices[0].message.content.trim());
          } else {
            console.error("Erreur API:", json);
            resolve(null);
          }
        } catch (e) {
          console.error("JSON parse error:", responseBody);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

function getFrFiles() {
  const files = fs.readdirSync(VTT_DIR);
  return files.filter(f => f.endsWith('_fr.vtt') && !f.startsWith('test_'));
}

async function run() {
  const frFiles = getFrFiles();
  console.log(`Found ${frFiles.length} French files to translate into 6 languages.`);
  
  for (let i = 0; i < frFiles.length; i++) {
    const file = frFiles[i];
    const frFp = path.join(VTT_DIR, file);
    const baseName = file.replace('_fr.vtt', '');
    console.log(`Processing [${i+1}/${frFiles.length}]: ${file}`);
    
    try {
      const originalVTT = fs.readFileSync(frFp, 'utf8');
      
      const tasks = Object.keys(langs).map(async (langCode) => {
          const langName = langs[langCode];
          let translatedVTT = await translateTextWithClaude(originalVTT, langName);
          
          if (translatedVTT) {
            translatedVTT = translatedVTT.replace(/^\`\`\`(vtt)?\n|\`\`\`$/g, '');
            translatedVTT = translatedVTT.trim();

            if (translatedVTT.startsWith('WEBVTT')) {
              const tgtFp = path.join(VTT_DIR, `${baseName}_${langCode}.vtt`);
              fs.writeFileSync(tgtFp, translatedVTT, 'utf8');
              console.log(`✅ [${langCode}] Success pour ${file}`);
            } else {
              console.log(`❌ [${langCode}] Echec pour ${file} : Not a valid WEBVTT.`);
            }
          } else {
            console.log(`❌ [${langCode}] Echec API pour ${file}`);
          }
      });
      
      await Promise.all(tasks);
      
      await sleep(1500);
      
    } catch(err) {
      console.log(`❌ Erreur catch ${file}`, err);
    }
  }
}

run();
