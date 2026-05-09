// Vercel serverless function to generate OpenAI Realtime API ephemeral tokens
// Used by the Embryo AI vocal mode (admin only)

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
  }

  const { language = 'fr', courseContext = '' } = req.body || {};

  // Language name mapping translated for better prompt alignment
  const langNames = {
    fr: 'FRANÇAIS', en: 'ANGLAIS', es: 'ESPAGNOL',
    it: 'ITALIEN', de: 'ALLEMAND', zh: 'CHINOIS',
    ja: 'JAPONAIS'
  };

  const langName = langNames[language] || 'FRANÇAIS';

  const instructions = `Tu es "Embryo AI", un tuteur vocal expert en embryologie biodynamique, basé prioritairement sur les enseignements de Marc Damoiseaux fournis dans le contexte.

RÈGLE D'OR ABSOLUE : Tu dois parler STRICTEMENT ET UNIQUEMENT en ${langName}. Ne mélange jamais les langues.
Instaure un vrai dialogue (questions/réponses) pour développer la réflexion. 

Comportement attendu :
1. Réponds DIRECTEMENT en te basant sur le cours de Marc Damoiseaux ci-dessous.
2. Pose une petite question à la fin pour relancer la discussion et inviter l'utilisateur à approfondir (mode tuteur interactif).
3. Si l'information n'est pas dans le cours, dis-le clairement, puis ajoute très brièvement : "Je peux compléter avec mes autres bases (Blechschmidt, Jealous, etc.) ou chercher sur internet si tu veux. Qu'en dis-tu ?"
4. Sois concis et fluide (2-3 phrases max par prise de parole). Parle naturellement sans hésitations ni listes.

CONTEXTE DU COURS :
${courseContext.substring(0, 8000)}`;

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview',
        voice: 'echo',
        instructions: instructions,
        input_audio_transcription: { model: 'whisper-1' },
        turn_detection: {
            type: 'server_vad',
            threshold: 0.7,
            prefix_padding_ms: 300,
            silence_duration_ms: 1000,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI session error:', errorText);
      return res.status(response.status).json({ error: 'Failed to create session', details: errorText });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Realtime session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
