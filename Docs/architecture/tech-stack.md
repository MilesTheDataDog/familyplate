# Technology Stack

Comprehensive documentation of all technologies used in FamilyPlate, including rationale for choices and alternatives considered.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Overview](#overview)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [APIs and Services](#apis-and-services)
- [Development Tools](#development-tools)
- [Deployment and Hosting](#deployment-and-hosting)
- [Future Technologies](#future-technologies)

---

## Overview

FamilyPlate uses a modern, lightweight tech stack optimized for rapid development, maintainability, and scalability.

### Technology Philosophy

1. **Simplicity First**: Choose simple solutions over complex ones
2. **Developer Experience**: Tools that enhance productivity
3. **Performance**: Fast load times and responsive UI
4. **Cost-Effective**: Minimize operational costs
5. **Future-Proof**: Technologies with strong ecosystems

---

## Frontend Technologies

### React 18.2.0

**What**: JavaScript library for building user interfaces

**Why Chosen:**
- ✅ Component-based architecture promotes reusability
- ✅ Large ecosystem and community support
- ✅ Excellent developer tools (React DevTools)
- ✅ Virtual DOM for efficient updates
- ✅ Hooks API for clean, functional components
- ✅ Strong TypeScript support (future migration path)

**Alternatives Considered:**
- Vue.js: Simpler learning curve but smaller ecosystem
- Angular: Too heavy for this use case
- Svelte: Smaller bundle sizes but less mature ecosystem

**Key Features Used:**
```javascript
// Functional components with hooks
import { useState, useEffect } from 'react';

export default function FamilyPlate() {
  const [recipes, setRecipes] = useState([]);
  
  useEffect(() => {
    loadRecipes();
  }, []);
  
  return <div>...</div>;
}
```

**Version Justification:**
- React 18 introduces concurrent features
- Automatic batching improves performance
- Suspense for better loading states (future use)

---

### Tailwind CSS 3.3.0

**What**: Utility-first CSS framework

**Why Chosen:**
- ✅ Rapid UI development with utility classes
- ✅ Responsive design built-in (sm:, md:, lg: breakpoints)
- ✅ Small production bundle (unused styles purged)
- ✅ Consistent design system out of the box
- ✅ No naming conventions needed (no BEM, SMACSS)
- ✅ Easy to customize via config file

**Alternatives Considered:**
- Bootstrap: Too opinionated, larger bundle
- Styled Components: Runtime overhead, harder to optimize
- CSS Modules: More boilerplate, less consistent
- Plain CSS: Harder to maintain, no design system

**Configuration:**
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom colors, spacing, etc.
    },
  },
  plugins: [],
}
```

**Key Benefits:**
- **Responsive**: `text-sm sm:text-base md:text-lg`
- **States**: `hover:bg-gray-50 focus:ring-2`
- **Composition**: Combine utilities for complex designs
- **PurgeCSS**: Production builds only include used classes

---

### Lucide React 0.263.1

**What**: SVG icon library

**Why Chosen:**
- ✅ Beautiful, consistent icon set
- ✅ Tree-shakeable (only import icons you use)
- ✅ Optimized SVGs (small file sizes)
- ✅ Customizable size, color, stroke width
- ✅ No font files needed
- ✅ Works perfectly with Tailwind

**Alternatives Considered:**
- Font Awesome: Larger bundle, font files needed
- Material Icons: Less consistent with design
- Heroicons: Limited icon selection
- Custom SVGs: Time-consuming to create/maintain

**Usage Pattern:**
```javascript
import { Camera, Book, Home } from 'lucide-react';

// Optimized icon wrapper
const Icon = ({ component: Component, size = 24 }) => (
  <Component 
    size={size}
    style={{ 
      backfaceVisibility: 'hidden',
      transform: 'translateZ(0)'
    }}
  />
);

<Icon component={Camera} size={48} />
```

**Optimization:**
- Hardware-accelerated rendering
- Integer pixel sizes (no sub-pixel rendering)
- Display: block to prevent layout shifts

---

### React Scripts 5.0.1

**What**: Configuration and scripts for Create React App

**Why Chosen:**
- ✅ Zero configuration needed
- ✅ Webpack, Babel, ESLint pre-configured
- ✅ Hot module replacement
- ✅ Production build optimization
- ✅ Development server included
- ✅ Test runner (Jest) included

**Key Commands:**
```json
{
  "scripts": {
    "start": "react-scripts start",    // Development server
    "build": "react-scripts build",    // Production build
    "test": "react-scripts test",      // Run tests
    "eject": "react-scripts eject"     // Eject config (avoid)
  }
}
```

**Build Optimizations:**
- Code splitting
- Asset optimization
- Source maps for debugging
- Environment variable injection

---

## Backend Technologies

### Node.js (Latest LTS)

**What**: JavaScript runtime for server-side code

**Why Chosen:**
- ✅ Same language as frontend (JavaScript)
- ✅ NPM ecosystem access
- ✅ Async/await for clean async code
- ✅ Fast for I/O operations
- ✅ Required for Vercel serverless functions

**Version**: Latest LTS (v20.x recommended)

**Usage:**
- Serverless function runtime
- Build tooling
- Development server

---

### Vercel Serverless Functions

**What**: Serverless backend functions

**Why Chosen:**
- ✅ No server management required
- ✅ Automatic scaling
- ✅ Pay only for usage
- ✅ Easy deployment (git push)
- ✅ Environment variable management
- ✅ Integrated with Vercel hosting
- ✅ Generous free tier

**Alternatives Considered:**
- AWS Lambda: More complex setup
- Google Cloud Functions: Steeper learning curve
- Azure Functions: Less integrated with frontend
- Traditional server (Express): More maintenance

**Function Structure:**
```javascript
// /api/extract-recipe.js
export default async function handler(req, res) {
  // Stateless function
  // Runs independently per request
  // Auto-scales with traffic
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const result = await processRequest(req.body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
```

**Benefits:**
- Cold start: ~100-500ms (acceptable for our use case)
- Auto-scaling: Handles traffic spikes
- Cost: Free tier covers development + small production
- Security: API keys in environment variables

---

## APIs and Services

### Anthropic Claude API

**What**: AI language model for text processing

**Model**: `claude-sonnet-4-20250514`

**Why Chosen:**
- ✅ Excellent OCR and text extraction
- ✅ Handles handwriting well
- ✅ Structured output (JSON)
- ✅ Context understanding
- ✅ Reasonable pricing (~$0.01-0.02 per recipe)
- ✅ Fast response times
- ✅ High accuracy

**Alternatives Considered:**
- OpenAI GPT-4 Vision: More expensive, similar quality
- Google Cloud Vision: Good OCR but needs additional processing
- Tesseract.js: Free but poor handwriting recognition
- AWS Textract: Good for printed text, struggles with handwriting

**API Integration:**
```javascript
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
        { type: 'image', source: { type: 'base64', media_type, data } },
        { type: 'text', text: prompt }
      ]
    }]
  })
});
```

**Cost Analysis:**
- Recipe extraction: ~$0.01-0.02 per recipe
- Time estimation: ~$0.002 per call
- 100 recipes: ~$1-2 total
- Very cost-effective for the value provided

---

## Development Tools

### Git

**What**: Version control system

**Why Essential:**
- ✅ Track all code changes
- ✅ Collaborate with others
- ✅ Rollback mistakes easily
- ✅ Required for deployment

**Best Practices:**
```bash
# Descriptive commit messages
git commit -m "Add hamburger menu navigation"

