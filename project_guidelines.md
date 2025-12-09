# FamilyPlate Project Guidelines

## Development Rules & Standards

*Last Updated: December 29, 2024*

---

## Purpose
This document outlines the rules and standards that must be followed during the development of the FamilyPlate application. All contributors and AI assistants working on this project must adhere to these guidelines.

---

## Behavioral Rules

### Rule 1: Confirmation Required
**Always confirm before creating or modifying files**
- No file changes without explicit user approval
- Present proposed changes clearly before implementation
- Wait for confirmation before proceeding

### Rule 2: Display Rules
**Display all behavioral_rules at start of every response**
- Begin each response by showing these rules
- Ensures rules are always visible and followed
- Maintains accountability throughout development

### Rule 3: No Assumptions
**Do not make assumptions, ask user for clarification**
- When requirements are unclear, ask questions
- Never guess at user intent
- Confirm understanding before proceeding

### Rule 4: 12 Factor App Methodology
**Apply all 12 Factor App rules to your plan**
- Reference: https://12factor.net/
- Principles include:
  - Codebase: One codebase tracked in revision control
  - Dependencies: Explicitly declare and isolate dependencies
  - Config: Store config in the environment
  - Backing services: Treat backing services as attached resources
  - Build, release, run: Strictly separate build and run stages
  - Processes: Execute the app as stateless processes
  - Port binding: Export services via port binding
  - Concurrency: Scale out via the process model
  - Disposability: Maximize robustness with fast startup and graceful shutdown
  - Dev/prod parity: Keep development, staging, and production as similar as possible
  - Logs: Treat logs as event streams
  - Admin processes: Run admin/management tasks as one-off processes

### Rule 5: Sandi Metz Rules
**Apply all Sandi Metz rules to your plan**
- Reference: https://thoughtbot.com/blog/sandi-metz-rules-for-developers
- Rules include:
  - Classes can be no longer than 100 lines of code
  - Methods can be no longer than 5 lines of code
  - Pass no more than 4 parameters into a method
  - Controllers can instantiate only one object
  - Views can only know about one instance variable
  - Never directly reference another class/module from within a view

### Rule 6: No Code Stubbing (CRITICAL)
**CRITICAL: Never stub live code. Ever!**
- All functionality must be fully implemented
- No placeholder comments like "TODO: implement this"
- No dummy functions that return mock data
- Complete implementation required for every feature

### Rule 7: Code Quality Requirements
**All code requires unit testing, linting, and JSDoc comments**
- **Unit Tests**: Every function/component must have tests
- **ESLint**: All code must pass linting checks
- **JSDoc Comments**: Document all functions, parameters, and return values
- Example JSDoc format:
```javascript
/**
 * Compresses an image to reduce file size
 * @param {string} dataUrl - Base64 encoded image data
 * @returns {Promise} Compressed image as base64 string
 */
```

### Rule 8: Plan Before Execute
**Report your plan before executing any commands**
- Present complete implementation plan
- Include all files to be created/modified
- List all dependencies and changes
- Wait for approval before starting

### Rule 9: Feature Completion (CRITICAL)
**CRITICAL: Do not move to next task until current feature is fully tested and linted**
- Complete BDD (Behavior-Driven Development) tests
- Complete unit tests
- Pass all ESLint checks
- Verify functionality works as expected
- Get user confirmation before proceeding to next task

### Rule 10: Mock Only External (CRITICAL)
**CRITICAL: Mock external dependencies only, never internal code**
- Mock external APIs (Anthropic API, external services)
- Mock browser APIs if necessary (fetch, localStorage)
- Never mock your own internal functions or components
- Internal code should be tested directly

### Rule 11: Documentation Location
**Create all documentation in the root docs directory**
- Centralized documentation location: `/docs`
- Prevents documentation scattered throughout project
- Structure: `/docs/api`, `/docs/guides`, `/docs/architecture`, etc.
- Keeps root directory clean

### Rule 12: Verification (CRITICAL)
**CRITICAL: Verify all tasks executed in accordance with plan and rules**
- Before marking task complete, verify:
  - All code implemented (no stubs)
  - All tests written and passing
  - All code linted and passing
  - All documentation complete
  - All rules followed

### Rule 13: Status Report (CRITICAL)
**CRITICAL: Provide report of all tasks and statuses, proving rules followed**
- At end of each development session, provide:
  - List of completed tasks
  - Test coverage report
  - Linting status
  - Documentation status
  - Confirmation that all rules were followed
- Format as checklist with ✅/❌ indicators

### Rule 14: Quality Over Speed
**Take your time. Focus on correctness, not speed**
- Rushing leads to mistakes and bugs
- Careful, methodical approach required
- User prefers correct code over fast code
- Double-check work before presenting

---

## Code Standards

### JavaScript/React Standards
- Use ES6+ syntax
- Functional components with hooks (React)
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Destructure props and state

### File Naming
- Components: PascalCase (e.g., `FamilyPlate.jsx`)
- Utilities: camelCase (e.g., `storage.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### Git Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive but concise
- Reference rules followed in commit message when relevant

---

## Testing Requirements

### Unit Tests
- Test all functions in isolation
- Minimum 80% code coverage
- Use Jest and React Testing Library

### Behavior-Driven Development (BDD)
- Write tests that describe behavior
- Use describe/it blocks clearly
- Test user-facing functionality

### Test File Location
- Place test files adjacent to source: `Component.test.jsx`
- Or in `__tests__` directory

---

## Enforcement
These guidelines are **mandatory** for all development work on FamilyPlate. Any code that doesn't follow these rules must be refactored before merging.

Violations of CRITICAL rules (6, 9, 10, 12, 13) will require immediate correction.

---

## Updates
This document should be updated whenever new standards or rules are established. All changes must be committed to version control with clear commit messages describing the rule changes.

---

## Quick Reference Checklist

Before committing any code, verify:
- [ ] User confirmed file changes
- [ ] No assumptions made without clarification
- [ ] 12 Factor App principles applied
- [ ] Sandi Metz rules followed
- [ ] No stubbed code
- [ ] Unit tests written and passing
- [ ] Code linted and passing
- [ ] JSDoc comments added
- [ ] Plan was presented and approved
- [ ] Feature fully complete before moving on
- [ ] Only external dependencies mocked
- [ ] Documentation in `/docs` directory
- [ ] All tasks verified against plan
- [ ] Status report provided
- [ ] Quality checked (not rushed)