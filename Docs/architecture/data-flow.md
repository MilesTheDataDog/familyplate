# Data Flow

Detailed documentation of how data flows through the FamilyPlate application, from user input to storage and display.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Overview](#overview)
- [Recipe Upload Flow](#recipe-upload-flow)
- [Recipe Extraction Flow](#recipe-extraction-flow)
- [Recipe Storage Flow](#recipe-storage-flow)
- [Recipe Retrieval Flow](#recipe-retrieval-flow)
- [Shopping List Flow](#shopping-list-flow)
- [State Management Flow](#state-management-flow)

---

## Overview

FamilyPlate follows a unidirectional data flow pattern, ensuring predictable state changes and easier debugging.

### Core Data Flow Principle

```
User Action → Event Handler → API/Storage → State Update → UI Re-render
```

All data modifications follow this pattern, with no circular dependencies or bi-directional data binding.

---

## Recipe Upload Flow

### Step-by-Step Process

#### 1. User Selects Image

```
User clicks "Upload Recipe" button
         ↓
Navigation: screen = 'upload'
         ↓
User clicks file input
         ↓
Browser file picker opens
         ↓
User selects image file
```

**Code Flow:**
```javascript
// Navigate to upload screen
setScreen('upload');

// Handle file selection
const handleUpload = async (e) => {
  const file = e.target.files[0];
  // Continue to step 2...
}
```

#### 2. Image Reading

```
File selected
         ↓
FileReader reads file as DataURL
         ↓
Image data loaded into memory
         ↓
Navigation: screen = 'preview'
```

**Code Flow:**
```javascript
const reader = new FileReader();
reader.onloadend = async () => {
  const imageData = reader.result;
  // Continue to step 3...
};
reader.readAsDataURL(file);
```

#### 3. Image Compression

```
Raw image data (DataURL)
         ↓
Create Image object
         ↓
Draw to Canvas at max 1200px width
         ↓
Convert to JPEG at 80% quality
         ↓
Return compressed DataURL
```

**Code Flow:**
```javascript
const compressImage = (dataUrl) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    
    // Maintain aspect ratio, max width 1200px
    if (w > 1200) {
      h = (h * 1200) / w;
      w = 1200;
    }
    
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    
    // Compress to JPEG 80%
    resolve(canvas.toDataURL('image/jpeg', 0.8));
  };
  img.src = dataUrl;
});
```

#### 4. Preview Display

```
Compressed image
         ↓
State update: previewImage = compressed
         ↓
UI re-renders with preview
         ↓
User sees image and action buttons
```

---

## Recipe Extraction Flow

### AI-Powered Extraction Pipeline

#### 1. User Triggers Extraction

```
User clicks "Extract Recipe" button
         ↓
Navigation: screen = 'processing'
         ↓
extractRecipe() function called
```

#### 2. Image Preparation

```
Compressed image (DataURL)
         ↓
Split into base64 data and MIME type
         ↓
base64 = imageData.split(',')[1]
type = imageData.split(';')[0].split(':')[1]
```

**Code Flow:**
```javascript
const compressed = await compressImage(imageData);
const base64 = compressed.split(',')[1];
const type = compressed.split(';')[0].split(':')[1];
```

#### 3. API Request Construction

```
Create prompt for Claude
         ↓
{
  image: base64,
  type: MIME type,
  prompt: extraction instructions
}
         ↓
POST to /api/extract-recipe
```

**Prompt Structure:**
```javascript
const prompt = `Extract this recipe as JSON with fields:
- title
- servings
- prepTime
- cookTime
- ingredientSections [{title, items[]}]
- instructions []

Return only valid JSON, no markdown.`;
```

#### 4. Serverless Function Processing

```
Vercel Function receives request
         ↓
Validate request method (POST)
         ↓
Validate required fields
         ↓
Retrieve ANTHROPIC_API_KEY from env
         ↓
Call Anthropic API
         ↓
Return response to client
```

**Function Flow:**
```javascript
// In /api/extract-recipe.js
export default async function handler(req, res) {
  // Validate
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Extract
  const { image, type, prompt } = req.body;
  
  // Call Anthropic
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      messages: [/* ... */]
    })
  });
  
  return res.status(200).json(await response.json());
}
```

#### 5. Response Processing

```
API response received
         ↓
Extract text content
         ↓
Remove markdown formatting
         ↓
Parse JSON
         ↓
Validate structure
```

**Code Flow:**
```javascript
const data = await res.json();

if (data.error) {
  alert('Failed: ' + data.error);
  setScreen('preview');
  return;
}

const text = data.content
  .find(i => i.type === 'text')
  .text
  .replace(/```json\n?/g, '')
  .replace(/```/g, '')
  .trim();

const extracted = JSON.parse(text);
```

#### 6. Recipe Object Creation

```
Parsed JSON
         ↓
Transform to Recipe Model
         ↓
Add metadata (id, dateAdded, image)
         ↓
Create recipe object
```

**Recipe Creation:**
```javascript
const recipe = {
  id: Date.now(),
  title: extracted.title || 'Untitled',
  image: compressed,
  ingredientSections: extracted.ingredientSections || [],
  instructions: extracted.instructions || [],
  servings: extracted.servings || '',
  prepTime: extracted.prepTime || '',
  cookTime: extracted.cookTime || '',
  dateAdded: new Date().toLocaleDateString()
};
```

#### 7. Storage & Navigation

```
Recipe object created
         ↓
Save to storage
         ↓
Add to recipes state
         ↓
Navigate to library
```

---

## Recipe Storage Flow

### LocalStorage Persistence

#### Write Flow

```
Recipe object
         ↓
Convert to JSON string
         ↓
Generate storage key: 'recipe:{id}'
         ↓
window.storage.set(key, jsonString)
         ↓
localStorage.setItem(key, jsonString)
         ↓
Success/Failure response
```

**Code Flow:**
```javascript
const saveRecipeToStorage = async (recipe) => {
  try {
    const key = 'recipe:' + recipe.id;
    const value = JSON.stringify(recipe);
    await window.storage.set(key, value);
    return true;
  } catch (e) {
    console.error('Storage failed:', e);
    return false;
  }
};
```

#### Read Flow

```
Request recipes
         ↓
List all keys with prefix 'recipe:'
         ↓
For each key:
  ├─ Get value from localStorage
  ├─ Parse JSON
  └─ Add to array
         ↓
Sort by id (newest first)
         ↓
Return recipes array
```

**Code Flow:**
```javascript
const loadRecipes = async () => {
  try {
    // Get all recipe keys
    const result = await window.storage.list('recipe:');
    
    if (result && result.keys) {
      const loaded = [];
      
      // Load each recipe
      for (const key of result.keys) {
        const data = await window.storage.get(key);
        if (data && data.value) {
          loaded.push(JSON.parse(data.value));
        }
      }
      
      // Sort newest first
      loaded.sort((a, b) => b.id - a.id);
      return loaded;
    }
  } catch (e) {
    console.error('Load failed:', e);
    return [];
  }
};
```

---

## Recipe Retrieval Flow

### Application Startup

```
App component mounts
         ↓
useEffect hook triggers
         ↓
loadRecipes() called
         ↓
Retrieve from storage
         ↓
Update recipes state
         ↓
Set loading = false
         ↓
UI renders with data
```

**Initialization Flow:**
```javascript
export default function FamilyPlate() {
  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    loadRecipes();
  }, []); // Run once on mount
  
  const loadRecipes = async () => {
    try {
      const loaded = await getRecipesFromStorage();
      setRecipes(loaded);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <AppContent recipes={recipes} />;
}
```

### Recipe Display

```
User navigates to Library
         ↓
screen = 'library'
         ↓
recipes.map() creates Recipe Cards
         ↓
Each card displays:
  ├─ Recipe image
  ├─ Recipe title
  └─ Date added
         ↓
User clicks card
         ↓
setCurrentRecipe(recipe)
         ↓
screen = 'view'
         ↓
Full recipe details displayed
```

---

## Shopping List Flow

### Adding Ingredients

```
User views recipe
         ↓
Clicks "Add to Shopping List"
         ↓
Parse all ingredients
         ↓
Extract ingredient names
         ↓
Show selection preview
         ↓
User selects/deselects items
         ↓
Confirm selection
         ↓
Merge with existing list
         ↓
Save to storage
         ↓
Navigate to shopping list
```

**Ingredient Parsing:**
```javascript
const parseIngredientName = (ingredient) => {
  let parsed = ingredient;
  
  // Remove measurements
  parsed = parsed.replace(/^[\d\s\/\.\-]+/, '');
  
  // Remove units
  parsed = parsed.replace(/\b(cup|tablespoon|teaspoon)\b/gi, '');
  
  // Remove preparation terms
  parsed = parsed.replace(/\b(chopped|diced|minced)\b/gi, '');
  
  // Clean whitespace
  parsed = parsed.trim();
  
  return parsed;
};
```

### Shopping List Management

```
Shopping list operations:

Toggle item:
  item.checked = !item.checked
  ↓ save to storage

Delete item:
  list = list.filter(i => i.id !== deleteId)
  ↓ save to storage

Clear all:
  list = []
  ↓ save to storage
```

---

## State Management Flow

### State Hierarchy

```
App Level State (FamilyPlate component)
├── screen (current view)
├── recipes (all recipes)
├── currentRecipe (selected recipe)
├── previewImage (upload preview)
├── loading (app initialization)
└── menuOpen (navigation menu)
```

### State Update Pattern

All state updates follow this pattern:

```
Event occurs
         ↓
Event handler called
         ↓
State setter function invoked
         ↓
React schedules re-render
         ↓
Component re-renders with new state
         ↓
UI reflects updated state
```

**Example:**
```javascript
// User action
<button onClick={() => setScreen('library')}>

// State update
setScreen('library')

// React re-renders
if (screen === 'library') {
  return <LibraryScreen />;
}
```

### Derived State

Some values are calculated from state rather than stored:

```javascript
// Stored state
const [recipes, setRecipes] = useState([]);

// Derived values (not stored)
const recipeCount = recipes.length;
const hasRecipes = recipes.length > 0;
const latestRecipe = recipes[0];
```

---

## Error Handling Flow

### API Errors

```
API call fails
         ↓
catch block activated
         ↓
Display error to user (alert)
         ↓
Revert to previous screen
         ↓
Log error for debugging
```

### Storage Errors

```
Storage operation fails
         ↓
catch block activated
         ↓
Return failure indicator
         ↓
Component handles failure
         ↓
Show user-friendly message
```

---

## Performance Optimizations

### Image Compression

- Reduces API payload size
- Faster transmission
- Lower storage requirements
- Better performance on mobile

### Lazy Loading

Future optimization:
```javascript
// Load recipes on demand
const [visibleRecipes, setVisibleRecipes] = useState([]);

useEffect(() => {
  // Load first 20 recipes
  setVisibleRecipes(recipes.slice(0, 20));
}, [recipes]);

// Load more on scroll
const loadMore = () => {
  setVisibleRecipes(prev => [
    ...prev,
    ...recipes.slice(prev.length, prev.length + 20)
  ]);
};
```

---

## Related Documentation

- [Architecture Overview](./overview.md)
- [API Endpoints](../api/endpoints.md)
- [Storage System](../features/storage.md)