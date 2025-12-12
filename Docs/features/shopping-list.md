# Shopping List Feature

## Overview

The Shopping List feature allows users to aggregate ingredients from multiple recipes into a consolidated shopping list. This feature is designed to streamline meal planning and grocery shopping by automatically collecting, organizing, and managing ingredients.

**Version:** 1.0.0 (Planned)  
**Last Updated:** December 10, 2025  
**Status:** Planned (Not Yet Implemented)  
**Target Release:** Q1 2026

---

## Feature Requirements

### Core Functionality

1. **Add Ingredients from Recipes**
   - Select recipes from library
   - Automatically extract all ingredients
   - Add to shopping list with one click

2. **Manual Ingredient Entry**
   - Add custom items not from recipes
   - Quick-add common items
   - Text input with auto-suggestions

3. **Quantity Aggregation**
   - Combine duplicate ingredients
   - Smart quantity addition (e.g., "2 cups" + "1 cup" = "3 cups")
   - Handle different units intelligently

4. **Category Organization**
   - Auto-categorize by food type (produce, dairy, meat, etc.)
   - Custom category creation
   - Drag-and-drop reordering

5. **Check-Off Items**
   - Mark items as purchased
   - Visual completion feedback
   - Track shopping progress

6. **Persistence**
   - Save list across sessions
   - Multiple list support
   - List history and archiving

---

## User Stories

### Primary User Stories

**As a user, I want to:**
- Add all ingredients from a recipe to my shopping list with one click
- See ingredients organized by grocery store section
- Check off items as I shop
- Combine ingredients from multiple recipes into one list
- Edit quantities and add custom notes
- Share my shopping list with family members
- Access my list on mobile while shopping

---

## UI/UX Design

### Shopping List Screen

```
┌─────────────────────────────────────┐
│  [←]  Shopping List        [Share] │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Add from recipe...        [+] │ │
│  └───────────────────────────────┘ │
│                                     │
│  Produce (3 items)                  │
│  ☐ Tomatoes - 4 large              │
│  ☐ Onions - 2 medium               │
│  ☑ Garlic - 1 bulb                 │
│                                     │
│  Dairy (2 items)                    │
│  ☐ Milk - 2 cups                   │
│  ☐ Butter - 1/2 cup                │
│                                     │
│  Meat & Seafood (1 item)            │
│  ☐ Chicken breast - 2 lbs          │
│                                     │
│  [+ Add Custom Item]                │
│                                     │
│  Progress: 1 of 6 items (17%)       │
└─────────────────────────────────────┘
```

### Add from Recipe Modal

```
┌─────────────────────────────────────┐
│  Select Recipes              [Close]│
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 🔍 Search recipes...          │ │
│  └───────────────────────────────┘ │
│                                     │
│  ☑ Grandma's Apple Pie             │
│    12 ingredients                   │
│                                     │
│  ☐ Mom's Spaghetti Sauce           │
│    8 ingredients                    │
│                                     │
│  ☐ Classic Chocolate Chip Cookies  │
│    10 ingredients                   │
│                                     │
│  [Add Selected to List]             │
└─────────────────────────────────────┘
```

---

## Data Model

### Shopping List Schema

```javascript
{
  id: number,                    // Unix timestamp
  name: string,                  // List name (e.g., "Weekly Groceries")
  created: string,               // ISO date string
  updated: string,               // ISO date string
  items: [
    {
      id: number,                // Item ID
      text: string,              // Item description
      quantity: string,          // Amount (e.g., "2 cups")
      category: string,          // Category name
      checked: boolean,          // Purchase status
      recipeId: number | null,   // Source recipe (if applicable)
      notes: string,             // Optional notes
      addedDate: string          // ISO date string
    }
  ],
  recipeIds: number[],           // Associated recipe IDs
  archived: boolean              // Archive status
}
```

### Storage Keys

| Key Pattern | Purpose | Example |
|------------|---------|---------|
| `list:{id}` | Shopping list data | `list:1702234567890` |
| `list-active` | Current active list ID | `list-active` |
| `list-archive:{id}` | Archived lists | `list-archive:1702234567890` |

---

## Implementation Plan

### Phase 1: Basic List Management (Week 1-2)

**Tasks:**
1. Create `ShoppingList` component
2. Implement storage schema
3. Add list creation/deletion
4. Build basic UI with category sections
5. Implement check-off functionality
6. Add manual item entry

**Deliverables:**
- Working shopping list screen
- Item add/remove/check functionality
- Persistent storage
- Unit tests for list operations

---

### Phase 2: Recipe Integration (Week 3)

**Tasks:**
1. Create "Add from Recipe" modal
2. Parse recipe ingredients
3. Implement ingredient extraction logic
4. Add recipe selection interface
5. Handle ingredient deduplication

**Deliverables:**
- Recipe selection modal
- Ingredient parsing function
- Duplicate detection algorithm
- Integration tests

---

### Phase 3: Smart Quantity Handling (Week 4)

**Tasks:**
1. Build quantity parser
2. Implement unit conversion
3. Create aggregation logic
4. Handle edge cases (e.g., "to taste", "pinch")
5. Add quantity editing

