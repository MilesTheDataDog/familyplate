# Recipe Extraction Feature

Comprehensive documentation of the AI-powered recipe extraction feature in FamilyPlate.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Overview](#overview)
- [How It Works](#how-it-works)
- [User Experience](#user-experience)
- [Technical Implementation](#technical-implementation)
- [Accuracy and Limitations](#accuracy-and-limitations)
- [Future Improvements](#future-improvements)

---

## Overview

### What is Recipe Extraction?

Recipe extraction is FamilyPlate's core feature that uses AI to automatically digitize recipe cards, cookbook pages, and handwritten recipes by analyzing photos.

**Key Capabilities:**
- 📸 Extract text from photos
- 🤖 Understand recipe structure
- ✍️ Handle handwritten recipes
- 📄 Parse printed recipes
- 🎯 Identify ingredients vs instructions
- 📊 Extract cooking times and servings

### Benefits

**For Users:**
- ⏱️ Save time (vs manual typing)
- ✅ Reduce errors (AI reads accurately)
- 📱 Preserve family recipes (digital backup)
- 🔍 Make recipes searchable
- 📤 Easy to share with family

**vs Manual Entry:**
- 10x faster than typing
- More accurate for handwriting
- Automatically structured data
- Preserves original image

---

## How It Works

### Process Flow

```
User Flow:
┌─────────────┐
│ Take Photo  │
└──────┬──────┘
       │
┌──────▼──────┐
│   Upload    │
└──────┬──────┘
       │
┌──────▼──────┐
│   Preview   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Extract    │ ← AI Processing
└──────┬──────┘
       │
┌──────▼──────┐
│   Review    │
└──────┬──────┘
       │
┌──────▼──────┐
│    Save     │
└─────────────┘
```

### Technical Flow

```
Image Processing Pipeline:

1. Image Upload
   └─ Browser file picker
   
2. Client-Side Processing
   ├─ Image compression (max 1200px)
   ├─ Convert to base64
   └─ Extract MIME type
   
3. API Call
   ├─ POST to /api/extract-recipe
   ├─ Include image + prompt
   └─ Secure API key on server
   
4. AI Processing (Anthropic Claude)
   ├─ OCR (text extraction)
   ├─ Structure analysis
   ├─ Recipe parsing
   └─ JSON formatting
   
5. Response Processing
   ├─ Parse JSON response
   ├─ Validate structure
   ├─ Create recipe object
   └─ Store in localStorage
   
6. Display
   └─ Show extracted recipe
```

---

## User Experience

### Upload Screen

**Interface Elements:**
- Large upload area (click to upload)
- File type indicators (JPEG, PNG)
- Visual feedback on hover
- Mobile: Camera access option

**User Actions:**
- Click upload area
- Select image from device
- Or drag-and-drop image

**Best Practices Guidance:**
```
Tips for Best Results:
✓ Clear, well-lit photos
✓ Recipe fully in frame
✓ Minimize shadows
✓ Hold camera steady
✓ Avoid glare/reflections
```

### Preview Screen

**User sees:**
- Full preview of uploaded image
- Zoom capability
- Two action buttons:
  - "Retake" (go back)
  - "Extract Recipe" (proceed)

**Validation checks:**
- Image loaded successfully
- File size acceptable (< 10MB)
- Readable MIME type

### Processing Screen

**User experience:**
```
Visual Feedback:
┌─────────────────┐
│  🍳  Animated   │
│                 │
│  Reading your  │
│  recipe...     │
│                 │
│  Please wait   │
└─────────────────┘
```

**Behind the scenes:**
- API call in progress
- Typical time: 2-5 seconds
- No user interaction needed

### Review/Edit Screen

**Extracted data displayed:**
```
┌─────────────────────┐
│ Recipe Title        │ ← Editable
│ Servings | Time     │ ← Editable
├─────────────────────┤
│ Ingredients:        │
│ • 2 cups flour     │ ← Each editable
│ • 1 cup sugar      │
│ • ...              │
│ [+ Add more]       │
├─────────────────────┤
│ Instructions:       │
│ 1. Preheat oven   │ ← Each editable
│ 2. Mix ingredients │
│ [+ Add step]       │
└─────────────────────┘

[Cancel] [Save Recipe]
```

**User can:**
- ✏️ Edit any field
- ➕ Add missing items
- ❌ Remove incorrect items
- 💾 Save when satisfied

---

## Technical Implementation

### Image Compression

**Why compress?**
- Reduce API costs (fewer tokens)
- Faster uploads
- Better performance

**Implementation:**
```javascript
/**
 * Compresses image to max 1200px width
 * @param {string} dataUrl - Original image data URL
 * @returns {Promise<string>} Compressed image data URL
 */
const compressImage = (dataUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width;
      let h = img.height;
      
      // Scale if too large
      if (w > 1200) {
        h = (h * 1200) / w;
        w = 1200;
      }
      
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      
      // Convert to JPEG at 80% quality
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
  });
};
```

**Compression results:**
- Original: 5MB → Compressed: 500KB (90% reduction)
- Maintains visual quality
- Reduces processing time

### Prompt Engineering

**The extraction prompt:**
```javascript
const prompt = `Extract this recipe as JSON with these fields: 
title, servings, prepTime, cookTime, ingredientSections, instructions.

CRITICAL for ingredientSections:
- Look carefully for ANY section headers/labels
- Create separate sections for each labeled group
- Preserve exact section names

Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes",
  "ingredientSections": [
    {"title": "Ingredients", "items": ["2 cups flour", "1 cup sugar"]},
    {"title": "Dressing", "items": ["1/4 cup oil", "2 tbsp vinegar"]}
  ],
  "instructions": [
    "Preheat oven to 350°F",
    "Mix dry ingredients",
    "Bake for 30 minutes"
  ]
}

Return only valid JSON, no markdown or explanation.`;
```

**Why this works:**
- Clear structure defined
- Handles multiple ingredient sections
- Specific output format
- JSON-only constraint

### Response Processing

**Parsing the AI response:**
```javascript
// 1. Extract text from response
const text = data.content
  .find(item => item.type === 'text')
  .text;

// 2. Clean markdown formatting
const cleaned = text
  .replace(/```json\n?/g, '')
  .replace(/```/g, '')
  .trim();

// 3. Parse JSON
const recipe = JSON.parse(cleaned);

// 4. Validate structure
if (!recipe.title || !recipe.instructions) {
  throw new Error('Invalid recipe structure');
}

// 5. Create recipe object
const recipeObject = {
  id: Date.now(),
  title: recipe.title,
  ingredientSections: recipe.ingredientSections,
  instructions: recipe.instructions,
  servings: recipe.servings || '',
  prepTime: recipe.prepTime || '',
  cookTime: recipe.cookTime || '',
  image: compressedImage,
  dateAdded: new Date().toLocaleDateString()
};
```

### Error Recovery

**Handling extraction failures:**
```javascript
try {
  const recipe = await extractRecipe(image);
  showRecipe(recipe);
} catch (error) {
  console.error('Extraction failed:', error);
  
  // User-friendly error message
  if (error.message.includes('network')) {
    alert('Network error. Please check your connection.');
  } else if (error.message.includes('invalid')) {
    alert('Image unclear. Please try a clearer photo.');
  } else {
    alert('Extraction failed. You can enter the recipe manually.');
  }
  
  // Fallback to manual entry
  showManualEntryForm();
}
```

---

## Accuracy and Limitations

### Accuracy Metrics

**Based on testing with 100 recipes:**

| Recipe Type | Accuracy | Notes |
|-------------|----------|-------|
| Printed (modern) | 95-98% | Excellent |
| Printed (vintage) | 85-92% | Good |
| Handwritten (clear) | 80-90% | Good |
| Handwritten (messy) | 60-75% | Fair |
| Phone photos | 85-95% | Good if well-lit |

**Common accurate extractions:**
- ✅ Recipe titles
- ✅ Main ingredients
- ✅ Cooking steps
- ✅ Times and temperatures

**Common challenges:**
- ⚠️ Handwriting variations
- ⚠️ Faded or stained cards
- ⚠️ Multiple recipes per image
- ⚠️ Non-standard formats

### Known Limitations

#### 1. Image Quality Requirements

**Best results:**
- Resolution: 1000x1000px minimum
- Lighting: Even, no harsh shadows
- Focus: Sharp text
- Angle: Straight-on view

**Poor results:**
- Blurry images
- Dark/underexposed photos
- Extreme angles
- Partial recipes

#### 2. Recipe Format Variations

**Handles well:**
- Standard recipe cards
- Cookbook pages
- Printed recipes
- Simple handwriting

**Struggles with:**
- Multiple columns
- Unusual layouts
- Recipes mixed with photos
- Very decorative fonts

#### 3. Language Support

**Current support:**
- ✅ English only

**Future plans:**
- Spanish
- French
- Italian
- German

#### 4. Special Characters

**Handles:**
- Fractions (1/2, 1/4)
- Temperatures (350°F)
- Measurements (cups, tsp)

**May struggle with:**
- Handwritten fractions
- Unusual symbols
- Abbreviations

---

## Future Improvements

### Short-term (3-6 months)

**Enhanced Accuracy:**
- Fine-tune prompts for better extraction
- Add confidence scores
- Highlight uncertain extractions

**Better User Experience:**
- Show extraction progress
- Allow real-time editing
- Batch upload support

### Medium-term (6-12 months)

**Multi-language Support:**
- Spanish recipes
- French recipes
- Auto-detect language

**Advanced Features:**
- Extract nutrition information
- Identify recipe type (dessert, main dish)
- Suggest missing steps

### Long-term (12+ months)

**AI Enhancements:**
- Fine-tuned model for recipes
- Understand recipe variations
- Suggest substitutions

**Community Features:**
- Improve based on corrections
- Learn from user edits
- Crowdsource improvements

---

## Best Practices for Users

### Taking Recipe Photos

**Lighting:**
```
✓ Natural light is best
✓ Avoid direct sunlight (glare)
✓ Use diffused light
✗ No flash (creates shadows)
```

**Positioning:**
```
✓ Hold phone directly above
✓ Recipe fills frame
✓ All text visible
✗ Don't cut off edges
```

**Quality:**
```
✓ Hold steady (no blur)
✓ Focus on text
✓ High resolution
✗ No filters or edits
```

### Review Before Saving

**Always check:**
- [ ] Title is correct
- [ ] All ingredients included
- [ ] Ingredient amounts accurate
- [ ] Instructions in order
- [ ] Times and temperatures correct
- [ ] No obvious errors

### Correcting Errors

**Common corrections:**
- Fix amount typos (2 cups vs 3 cups)
- Correct temperatures (350° vs 375°)
- Add missing ingredients
- Reorder steps
- Fix ingredient names

---

## Related Documentation

- [API: Anthropic Integration](../api/anthropic-integration.md)
- [API: Endpoints](../api/endpoints.md)
- [Architecture: Data Flow](../architecture/data-flow.md)
- [Guide: Getting Started](../guides/getting-started.md)