# Feature branches
git checkout -b feature/shopping-list

# Regular commits
# Commit after each complete feature
```

---

### VS Code (Recommended)

**What**: Code editor

**Why Recommended:**
- ✅ Excellent React/JavaScript support
- ✅ Built-in terminal
- ✅ Git integration
- ✅ Extensions for productivity
- ✅ Free and cross-platform

**Essential Extensions:**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- GitLens

---

### ESLint

**What**: JavaScript linter

**Why Essential:**
- ✅ Catch errors before runtime
- ✅ Enforce code style consistency
- ✅ Prevent common mistakes
- ✅ Team collaboration easier

**Configuration:**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['react-app'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off', // Allow console for debugging
  }
};
```

---

### Jest & React Testing Library

**What**: Testing frameworks

**Why Essential:**
- ✅ Test components and functions
- ✅ Catch regressions
- ✅ Document expected behavior
- ✅ Confidence in refactoring

**Usage:**
```javascript
// FamilyPlate.test.jsx
import { render, screen } from '@testing-library/react';
import FamilyPlate from './FamilyPlate';

test('renders home screen', () => {
  render(<FamilyPlate />);
  expect(screen.getByText('FamilyPlate')).toBeInTheDocument();
});
```

---

## Deployment and Hosting

### Vercel

