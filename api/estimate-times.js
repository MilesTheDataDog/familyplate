// Vercel Serverless Function for Time Estimation
// Place this file at: api/estimate-times.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, ingredients, instructions } = req.body;

    // Validate input
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ error: 'Missing required fields: title, ingredients, instructions' });
    }

    const prompt = `Estimate prep and cook times for this recipe. Return ONLY valid JSON with prepTime and cookTime as strings (e.g. "15 minutes").

Recipe: ${title}
Ingredients: ${ingredients}
Instructions: ${instructions}

Respond with JSON only, no markdown or explanation.`;

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
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: prompt
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
    console.error('Time estimation error:', error);
    return res.status(500).json({ error: 'Failed to estimate times', details: error.message });
  }
}