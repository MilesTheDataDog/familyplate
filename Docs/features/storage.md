# Storage System

Documentation of FamilyPlate's data storage architecture and implementation.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Overview](#overview)
- [Storage Architecture](#storage-architecture)
- [Implementation](#implementation)
- [Data Models](#data-models)
- [Storage Operations](#storage-operations)
- [Limitations and Solutions](#limitations-and-solutions)
- [Future Storage Plans](#future-storage-plans)

---

## Overview

### Current Storage Solution

FamilyPlate uses **browser localStorage** for data persistence:
- Client-side storage (no server required)
- Persistent across sessions
- Synchronous API
- 5-10MB storage limit per domain

### Why localStorage?

**Advantages:**
- ✅ Simple to implement
- ✅ No backend infrastructure needed
- ✅ Works offline
- ✅ Fast access
- ✅ Free (no hosting costs)
- ✅ Sufficient for MVP

**Trade-offs:**
- ⚠️ Storage size limits
- ⚠️ No cross-device sync
- ⚠️ Data tied to browser
- ⚠️ No backup/recovery
- ⚠️ Cleared if browser data cleared

---

## Storage Architecture

### Storage Abstraction Layer

**Design Pattern:**
```
Application Code
       ↓
Storage Wrapper (window.storage)
       ↓
localStorage API
```

**Why abstraction?**
- Easy to swap implementations
- Consistent API across platforms
- Simple to add features (encryption, compression)
- Testable with mocks

### Storage Wrapper

**Interface:**
```javascript
window.storage = {
  get(key),           // Retrieve value
  set(key, value),    // Store value
  delete(key),        // Remove value
  list(prefix)        // List keys with prefix
};
```

**Implementation:**
```javascript
// src/storage.js

export const storage = {
  /**
   * Retrieves value from storage
   * @param {string} key - Storage key
   * @returns {Promise<Object|null>} Storage result or null
   */
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  
  /**
   * Stores value in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   * @returns {Promise<Object|null>} Storage result or null
   */
  async set(key, value) {
    try {
      localStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      console.error('Storage set error:', e);
      return null;
    }
  },
  
  /**
   * Deletes value from storage
   * @param {string} key - Storage key
   * @returns {Promise<Object|null>} Deletion result or null
   */
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      console.error('Storage delete error:', e);
      return null;
    }
  },
  
  /**
   * Lists keys matching prefix
   * @param {string} prefix - Key prefix to match
   * @returns {Promise<Object>} Object with keys array
   */
  async list(prefix) {
    try {
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith(prefix));
      return { keys };
    } catch (e) {
      console.error('Storage list error:', e);
      return { keys: [] };
    }
  }
};

// Make available globally
window.storage = storage;
```

---

## Implementation

### Key Naming Convention

**Pattern:** `{type}:{id}`

**Examples:**
```
recipe:1638472839182
recipe:1638472840291
recipe:1638472841405
shopping-list
user-preferences
```

**Benefits:**
- Organized by type
- Easy to query (list all recipes)
- Prevents collisions
- Clear purpose

### Data Serialization

**All data stored as JSON strings:**

```javascript
// Saving
const recipe = { title: 'Cookies', ingredients: [...] };
const jsonString = JSON.stringify(recipe);
await storage.set('recipe:123', jsonString);

// Loading
const result = await storage.get('recipe:123');
const recipe = JSON.parse(result.value);
```

**Error Handling:**
```javascript
try {
  const recipe = JSON.parse(result.value);
} catch (error) {
  console.error('Failed to parse recipe:', error);
  // Handle corrupted data
  return null;
}
```

---

## Data Models

### Recipe Model

**Structure:**
```javascript
{
  id: Number,                    // Timestamp-based ID
  title: String,                 // Recipe name
  image: String,                 // Base64 encoded image
  ingredientSections: [{         // Organized ingredients
    title: String,               // Section name
    items: [String]              // Ingredient list
  }],
  instructions: [String],        // Step-by-step instructions
  servings: String,              // Number of servings
  prepTime: String,              // Preparation time
  cookTime: String,              // Cooking time
  dateAdded: String,            // Date added (MM/DD/YYYY)
  category: String,              // Category (optional)
  tags: [String]                 // Tags (optional)
}
```

**Example:**
```json
{
  "id": 1638472839182,
  "title": "Chocolate Chip Cookies",
  "image": "data:image/jpeg;base64,/9j/4AAQ...",
  "ingredientSections": [
    {
      "title": "Dry Ingredients",
      "items": [
        "2 1/4 cups all-purpose flour",
        "1 tsp baking soda",
        "1 tsp salt"
      ]
    },
    {
      "title": "Wet Ingredients",
      "items": [
        "1 cup butter, softened",
        "3/4 cup granulated sugar",
        "2 large eggs"
      ]
    }
  ],
  "instructions": [
    "Preheat oven to 375°F",
    "Mix flour, baking soda, and salt",
    "Beat butter and sugars until creamy"
  ],
  "servings": "48 cookies",
  "prepTime": "15 minutes",
  "cookTime": "9-11 minutes",
  "dateAdded": "12/29/2024",
  "category": "Dessert",
  "tags": ["cookies", "baking", "family favorite"]
}
```

### Shopping List Model

**Structure:**
```javascript
[
  {
    id: Number,                  // Unique ID
    name: String,                // Item name
    checked: Boolean,            // Checked off
    sources: [{                  // Which recipes need this
      recipeName: String,
      originalText: String
    }]
  }
]
```

---

## Storage Operations

### Creating Recipes

```javascript
/**
 * Saves recipe to storage
 * @param {Object} recipe - Recipe object
 * @returns {Promise<boolean>} Success status
 */
const saveRecipe = async (recipe) => {
  try {
    const key = `recipe:${recipe.id}`;
    const value = JSON.stringify(recipe);
    const result = await window.storage.set(key, value);
    return result !== null;
  } catch (error) {
    console.error('Failed to save recipe:', error);
    return false;
  }
};
```

### Reading Recipes

```javascript
/**
 * Loads all recipes from storage
 * @returns {Promise<Array>} Array of recipe objects
 */
const loadRecipes = async () => {
  try {
    // Get all recipe keys
    const result = await window.storage.list('recipe:');
    
    if (!result || !result.keys) {
      return [];
    }
    
    const recipes = [];
    
    // Load each recipe
    for (const key of result.keys) {
      const data = await window.storage.get(key);
      
      if (data && data.value) {
        try {
          const recipe = JSON.parse(data.value);
          recipes.push(recipe);
        } catch (parseError) {
          console.error(`Failed to parse recipe ${key}:`, parseError);
        }
      }
    }
    
    // Sort by ID (newest first)
    recipes.sort((a, b) => b.id - a.id);
    
    return recipes;
  } catch (error) {
    console.error('Failed to load recipes:', error);
    return [];
  }
};
```

### Updating Recipes

```javascript
/**
 * Updates existing recipe
 * @param {Object} updatedRecipe - Updated recipe object
 * @returns {Promise<boolean>} Success status
 */
const updateRecipe = async (updatedRecipe) => {
  // Same as save - overwrites existing
  return await saveRecipe(updatedRecipe);
};
```

### Deleting Recipes

```javascript
/**
 * Deletes recipe from storage
 * @param {number} recipeId - Recipe ID to delete
 * @returns {Promise<boolean>} Success status
 */
const deleteRecipe = async (recipeId) => {
  try {
    const key = `recipe:${recipeId}`;
    const result = await window.storage.delete(key);
    return result !== null;
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    return false;
  }
};
```

---

## Limitations and Solutions

### Storage Quota Exceeded

**Problem:**
```javascript
// Error when storage full
QuotaExceededError: Failed to execute 'setItem' on 'Storage'
```

**Detection:**
```javascript
const checkStorageSpace = () => {
  try {
    const test = 'test';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      return false;
    }
    throw e;
  }
};
```

**Solutions:**

1. **Compress Images Further**
```javascript
// Reduce quality or dimensions
canvas.toDataURL('image/jpeg', 0.6); // Lower quality
```

2. **Show Storage Usage**
```javascript
const getStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length;
    }
  }
  return total / 1024 / 1024; // MB
};
```

3. **Prompt User to Delete**
```javascript
if (getStorageSize() > 4.5) {
  alert('Storage almost full. Please delete old recipes.');
}
```

### Data Loss on Browser Clear

**Problem:** Data deleted when user clears browser data

**Solutions:**

1. **Export/Import Feature**
```javascript
const exportRecipes = async () => {
  const recipes = await loadRecipes();
  const json = JSON.stringify(recipes, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `familyplate-backup-${Date.now()}.json`;
  a.click();
};

const importRecipes = async (file) => {
  const text = await file.text();
  const recipes = JSON.parse(text);
  
  for (const recipe of recipes) {
    await saveRecipe(recipe);
  }
};
```

2. **Regular Backup Reminders**
```javascript
// Check last backup
const lastBackup = localStorage.getItem('last-backup');
const daysSinceBackup = (Date.now() - lastBackup) / 86400000;

if (daysSinceBackup > 30) {
  showBackupReminder();
}
```

### No Cross-Device Sync

**Problem:** Recipes not available on other devices

**Future Solution:** Cloud storage with sync
- Firebase Firestore
- Supabase
- Custom backend

---

## Future Storage Plans

### Phase 1: Enhanced localStorage (3 months)

**Features:**
- Data encryption
- Automatic backups
- Storage usage tracking
- Cleanup tools

**Implementation:**
```javascript
// Encrypted storage
import CryptoJS from 'crypto-js';

const encryptedStorage = {
  async set(key, value) {
    const encrypted = CryptoJS.AES.encrypt(value, userKey).toString();
    return await storage.set(key, encrypted);
  },
  
  async get(key) {
    const result = await storage.get(key);
    if (!result) return null;
    
    const decrypted = CryptoJS.AES.decrypt(result.value, userKey);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
```

### Phase 2: Cloud Storage (6 months)

**Migration to Firebase:**
```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const db = getFirestore(app);

const saveRecipeToCloud = async (recipe) => {
  const docRef = await addDoc(collection(db, 'recipes'), recipe);
  return docRef.id;
};
```

**Benefits:**
- Cross-device sync
- Larger storage capacity
- Automatic backups
- Real-time updates

### Phase 3: Hybrid Storage (12 months)

**Best of both worlds:**
```javascript
const hybridStorage = {
  async save(recipe) {
    // Save locally (fast, offline)
    await localStorage.set(recipe.id, recipe);
    
    // Queue for cloud sync
    await syncQueue.add(recipe);
  },
  
  async load() {
    // Load from local first
    const local = await localStorage.getAll();
    
    // Sync with cloud in background
    syncFromCloud();
    
    return local;
  }
};
```

---

## Best Practices

### Do's

✅ **Always handle errors**
```javascript
try {
  await storage.set(key, value);
} catch (error) {
  // Handle gracefully
}
```

✅ **Validate before storing**
```javascript
if (!recipe.title || !recipe.id) {
  throw new Error('Invalid recipe');
}
```

✅ **Use consistent keys**
```javascript
const key = `recipe:${recipe.id}`;
```

✅ **Check storage availability**
```javascript
if (typeof Storage === 'undefined') {
  alert('Storage not available');
}
```

### Don'ts

❌ **Don't store sensitive data**
```javascript
// Never store passwords, tokens, etc.
```

❌ **Don't assume infinite storage**
```javascript
// Always check capacity
```

❌ **Don't store large files**
```javascript
// Compress images, limit sizes
```

❌ **Don't forget to clean up**
```javascript
// Delete old/unused data
```

---

## Related Documentation

- [Architecture: Data Flow](../architecture/data-flow.md)
- [Features: Recipe Extraction](./recipe-extraction.md)
- [API: Error Handling](../api/error-handling.md)