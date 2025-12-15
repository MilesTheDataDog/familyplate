# Anthropic API Integration

Comprehensive guide to the Anthropic Claude API integration for recipe extraction and text processing in FamilyPlate.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Overview](#overview)
- [API Configuration](#api-configuration)
- [Recipe Extraction](#recipe-extraction)
- [Time Estimation](#time-estimation)
- [Prompt Engineering](#prompt-engineering)
- [Error Handling](#error-handling)
- [Cost Optimization](#cost-optimization)
- [Best Practices](#best-practices)

---

## Overview

### What is Claude?

Claude is an AI assistant created by Anthropic that excels at:
- Text extraction from images (OCR)
- Understanding handwritten content
- Structured data extraction
- Natural language understanding
- JSON output generation

### Why Claude for FamilyPlate?

**Advantages:**
- ✅ Excellent handwriting recognition
- ✅ Context-aware text processing
- ✅ Structured output (JSON)
- ✅ High accuracy on recipe cards
- ✅ Handles various formats (printed, handwritten, photos)
- ✅ Reasonable pricing
- ✅ Fast response times (~2-5 seconds)

**Compared to Alternatives:**
- Better than Tesseract.js for handwriting
- More cost-effective than GPT-4 Vision
- More accurate than Google Cloud Vision for recipes
- Simpler integration than AWS Textract

---

## API Configuration

### API Keys

**Obtaining an API Key:**

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Click "Create Key"
5. Copy and save the key securely

**Key Format:**
```
sk-ant-api03-[rest-of-key]
```

### Environment Setup

**Local Development (.env.local):**
```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Vercel Production:**
```
1. Go to Vercel Dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: ANTHROPIC_API_KEY = your-key
5. Check all environments (Production, Preview, Development)
6. Save and redeploy
```

### API Endpoint

```
Base URL: https://api.anthropic.com/v1/messages
Method: POST
Content-Type: application/json
```

### Authentication

```javascript
headers: {
  'Content-Type': 'application/json',
  'anthropic-version': '2023-06-01',
  'x-api-key': process.env.ANTHROPIC_API_KEY
}
```

---

## Recipe Extraction

### Complete Implementation

**Serverless Function** (`/api/extract-recipe.js`):

```javascript
/**
 * Extracts recipe data from an image using Anthropic Claude API
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Promise<Object>} Extracted recipe data
 */
export default async function handler(req, res) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, type, prompt } = req.body;

    // Input validation
    if (!image || !type || !prompt) {
      return res.status(400).json({ 
        error: 'Missing required fields: image, type, prompt' 
      });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY
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

    // Error handling
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // Return successful response
    return res.status(200).json(data);

  } catch (error) {
    console.error('Recipe extraction error:', error);
    return res.status(500).json({ 
      error: 'Failed to extract recipe', 
      details: error.message 
    });
  }
}
```

### Request Format

**Client-Side Call:**
```javascript
const extractRecipe = async (imageData) => {
  // 1. Compress image
  const compressed = await compressImage(imageData);
  
  // 2. Prepare data
  const base64 = compressed.split(',')[1];
  const type = compressed.split(';')[0].split(':')[1];
  
  // 3. Create prompt
  const prompt = `Extract this recipe as JSON...`;
  
  // 4. Call API
  const response = await fetch('/api/extract-recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64, type, prompt })
  });
  
  // 5. Process response
  const data = await response.json();
  return processRecipeData(data);
};
```

### Response Format

**Successful Response:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"title\":\"Chocolate Chip Cookies\",\"servings\":\"24\",\"prepTime\":\"15 minutes\",\"cookTime\":\"10 minutes\",\"ingredientSections\":[{\"title\":\"Ingredients\",\"items\":[\"2 1/4 cups all-purpose flour\",\"1 tsp baking soda\",\"1 cup butter, softened\",\"3/4 cup granulated sugar\",\"3/4 cup packed brown sugar\",\"2 large eggs\",\"2 tsp vanilla extract\",\"2 cups chocolate chips\"]}],\"instructions\":[\"Preheat oven to 375°F\",\"Mix flour and baking soda in bowl\",\"Beat butter and sugars until creamy\",\"Add eggs and vanilla\",\"Gradually blend in flour mixture\",\"Stir in chocolate chips\",\"Drop by rounded tablespoon onto baking sheets\",\"Bake 9 to 11 minutes or until golden brown\"]}"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "role": "assistant",
  "stop_reason": "end_turn"
}
```

---

## Time Estimation

### Implementation

**Serverless Function** (`/api/estimate-times.js`):

```javascript
/**
 * Estimates prep and cook times for a recipe using Anthropic Claude API
 * @param {Object} req - HTTP request object
 * @param {Object} res - HTTP response object
 * @returns {Promise<Object>} Estimated times
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, ingredients, instructions } = req.body;

    // Validation
    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, ingredients, instructions' 
      });
    }

    const prompt = `Estimate prep and cook times for this recipe. Return ONLY valid JSON with prepTime and cookTime as strings (e.g. "15 minutes").

Recipe: ${title}
Ingredients: ${ingredients}
Instructions: ${instructions}

Respond with JSON only, no markdown or explanation.`;

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_API_KEY
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

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Time estimation error:', error);
    return res.status(500).json({ 
      error: 'Failed to estimate times', 
      details: error.message 
    });
  }
}
```

---

## Prompt Engineering

### Recipe Extraction Prompt

**Current Prompt:**
```javascript
const prompt = `Extract this recipe as JSON with these fields: title, servings, prepTime, cookTime, ingredientSections, instructions.

CRITICAL for ingredientSections:
- Look carefully for ANY section headers/labels in the ingredients area
- If you see multiple labeled groups (like "INGREDIENTS" followed by "DRESSING"), create separate sections for each
- Only combine into a single section if there are truly NO section labels at all
- Preserve the exact section names from the recipe

Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes", 
  "ingredientSections": [
    {"title": "Ingredients", "items": ["item 1", "item 2"]},
    {"title": "Dressing", "items": ["item 1", "item 2"]}
  ],
  "instructions": ["step 1", "step 2"]
}

Return only valid JSON, no markdown or explanation.`;
```

**Why This Prompt Works:**

1. **Clear Structure**: Defines exact JSON format expected
2. **Specific Instructions**: Handles edge cases (multiple sections)
3. **Example Output**: Shows desired format
4. **Constraints**: "Return only valid JSON" prevents extra text

### Prompt Best Practices

**DO:**
- ✅ Provide clear structure
- ✅ Use examples
- ✅ Specify output format explicitly
- ✅ Handle edge cases
- ✅ Keep instructions concise

**DON'T:**
- ❌ Use ambiguous language
- ❌ Ask for multiple formats
- ❌ Omit important constraints
- ❌ Make assumptions

### Prompt Iteration

**Version 1 (Initial):**
```
Extract the recipe from this image.
```
❌ Too vague, inconsistent results

**Version 2 (Better):**
```
Extract the recipe and return as JSON with title, ingredients, and instructions.
```
⚠️ Better but missing structure details

**Version 3 (Current):**
```
Extract this recipe as JSON with these fields: title, servings, prepTime...
[Full structured prompt]
```
✅ Clear, specific, consistent results

---

## Error Handling

### Common Errors

#### 1. API Key Invalid

**Error:**
```json
{
  "error": {
    "type": "authentication_error",
    "message": "invalid x-api-key"
  }
}
```

**Solution:**
- Verify API key in Vercel environment variables
- Check key hasn't been revoked
- Ensure key is correctly formatted

#### 2. Rate Limit Exceeded

**Error:**
```json
{
  "error": {
    "type": "rate_limit_error",
    "message": "rate limit exceeded"
  }
}
```

**Solution:**
- Implement retry logic with exponential backoff
- Add request throttling
- Upgrade API plan if needed

**Retry Logic:**
```javascript
const callWithRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.type === 'rate_limit_error' && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};
```

#### 3. Invalid Image Format

**Error:**
```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "invalid base64 image data"
  }
}
```

**Solution:**
- Validate image format before sending
- Ensure proper base64 encoding
- Check image isn't corrupted

#### 4. Token Limit Exceeded

**Error:**
```json
{
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens exceeds maximum"
  }
}
```

**Solution:**
- Reduce max_tokens in request
- Split large requests
- Compress images further

---

## Cost Optimization

### Current Pricing (as of Dec 2024)

**Claude Sonnet 4:**
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

**Recipe Extraction:**
- Image: ~1000 tokens
- Prompt: ~200 tokens
- Response: ~500 tokens
- **Total per recipe: ~$0.01-0.02**

### Cost Calculation

```javascript
/**
 * Estimates API cost for a recipe extraction
 * @param {number} imageTokens - Tokens in image
 * @param {number} promptTokens - Tokens in prompt
 * @param {number} responseTokens - Expected response tokens
 * @returns {number} Estimated cost in dollars
 */
const estimateCost = (imageTokens, promptTokens, responseTokens) => {
  const inputCost = (imageTokens + promptTokens) * 3 / 1_000_000;
  const outputCost = responseTokens * 15 / 1_000_000;
  return inputCost + outputCost;
};

// Example
const cost = estimateCost(1000, 200, 500);
console.log(`Cost: $${cost.toFixed(4)}`); // $0.0111
```

### Optimization Strategies

#### 1. Image Compression
```javascript
// Reduce image size = fewer tokens
const compressImage = (dataUrl) => {
  // Max width: 1200px
  // Quality: 80%
  // Reduces tokens by ~60%
};
```

#### 2. Prompt Optimization
```javascript
// Shorter prompts = lower cost
// But maintain clarity
const optimizedPrompt = `Extract recipe JSON: title, ingredients[], instructions[]`;
// vs verbose version
```

#### 3. Response Length Control
```javascript
// Set appropriate max_tokens
body: JSON.stringify({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000, // Adjust based on needs
  // ...
})
```

#### 4. Caching (Future)
```javascript
// Cache extracted recipes to avoid re-processing
const cacheKey = `recipe-${imageHash}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;

const extracted = await extractRecipe(image);
await cache.set(cacheKey, extracted, { ttl: 86400 }); // 24h
```

### Budget Management

**Monthly Budget Tracking:**
```javascript
// Track API usage
let monthlySpend = 0;
const BUDGET_LIMIT = 50; // $50/month

const trackAPICall = (cost) => {
  monthlySpend += cost;
  if (monthlySpend > BUDGET_LIMIT) {
    console.warn('Budget limit exceeded');
    // Notify admin, throttle requests, etc.
  }
};
```

---

## Best Practices

### 1. Always Validate Responses

```javascript
const validateRecipeResponse = (data) => {
  if (!data.content || data.content.length === 0) {
    throw new Error('Empty response');
  }
  
  const text = data.content[0].text;
  if (!text) {
    throw new Error('No text in response');
  }
  
  try {
    const recipe = JSON.parse(text);
    if (!recipe.title || !recipe.ingredients) {
      throw new Error('Invalid recipe structure');
    }
    return recipe;
  } catch (e) {
    throw new Error('Invalid JSON response');
  }
};
```

### 2. Implement Timeout

```javascript
const callWithTimeout = async (fn, timeoutMs = 30000) => {
  return Promise.race([
    fn(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeoutMs)
    )
  ]);
};
```

### 3. Log for Debugging

```javascript
const logAPICall = (request, response) => {
  console.log({
    timestamp: new Date().toISOString(),
    model: request.model,
    imageSize: request.image?.length,
    promptLength: request.prompt?.length,
    responseTokens: response.usage?.output_tokens,
    success: !response.error
  });
};
```

### 4. Handle Partial Failures

```javascript
const extractWithFallback = async (image) => {
  try {
    // Try primary extraction
    return await extractRecipe(image);
  } catch (error) {
    console.error('Primary extraction failed:', error);
    
    // Fallback: simpler prompt
    try {
      return await extractRecipeSimple(image);
    } catch (fallbackError) {
      console.error('Fallback extraction failed:', fallbackError);
      
      // Last resort: manual entry
      return { requiresManualEntry: true };
    }
  }
};
```

### 5. Monitor API Health

```javascript
// Periodic health check
const checkAPIHealth = async () => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { /* ... */ },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};
```

---

## Related Documentation

- [API Endpoints](./endpoints.md)
- [Error Handling](./error-handling.md)
- [Architecture Overview](../architecture/overview.md)