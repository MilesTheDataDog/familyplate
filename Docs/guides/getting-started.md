# Getting Started

Quick start guide for developers new to FamilyPlate. Get up and running in under 30 minutes.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [First Steps](#first-steps)
- [Common Tasks](#common-tasks)
- [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

Before starting, ensure you have these installed:

| Software | Minimum Version | Purpose |
|----------|----------------|---------|
| **Node.js** | 18.x or higher | JavaScript runtime |
| **npm** | 9.x or higher | Package manager |
| **Git** | 2.x or higher | Version control |
| **Code Editor** | Any | VS Code recommended |

### Check Your Versions

```bash
# Verify installations
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
git --version     # Should show 2.x.x or higher
```

### Recommended Tools

- **VS Code Extensions**:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - ESLint
  - Prettier
  - GitLens

---

## Quick Start

### 1. Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/familyplate.git

# Navigate to project
cd familyplate
```

### 2. Install Dependencies

```bash
# Install all packages
npm install

# This installs:
# - React and React DOM
# - React Scripts (Create React App)
# - Tailwind CSS
# - Lucide React (icons)
# - PostCSS and Autoprefixer
```

**Expected Output:**
```
added 1459 packages, and audited 1460 packages in 45s
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Create environment file
touch .env.local
```

Add your Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Note**: Never commit `.env.local` to Git (it's in `.gitignore`)

### 4. Start Development Server

```bash
# Start the app
npm start
```

The app will automatically open at `http://localhost:3000`

**You should see:**
- FamilyPlate home screen
- "Add Recipe" and "My Recipes" buttons
- Responsive design (try resizing window)

### 5. Test the App

1. **Click "Add Recipe"** → Upload screen
2. **Select an image** → Preview screen
3. **Click "Extract Recipe"** → Processing → Recipe extracted!
4. **View "My Recipes"** → See your saved recipes

---

## Project Structure

### File Organization

```
familyplate/
├── api/                          # Serverless API functions
│   ├── extract-recipe.js         # Recipe extraction endpoint
│   └── estimate-times.js         # Time estimation endpoint
├── docs/                         # Documentation
│   ├── README.md                 # Documentation index
│   ├── architecture/             # Architecture docs
│   ├── api/                      # API documentation
│   ├── guides/                   # Developer guides
│   ├── features/                 # Feature documentation
│   └── project-management/       # Planning docs
├── public/                       # Static files
│   └── index.html                # HTML template
├── src/                          # Source code
│   ├── FamilyPlate.jsx           # Main app component
│   ├── storage.js                # Storage wrapper
│   ├── index.js                  # App entry point
│   └── index.css                 # Global styles
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
└── project_guidelines.md         # Development rules
```

### Key Files Explained

#### `src/FamilyPlate.jsx`
Main application component containing:
- All screens (home, upload, library, etc.)
- State management
- Business logic
- UI components

#### `api/extract-recipe.js`
Serverless function that:
- Receives image data from client
- Calls Anthropic API securely
- Returns extracted recipe data

#### `src/storage.js`
Storage abstraction layer:
- Wraps localStorage API
- Provides async interface
- Easy to swap implementations

---

## First Steps

### Understanding the App Flow

```
User Journey:
1. Home Screen → Choose to add recipe or view library
2. Upload Screen → Select recipe image from device
3. Preview Screen → Confirm image looks good
4. Processing Screen → AI extracts recipe data
5. Library Screen → View all saved recipes
6. Recipe View → See full recipe details
```

### Exploring the Code

**Start here:**
```javascript
// src/FamilyPlate.jsx

// 1. Look at state management
const [screen, setScreen] = useState('home');
const [recipes, setRecipes] = useState([]);

// 2. Understand screen rendering
if (screen === 'home') return <HomeScreen />;
if (screen === 'upload') return <UploadScreen />;

// 3. Study data flow
const extractRecipe = async (imageData) => {
  // Image → API → Storage → UI
};
```

### Making Your First Change

**Simple Exercise**: Change the home screen title

1. **Find the code** (src/FamilyPlate.jsx, line ~400):
```javascript
<h1>FamilyPlate</h1>
```

2. **Make a change**:
```javascript
<h1>My Family Recipes</h1>
```

3. **Save the file** - app auto-reloads!

4. **See your change** in the browser

---

## Common Tasks

### Running the App

```bash
# Development mode (with hot reload)
npm start

# Production build
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Adding a New Feature

**Example: Add a "Share Recipe" button**

1. **Add state** (if needed):
```javascript
const [shareModalOpen, setShareModalOpen] = useState(false);
```

2. **Add UI component**:
```javascript
<button onClick={() => setShareModalOpen(true)}>
  Share Recipe
</button>
```

3. **Implement logic**:
```javascript
const shareRecipe = (recipe) => {
  const shareData = {
    title: recipe.title,
    text: `Check out this recipe: ${recipe.title}`
  };
  navigator.share(shareData);
};
```

4. **Test your feature**
5. **Commit changes**:
```bash
git add .
git commit -m "Add recipe sharing feature"
```

### Debugging

**Browser DevTools:**
```javascript
// Add debugging statements
console.log('Current recipe:', currentRecipe);
console.log('Screen state:', screen);

// Inspect localStorage
console.log('Stored recipes:', localStorage);

// Check network requests
// DevTools → Network tab → Filter by "api"
```

**React DevTools:**
- Install React DevTools extension
- Inspect component state and props
- View component hierarchy

### Common Issues

#### Issue: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

#### Issue: API key not working

**Solution:**
1. Verify key in `.env.local`
2. Restart development server (npm start)
3. Check for typos in key
4. Verify key is active in Anthropic console

---

## Next Steps

### Learn More

1. **Read Architecture Docs**
   - [Architecture Overview](../architecture/overview.md)
   - [Data Flow](../architecture/data-flow.md)
   - [Tech Stack](../architecture/tech-stack.md)

2. **Understand APIs**
   - [Anthropic Integration](../api/anthropic-integration.md)
   - [API Endpoints](../api/endpoints.md)

3. **Study Features**
   - [Recipe Extraction](../features/recipe-extraction.md)
   - [Storage System](../features/storage.md)

### Development Workflow

```
1. Create feature branch
   git checkout -b feature/my-feature

2. Make changes
   - Edit code
   - Test locally
   - Write tests

3. Commit changes
   git add .
   git commit -m "Add my feature"

4. Push to GitHub
   git push origin feature/my-feature

5. Create pull request
   - Review changes
   - Request code review
   - Merge when approved
```

### Best Practices

**Code Style:**
- Use functional components
- Use hooks (useState, useEffect)
- Keep components small (< 100 lines)
- Extract reusable logic

**Git Workflow:**
- Commit frequently
- Write descriptive commit messages
- Create feature branches
- Pull before pushing

**Testing:**
- Test new features manually
- Write unit tests for utilities
- Test on multiple browsers
- Test responsive design

### Resources

**Documentation:**
- [Contributing Guidelines](./contributing.md)
- [Development Setup](./development-setup.md)
- [Deployment Guide](./deployment.md)
- [Testing Guide](./testing.md)

**External Resources:**
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Vercel Documentation](https://vercel.com/docs)

### Get Help

**Questions?**
- Check existing documentation first
- Search GitHub issues
- Ask in project discussions
- Create a new issue if needed

**Found a Bug?**
1. Check if already reported
2. Create detailed bug report
3. Include steps to reproduce
4. Provide error messages/screenshots

---

## Quick Reference

### Essential Commands

```bash
# Development
npm start              # Start dev server
npm test               # Run tests
npm run build          # Production build

# Git
git status             # Check status
git add .              # Stage changes
git commit -m "msg"    # Commit changes
git push               # Push to remote

# Debugging
console.log()          # Log to console
debugger;              # Set breakpoint
```

### Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + P` | Quick file open |
| `Ctrl/Cmd + Shift + P` | Command palette |
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Ctrl/Cmd + /` | Toggle comment |
| `F12` | Go to definition |

### Helpful Snippets

```javascript
// Create new component
const MyComponent = () => {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return <div>Content</div>;
};

// Async function with error handling
const myFunction = async () => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## Congratulations! 🎉

You're now set up and ready to contribute to FamilyPlate!

**Next Recommended Steps:**
1. Explore the codebase
2. Try making a small change
3. Read the [Contributing Guidelines](./contributing.md)
4. Pick a "good first issue" to work on

**Welcome to the FamilyPlate project!**