# Error Handling

Comprehensive guide to error handling patterns, strategies, and best practices in FamilyPlate.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Error Handling Philosophy](#error-handling-philosophy)
- [Error Types](#error-types)
- [Client-Side Error Handling](#client-side-error-handling)
- [Server-Side Error Handling](#server-side-error-handling)
- [User-Facing Error Messages](#user-facing-error-messages)
- [Error Logging](#error-logging)
- [Recovery Strategies](#recovery-strategies)

---

## Error Handling Philosophy

### Core Principles

1. **Fail Gracefully**: Never crash the app
2. **User-Friendly Messages**: Clear, actionable error messages
3. **Log for Debugging**: Detailed logs for developers
4. **Provide Context**: Help users understand what went wrong
5. **Offer Solutions**: Tell users how to fix the problem

### Error Handling Goals

- ✅ Prevent data loss
- ✅ Maintain app stability
- ✅ Provide clear feedback
- ✅ Enable easy debugging
- ✅ Guide users to resolution

---

## Error Types

### 1. Network Errors

**Cause**: Connection problems, timeout, server unavailable

**Examples:**
```javascript
// Fetch fails completely
Error: Failed to fetch

// Timeout
Error: Network request timed out

// Server unreachable
Error: Server is not responding
```

**Handling:**
```javascript
try {
  const response = await fetch('/api/extract-recipe', {
    method: 'POST',
    // ... options
  });
} catch (error) {
  if (error.message === 'Failed to fetch') {
    alert('Network error. Please check your internet connection.');
  } else if (error.message.includes('timeout')) {
    alert('Request timed out. Please try again.');
  }
}
```

### 2. API Errors

**Cause**: API key issues, rate limits, invalid requests

**Examples:**
```javascript
// Invalid API key
{ error: { type: 'authentication_error', message: 'invalid x-api-key' } }

// Rate limit
{ error: { type: 'rate_limit_error', message: 'rate limit exceeded' } }

// Invalid request
{ error: { type: 'invalid_request_error', message: 'invalid parameters' } }
```

**Handling:**
```javascript
const data = await response.json();

if (data.error) {
  switch (data.error.type) {
    case 'authentication_error':
      console.error('API key configuration error');
      alert('Service configuration error. Please contact support.');
      break;
    case 'rate_limit_error':
      alert('Too many requests. Please wait a moment and try again.');
      break;
    case 'invalid_request_error':
      alert('Invalid request. Please try again with a different image.');
      break;
    default:
      alert('An error occurred. Please try again.');
  }
}
```

### 3. Validation Errors

**Cause**: Invalid user input, missing data, wrong format

**Examples:**
```javascript
// Missing required field
Error: Recipe title is required

// Invalid format
Error: Image must be JPEG or PNG

// Size limit exceeded
Error: Image too large (max 10MB)
```

**Handling:**
```javascript
/**
 * Validates recipe data
 * @param {Object} recipe - Recipe object to validate
 * @throws {Error} Validation error with descriptive message
 */
const validateRecipe = (recipe) => {
  if (!recipe.title || recipe.title.trim() === '') {
    throw new Error('Recipe title is required');
  }
  
  if (recipe.title.length > 200) {
    throw new Error('Recipe title must be less than 200 characters');
  }
  
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    throw new Error('Recipe must have at least one instruction');
  }
  
  return true;
};

// Usage
try {
  validateRecipe(recipe);
  await saveRecipe(recipe);
} catch (error) {
  alert(error.message); // Show specific validation error
}
```

### 4. Storage Errors

**Cause**: localStorage full, quota exceeded, browser restrictions

**Examples:**
```javascript
// Quota exceeded
Error: QuotaExceededError

// Storage disabled
Error: localStorage is not available

// Parse error
Error: Unexpected token in JSON
```

**Handling:**
```javascript
/**
 * Safely saves data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
const safeSave = (key, value) => {
  try {
    const jsonString = JSON.stringify(value);
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      alert('Storage full. Please delete some recipes to free up space.');
    } else if (error.message.includes('localStorage')) {
      alert('Storage not available. Please enable cookies and site data.');
    } else {
      console.error('Save error:', error);
      alert('Failed to save. Please try again.');
    }
    return false;
  }
};
```

### 5. Processing Errors

**Cause**: Image compression fails, JSON parsing fails, unexpected data format

**Examples:**
```javascript
// Image compression
Error: Failed to load image

// JSON parsing
Error: Unexpected token < in JSON at position 0

// Invalid response
Error: Response text is not valid JSON
```

**Handling:**
```javascript
/**
 * Safely processes API response with error handling
 * @param {Response} response - Fetch API response
 * @returns {Promise<Object>} Parsed response data
 */
const processResponse = async (response) => {
  try {
    // Check HTTP status
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    // Parse JSON
    const data = await response.json();
    
    // Validate structure
    if (!data.content || !Array.isArray(data.content)) {
      throw new Error('Invalid response format');
    }
    
    // Extract text
    const textContent = data.content.find(item => item.type === 'text');
    if (!textContent || !textContent.text) {
      throw new Error('No text content in response');
    }
    
    // Clean and parse JSON
    const cleanText = textContent.text
      .replace(/```json\n?/g, '')
      .replace(/```/g, '')
      .trim();
    
    const parsed = JSON.parse(cleanText);
    
    return parsed;
    
  } catch (error) {
    console.error('Response processing error:', error);
    throw new Error('Failed to process response: ' + error.message);
  }
};
```

---

## Client-Side Error Handling

### Global Error Boundary

**React Error Boundary:**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <FamilyPlate />
</ErrorBoundary>
```

### Try-Catch Pattern

**Async Function Error Handling:**
```javascript
/**
 * Example of proper async error handling
 * @param {string} imageData - Image data URL
 */
const extractRecipe = async (imageData) => {
  try {
    // Set loading state
    setScreen('processing');
    
    // Compress image
    const compressed = await compressImage(imageData);
    
    // Prepare request
    const base64 = compressed.split(',')[1];
    const type = compressed.split(';')[0].split(':')[1];
    
    // Call API
    const response = await fetch('/api/extract-recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, type, prompt })
    });
    
    // Process response
    const data = await processResponse(response);
    
    // Save recipe
    const recipe = createRecipe(data);
    await saveRecipe(recipe);
    
    // Success
    setScreen('library');
    
  } catch (error) {
    // Log for debugging
    console.error('Recipe extraction failed:', error);
    
    // User-friendly message
    alert(
      'Failed to extract recipe. ' +
      (error.message || 'Please try again with a different image.')
    );
    
    // Return to safe state
    setScreen('preview');
  }
};
```

### Event Handler Error Handling

```javascript
/**
 * Safe event handler wrapper
 * @param {Function} handler - Event handler function
 * @returns {Function} Wrapped handler with error handling
 */
const safeHandler = (handler) => {
  return async (event) => {
    try {
      await handler(event);
    } catch (error) {
      console.error('Handler error:', error);
      alert('An error occurred. Please try again.');
    }
  };
};

// Usage
<button onClick={safeHandler(handleClick)}>
  Click Me
</button>
```

---

## Server-Side Error Handling

### Serverless Function Pattern

```javascript
/**
 * Serverless function with comprehensive error handling
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
export default async function handler(req, res) {
  try {
    // 1. Method validation
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed',
        allowedMethods: ['POST']
      });
    }

    // 2. Input validation
    const { image, type, prompt } = req.body;
    
    if (!image || !type || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['image', 'type', 'prompt']
      });
    }

    // 3. Type validation
    if (typeof image !== 'string') {
      return res.status(400).json({
        error: 'Invalid image format',
        expected: 'base64 string'
      });
    }

    // 4. Size validation
    if (image.length > 10 * 1024 * 1024) {
      return res.status(413).json({
        error: 'Image too large',
        maxSize: '10MB'
      });
    }

    // 5. Call external API
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
            { type: 'image', source: { type: 'base64', media_type: type, data: image } },
            { type: 'text', text: prompt }
          ]
        }]
      })
    });

    // 6. Handle API response
    const data = await response.json();

    if (data.error) {
      console.error('Anthropic API error:', data.error);
      return res.status(500).json({
        error: 'API processing failed',
        // Don't expose internal error details
      });
    }

    // 7. Success response
    return res.status(200).json(data);

  } catch (error) {
    // Log full error for debugging
    console.error('Serverless function error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // Generic user-facing error
    return res.status(500).json({
      error: 'Internal server error',
      // Never expose stack traces or sensitive info
    });
  }
}
```

### Environment Variable Validation

```javascript
/**
 * Validates required environment variables at startup
 * @throws {Error} If required variables are missing
 */
const validateEnvironment = () => {
  const required = ['ANTHROPIC_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

// At top of serverless function
export default async function handler(req, res) {
  try {
    validateEnvironment();
    // ... rest of function
  } catch (error) {
    console.error('Configuration error:', error);
    return res.status(500).json({
      error: 'Service configuration error'
    });
  }
}
```

---

## User-Facing Error Messages

### Message Guidelines

**DO:**
- ✅ Be clear and specific
- ✅ Suggest next steps
- ✅ Use simple language
- ✅ Be empathetic

**DON'T:**
- ❌ Use technical jargon
- ❌ Blame the user
- ❌ Expose system details
- ❌ Be vague

### Message Templates

```javascript
const ERROR_MESSAGES = {
  // Network errors
  network: 'Network error. Please check your internet connection and try again.',
  timeout: 'Request timed out. Please try again.',
  
  // API errors
  apiKey: 'Service configuration error. Please contact support.',
  rateLimit: 'Too many requests. Please wait a moment and try again.',
  
  // Validation errors
  noTitle: 'Please enter a recipe title.',
  noImage: 'Please select an image to upload.',
  imageTooLarge: 'Image is too large. Please use an image under 10MB.',
  invalidFormat: 'Invalid image format. Please use JPEG or PNG.',
  
  // Storage errors
  quotaExceeded: 'Storage full. Please delete some recipes to free up space.',
  storageDisabled: 'Storage not available. Please enable cookies and site data.',
  
  // Processing errors
  extractionFailed: 'Failed to extract recipe. Please try again with a clearer image.',
  parsingFailed: 'Failed to process recipe data. Please try again.',
  
  // Generic
  unknown: 'An unexpected error occurred. Please try again.'
};

/**
 * Gets user-friendly error message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
const getUserMessage = (error) => {
  // Match error to known types
  if (error.message === 'Failed to fetch') {
    return ERROR_MESSAGES.network;
  }
  if (error.message.includes('timeout')) {
    return ERROR_MESSAGES.timeout;
  }
  if (error.name === 'QuotaExceededError') {
    return ERROR_MESSAGES.quotaExceeded;
  }
  
  // Return error message if user-friendly, otherwise generic
  const userFriendly = Object.values(ERROR_MESSAGES).includes(error.message);
  return userFriendly ? error.message : ERROR_MESSAGES.unknown;
};
```

---

## Error Logging

### Console Logging

```javascript
/**
 * Structured error logging
 * @param {string} context - Where error occurred
 * @param {Error} error - Error object
 * @param {Object} metadata - Additional context
 */
const logError = (context, error, metadata = {}) => {
  console.error({
    context,
    message: error.message,
    name: error.name,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...metadata
  });
};

// Usage
try {
  await extractRecipe(image);
} catch (error) {
  logError('Recipe Extraction', error, {
    imageSize: image.length,
    screen: currentScreen
  });
}
```

### Future: Error Tracking Service

```javascript
// Example: Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Filter out sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  }
});

// Capture errors
try {
  await riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      feature: 'recipe-extraction'
    },
    extra: {
      imageSize: image.length
    }
  });
}
```

---

## Recovery Strategies

### Retry Logic

```javascript
/**
 * Retries a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<any>} Function result
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on client errors (400-499)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Last attempt, throw error
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Usage
try {
  const result = await retryWithBackoff(() => 
    fetch('/api/extract-recipe', options)
  );
} catch (error) {
  console.error('All retries failed:', error);
}
```

### Fallback Strategies

```javascript
/**
 * Attempts primary method, falls back to secondary if it fails
 * @param {Function} primary - Primary method
 * @param {Function} fallback - Fallback method
 * @returns {Promise<any>} Result from either method
 */
const withFallback = async (primary, fallback) => {
  try {
    return await primary();
  } catch (primaryError) {
    console.warn('Primary method failed, trying fallback:', primaryError);
    try {
      return await fallback();
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      throw new Error('All methods failed');
    }
  }
};

// Usage
const recipe = await withFallback(
  () => extractRecipe(image),           // Try AI extraction
  () => manualEntryPrompt()             // Fallback to manual entry
);
```

### Graceful Degradation

```javascript
/**
 * Attempts operation, returns partial result on failure
 */
const extractWithGracefulDegradation = async (image) => {
  try {
    // Try full extraction
    return await extractRecipe(image);
  } catch (error) {
    console.warn('Full extraction failed, attempting partial:', error);
    
    try {
      // Try simpler extraction (text only)
      return await extractTextOnly(image);
    } catch (textError) {
      console.error('Text extraction also failed:', textError);
      
      // Return minimal template for manual entry
      return {
        title: '',
        ingredients: [],
        instructions: [],
        requiresManualEntry: true
      };
    }
  }
};
```

---

## Related Documentation

- [API Endpoints](./endpoints.md)
- [Anthropic Integration](./anthropic-integration.md)
- [Testing Guide](../guides/testing.md)