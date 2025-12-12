# Architectural Decision Records (ADR)

## Overview

This document records significant architectural and technical decisions made during the development of FamilyPlate. Each decision includes context, options considered, rationale, and consequences.

**Format:** Based on [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)

**Version:** 1.0.0  
**Last Updated:** December 10, 2025

---

## Table of Contents

1. [ADR-001: Use React for Web Application](#adr-001-use-react-for-web-application)
2. [ADR-002: Use Anthropic Claude for Recipe Extraction](#adr-002-use-anthropic-claude-for-recipe-extraction)
3. [ADR-003: Use localStorage for Data Persistence](#adr-003-use-localstorage-for-data-persistence)
4. [ADR-004: Use Tailwind CSS for Styling](#adr-004-use-tailwind-css-for-styling)
5. [ADR-005: Deploy on Vercel](#adr-005-deploy-on-vercel)
6. [ADR-006: Store Images as Base64](#adr-006-store-images-as-base64)
7. [ADR-007: Use Vercel Serverless Functions](#adr-007-use-vercel-serverless-functions)
8. [ADR-008: Migrate to React Native](#adr-008-migrate-to-react-native)
9. [ADR-009: Use Expo for React Native](#adr-009-use-expo-for-react-native)
10. [ADR-010: Use SQLite for Mobile Storage](#adr-010-use-sqlite-for-mobile-storage)

---

## ADR-001: Use React for Web Application

**Date:** November 15, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Product Owner

### Context

We need to choose a frontend framework for building the FamilyPlate web application. The app requires:
- Dynamic UI with state management
- Component reusability
- Fast development iteration
- Good mobile responsiveness
- Future migration path to native mobile

### Decision

We will use **React 18** as the frontend framework.

### Options Considered

1. **React**
   - Pros: Large ecosystem, component reusability, good mobile support, can migrate to React Native
   - Cons: Requires build tooling, learning curve for beginners

2. **Vue.js**
   - Pros: Simpler syntax, great documentation, good performance
   - Cons: Smaller ecosystem, no clear native migration path

3. **Vanilla JavaScript**
   - Pros: No framework overhead, full control
   - Cons: Slow development, no component reuse, harder to maintain

4. **Svelte**
   - Pros: No virtual DOM, smaller bundle size, simple syntax
   - Cons: Smaller ecosystem, less mature, no native mobile path

### Rationale

React was chosen because:
1. **Ecosystem**: Largest component library and community support
2. **Migration Path**: Clear path to React Native for mobile apps
3. **Developer Experience**: Hot reload, component dev tools, extensive documentation
4. **Performance**: Virtual DOM provides good performance for our use case
5. **Code Reusability**: 60-70% code can be reused in React Native migration

### Consequences

**Positive:**
- Fast development with reusable components
- Large community for problem-solving
- Clear migration path to React Native
- Good tooling and debugging support

**Negative:**
- Larger bundle size than Svelte
- Requires understanding of React patterns
- Additional build configuration needed

**Neutral:**
- Team needs to maintain React knowledge
- Regular React updates to follow

---

## ADR-002: Use Anthropic Claude for Recipe Extraction

**Date:** November 18, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Product Owner

### Context

We need an AI solution to extract recipe information from photos of recipe cards, cookbook pages, or handwritten notes. The solution must:
- Handle various image qualities
- Extract structured data (title, ingredients, instructions)
- Support multiple formats (printed, handwritten)
- Be cost-effective
- Have reliable API

### Decision

We will use **Anthropic Claude (Sonnet 4.5)** with vision capabilities for recipe extraction.

### Options Considered

1. **Anthropic Claude**
   - Pros: Excellent vision capabilities, structured output, great with handwriting, API reliability
   - Cons: Cost per request, rate limits

2. **OpenAI GPT-4 Vision**
   - Pros: Strong vision model, good structured output
   - Cons: Higher cost, less reliable with handwriting

3. **Google Cloud Vision + Custom NLP**
   - Pros: Specialized OCR, lower cost per image
   - Cons: Requires two-step process (OCR then parsing), less accurate on handwriting

4. **AWS Textract + Comprehend**
   - Pros: Good OCR, AWS ecosystem integration
   - Cons: Complex multi-service setup, higher latency

5. **Open Source (Tesseract + LLaMA)**
   - Pros: No API costs, full control
   - Cons: Requires hosting, lower accuracy, maintenance burden

### Rationale

Claude was chosen because:
1. **Accuracy**: Superior performance on handwritten and low-quality images
2. **Single API**: One request handles both image analysis and data structuring
3. **Reliability**: High uptime, consistent performance
4. **JSON Output**: Can request structured JSON directly
5. **Cost-Effectiveness**: Reasonable pricing for our expected volume
6. **Developer Experience**: Simple API, good documentation

### Consequences

**Positive:**
- High-quality recipe extraction
- Simple integration (single API call)
- Handles edge cases well (handwriting, stains, etc.)
- Reliable service uptime

**Negative:**
- Recurring API costs ($10-15 per 1000 requests)
- Rate limits may require queuing
- Dependency on external service

**Mitigation:**
- Implement request caching
- Add rate limit handling
- Consider batch processing
- Monitor costs and usage

**Cost Analysis:**
- Estimated 10,000 extractions/month at scale
- Cost: ~$150/month
- Alternative (GPT-4V): ~$200/month
- Self-hosted: ~$500/month (hosting + maintenance)

---

## ADR-003: Use localStorage for Data Persistence

**Date:** November 20, 2025  
**Status:** Accepted (with planned migration)  
**Deciders:** Technical Lead

### Context

We need a simple, reliable way to persist recipe data in the web application. Requirements:
- Client-side storage (no backend yet)
- Synchronous API for simplicity
- ~10MB capacity for MVP
- Works offline

### Decision

We will use **browser localStorage** with a Promise-based wrapper for the initial web application.

### Options Considered

1. **localStorage**
   - Pros: Simple API, synchronous, ~10MB capacity, universal browser support
   - Cons: Synchronous blocks UI, limited capacity, strings only, can be cleared by user

2. **IndexedDB**
   - Pros: Asynchronous, larger capacity (50MB+), supports binary data
   - Cons: Complex API, overkill for MVP, harder to debug

3. **Backend Database**
   - Pros: Unlimited storage, sync across devices, backups
   - Cons: Requires server infrastructure, adds complexity, costs money

4. **Service Worker + Cache API**
   - Pros: Offline-first, PWA support, good for assets
   - Cons: Complex for structured data, not designed for app state

### Rationale

localStorage was chosen because:
1. **Simplicity**: Minimal code to implement
2. **Sufficient for MVP**: 10MB handles 50-100 recipes with images
3. **No Backend Required**: Reduces infrastructure costs and complexity
4. **Fast Development**: Simple Promise wrapper provides good DX
5. **Migration Path**: Can migrate to IndexedDB or backend later

### Consequences

**Positive:**
- Fast implementation (1 day)
- No infrastructure costs
- Works offline by default
- Simple debugging (visible in DevTools)

**Negative:**
- Limited storage capacity (~10MB)
- Can be cleared by browser
- Synchronous operations block UI (mitigated by wrapper)
- No cross-device sync

**Migration Plan:**
- Monitor storage usage
- When approaching limits, migrate to IndexedDB
- Eventually add backend sync for cross-device support
- Estimated migration: Q2 2026

**Technical Debt:**
- Storage abstraction layer allows easy migration
- Usage metrics will guide timing
- IndexedDB migration ~2 weeks of work

---

## ADR-004: Use Tailwind CSS for Styling

**Date:** November 22, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, UI Designer

### Context

We need a styling solution that enables rapid UI development while maintaining consistency and responsive design. Requirements:
- Fast iteration
- Mobile-first responsive design
- Minimal custom CSS
- Good performance
- Easy to maintain

### Decision

We will use **Tailwind CSS 3** as our styling framework.

### Options Considered

1. **Tailwind CSS**
   - Pros: Utility-first, fast development, mobile-first, purges unused CSS
   - Cons: Verbose HTML, learning curve, large initial stylesheet

2. **CSS Modules**
   - Pros: Scoped styles, no naming conflicts, standard CSS
   - Cons: Slower development, more files, inconsistent patterns

3. **Styled Components**
   - Pros: CSS-in-JS, dynamic styling, component-scoped
   - Cons: Runtime overhead, larger bundle, harder to debug

4. **Bootstrap**
   - Pros: Complete component library, familiar
   - Cons: Heavy framework, looks "Bootstrap-y", harder to customize

5. **Plain CSS**
   - Pros: No dependencies, full control, standards-based
   - Cons: Slow development, maintainability issues, no utility classes

### Rationale

Tailwind was chosen because:
1. **Development Speed**: Build UIs 2-3x faster with utility classes
2. **Consistency**: Design system built-in (spacing, colors, typography)
3. **Responsive Design**: Mobile-first breakpoints out of the box
4. **Performance**: PurgeCSS removes unused styles (final bundle: ~10KB)
5. **No Naming**: Eliminates CSS naming decisions and conflicts
6. **Customization**: Easy to extend and theme

### Consequences

**Positive:**
- Very fast UI development
- Consistent design across app
- Small production bundle
- Excellent mobile responsiveness
- Easy to maintain and iterate

**Negative:**
- HTML becomes more verbose
- Initial learning curve for utility classes
- Large development stylesheet (~3MB, not in production)

**Best Practices Established:**
- Extract common patterns to components
- Use `@apply` for repeated patterns
- Document custom utilities in theme config
- Maintain consistent spacing scale

**Performance Impact:**
- Development: ~3MB stylesheet (not shipped)
- Production: ~10-15KB (after purge)
- No runtime JavaScript
- Critical CSS inlined

---

## ADR-005: Deploy on Vercel

**Date:** November 25, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, DevOps

### Context

We need a hosting platform for the web application that provides:
- Fast global deployment
- Automatic SSL
- Serverless functions for API calls
- Simple CI/CD
- Low cost for MVP stage

### Decision

We will deploy FamilyPlate on **Vercel**.

### Options Considered

1. **Vercel**
   - Pros: Zero-config, serverless functions, fast CDN, free tier, GitHub integration
   - Cons: Vendor lock-in, function timeouts (10s), cold starts

2. **Netlify**
   - Pros: Similar to Vercel, good free tier, edge functions
   - Cons: Slower builds, less React-optimized, smaller ecosystem

3. **AWS (S3 + CloudFront + Lambda)**
   - Pros: Full control, scalable, comprehensive services
   - Cons: Complex setup, more expensive, requires DevOps expertise

4. **Traditional VPS (DigitalOcean, Linode)**
   - Pros: Full control, predictable costs, no cold starts
   - Cons: Manual setup, maintenance burden, no serverless functions

5. **Firebase Hosting**
   - Pros: Good free tier, integrates with Firebase services
   - Cons: Slower deployment, less flexible, Google ecosystem lock-in

### Rationale

Vercel was chosen because:
1. **Zero Configuration**: Deploy with `git push` (no config files)
2. **Serverless Functions**: Built-in API routes for Anthropic integration
3. **Performance**: Global CDN with edge caching
4. **Developer Experience**: Preview deployments, rollback, analytics
5. **Cost**: Free tier sufficient for MVP (100GB bandwidth, unlimited requests)
6. **React Optimization**: Built by Next.js team, optimized for React

### Consequences

**Positive:**
- Instant deployments (< 1 minute)
- Preview URLs for every PR
- Automatic HTTPS and CDN
- Built-in analytics
- Minimal DevOps overhead

**Negative:**
- Vendor lock-in (mitigated by standard web app)
- Function timeout limits (10s for free tier, 60s for paid)
- Pricing can increase with scale

**Cost Structure:**
- Free tier: 100GB bandwidth, 100GB-hrs compute
- Expected usage: ~10GB/month (well within free tier)
- Scaling: $20/month for Pro tier if needed

**Migration Path:**
If we outgrow Vercel:
1. Move static assets to S3 + CloudFront
2. Run functions on AWS Lambda
3. Estimated migration effort: 1-2 weeks

---

## ADR-006: Store Images as Base64

**Date:** November 28, 2025  
**Status:** Accepted (temporary)  
**Deciders:** Technical Lead

### Context

Recipe images need to be stored and displayed in the application. We must decide on storage format and location. Constraints:
- No backend server (yet)
- Must work offline
- Need reasonable quality
- Storage limits (~10MB localStorage)

### Decision

We will store images as **base64-encoded JPEG** strings in localStorage with client-side compression.

### Options Considered

1. **Base64 in localStorage**
   - Pros: Simple, works offline, no backend needed, synchronous access
   - Cons: ~33% size increase, storage limits, slower parse times

2. **IndexedDB with Blob**
   - Pros: No base64 overhead, faster, more storage
   - Cons: Complex API, asynchronous, harder to debug

3. **Cloud Storage (S3, Firebase)**
   - Pros: Unlimited storage, fast CDN delivery
   - Cons: Requires backend, internet dependency, costs money

4. **File System API (Chrome only)**
   - Pros: Native file storage, no size limits
   - Cons: Browser support limited, complex permissions

### Rationale

Base64 localStorage was chosen because:
1. **Simplicity**: One line to store/retrieve
2. **Offline-First**: No network dependency
3. **MVP-Appropriate**: Sufficient for 50-100 recipes
4. **Compression**: We compress to 1200px max width, 80% quality → ~50-150KB per image
5. **No Backend**: Reduces infrastructure complexity
6. **Migration Path**: Can move to proper storage later

### Consequences

**Positive:**
- Dead simple implementation (< 50 lines)
- Works completely offline
- No infrastructure costs
- Immediate data availability

**Negative:**
- Base64 encoding adds 33% overhead
- Storage limited to ~10MB (60-70 recipes with images)
- Slower to parse large images
- Can't share images easily

**Mitigation Strategies:**
- Aggressive compression (1200px max, 80% quality)
- Warn user when approaching storage limits
- Provide export/import for backup

**Future Migration (Q3 2026):**
- Move to IndexedDB with Blob storage
- Or backend storage with CDN
- Estimated effort: 1 week

**Performance Impact:**
- Load time: +50-100ms per image (acceptable)
- Storage efficiency: 66% (due to base64 encoding)
- Compression effectiveness: 95% reduction from original

---

## ADR-007: Use Vercel Serverless Functions

**Date:** December 1, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Security Advisor

### Context

The Anthropic API requires an API key that cannot be exposed in client-side code. We need a secure way to make API calls without building a full backend server. Requirements:
- Secure API key storage
- Low latency
- Simple deployment
- Cost-effective
- Scalable

### Decision

We will use **Vercel Serverless Functions** as a proxy for Anthropic API calls.

### Options Considered

1. **Vercel Serverless Functions**
   - Pros: Zero config, auto-scaling, integrated with hosting, simple deployment
   - Cons: 10s timeout (free tier), cold starts, vendor lock-in

2. **AWS Lambda**
   - Pros: Mature, scalable, configurable, low cost
   - Cons: Complex setup, separate deployment, requires API Gateway

3. **Traditional Backend (Express)**
   - Pros: Full control, no timeouts, can add features
   - Cons: Requires server, maintenance, hosting costs ($20-50/month)

4. **Client-Side with CORS Proxy**
   - Pros: No backend needed
   - Cons: Insecure (exposes API key), unreliable, rate limits

5. **Firebase Cloud Functions**
   - Pros: Good free tier, scalable
   - Cons: Slower cold starts, Google lock-in, separate deployment

### Rationale

Vercel Serverless Functions chosen because:
1. **Security**: API key stored as environment variable, never exposed
2. **Simplicity**: Same deployment as main app
3. **Cost**: Free tier sufficient (100GB-hrs/month)
4. **Performance**: Low cold start latency (<1s)
5. **Developer Experience**: Local development with `vercel dev`
6. **Integration**: Seamless with Vercel hosting

### Consequences

**Positive:**
- Secure API key management
- Zero infrastructure maintenance
- Scales automatically
- Fast deployment (included in main deploy)

**Negative:**
- 10s timeout limit (sufficient for our use case)
- Cold starts add 200-500ms latency
- Vendor lock-in to Vercel

**Security Measures:**
1. API key stored in Vercel environment variables
2. CORS restricted to our domain
3. Rate limiting implemented
4. Request validation

**Performance:**
- Cold start: ~500ms (acceptable for background operation)
- Warm request: ~50ms overhead
- Total API time: 2-5s (dominated by Anthropic API)

**Cost Analysis:**
- Expected usage: 1,000 requests/month MVP
- Compute time: ~5s per request × 1,000 = 5,000s = 1.4 GB-hrs
- Free tier: 100 GB-hrs/month
- Conclusion: Well within free tier

---

## ADR-008: Migrate to React Native

**Date:** December 5, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Product Owner, Stakeholders

### Context

User research shows:
- 85% of users access recipes while cooking (mobile context)
- Users want offline access
- Native camera integration is desired
- Current web app feels less polished on mobile

We need to decide whether to enhance the web app or build native mobile apps.

### Decision

We will **migrate to React Native** to build native iOS and Android applications while maintaining the web version for desktop users.

### Options Considered

1. **React Native Migration**
   - Pros: Reuse 60-70% code, native performance, offline-first, full device access
   - Cons: Longer development time (20 weeks), higher cost ($80-120k), app store distribution

2. **Progressive Web App (PWA)**
   - Pros: Enhance existing web app, offline support, faster/cheaper
   - Cons: Still web limitations, poor iOS support, no native feel, limited device access

3. **Keep Web-Only**
   - Pros: Cheapest, fastest, already done
   - Cons: Doesn't solve user problems, competitive disadvantage, poor mobile UX

4. **Native Development (Swift + Kotlin)**
   - Pros: Best performance, full native features, platform-optimized
   - Cons: 2x development cost, can't reuse code, 2x maintenance, 40+ weeks

5. **Flutter**
   - Pros: Fast development, good performance, single codebase
   - Cons: Can't reuse React code, different ecosystem, Dart language, less mature

### Rationale

React Native was chosen because:
1. **Code Reusability**: 60-70% of existing React code can be reused
2. **Native Experience**: True native UI and performance
3. **Offline-First**: Full offline capabilities with SQLite
4. **Device Integration**: Camera, photos, sharing, notifications
5. **Developer Productivity**: Leverages existing React skills
6. **Cost-Effective**: Cheaper than pure native, better ROI than PWA
7. **App Store Presence**: Increases trust and discoverability
8. **Future-Proof**: Mobile-first is long-term strategy

### Consequences

**Positive:**
- Superior mobile user experience
- Full offline functionality
- Native device feature access
- App store distribution
- Higher user trust and engagement
- Competitive parity with other recipe apps

**Negative:**
- Significant development investment (20 weeks, $80-120k)
- Slower update cycle (app store review)
- Must maintain two platforms (iOS + Android)
- Some platform-specific code required

**Risk Mitigation:**
1. **Cost**: Phased development reduces risk
2. **Timeline**: 20-week detailed plan with milestones
3. **Quality**: Extensive testing and beta program
4. **Maintenance**: Shared codebase minimizes overhead

**Migration Timeline:**
- Q2 2026: Development (weeks 1-13)
- Q3 2026: Testing & Launch (weeks 14-20)
- Web version maintained indefinitely for desktop users

**Success Criteria:**
- 1,000+ downloads in first month
- 4.0+ star rating
- <1% crash rate
- 60%+ 30-day retention

---

## ADR-009: Use Expo for React Native

**Date:** December 8, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Mobile Developer

### Context

We've decided to build React Native apps, but need to choose between bare React Native or Expo framework. Considerations:
- Development speed
- Native module access
- Build complexity
- OTA updates
- Long-term flexibility

### Decision

We will use **Expo SDK 49+** with EAS Build for the React Native applications.

### Options Considered

1. **Expo (Managed Workflow)**
   - Pros: Fast setup, pre-built modules, OTA updates, EAS Build, easier development
   - Cons: Limited customization, some native modules unavailable, Expo dependency

2. **Bare React Native**
   - Pros: Full control, any native module, no Expo dependency, smaller bundle
   - Cons: Complex setup, manual linking, no OTA updates, harder builds

3. **Expo (Bare Workflow)**
   - Pros: Expo tools + full native access, flexibility
   - Cons: More complex than managed, loses some Expo benefits

4. **Ignite CLI (Boilerplate)**
   - Pros: Opinionated structure, good patterns
   - Cons: Still bare React Native, no Expo benefits, locked into patterns

### Rationale

Expo was chosen because:
1. **Development Speed**: 30-40% faster than bare React Native
2. **Pre-Built Modules**: Camera, image picker, file system all ready
3. **OTA Updates**: Push fixes without app store review (critical for quick fixes)
4. **EAS Build**: Cloud builds eliminate local environment issues
5. **Sufficient for Our Needs**: All required features available in Expo
6. **Future Flexibility**: Can eject to bare if needed (unlikely)

### Consequences

**Positive:**
- Faster development (estimated 4-6 weeks saved)
- Simpler build process
- OTA updates save review time
- Better developer experience
- Easier onboarding for new developers

**Negative:**
- Slightly larger app size (~5-10MB)
- Expo SDK dependency (updated quarterly)
- Limited to Expo-compatible native modules
- Monthly cost for EAS Build ($29/month for priority)

**Module Analysis:**
Required modules all available in Expo:
- ✅ expo-camera
- ✅ expo-image-picker
- ✅ expo-file-system
- ✅ expo-sharing
- ✅ AsyncStorage
- ✅ expo-sqlite
- ✅ expo-haptics
- ✅ expo-notifications (optional)

**Cost-Benefit:**
- Development time saved: 4-6 weeks (~$16-24k value)
- EAS Build cost: $29/month × 12 = $348/year
- ROI: Immediate and significant

**Ejection Plan (if ever needed):**
- Expo allows ejecting to bare workflow
- Estimated effort: 1-2 weeks
- Keeps all code, loses Expo conveniences
- Would only eject if critical native module needed

---

## ADR-010: Use SQLite for Mobile Storage

**Date:** December 10, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Mobile Developer

### Context

React Native apps need robust local storage for recipes that works offline and handles complex data. Requirements:
- Store 1000+ recipes
- Fast queries (search, filter)
- Relational data (recipes, ingredients, categories)
- ACID compliance
- Minimal storage overhead

### Decision

We will use **SQLite via expo-sqlite** for primary data storage in the React Native apps.

### Options Considered

1. **SQLite (via expo-sqlite)**
   - Pros: Relational, ACID, fast queries, unlimited storage, no dependencies
   - Cons: SQL learning curve, migration management, synchronous queries

2. **AsyncStorage Only**
   - Pros: Simple API, key-value, async, good for small data
   - Cons: Slow with large datasets, no queries, flat structure, string-only

3. **Realm Database**
   - Pros: Fast, object-oriented, reactive queries, sync built-in
   - Cons: Large SDK size, learning curve, MongoDB dependency for sync

4. **WatermelonDB**
   - Pros: Fast, offline-first, lazy loading, observables
   - Cons: Complex setup, additional abstraction layer, smaller community

5. **JSON Files**
   - Pros: Simple, human-readable, easy backup
   - Cons: Slow with large datasets, no queries, no transactions

### Rationale

SQLite was chosen because:
1. **Performance**: Optimized for mobile, fast queries even with 1000+ recipes
2. **Relational**: Perfect for recipes with ingredients, categories, tags
3. **Proven**: Industry standard, battle-tested, reliable
4. **Storage**: No practical size limits (can handle 100K+ recipes)
5. **Queries**: Full SQL support for complex searches and filters
6. **Offline-First**: No network dependency, fully local
7. **ACID Compliance**: Data integrity guaranteed
8. **Expo Integration**: Well-supported via expo-sqlite

### Database Schema

```sql
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  servings TEXT,
  prepTime TEXT,
  cookTime TEXT,
  dateAdded TEXT,
  image TEXT,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE ingredient_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  title TEXT,
  position INTEGER,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  position INTEGER,
  FOREIGN KEY (section_id) REFERENCES ingredient_sections(id) ON DELETE CASCADE
);

CREATE TABLE instructions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  recipe_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  position INTEGER,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE recipe_categories (
  recipe_id INTEGER,
  category_id INTEGER,
  PRIMARY KEY (recipe_id, category_id),
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX idx_recipes_title ON recipes(title);
CREATE INDEX idx_recipes_date ON recipes(dateAdded);
CREATE INDEX idx_ingredients_text ON ingredients(text);
```

### Consequences

**Positive:**
- Fast queries for search and filtering
- Relational data modeling
- Unlimited storage capacity
- ACID transactions
- Complex queries supported
- Indexes for performance

**Negative:**
- SQL learning curve for team
- Migration management needed
- Synchronous API (can block UI if misused)
- Manual query building (no ORM)

**Performance Expectations:**
- Load 100 recipes: <50ms
- Search across 1000 recipes: <100ms
- Insert recipe: <10ms
- Complex join queries: <200ms

**Data Migration Strategy:**
1. Version database schema
2. Write migration functions for schema changes
3. Test migrations with production data copies
4. Implement rollback capability

**AsyncStorage Usage:**
SQLite for structured data, AsyncStorage for:
- User preferences
- App settings
- Session data
- Cache keys

**Complementary Usage:**
```javascript
// SQLite for recipes
await db.executeSql('SELECT * FROM recipes WHERE title LIKE ?', ['%pasta%']);

// AsyncStorage for settings
await AsyncStorage.setItem('theme', 'dark');
```

**Future Considerations:**
- Add full-text search (FTS5)
- Implement cloud sync (conflict resolution)
- Consider Realm if real-time sync becomes priority

---

## Decision-Making Framework

### How We Make Decisions

**Principles:**
1. **User Impact First**: Prioritize user benefit over technical elegance
2. **Start Simple**: Choose simplest solution that solves the problem
3. **Pragmatic Tradeoffs**: Perfect is enemy of good
4. **Measure & Iterate**: Make decisions reversible when possible
5. **Document Everything**: Future us will thank present us

**Process:**
1. **Identify Need**: What problem are we solving?
2. **Research Options**: What are the alternatives?
3. **Evaluate Tradeoffs**: Pros/cons of each option
4. **Make Decision**: Choose based on context and priorities
5. **Document**: Record in ADR format
6. **Review**: Revisit decisions quarterly

---

## When to Create an ADR

**Create an ADR when:**
- ✅ Choosing a framework, library, or major dependency
- ✅ Making architectural decisions that are hard to reverse
- ✅ Deciding on data storage strategies
- ✅ Selecting deployment platforms
- ✅ Choosing design patterns for the project
- ✅ Making security or privacy decisions

**Don't create an ADR for:**
- ❌ Minor library choices
- ❌ Coding style decisions (use linter config)
- ❌ Obvious, well-established patterns
- ❌ Tactical, easily-reversed decisions

---

## ADR Template

```markdown
## ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Deciders:** [Names/Roles]

### Context
[What is the situation forcing this decision?]

### Decision
[What is the change that we're proposing/doing?]

### Options Considered
1. **Option 1**
   - Pros: ...
   - Cons: ...

2. **Option 2**
   - Pros: ...
   - Cons: ...

### Rationale
[Why did we choose this option?]

### Consequences

**Positive:**
- [Benefit 1]
- [Benefit 2]

**Negative:**
- [Cost 1]
- [Cost 2]

**Neutral:**
- [Other consideration]
```

---

## Related Documentation

- [Architecture Overview](../architecture/overview.md)
- [Roadmap](./roadmap.md)
- [Changelog](./changelog.md)

---

## Document History

### Version 1.0.0 (December 10, 2025)
- Initial ADR document created
- 10 architectural decisions recorded
- Decision-making framework established
- ADR template provided