**What**: Cloud platform for static sites and serverless functions

**Why Chosen:**
- ✅ Automatic deployments from Git
- ✅ Global CDN for fast loading
- ✅ Preview deployments for PRs
- ✅ Environment variables management
- ✅ Serverless functions included
- ✅ Free SSL certificates
- ✅ Generous free tier
- ✅ Excellent DX (developer experience)

**Alternatives Considered:**
- Netlify: Similar but less serverless integration
- AWS S3 + CloudFront: More complex setup
- GitHub Pages: No serverless functions
- Heroku: More expensive, overkill for static site

**Deployment Process:**
```bash
# Automatic deployment
git push origin main
# ↓
# Vercel detects push
# ↓
# Runs npm install
# ↓
# Runs npm run build
# ↓
# Deploys to CDN
# ↓
# App live at familyplate.vercel.app
```

**Features Used:**
- Automatic HTTPS
- Environment variables for API keys
- Serverless functions (/api/*)
- Analytics (optional)
- Domain management

---

## Storage

### localStorage (Current)

**What**: Browser storage API

**Why Chosen (MVP):**
- ✅ Simple to implement
- ✅ No backend required
- ✅ Works offline
- ✅ Fast access
- ✅ Free (no costs)
- ✅ Sufficient for MVP

**Limitations:**
- ⚠️ 5-10MB storage limit
- ⚠️ No cross-device sync
- ⚠️ No user accounts
- ⚠️ Data lost if browser cleared

**Wrapper Interface:**
```javascript
window.storage = {
  async get(key) {
    return localStorage.getItem(key);
  },
  async set(key, value) {
    localStorage.setItem(key, value);
  },
  async delete(key) {
    localStorage.removeItem(key);
  },
  async list(prefix) {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(prefix));
  }
};
```

---

### AsyncStorage (React Native Future)

**What**: React Native storage API

**Why for Mobile:**
- ✅ Similar API to localStorage
- ✅ Asynchronous (non-blocking)
- ✅ Larger storage capacity
- ✅ Native performance

**Migration Path:**
```javascript
// Same interface, different implementation
window.storage = {
  async get(key) {
    return await AsyncStorage.getItem(key);
  },
  // ... same API
};
```

---

## Future Technologies

### Planned Additions

#### User Authentication
- **Option 1**: Firebase Auth
- **Option 2**: Auth0
- **Option 3**: Supabase Auth

#### Cloud Storage
- **Option 1**: Firebase Storage (images)
- **Option 2**: AWS S3
- **Option 3**: Cloudinary

#### Database
- **Option 1**: Firebase Firestore
- **Option 2**: Supabase (PostgreSQL)
- **Option 3**: MongoDB Atlas

#### Analytics
- **Option 1**: Google Analytics
- **Option 2**: Plausible (privacy-focused)
- **Option 3**: Vercel Analytics

---

## Technology Decision Matrix

### Evaluation Criteria

| Technology | Ease of Use | Performance | Cost | Ecosystem | Total |
|------------|-------------|-------------|------|-----------|-------|
| React      | 9/10        | 9/10        | 10/10| 10/10     | 38/40 |
| Tailwind   | 10/10       | 9/10        | 10/10| 9/10      | 38/40 |
| Vercel     | 10/10       | 9/10        | 10/10| 9/10      | 38/40 |
| Anthropic  | 8/10        | 9/10        | 8/10 | 8/10      | 33/40 |
| localStorage| 10/10      | 10/10       | 10/10| 9/10      | 39/40 |

---

## Dependency Management

### Current Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24"
  }
}
```

### Update Strategy

- **React**: Update with minor versions (18.x)
- **Tailwind**: Keep up to date (stable releases)
- **Icons**: Update as needed for new icons
- **Build Tools**: Update cautiously (test thoroughly)

### Security

```bash
# Regular security audits
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

---

## Performance Metrics

### Current Performance

- **Lighthouse Score**: 95+ (performance)
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: ~200KB (gzipped)

### Optimization Techniques

1. **Code Splitting**: Lazy load routes (future)
2. **Image Compression**: Reduce upload sizes
3. **Tree Shaking**: Remove unused code
4. **CDN**: Global distribution via Vercel
5. **Caching**: Browser caching headers

---

## Related Documentation

- [Architecture Overview](./overview.md)
- [Deployment Guide](../guides/deployment.md)
- [API Documentation](../api/)