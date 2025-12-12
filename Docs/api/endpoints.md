# API Endpoints

Complete reference documentation for all FamilyPlate API endpoints.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints Overview](#endpoints-overview)
- [Recipe Extraction](#recipe-extraction)
- [Time Estimation](#time-estimation)
- [Rate Limiting](#rate-limiting)
- [Error Responses](#error-responses)

---

## Base URL

**Production:**
```
https://familyplate.vercel.app/api
```

**Development:**
```
http://localhost:3000/api
```

---

## Authentication

Currently, no authentication is required for API endpoints. The Anthropic API key is securely stored server-side and never exposed to clients.

**Future (Multi-User):**
```javascript
headers: {
  'Authorization': 'Bearer <user-token>'
}
```

---

## Endpoints Overview

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/extract-recipe` | POST | Extract recipe from image | No |
| `/api/estimate-times` | POST | Estimate prep/cook times | No |

---

## Recipe Extraction

### POST `/api/extract-recipe`

Extracts structured recipe data from an image using AI.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "image": "string",    // Base64 encoded image data (without data:image prefix)
  "type": "string",     // MIME type (e.g., "image/jpeg", "image/png")
  "prompt": "string"    // Extraction instructions for AI
}
```

**Example:**
```javascript
const response = await fetch('/api/extract-recipe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: "/9j/4AAQSkZJRgABAQAAAQABAAD...",  // Base64 data
    type: "image/jpeg",
    prompt: "Extract this recipe as JSON with fields: title, servings, prepTime, cookTime, ingredientSections, instructions..."
  })
});

const data = await response.json();
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"title\":\"Chocolate Chip Cookies\",\"servings\":\"24\",\"prepTime\":\"15 minutes\",\"cookTime\":\"10 minutes\",\"ingredientSections\":[{\"title\":\"Ingredients\",\"items\":[\"2 1/4 cups flour\",\"1 tsp baking soda\",\"1 cup butter\",\"2 eggs\",\"2 cups chocolate chips\"]}],\"instructions\":[\"Preheat oven to 375°F\",\"Mix ingredients\",\"Bake 10 minutes\"]}"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "role": "assistant",
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 1234,
    "output_tokens": 456
  }
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Missing required fields: image, type, prompt"
}
```

**Error (405 Method Not Allowed):**
```json
{
  "error": "Method not allowed"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Failed to extract recipe",
  "details": "API error message"
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `image` | string | Yes | Base64 encoded image without data URI prefix |
| `type` | string | Yes | MIME type of image (image/jpeg, image/png, image/webp) |
| `prompt` | string | Yes | Instructions for recipe extraction |

#### Processing Flow

```
1. Client uploads image
   ↓
2. Image compressed to < 1200px width
   ↓
3. Converted to base64
   ↓
4. POST to /api/extract-recipe
   ↓
5. Server validates request
   ↓
6. Calls Anthropic API
   ↓
7. Returns structured recipe data
   ↓
8. Client parses JSON response
```

#### Example Usage

```javascript
/**
 * Extracts recipe from image data
 * @param {string} imageDataUrl - Data URL of image
 * @returns {Promise<Object>} Extracted recipe object
 */
const extractRecipe = async (imageDataUrl) => {
  try {
    // 1. Compress image
    const compressed = await compressImage(imageDataUrl);
    
    // 2. Split data URL
    const parts = compressed.split(',');
    const base64 = parts[1];
    const mimeType = parts[0].split(':')[1].split(';')[0];
    
    // 3. Create extraction prompt
    const prompt = `Extract this recipe as JSON with these fields: title, servings, prepTime, cookTime, ingredientSections, instructions.
    
Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "ingredientSections": [
    {"title": "Ingredients", "items": ["item 1", "item 2"]}
  ],
  "instructions": ["step 1", "step 2"]
}

Return only valid JSON, no markdown.`;
    
    // 4. Call API
    const response = await fetch('/api/extract-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64,
        type: mimeType,
        prompt: prompt
      })
    });
    
    // 5. Handle response
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // 6. Extract and parse JSON
    if (data.error) {
      throw new Error(data.error);
    }
    
    const text = data.content[0].text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .trim();
    
    return JSON.parse(text);
    
  } catch (error) {
    console.error('Recipe extraction failed:', error);
    throw error;
  }
};
```

#### Rate Limits

- **Default**: No explicit rate limit
- **Vercel Serverless**: 10s max execution time
- **Anthropic API**: Subject to account tier limits
- **Recommended**: Implement client-side debouncing

#### Best Practices

1. **Compress images** before sending (reduces tokens/cost)
2. **Validate response** structure before using
3. **Handle errors** gracefully with user feedback
4. **Cache results** to avoid duplicate processing
5. **Show loading indicator** (API calls take 2-5 seconds)

---

## Time Estimation

### POST `/api/estimate-times`

Estimates preparation and cooking times for a recipe using AI analysis.

#### Request

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "title": "string",          // Recipe name
  "ingredients": "string",    // Comma-separated ingredients
  "instructions": "string"    // Space-separated instructions
}
```

**Example:**
```javascript
const response = await fetch('/api/estimate-times', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: "Chocolate Chip Cookies",
    ingredients: "flour, butter, sugar, eggs, chocolate chips",
    instructions: "Mix ingredients. Form dough. Bake at 375F for 10 minutes."
  })
});

const data = await response.json();
```

#### Response

**Success (200 OK):**
```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"prepTime\":\"15 minutes\",\"cookTime\":\"10 minutes\"}"
    }
  ],
  "model": "claude-sonnet-4-20250514",
  "role": "assistant",
  "stop_reason": "end_turn"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "Missing required fields: title, ingredients, instructions"
}
```

**Error (500 Internal Server Error):**
```json
{
  "error": "Failed to estimate times",
  "details": "Error message"
}
```

#### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Name of the recipe |
| `ingredients` | string | Yes | Ingredients (comma or space separated) |
| `instructions` | string | Yes | Cooking instructions |

#### Example Usage

```javascript
/**
 * Estimates prep and cook times for a recipe
 * @param {Object} recipe - Recipe object with title, ingredients, instructions
 * @returns {Promise<Object>} Object with prepTime and cookTime strings
 */
const estimateTimes = async (recipe) => {
  try {
    // 1. Prepare data
    const ingredients = recipe.ingredientSections
      .flatMap(section => section.items)
      .join(', ');
    
    const instructions = recipe.instructions.join(' ');
    
    // 2. Call API
    const response = await fetch('/api/estimate-times', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: recipe.title,
        ingredients: ingredients,
        instructions: instructions
      })
    });
    
    // 3. Handle response
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // 4. Parse JSON
    const text = data.content[0].text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .trim();
    
    return JSON.parse(text);
    
  } catch (error) {
    console.error('Time estimation failed:', error);
    // Return defaults on error
    return {
      prepTime: "15 minutes",
      cookTime: "30 minutes"
    };
  }
};
```

#### When to Use

- Recipe extracted without time information
- User wants time estimates for planning
- Converting old recipes without times

#### Rate Limits

- **Default**: No explicit rate limit
- **Cost**: ~$0.002 per estimation (much cheaper than extraction)
- **Speed**: ~1-2 seconds typical response time

---

## Rate Limiting

### Current Implementation

**Status**: No rate limiting currently implemented

**Vercel Limits**:
- 10 second max execution time per function
- 50MB max request body size
- 5MB max response body size

### Planned Implementation

```javascript
// Future rate limiting
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per window
  message: {
    error: 'Too many requests, please try again later'
  }
});

export default async function handler(req, res) {
  await limiter(req, res);
  // ... rest of handler
}
```

### Client-Side Throttling

**Recommended:**
```javascript
// Debounce API calls
import { debounce } from 'lodash';

const debouncedExtract = debounce(extractRecipe, 1000);

// Or simple throttle
let lastCall = 0;
const throttledExtract = async (image) => {
  const now = Date.now();
  if (now - lastCall < 2000) {
    throw new Error('Please wait before trying again');
  }
  lastCall = now;
  return await extractRecipe(image);
};
```

---

## Error Responses

### Standard Error Format

All errors follow this format:

```json
{
  "error": "Error message",
  "details": "Optional detailed error information"
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | Success | Request processed successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 405 | Method Not Allowed | Wrong HTTP method used |
| 413 | Payload Too Large | Request body exceeds limits |
| 500 | Internal Server Error | Server or API error |
| 503 | Service Unavailable | API temporarily down |

### Error Types

#### Client Errors (4xx)

**400 - Missing Fields:**
```json
{
  "error": "Missing required fields: image, type, prompt"
}
```

**400 - Invalid Format:**
```json
{
  "error": "Invalid image format"
}
```

**405 - Wrong Method:**
```json
{
  "error": "Method not allowed"
}
```

**413 - Too Large:**
```json
{
  "error": "Request entity too large"
}
```

#### Server Errors (5xx)

**500 - API Error:**
```json
{
  "error": "Failed to extract recipe",
  "details": "Anthropic API error: rate limit exceeded"
}
```

**503 - Service Down:**
```json
{
  "error": "Service temporarily unavailable"
}
```

### Error Handling Example

```javascript
/**
 * Calls API with comprehensive error handling
 * @param {string} endpoint - API endpoint path
 * @param {Object} data - Request payload
 * @returns {Promise<Object>} API response data
 * @throws {Error} Descriptive error with user-friendly message
 */
const callAPI = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      switch (response.status) {
        case 400:
          throw new Error('Invalid request. Please check your input.');
        case 405:
          throw new Error('Request method not supported.');
        case 413:
          throw new Error('Image too large. Please use a smaller image.');
        case 500:
          throw new Error('Server error. Please try again later.');
        case 503:
          throw new Error('Service temporarily unavailable.');
        default:
          throw new Error(errorData.error || 'Unknown error occurred');
      }
    }
    
    const responseData = await response.json();
    
    // Handle API-level errors
    if (responseData.error) {
      throw new Error(responseData.error);
    }
    
    return responseData;
    
  } catch (error) {
    // Network errors
    if (error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw with context
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
};
```

---

## Testing

### Manual Testing

**Using cURL:**

```bash
# Extract recipe
curl -X POST https://familyplate.vercel.app/api/extract-recipe \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64_encoded_image_data",
    "type": "image/jpeg",
    "prompt": "Extract recipe as JSON..."
  }'

# Estimate times
curl -X POST https://familyplate.vercel.app/api/estimate-times \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Recipe",
    "ingredients": "flour, eggs, milk",
    "instructions": "Mix and bake"
  }'
```

### Automated Testing

```javascript
// Jest test example
describe('API Endpoints', () => {
  describe('POST /api/extract-recipe', () => {
    it('should extract recipe from valid image', async () => {
      const response = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: validBase64Image,
          type: 'image/jpeg',
          prompt: validPrompt
        })
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.content).toBeDefined();
    });
    
    it('should return 400 for missing fields', async () => {
      const response = await fetch('/api/extract-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: 'test' })
      });
      
      expect(response.status).toBe(400);
    });
  });
});
```

---

## Related Documentation

- [Anthropic Integration](./anthropic-integration.md)
- [Error Handling](./error-handling.md)
- [Security](../architecture/security.md)