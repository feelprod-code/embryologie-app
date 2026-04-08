// Read OpenRouter Key
const fs = require('fs');
const path = require('path');
const https = require('https');

const mcpConfigPath = path.join(require('os').homedir(), '.gemini', 'antigravity', 'mcp_config.json');
const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
const OPENROUTER_API_KEY = mcpConfig.mcpServers.openrouter.env.OPENROUTER_API_KEY;

const VTT_DIR = path.join(__dirname, '../public/vtt');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function correctTextWithClaude(vttContent) {
  const prompt = `Tu es un relecteur orthographique professionnel. 
Voici un fichier de sous-titres VTT issu d'une transcription automatique (thérapeute qui parle).
Corrige UNIQUEMENT les erreurs phonétiques (ex : "Yonah Messie" -> "Joanna Macy"), les fautes d'accord, de grammaire et d'orthographe. 
Ne modifie AUCUN mot pour faire "plus joli", garde le ton parfaitement oral d'origine ("On va se rendre compte" etc.).
Ne modifie AUCUN timecode ni la structure du fichier VTT.
Ne saute aucune phrase. Le texte final doit être exactement un copié-collé corrigé de l'original.

Renvoie STRICTEMENT et UNIQUEMENT le contenu VTT corrigé. Sans introduction, sans conclusion, sans "\`\`\`vtt". Que du texte brut commençant par WEBVTT.

Voici le fichier :
${vttContent}
`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "openai/gpt-4o",
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
        'X-Title': 'VTT Corrector'
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

function getFiles() {
  const files = fs.readdirSync(VTT_DIR);
  return files.filter(f => f.endsWith('_fr.vtt') && !f.startsWith('test_'));
}

async function run() {
  const filesToProcess = getFiles();
  console.log(`Found ${filesToProcess.length} files to process.`);
  
  for (let i = 0; i < filesToProcess.length; i++) {
    const file = filesToProcess[i];
    const fp = path.join(VTT_DIR, file);
    console.log(`Processing [${i+1}/${filesToProcess.length}]: ${file}`);
    
    try {
      const originalVTT = fs.readFileSync(fp, 'utf8');
      
      let correctedVTT = await correctTextWithClaude(originalVTT);
      
      if (correctedVTT) {
        // Remove markdown code block if Claude added it despite instructions
        correctedVTT = correctedVTT.replace(/^\`\`\`(vtt)?\n|\`\`\`$/g, '');
        correctedVTT = correctedVTT.trim();

        if (correctedVTT.startsWith('WEBVTT')) {
          fs.writeFileSync(fp, correctedVTT, 'utf8');
          console.log(`✅ Success pour ${file} (écrasé avec succès)`);
        } else {
          console.log(`❌ Echec pour ${file} : La sortie ne commence pas par WEBVTT.`);
        }
      } else {
        console.log(`❌ Echec API pour ${file}`);
      }
      
      await sleep(1000); // 1 second delay to avoid rate limits
      
    } catch(err) {
      console.log(`❌ Erreur catch ${file}`, err);
    }
  }
}

run();
