# Development Setup

Complete guide to setting up your local development environment for FamilyPlate.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [System Requirements](#system-requirements)
- [Installing Prerequisites](#installing-prerequisites)
- [Project Setup](#project-setup)
- [Environment Configuration](#environment-configuration)
- [IDE Setup](#ide-setup)
- [Development Tools](#development-tools)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Hardware Requirements

**Minimum:**
- CPU: Dual-core processor
- RAM: 4GB
- Storage: 2GB free space
- Internet: Required for API calls

**Recommended:**
- CPU: Quad-core processor
- RAM: 8GB or more
- Storage: 5GB free space
- Internet: Broadband connection

### Supported Operating Systems

- ✅ Windows 10/11
- ✅ macOS 10.15 (Catalina) or later
- ✅ Linux (Ubuntu 20.04+, Debian, Fedora)

---

## Installing Prerequisites

### Node.js and npm

Node.js is required to run FamilyPlate. It includes npm (Node Package Manager).

#### Windows

**Option 1: Official Installer (Recommended)**
1. Visit https://nodejs.org
2. Download the LTS version (Long Term Support)
3. Run the installer
4. Follow installation wizard
5. Restart your terminal

**Option 2: Using Chocolatey**
```powershell
choco install nodejs-lts
```

#### macOS

**Option 1: Official Installer**
1. Visit https://nodejs.org
2. Download macOS installer
3. Run and follow prompts

**Option 2: Using Homebrew (Recommended)**
```bash
brew install node
```

#### Linux (Ubuntu/Debian)

```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Verify Installation

```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
```

---

### Git

Git is required for version control and cloning the repository.

#### Windows

**Download and Install:**
1. Visit https://git-scm.com/download/win
2. Download the installer
3. Run installer with default options
4. Select "Git from the command line and also from 3rd-party software"

**Using Chocolatey:**
```powershell
choco install git
```

#### macOS

**Pre-installed** on macOS (Xcode Command Line Tools)

Or install via Homebrew:
```bash
brew install git
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install git

# Fedora
sudo dnf install git

# Arch
sudo pacman -S git
```

#### Configure Git

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

### Code Editor

While any text editor works, **VS Code** is highly recommended.

#### Visual Studio Code

**Install:**
1. Visit https://code.visualstudio.com
2. Download for your OS
3. Install and launch

**Essential Extensions:**
```bash
# Install via command line (optional)
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
```

**Or install manually:**
1. Open VS Code
2. Click Extensions (Ctrl/Cmd + Shift + X)
3. Search and install:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier - Code formatter
   - GitLens

---

## Project Setup

### Clone Repository

```bash
# Via HTTPS
git clone https://github.com/YOUR_USERNAME/familyplate.git

# Or via SSH (if configured)
git clone git@github.com:YOUR_USERNAME/familyplate.git

# Navigate to project
cd familyplate
```

### Install Dependencies

```bash
# Install all project dependencies
npm install
```

**This installs:**
- React 18.2.0
- React DOM 18.2.0
- React Scripts 5.0.1
- Lucide React 0.263.1
- Tailwind CSS 3.3.0
- PostCSS 8.4.24
- Autoprefixer 10.4.14

**Expected output:**
```
added 1459 packages, and audited 1460 packages in 45s

245 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### Verify Installation

```bash
# Check if packages installed correctly
npm list --depth=0

# Should show main dependencies
├── lucide-react@0.263.1
├── react-dom@18.2.0
├── react-scripts@5.0.1
├── react@18.2.0
└── ...
```

---

## Environment Configuration

### API Keys

FamilyPlate requires an Anthropic API key for recipe extraction.

#### Obtain Anthropic API Key

1. **Sign up** at https://console.anthropic.com
2. **Navigate to** Settings → API Keys
3. **Click** "Create Key"
4. **Copy** the key (starts with `sk-ant-api03-`)
5. **Save** it securely

#### Create Environment File

**Create `.env.local` in project root:**

```bash
# Windows (Command Prompt)
type nul > .env.local

# Windows (PowerShell)
New-Item .env.local

# macOS/Linux
touch .env.local
```

**Add your API key:**
```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

#### Important Security Notes

- ⚠️ **NEVER commit `.env.local` to Git**
- ⚠️ Already in `.gitignore`
- ⚠️ Never share your API key
- ⚠️ Don't include in screenshots
- ⚠️ Rotate keys every 90 days

### Verify Environment Setup

```javascript
// Test in browser console (after starting app)
fetch('/api/extract-recipe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    image: 'test',
    type: 'image/jpeg',
    prompt: 'test'
  })
})
.then(r => r.json())
.then(d => console.log(d));

// If configured correctly, you'll get a response (even if error due to invalid data)
// If not configured: "ANTHROPIC_API_KEY not defined" error
```

---

## IDE Setup

### VS Code Configuration

#### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*=\\s*['\"`]([^'\"`]*)['\"`]", "([^'\"`]*)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

#### Launch Configuration

Create `.vscode/launch.json` for debugging:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

#### Recommended Keybindings

Create `.vscode/keybindings.json`:

```json
[
  {
    "key": "ctrl+shift+f",
    "command": "editor.action.formatDocument"
  }
]
```

### Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

### ESLint Configuration

Already included via `react-scripts`, but can customize:

```javascript
// .eslintrc.js (optional customization)
module.exports = {
  extends: ['react-app'],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
```

---

## Development Tools

### Browser DevTools

**Chrome DevTools** (Recommended)

**Essential Tabs:**
- **Elements**: Inspect DOM and styles
- **Console**: View logs and errors
- **Network**: Monitor API calls
- **Application**: Inspect localStorage
- **Sources**: Debug JavaScript

**Shortcuts:**
- Open DevTools: `F12` or `Ctrl/Cmd + Shift + I`
- Console: `Ctrl/Cmd + Shift + J`
- Inspect Element: `Ctrl/Cmd + Shift + C`

### React Developer Tools

**Install:**
1. Chrome Web Store: Search "React Developer Tools"
2. Add to Chrome
3. Restart browser

**Features:**
- Inspect component hierarchy
- View props and state
- Profile performance
- Debug hooks

**Usage:**
```
1. Open DevTools
2. Click "Components" tab
3. Select component
4. View props, state, hooks
```

### Git GUI Tools (Optional)

While command line is recommended, GUI tools can be helpful:

**GitKraken** (Cross-platform)
- Visual commit history
- Drag-and-drop branching
- Merge conflict resolution

**GitHub Desktop** (Windows/Mac)
- Simple interface
- GitHub integration
- Perfect for beginners

**SourceTree** (Windows/Mac)
- Advanced features
- Free from Atlassian

---

## Development Workflow

### Starting Development

```bash
# Start development server
npm start
```

**What happens:**
1. Webpack starts bundling
2. Development server starts on port 3000
3. Browser opens automatically
4. Hot module replacement enabled
5. ESLint runs automatically

**Expected output:**
```
Compiled successfully!

You can now view familyplate in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

### Making Changes

**Development Cycle:**
```
1. Edit code in VS Code
   ↓
2. Save file (Ctrl/Cmd + S)
   ↓
3. Watch terminal for compilation
   ↓
4. Browser auto-refreshes
   ↓
5. Test changes
   ↓
6. Repeat
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --watchAll=false

# Run tests with coverage
npm test -- --coverage
```

### Building for Production

```bash
# Create optimized production build
npm run build
```

**Output:**
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  50.23 KB  build/static/js/main.abc123.js
  5.12 KB   build/static/css/main.def456.css

The build folder is ready to be deployed.
```

---

## Troubleshooting

### Common Issues

#### Port 3000 Already in Use

**Error:**
```
Something is already running on port 3000
```

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 npm start
```

#### Module Not Found

**Error:**
```
Module not found: Can't resolve 'xyz'
```

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Git Issues

**Error:**
```
fatal: not a git repository
```

**Solution:**
```bash
# Initialize git
git init
git remote add origin https://github.com/YOUR_USERNAME/familyplate.git
```

#### ESLint Errors

**Error:**
```
Failed to load config "react-app" to extend from
```

**Solution:**
```bash
# Reinstall react-scripts
npm install react-scripts@latest
```

### Getting Help

**Before asking for help:**
1. ✅ Check error message carefully
2. ✅ Search error on Google/Stack Overflow
3. ✅ Check GitHub issues
4. ✅ Review relevant documentation
5. ✅ Try basic troubleshooting steps

**When asking for help, provide:**
- Operating system and version
- Node and npm versions
- Exact error message
- Steps to reproduce
- What you've already tried

---

## Next Steps

Once your development environment is set up:

1. **Read** [Getting Started Guide](./getting-started.md)
2. **Explore** the codebase
3. **Make** your first change
4. **Read** [Contributing Guidelines](./contributing.md)
5. **Pick** a task to work on

---

## Quick Reference

### Essential Commands

```bash
# Project management
npm install           # Install dependencies
npm start             # Start dev server
npm test              # Run tests
npm run build         # Production build

# Git commands
git status            # Check status
git add .             # Stage all changes
git commit -m "msg"   # Commit changes
git push              # Push to remote
git pull              # Pull from remote

# Cleanup
rm -rf node_modules   # Delete dependencies
npm cache clean --force  # Clear npm cache
```

### Useful Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Save | Ctrl + S | Cmd + S |
| Find | Ctrl + F | Cmd + F |
| Replace | Ctrl + H | Cmd + H |
| Terminal | Ctrl + ` | Cmd + ` |
| Command Palette | Ctrl + Shift + P | Cmd + Shift + P |

---

## Related Documentation

- [Getting Started](./getting-started.md)
- [Contributing Guidelines](./contributing.md)
- [Deployment Guide](./deployment.md)
- [Testing Guide](./testing.md)