**Deliverables:**
- Quantity parsing utility
- Unit conversion system
- Aggregation algorithm
- Comprehensive test suite

---

### Phase 4: Categories & Organization (Week 5)

**Tasks:**
1. Define default categories
2. Implement auto-categorization
3. Add category management UI
4. Enable drag-and-drop reordering
5. Custom category creation

**Deliverables:**
- Category management system
- Auto-categorization logic
- Drag-and-drop interface
- Category CRUD operations

---

### Phase 5: Advanced Features (Week 6)

**Tasks:**
1. Multiple list support
2. List archiving
3. Share functionality (export as text/email)
4. List templates
5. Shopping history

**Deliverables:**
- Multi-list management
- Archive system
- Export functionality
- Template library

---

## Technical Specifications

### Ingredient Parsing

```javascript
/**
 * Parses ingredient string into structured data
 * @param {string} ingredient - Raw ingredient text
 * @returns {Object} Parsed ingredient object
 * 
 * @example
 * parseIngredient("2 cups all-purpose flour")
 * // Returns: {
 * //   quantity: "2",
 * //   unit: "cups",
 * //   item: "all-purpose flour",
 * //   original: "2 cups all-purpose flour"
 * // }
 */
function parseIngredient(ingredient) {
  const regex = /^([\d\s\/.-]+)?\s*([a-zA-Z]+)?\s*(.+)$/;
  const match = ingredient.match(regex);
  
  if (!match) {
    return { 
      quantity: "", 
      unit: "", 
      item: ingredient, 
      original: ingredient 
    };
  }
  
  return {
    quantity: (match[1] || "").trim(),
    unit: (match[2] || "").trim(),
    item: (match[3] || "").trim(),
    original: ingredient
  };
}
```

### Quantity Aggregation

```javascript
/**
 * Aggregates quantities of the same ingredient
 * @param {Array} items - Array of ingredient items
 * @returns {Array} Aggregated items
 * 
 * @example
 * aggregateQuantities([
 *   { item: "flour", quantity: "2", unit: "cups" },
 *   { item: "flour", quantity: "1", unit: "cup" }
 * ])
 * // Returns: [{ item: "flour", quantity: "3", unit: "cups" }]
 */
function aggregateQuantities(items) {
  const grouped = {};
  
  for (const item of items) {
    const key = `${item.item.toLowerCase()}_${item.unit}`;
    
    if (!grouped[key]) {
      grouped[key] = { ...item };
    } else {
      const existingQty = parseFloat(grouped[key].quantity) || 0;
      const newQty = parseFloat(item.quantity) || 0;
      grouped[key].quantity = String(existingQty + newQty);
    }
  }
  
  return Object.values(grouped);
}
```

### Auto-Categorization

```javascript
/**
 * Automatically categorizes ingredient by type
 * @param {string} ingredient - Ingredient name
 * @returns {string} Category name
 */
function categorizeIngredient(ingredient) {
  const categories = {
    'Produce': [
      'tomato', 'onion', 'garlic', 'lettuce', 'carrot', 
      'potato', 'apple', 'banana', 'lemon', 'lime'
    ],
    'Dairy': [
      'milk', 'butter', 'cheese', 'cream', 'yogurt', 
      'sour cream', 'cottage cheese'
    ],
    'Meat & Seafood': [
      'chicken', 'beef', 'pork', 'fish', 'salmon', 
      'shrimp', 'turkey', 'lamb'
    ],
    'Pantry': [
      'flour', 'sugar', 'salt', 'pepper', 'oil', 
      'vinegar', 'rice', 'pasta', 'bread'
    ],
    'Spices': [
      'cinnamon', 'paprika', 'oregano', 'basil', 
      'thyme', 'cumin', 'chili powder'
    ]
  };
  
  const lower = ingredient.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return category;
    }
  }
  
  return 'Other';
}
```

---

## API Design

### Component API

```javascript
<ShoppingList
  listId={currentListId}
  recipes={availableRecipes}
  onAddRecipe={(recipeId) => {}}
  onToggleItem={(itemId) => {}}
  onDeleteItem={(itemId) => {}}
  onUpdateItem={(itemId, changes) => {}}
  onShare={() => {}}
/>
```

### Storage Operations

```javascript
// Create new list
const list = await createShoppingList("Weekly Groceries");

// Add recipe to list
await addRecipeToList(listId, recipeId);

// Add custom item
await addItemToList(listId, {
  text: "Olive oil",
  quantity: "1 bottle",
  category: "Pantry"
});

// Toggle item checked status
await toggleItemChecked(listId, itemId);

// Get active list
const activeList = await getActiveShoppingList();

// Archive list
await archiveShoppingList(listId);
```

---

## User Flow

### Adding Recipes to List

1. User navigates to Shopping List screen
2. Clicks "Add from Recipe" button
3. Modal displays available recipes
4. User selects one or more recipes
5. Clicks "Add Selected to List"
6. System extracts ingredients from selected recipes
7. Duplicates are detected and aggregated
8. Items are auto-categorized
9. List updates with new items
10. Success message displayed

