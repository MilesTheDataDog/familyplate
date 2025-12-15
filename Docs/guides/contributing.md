# Contributing Guidelines

Guide for contributing to FamilyPlate. Learn how to submit issues, create pull requests, and follow project standards.

*Last Updated: December 29, 2024*

---

## Table of Contents
- [Getting Started](#getting-started)
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- ✅ Read the [Getting Started Guide](./getting-started.md)
- ✅ Set up your [Development Environment](./development-setup.md)
- ✅ Read the [Project Guidelines](../../project_guidelines.md)
- ✅ Familiarized yourself with the codebase

### First Contributions

**Good First Issues:**
Look for issues labeled:
- `good first issue` - Perfect for newcomers
- `help wanted` - Community contributions welcome
- `documentation` - Documentation improvements
- `bug` - Bug fixes needed

**Where to Start:**
1. Browse open issues on GitHub
2. Comment on issue you want to work on
3. Wait for maintainer approval
4. Fork repository and start coding!

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- ✅ Being respectful of differing opinions
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what's best for the community
- ✅ Showing empathy towards others

**Unacceptable behavior includes:**
- ❌ Harassment or discriminatory language
- ❌ Trolling or insulting comments
- ❌ Personal or political attacks
- ❌ Publishing others' private information

### Enforcement

Violations may result in:
1. Warning
2. Temporary ban
3. Permanent ban

Report violations to project maintainers.

---

## How to Contribute

### Types of Contributions

#### 1. Bug Reports

**Before submitting:**
- Search existing issues to avoid duplicates
- Verify the bug exists in the latest version
- Test in multiple browsers if UI-related

**Include in bug report:**
- Clear descriptive title
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser/OS/device information
- Error messages or console logs

**Example:**
```markdown
**Bug Description:**
Recipe extraction fails when uploading PNG images

**Steps to Reproduce:**
1. Click "Add Recipe"
2. Upload PNG image
3. Click "Extract Recipe"

**Expected:**
Recipe should be extracted

**Actual:**
Shows "Invalid image format" error

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop
```

#### 2. Feature Requests

**Before suggesting:**
- Check if feature already requested
- Consider if fits project scope
- Think about implementation complexity

**Include in feature request:**
- Clear use case
- Expected behavior
- Mockups/examples if applicable
- Why this benefits users

**Example:**
```markdown
**Feature:**
Batch upload multiple recipes

**Use Case:**
Users want to digitize multiple recipe cards at once

**Proposed Solution:**
Allow selecting multiple images in file picker

**Benefits:**
- Saves time for users with many recipes
- Improves user experience
```

#### 3. Code Contributions

See [Development Workflow](#development-workflow) below.

#### 4. Documentation

**Documentation needs:**
- Fixing typos or errors
- Clarifying confusing sections
- Adding missing information
- Improving examples
- Translating documentation

**Process:**
1. Find documentation file in `/docs`
2. Make changes
3. Submit pull request

---

## Development Workflow

### 1. Fork and Clone

```bash
# Fork repository on GitHub (click Fork button)

# Clone your fork
git clone https://github.com/YOUR_USERNAME/familyplate.git
cd familyplate

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/familyplate.git
```

### 2. Create Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation only
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 3. Make Changes

**Follow project guidelines:**
- See [project_guidelines.md](../../project_guidelines.md)
- Follow [Coding Standards](#coding-standards)
- Write tests for new code
- Update documentation

**Commit frequently:**
```bash
git add .
git commit -m "Add recipe sharing feature"
```

### 4. Test Your Changes

```bash
# Run tests
npm test

# Run linter
npm run lint

# Test in browser
npm start

# Build production version
npm run build
```

### 5. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create Pull Request on GitHub.

---

## Coding Standards

### JavaScript/React Style

**Follow these principles:**

#### Component Structure
```javascript
import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 * @returns {JSX.Element} Component
 */
const MyComponent = ({ title, onAction }) => {
  // 1. Hooks at top
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Effects here
  }, [dependencies]);
  
  // 2. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 3. Helper functions
  const formatData = (data) => {
    return data.formatted;
  };
  
  // 4. Render
  return (
    <div className="container">
      <h1>{title}</h1>
      <button onClick={handleClick}>Action</button>
    </div>
  );
};

export default MyComponent;
```

#### Variable Naming
```javascript
// Use descriptive names
const recipeList = []; // Good
const arr = []; // Bad

// Use camelCase
const firstName = 'John'; // Good
const first_name = 'John'; // Bad

// Boolean variables
const isLoading = true; // Good
const loading = true; // Acceptable

// Constants
const MAX_RECIPES = 100; // Good
const maxRecipes = 100; // Bad for constants
```

#### Function Style
```javascript
// Arrow functions for callbacks
const items = array.map(item => item.value);

// Named functions for main logic
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Async/await for promises
const fetchData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

### CSS/Tailwind

**Tailwind utility classes:**
```jsx
// Good - organized, readable
<div className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white shadow-md
  hover:shadow-lg transition-shadow
">

// Bad - disorganized
<div className="flex bg-white p-4 items-center shadow-md rounded-lg justify-between hover:shadow-lg transition-shadow">
```

**Responsive design:**
```jsx
<div className="
  text-sm sm:text-base md:text-lg
  p-2 sm:p-4 md:p-6
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
">
```

### Testing Standards

**Test file naming:**
```
Component.jsx → Component.test.jsx
utils.js → utils.test.js
```

**Test structure:**
```javascript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should do something', () => {
      // Arrange
      const input = setupInput();
      
      // Act
      const result = functionUnderTest(input);
      
      // Assert
      expect(result).toBe(expected);
    });
  });
});
```

### Documentation Standards

**JSDoc comments:**
```javascript
/**
 * Extracts recipe from image
 * @param {string} imageData - Base64 encoded image
 * @param {Object} options - Extraction options
 * @param {number} options.maxTokens - Max tokens for AI
 * @returns {Promise<Object>} Extracted recipe object
 * @throws {Error} If extraction fails
 */
