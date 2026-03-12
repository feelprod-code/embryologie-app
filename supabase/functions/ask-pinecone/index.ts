import "jsr:@supabase/functions-js/edge-runtime.js"
import { Pinecone } from 'npm:@pinecone-database/pinecone'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, author, topK = 5 } = await req.json()

    if (!query) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const pineconeApiKey = Deno.env.get('PINECONE_API_KEY')
    if (!pineconeApiKey) {
      throw new Error('PINECONE_API_KEY environment variable is missing')
    }

    const pc = new Pinecone({ apiKey: pineconeApiKey })
    // Use the gravity-claw index
    const index = pc.Index('gravity-claw')

    // Since the index uses the integrated 'llama-text-embed-v2' model, 
    // we first need to generate the embedding for the query.
    // Using Pinecone's inference API via the SDK (v3+ feature, we can do it manually if not supported)

    // Pinecone inference REST request:
    const embedRes = await fetch("https://api.pinecone.io/embed", {
      method: "POST",
      headers: {
        "Api-Key": pineconeApiKey,
        "Content-Type": "application/json",
        "X-Pinecone-API-Version": "2024-10"
      },
      body: JSON.stringify({
        model: "llama-text-embed-v2",
        parameters: { input_type: "query", truncate: "END" },
        inputs: [{ text: query }]
      })
    });

    if (!embedRes.ok) {
      const errText = await embedRes.text();
      throw new Error(`Pinecone Embedding failed: ${errText}`);
    }

    const embedData = await embedRes.json();
    const queryVector = embedData.data[0].values;

    // Filter by author if provided
    const filter = author ? { author: author } : undefined;

    // Query the index
    const queryResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      filter
    });

    // Format the results for the frontend
    const results = queryResponse.matches.map(match => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
      text: match.metadata?.text || ''
    }));

    return new Response(
      JSON.stringify({ results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