### Shopping Workflow

1. User opens shopping list on mobile
2. Items organized by category (matching store layout)
3. User walks through store
4. Taps items to check off as purchased
5. Progress bar shows completion percentage
6. Checked items move to bottom of category
7. User completes shopping
8. Option to archive or clear list

---

## Testing Strategy

### Unit Tests

```javascript
describe('Shopping List', () => {
  test('parseIngredient handles standard format', () => {
    const result = parseIngredient('2 cups flour');
    expect(result).toEqual({
      quantity: '2',
      unit: 'cups',
      item: 'flour',
      original: '2 cups flour'
    });
  });
  
  test('aggregateQuantities combines same ingredients', () => {
    const items = [
      { item: 'flour', quantity: '2', unit: 'cups' },
      { item: 'flour', quantity: '1', unit: 'cup' }
    ];
    const result = aggregateQuantities(items);
    expect(result[0].quantity).toBe('3');
  });
  
  test('categorizeIngredient returns correct category', () => {
    expect(categorizeIngredient('chicken breast')).toBe('Meat & Seafood');
    expect(categorizeIngredient('tomatoes')).toBe('Produce');
    expect(categorizeIngredient('cheddar cheese')).toBe('Dairy');
  });
});
```

### Integration Tests

```javascript
describe('Shopping List Integration', () => {
  test('can add recipe to list and extract ingredients', async () => {
    const recipe = {
      id: 1,
      ingredientSections: [
        { items: ['2 cups flour', '1 cup milk'] }
      ]
    };
    
    const listId = await createShoppingList('Test List');
    await addRecipeToList(listId, recipe.id);
    
    const list = await getShoppingList(listId);
    expect(list.items.length).toBe(2);
    expect(list.recipeIds).toContain(recipe.id);
  });
});
```

### End-to-End Tests

```javascript
describe('Shopping List E2E', () => {
  test('complete shopping workflow', async () => {
    // Navigate to shopping list
    await page.goto('/shopping');
    
    // Add recipe
    await page.click('[data-testid="add-recipe-btn"]');
    await page.click('[data-testid="recipe-1"]');
    await page.click('[data-testid="add-selected"]');
    
    // Verify items appear
    const items = await page.$$('[data-testid="list-item"]');
    expect(items.length).toBeGreaterThan(0);
    
    // Check off first item
    await items[0].click();
    const checked = await items[0].getAttribute('data-checked');
    expect(checked).toBe('true');
  });
});
```

---

## Accessibility

### ARIA Labels

```javascript
<div 
  role="checkbox" 
  aria-checked={item.checked}
  aria-label={`${item.text}, ${item.quantity}`}
  tabIndex={0}
  onKeyPress={(e) => e.key === 'Enter' && toggleItem(item.id)}
>
  {/* Item content */}
</div>
```

### Keyboard Navigation

- **Tab**: Navigate between items
- **Enter/Space**: Toggle item checked status
- **Delete**: Remove focused item
- **Arrow Up/Down**: Move between categories

### Screen Reader Support

- Announce item count in each category
- Announce progress percentage
- Confirm when item is checked/unchecked
- Alert when recipe is added to list

---

## Performance Considerations

### Optimization Strategies

1. **Virtual Scrolling**
   - Render only visible items for large lists (100+ items)
   - Improve performance on mobile devices

2. **Debounced Search**
   - Delay search input processing
   - Reduce unnecessary re-renders

3. **Lazy Loading**
   - Load recipe details on-demand
   - Don't load all recipes at once

4. **Memoization**
   - Cache categorized results
   - Avoid re-categorizing on every render

---

## Mobile Optimization

### Touch Interactions

- **Swipe Left**: Quick delete item
- **Long Press**: Edit item details
- **Pull to Refresh**: Sync changes
- **Swipe Right**: Mark as checked

### Offline Support

- Cache list data locally
- Queue changes when offline
- Sync when connection restored
- Show offline indicator

---

## Future Enhancements

### Phase 2 Features

1. **Smart Suggestions**
   - Suggest commonly purchased items
   - Learn from purchase history
   - Seasonal recommendations

2. **Store Integration**
   - Map to specific store layouts
   - Show aisle numbers
   - Price tracking

3. **Barcode Scanning**
   - Scan items to add to list
   - Verify item against list
   - Price comparison

4. **Recipe Scaling**
   - Adjust quantities when scaling recipes
   - Automatic recalculation
   - Serving size multiplier

5. **Collaborative Lists**
   - Real-time multi-user editing
   - Family sharing
   - Assignment of items to shoppers

---

## Related Documentation

- [Storage System](./storage.md)
- [Recipe Library](./recipe-library.md)
- [Architecture Overview](../architecture/overview.md)
- [Testing Guide](../guides/testing.md)

---

## Changelog

### Version 1.0.0 (Planned - Q1 2026)
- Initial shopping list feature specification
- Core functionality defined
- UI/UX mockups created
- Technical implementation plan established
- Testing strategy documented