# Architecture Overview

Comprehensive overview of FamilyPlate's system architecture, design patterns, and architectural decisions.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [System Architecture](#system-architecture)
- [Component Architecture](#component-architecture)
- [Data Architecture](#data-architecture)
- [API Architecture](#api-architecture)
- [Design Patterns](#design-patterns)
- [Scalability Considerations](#scalability-considerations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Interface                       │
│              (React + Tailwind CSS)                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├─── Local State Management (React Hooks)
                 │
                 ├─── Client-Side Storage (localStorage)
                 │
                 └─── API Layer
                      │
                      ├─── Vercel Serverless Functions
                      │    │
                      │    ├─── /api/extract-recipe
                      │    └─── /api/estimate-times
                      │
                      └─── External APIs
                           └─── Anthropic Claude API
```

### Architecture Layers

#### 1. Presentation Layer
- **Technology**: React 18 with functional components
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Hooks (useState, useEffect)
- **Responsibilities**:
  - User interface rendering
  - User interaction handling
  - Local state management
  - Client-side routing

#### 2. Business Logic Layer
- **Location**: React components and custom hooks
- **Responsibilities**:
  - Recipe data validation
  - Image compression
  - Ingredient parsing
  - Recipe organization
  - Shopping list generation

#### 3. API Layer
- **Technology**: Vercel Serverless Functions
- **Language**: JavaScript/Node.js
- **Responsibilities**:
  - Secure API key management
  - Request/response handling
  - Error handling
  - Rate limiting
  - API response transformation

#### 4. Storage Layer
- **Current**: Browser localStorage
- **Future**: AsyncStorage (React Native)
- **Responsibilities**:
  - Recipe persistence
  - User preferences
  - Shopping list storage
  - Offline data access

#### 5. External Services Layer
- **Anthropic Claude API**: Recipe extraction and text processing
- **Vercel CDN**: Static asset delivery
- **Future**: Cloud storage for recipe images

---

## Component Architecture

### Component Hierarchy

```
App (FamilyPlate)
├── HamburgerMenu
│   ├── Icon (Home)
│   ├── Icon (Plus)
│   ├── Icon (Book)
│   └── Icon (ShoppingCart)
├── TopBar
│   └── Icon (Menu)
└── Screens
    ├── Home Screen
    ├── Upload Screen
    │   └── FileInput
    ├── Preview Screen
    │   └── Image Display
    ├── Processing Screen
    │   └── Loading Indicator
    ├── Library Screen
    │   └── Recipe Cards[]
    ├── View Screen
    │   ├── Recipe Header
    │   ├── Ingredients List
    │   └── Instructions List
    └── Shopping Screen
        └── Shopping Items[]
```

### Component Design Principles

#### Single Responsibility
Each component has one clear purpose:
- `HamburgerMenu`: Navigation only
- `TopBar`: Header and menu trigger
- `Icon`: SVG icon rendering

#### Composition Over Inheritance
Components are composed of smaller, reusable components rather than using class inheritance.

#### Container/Presentational Pattern
- **Container Components**: `FamilyPlate` (main app state)
- **Presentational Components**: All screen and UI components

---

## Data Architecture

### Data Flow Pattern

FamilyPlate follows a **unidirectional data flow** pattern:

```
User Action → Event Handler → State Update → UI Re-render
```

### State Management

#### Local Component State
```javascript
const [screen, setScreen] = useState('home');
const [recipes, setRecipes] = useState([]);
const [currentRecipe, setCurrentRecipe] = useState(null);
const [menuOpen, setMenuOpen] = useState(false);
```

#### Derived State
State that is calculated from other state rather than stored:
```javascript
const recipeCount = recipes.length;
const hasRecipes = recipes.length > 0;
```

### Data Models

#### Recipe Model
```javascript
{
  id: Number,                    // Timestamp-based unique ID
  title: String,                 // Recipe name
  image: String,                 // Base64 encoded image
  ingredientSections: Array[{    // Structured ingredients
    title: String,               // Section name (e.g., "Dressing")
    items: Array[String]         // Ingredient items
  }],
  instructions: Array[String],   // Step-by-step instructions
  servings: String,              // Serving size
  prepTime: String,              // Preparation time
  cookTime: String,              // Cooking time
  dateAdded: String             // Date recipe was added
}
```

#### Storage Key Pattern
```
recipe:{id}        // Individual recipes
shopping-list      // Shopping list data
```

---

## API Architecture

### Serverless Function Architecture

#### Design Principles
- **Stateless**: Each function invocation is independent
- **Single Purpose**: One endpoint per function
- **Environment-Based Config**: API keys in environment variables
- **Error Handling**: Consistent error response format

#### Endpoint Pattern

```javascript
export default async function handler(req, res) {
  // 1. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Input validation
  if (!requiredFields) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // 3. Business logic
  try {
    const result = await processRequest(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

### API Security

#### API Key Management
- Keys stored in environment variables
- Never exposed to client
- Accessed only in serverless functions

#### Request Validation
- Method validation (POST only)
- Input sanitization
- Size limits on uploads

---

## Design Patterns

### 1. Facade Pattern
The `Icon` component acts as a facade for Lucide React icons:
```javascript
const Icon = ({ component: Component, size, className }) => (
  <Component size={size} className={className} />
);
```

### 2. Strategy Pattern
Different storage strategies can be swapped:
- localStorage (web)
- AsyncStorage (React Native)
- Cloud storage (future)

### 3. Observer Pattern
React's built-in state management implements the observer pattern:
```javascript
useState() // Observable state
useEffect() // Observer that reacts to changes
```

### 4. Factory Pattern
Recipe creation from API response:
```javascript
const createRecipe = (apiResponse) => ({
  id: Date.now(),
  title: apiResponse.title || 'Untitled',
  // ... transform API data to recipe model
});
```

### 5. Singleton Pattern
Storage interface acts as a singleton:
```javascript
window.storage = {
  get: () => {},
  set: () => {},
  delete: () => {},
  list: () => {}
};
```

---

## Scalability Considerations

### Current Architecture (MVP)

**Strengths:**
- ✅ Simple and maintainable
- ✅ Low operational cost (serverless)
- ✅ Fast development cycle
- ✅ Easy to deploy

**Limitations:**
- ⚠️ localStorage size limits (~5-10MB)
- ⚠️ No user authentication
- ⚠️ No data sync between devices
- ⚠️ Serverless function cold starts

### Future Scalability Path

#### Phase 1: Enhanced Storage (Near-term)
- Implement cloud storage for images
- Add user authentication
- Sync recipes across devices
- Increase storage capacity

#### Phase 2: Performance Optimization (Mid-term)
- Implement image CDN
- Add caching layers
- Optimize API calls
- Implement lazy loading

#### Phase 3: Feature Expansion (Long-term)
- Multi-user support
- Recipe sharing
- Social features
- Advanced search
- Recipe recommendations

### Architectural Evolution

```
Current: Monolithic Client + Serverless API
         ↓
Phase 1: Microservices + User Service
         ↓
Phase 2: Event-Driven Architecture
         ↓
Phase 3: Distributed System with CDN
```

---

## 12 Factor App Compliance

FamilyPlate follows 12 Factor App methodology:

1. **Codebase**: ✅ Single codebase in Git, multiple deploys
2. **Dependencies**: ✅ Explicit in package.json, npm install
3. **Config**: ✅ Environment variables for API keys
4. **Backing Services**: ✅ Anthropic API as attached resource
5. **Build/Release/Run**: ✅ Separate build (npm build) and run stages
6. **Processes**: ✅ Stateless serverless functions
7. **Port Binding**: ✅ Services via Vercel's port binding
8. **Concurrency**: ✅ Horizontal scaling via serverless
9. **Disposability**: ✅ Fast startup, graceful shutdown
10. **Dev/Prod Parity**: ✅ Same codebase, environment-based config
11. **Logs**: ✅ Treated as event streams (Vercel logs)
12. **Admin Processes**: ✅ One-off tasks via scripts

---

## Sandi Metz Rules Compliance

Following Sandi Metz rules for maintainable code:

1. **Classes < 100 lines**: ✅ Main component ~500 lines (exception for main app component)
2. **Methods < 5 lines**: ⚠️ Goal, working towards refactoring
3. **≤ 4 parameters**: ✅ Most functions follow this
4. **Controllers instantiate 1 object**: ✅ React pattern complies
5. **Views know 1 instance variable**: ✅ Props pattern complies

---

## Architecture Decision Records (ADR)

See [Architecture Decisions](../project-management/decisions.md) for detailed ADRs on key architectural choices.

---

## Related Documentation

- [Data Flow](./data-flow.md) - Detailed data flow diagrams
- [Tech Stack](./tech-stack.md) - Technology choices and rationale
- [Security](./security.md) - Security architecture
- [API Endpoints](../api/endpoints.md) - API documentation