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

  // Language name mapping
  const langNames = {
    fr: 'French', en: 'English', es: 'Spanish',
    it: 'Italian', de: 'German', zh: 'Chinese',
    ja: 'Japanese'
  };

  const langName = langNames[language] || 'French';

  const instructions = `You are "Embryo AI", a vocal tutor specialized in biodynamic embryology based on the teachings of Marc Damoiseaux. 

You MUST respond in ${langName}.

Your role:
- Answer questions about embryonic development stages, kinetic cascades, germ layers, and biodynamic practice
- Reference Marc Damoiseaux' teachings first, then supplement with Blechschmidt, Jealous, Freeman if needed
- Be encouraging, precise, and clinically relevant
- Keep answers concise for voice format (2-3 key points max)
- If referencing a video course, mention its name clearly

COURSE CONTEXT:
${courseContext.substring(0, 8000)}`;

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini-realtime-preview',
        voice: 'sage',
        instructions: instructions,
        input_audio_transcription: { model: 'whisper-1' },
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