const extractRecipe = async (imageData, options = {}) => {
  // Implementation
};
```

**Inline comments:**
```javascript
// Good - explains WHY
// Using exponential backoff to handle rate limits
const delay = baseDelay * Math.pow(2, attempt);

// Bad - explains WHAT (code already shows this)
// Set delay variable
const delay = baseDelay * Math.pow(2, attempt);
```

---

## Pull Request Process

### Before Submitting PR

**Checklist:**
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Tests passing locally
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

### Creating Pull Request

**PR Title Format:**
```
[Type] Brief description

Examples:
[Feature] Add recipe sharing functionality
[Fix] Resolve image upload bug on iOS
[Docs] Update API documentation
[Refactor] Simplify storage logic
```

**PR Description Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Added recipe sharing button
- Implemented share API integration
- Updated UI for share modal

## Testing
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on mobile

## Screenshots
[If applicable]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Code Review Process

**What reviewers look for:**
1. Code quality and readability
2. Test coverage
3. Performance implications
4. Security concerns
5. Documentation completeness

**Responding to feedback:**
- Be respectful and professional
- Ask questions if unclear
- Make requested changes
- Push updates to same branch
- Respond to comments

**Getting PR merged:**
1. Address all review comments
2. Ensure all checks pass
3. Wait for maintainer approval
4. Maintainer will merge

---

## Issue Guidelines

### Creating Issues

**Issue title:**
- Clear and descriptive
- Include issue type prefix

**Examples:**
```
[Bug] Recipe extraction fails on Safari
[Feature] Add dark mode support
[Docs] Clarify deployment steps
```

**Issue body:**
Use appropriate template (bug, feature, documentation)

### Working on Issues

**Claiming an issue:**
1. Comment "I'd like to work on this"
2. Wait for maintainer assignment
3. Don't work on unassigned issues

**Communication:**
- Update issue if you need help
- Comment if taking longer than expected
- Comment if you can no longer work on it

---

## Git Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat: add recipe sharing functionality

Implements native share API for sharing recipes with friends.
Includes share button on recipe view screen.

Closes #123


fix: resolve image compression on iOS

Image compression was failing on iOS due to canvas size limits.
Now splits large images into tiles for processing.

Fixes #456


docs: update deployment guide

Adds section on environment variable configuration.
Clarifies Vercel setup steps.
```

### Commit Best Practices

**DO:**
- ✅ Commit frequently
- ✅ Write clear messages
- ✅ Commit related changes together
- ✅ Test before committing

**DON'T:**
- ❌ Commit broken code
- ❌ Commit with "WIP" or "test" messages
- ❌ Commit unrelated changes together
- ❌ Commit sensitive data

---

## Community

### Getting Help

**Resources:**
- [Documentation](../README.md)
- [GitHub Discussions](https://github.com/owner/familyplate/discussions)
- [Issues](https://github.com/owner/familyplate/issues)

**Before asking:**
1. Search existing issues/discussions
2. Check documentation
3. Try troubleshooting steps

**When asking:**
- Be specific
- Provide context
- Include relevant code/errors
- Show what you've tried

### Recognizing Contributors

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README

Thank you for contributing to FamilyPlate! 🎉

---

## Related Documentation

- [Getting Started](./getting-started.md)
- [Development Setup](./development-setup.md)
- [Testing Guide](./testing.md)
- [Project Guidelines](../../project_guidelines.md)