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
8. [ADR-008: Migrate to React Native Web](#adr-008-migrate-to-react-native-web)
9. [ADR-009: Use Expo for React Native](#adr-009-use-expo-for-react-native)
10. [ADR-010: Use AsyncStorage for Mobile Storage](#adr-010-use-asyncstorage-for-mobile-storage)
11. [ADR-011: Client Requirement - Single Codebase](#adr-011-client-requirement---single-codebase)

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

## ADR-008: Migrate to React Native Web

**Date:** December 10, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead, Product Owner, Client Stakeholders

### Context

We have a working React web application, but the client has mandated a **company requirement for a single codebase** that supports both web and mobile platforms. We need to decide how to deliver native mobile apps while maintaining web functionality from one codebase.

### Decision

We will migrate to **React Native Web** using Expo, creating a single codebase that deploys to iOS, Android, and web.

### Options Considered

1. **React Native Web (Expo)**
   - Pros: Single codebase, native apps + web, 60-70% code reuse, meets client requirement
   - Cons: Larger web bundle, some web optimizations harder, learning curve

2. **Separate React Native Apps + Keep Web**
   - Pros: Optimized for each platform, better web performance
   - Cons: Two codebases, doesn't meet client requirement, 2x maintenance

3. **Keep React Web Only**
   - Pros: Already done, optimized for web
   - Cons: No native apps, doesn't meet client requirement, web-only

4. **Flutter**
   - Pros: Single codebase, excellent performance
   - Cons: Complete rewrite, different language (Dart), lose React investment

5. **Progressive Web App (PWA)**
   - Pros: Enhanced web experience, some offline support
   - Cons: Still web-based, limited iOS support, doesn't meet client requirement

### Rationale

React Native Web was chosen because:

1. **Meets Client Requirement**: Only option that delivers single codebase for web + mobile ✅
2. **Code Reusability**: Can reuse 60-70% of existing React code
3. **Native Mobile Apps**: Delivers true native apps for iOS and Android
4. **Team Skills**: Leverages existing React knowledge
5. **Expo Ecosystem**: Simplifies development and deployment
6. **Single Maintenance**: One codebase reduces long-term costs
7. **Faster Than Separate**: 9 weeks vs 20 weeks for separate apps

**Client Mandate is Decisive Factor:**
The client's company policy requires a single codebase. This makes React Native Web the **only viable option** that:
- Satisfies the requirement
- Leverages existing investment
- Delivers to all platforms

### Consequences

**Positive:**
- Single codebase for all platforms
- Native iOS and Android apps
- Consistent UI across platforms
- Lower maintenance cost
- Faster feature deployment
- Meets client requirement ✅

**Negative:**
- Web bundle larger (~300KB vs ~50KB)
- Slightly slower web initial load
- Web UI feels more mobile-like
- Platform-specific code needed for some features
- Team needs React Native training

**Mitigation:**
- Code splitting for web performance
- Platform detection for optimal UX
- Comprehensive testing on all platforms
- Team training on React Native patterns

**Trade-offs Accepted:**
- Web performance slightly worse (acceptable given requirement)
- Desktop UX less optimized (acceptable given mobile-first use case)
- Update process slower for mobile (mitigated by OTA updates)

**Timeline:**
- 9-week migration (Q2 2026)
- Simultaneous launch on all platforms
- Faster than separate app development (20 weeks)

**Cost:**
- Development: $50,000-$70,000
- 50% cheaper than separate apps ($80k-120k)
- Lower ongoing maintenance

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

## ADR-010: Use AsyncStorage for Mobile Storage

**Date:** December 10, 2025  
**Status:** Accepted  
**Deciders:** Technical Lead

### Context

React Native apps need local storage for recipes that works offline and across all platforms (iOS, Android, Web). Requirements:
- Store 100-1000+ recipes
- Work offline
- Cross-platform compatibility
- Simple API
- Sufficient performance

### Decision

We will use **AsyncStorage** via `@react-native-async-storage/async-storage` for primary data storage in the React Native Web application.

### Options Considered

1. **AsyncStorage**
   - Pros: Cross-platform, simple API, sufficient capacity, async, built for RN
   - Cons: Key-value only (no queries), all operations by key, less structured

2. **SQLite (via expo-sqlite)**
   - Pros: Relational, SQL queries, ACID compliance, unlimited storage
   - Cons: Web support limited, more complex API, overkill for current needs

3. **Realm Database**
   - Pros: Fast, object-oriented, reactive queries
   - Cons: Large SDK, web support poor, MongoDB sync not needed

4. **LocalStorage (web) / AsyncStorage (mobile)**
   - Pros: Platform native
   - Cons: Different APIs per platform, harder to maintain

### Rationale

AsyncStorage was chosen because:

1. **Cross-Platform**: Works on iOS, Android, and Web (React Native Web)
2. **Simple API**: Easy to use, Promise-based, minimal learning curve
3. **Sufficient Capacity**: Can store 100s of recipes with images (MB of data)
4. **React Native Standard**: De facto storage solution for React Native
5. **Async Operations**: Non-blocking, good for UI performance
6. **Easy Migration**: Can migrate from localStorage (web) easily
7. **Meets Current Needs**: Key-value storage is sufficient for our data model

**Why Not SQLite:**
- Current recipe data model is simple (JSON objects)
- No need for complex queries or joins
- Key-based retrieval is sufficient
- Web support for SQLite is limited
- AsyncStorage is simpler and faster to implement

**Future Consideration:**
If we need complex queries, relationships, or very large datasets, we can migrate to SQLite later. The storage abstraction layer makes this migration straightforward.

### Storage Strategy

**Data Model:**
```javascript
// Key pattern
'recipe:{id}' → JSON stringified recipe object

// Example
'recipe:1702234567890' → '{"id": 1702234567890, "title": "Apple Pie", ...}'
```

**Storage Wrapper:**
```javascript
export const storage = {
  async get(key) { ... },      // Returns {key, value} or null
  async set(key, value) { ... }, // Returns {key, value} or null
  async delete(key) { ... },    // Returns {key, deleted: true} or null
  async list(prefix) { ... }    // Returns {keys: [...]}
};
```

### Consequences

**Positive:**
- Simple implementation (< 100 lines)
- Works on all platforms
- Fast for our use case
- Easy to test and debug
- Cross-platform compatible
- Sufficient capacity

**Negative:**
- No SQL queries (must load all, then filter in JS)
- No relationships or joins
- All operations by key
- Must manage JSON serialization
- Can't do complex searches efficiently

**Mitigation:**
- Load all recipes into memory (acceptable for 100-1000 recipes)
- Filter and sort in JavaScript
- Use key prefixes for organization
- Implement simple search in-memory

**Performance Expectations:**
- Load 100 recipes: <100ms
- Save recipe: <20ms
- Delete recipe: <20ms
- List all keys: <50ms

**Capacity:**
- AsyncStorage typically: 6MB+ per platform
- Recipe with image: ~50-150KB
- Capacity: 40-120 recipes conservatively
- Sufficient for MVP and beyond

**Future Migration Path:**
If needs grow:
1. Implement SQLite for structured queries
2. Keep AsyncStorage for settings
3. Migration utility to move data
4. Estimated effort: 1-2 weeks

---

## ADR-011: Client Requirement - Single Codebase

**Date:** December 10, 2025  
**Status:** Accepted  
**Deciders:** Client Stakeholders, Technical Lead, Product Owner

### Context

This ADR documents a **client-mandated requirement** that fundamentally drives all technical decisions for the FamilyPlate project going forward.

**Client Requirement:**
"The application must use a single codebase that deploys to both web and mobile platforms. This is a company policy and non-negotiable."

This requirement supersedes technical preferences and determines the entire migration strategy.

### Decision

We accept and will implement the client's requirement for a **single codebase supporting web and mobile platforms** using React Native Web with Expo.

### Impact Analysis

This requirement **eliminates** several otherwise viable technical approaches:

**Eliminated Options:**
- ❌ Maintain separate React web app + build React Native mobile apps
- ❌ Keep web-only (no mobile)
- ❌ Build Progressive Web App only
- ❌ Use different frameworks for web vs mobile

**Only Viable Options:**
- ✅ React Native Web (Expo) - CHOSEN
- ⚠️ Flutter (requires complete rewrite in Dart)

### Rationale for React Native Web

Given the single codebase requirement, React Native Web was chosen because:

1. **Meets Requirement**: Single codebase deploys to iOS, Android, and Web ✅
2. **Leverages Investment**: Can reuse 60-70% of existing React code
3. **Team Skills**: Team knows React, not Dart (Flutter)
4. **Ecosystem**: React Native is mature and well-supported
5. **Expo**: Simplifies cross-platform development
6. **Practical**: Only realistic option given constraints

**Why Not Flutter:**
- Requires complete rewrite (lose all existing code)
- Team would need to learn Dart
- Lose React ecosystem and tooling
- Longer timeline (12-16 weeks for rewrite vs 9 weeks for migration)

### Consequences

**Positive:**
- Clear technical direction (no ambiguity)
- Single codebase reduces maintenance
- Consistent features across platforms
- Meets client requirement ✅
- Client satisfaction

**Negative (Trade-offs Accepted):**
- Web bundle larger than pure React web app
- Some web-specific optimizations harder
- Platform-specific code needed for some features
- Team needs React Native training

**Non-Negotiable Constraints:**
- Must be single codebase (not optional)
- Must support web + mobile (iOS + Android)
- Must meet company policy

**Business Impact:**
- Project approved by client ✅
- Budget approved
- Timeline accepted
- Technical direction validated

### Implementation

**Approach:** React Native Web with Expo
**Timeline:** 9 weeks (Q2 2026)
**Cost:** $50,000-$70,000
**Result:** Single codebase for web, iOS, and Android

**Success Criteria:**
- One codebase maintained
- Deploys to all three platforms
- Feature parity across platforms
- Meets company policy requirement
- Client satisfaction

### Related Decisions

This requirement directly influenced:
- ADR-008: Migrate to React Native Web
- ADR-009: Use Expo for React Native
- ADR-010: Use AsyncStorage for Mobile Storage

All subsequent technical decisions must align with this single codebase requirement.

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

## Changelog

### Version 2.0.0 (December 10, 2025)
- **MAJOR UPDATE:** Added ADR-011 for client single codebase requirement
- **UPDATED:** ADR-008 changed from "Migrate to React Native" to "Migrate to React Native Web"
- **UPDATED:** ADR-010 changed from SQLite to AsyncStorage (simpler, cross-platform)
- Documented client mandate driving technical decisions
- Updated all ADRs to reflect single codebase approach
- Clarified React Native Web vs separate apps decision

### Version 1.0.0 (December 10, 2025)
- Initial ADR document created
- 10 architectural decisions recorded (original approach)
- Decision-making framework established
- ADR template provided
