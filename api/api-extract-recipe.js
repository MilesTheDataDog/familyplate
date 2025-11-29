// Vercel Serverless Function for Recipe Extraction
// Place this file at: api/extract-recipe.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, type, prompt } = req.body;

    // Validate input
    if (!image || !type || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: image, type, prompt' });
    }

    // Call Anthropic API with server-side API key
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY  // Secure - only on server
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: type,
                data: image
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }]
      })
    });

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Return the result
    return res.status(200).json(data);

  } catch (error) {
    console.error('Recipe extraction error:', error);
    return res.status(500).json({ error: 'Failed to extract recipe', details: error.message });
  }
}