# React Native Migration Plan

## Overview

This document outlines the strategic plan for migrating FamilyPlate from a React web application to a native mobile application using React Native. This migration will provide enhanced mobile capabilities, better performance, and access to native device features.

**Version:** 1.0.0  
**Last Updated:** December 10, 2025  
**Status:** Planning Phase  
**Target Timeline:** Q2-Q3 2026

---

## Executive Summary

### Migration Goals

1. **Native Mobile Experience** - Deliver true native performance and UX
2. **Offline-First Architecture** - Full functionality without internet connection
3. **Device Integration** - Access camera, files, and native sharing
4. **App Store Presence** - Distribute via Apple App Store and Google Play Store
5. **Enhanced Performance** - Faster load times, smoother animations
6. **Maintain Code Reusability** - Leverage existing React codebase

### Key Benefits

| Benefit | Impact |
|---------|--------|
| Native camera integration | Seamless recipe photo capture |
| Offline storage | Use app without internet |
| Push notifications | Remind users about meal planning |
| Native sharing | Share recipes via iOS/Android share sheet |
| Faster performance | Improved user experience |
| App Store visibility | Increased discoverability |

---

## Strategic Approach

### Migration Strategy: Hybrid Development

We will use **React Native with Expo** for the following reasons:

1. **Code Reusability** - Reuse ~70% of existing React components
2. **Faster Development** - Expo provides pre-built native modules
3. **Over-the-Air Updates** - Deploy fixes without app store review
4. **Development Speed** - Faster iteration and testing
5. **Cross-Platform** - Single codebase for iOS and Android

### Alternative Considered: Native Development

**Why not pure native (Swift/Kotlin)?**
- Would require 2x development time (separate iOS and Android teams)
- Cannot reuse existing React codebase
- Higher maintenance burden
- Slower feature delivery

---

## Technical Architecture

### Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | React Native 0.72+ | Cross-platform, React-based |
| **Build Tool** | Expo SDK 49+ | Simplified native module access |
| **Storage** | AsyncStorage + SQLite | Persistent, offline-capable |
| **Navigation** | React Navigation 6 | Industry standard, flexible |
| **State Management** | React Context + Hooks | Simple, maintainable |
| **Image Handling** | expo-image-picker | Native camera access |
| **HTTP Client** | Fetch API | Built-in, standard |
| **AI Integration** | Anthropic API | Same as web version |

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│         React Native App                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  UI Layer   │    │ Navigation  │   │
│  │  (Screens)  │◄───┤   Stack     │   │
│  └─────────────┘    └─────────────┘   │
│         │                               │
│         ▼                               │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  Business   │◄──►│   Storage   │   │
│  │   Logic     │    │   Layer     │   │
│  └─────────────┘    └─────────────┘   │
│         │                  │            │
│         ▼                  ▼            │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  API Layer  │    │ AsyncStorage│   │
│  │  (Anthropic)│    │   SQLite    │   │
│  └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────┘
```

---

## Migration Phases

### Phase 1: Foundation Setup (Weeks 1-2)

**Objective:** Establish React Native project structure

**Tasks:**
1. Initialize Expo project
2. Set up development environment
3. Configure build tools (EAS Build)
4. Establish folder structure
5. Set up linting and formatting
6. Configure TypeScript (optional)

**Deliverables:**
- Working React Native project
- Build pipeline configured
- Development documentation
- Team environment setup

**Success Criteria:**
- Can run app on iOS and Android simulators
- Can build and deploy to test devices
- All team members have working dev environment

---

### Phase 2: Core UI Migration (Weeks 3-6)

**Objective:** Migrate existing React components to React Native

**Priority Components:**
1. **Navigation System** (Week 3)
   - Hamburger menu → Drawer navigation
   - Top bar → Header navigation
   - Screen routing

2. **Recipe Library Screen** (Week 4)
   - Recipe card grid
   - Recipe detail view
   - Delete functionality

3. **Upload Screen** (Week 5)
   - Camera integration
   - Image picker
   - Preview screen

4. **Home Screen** (Week 6)
   - Welcome screen
   - Quick actions
   - Statistics display

**Migration Approach:**

```javascript
// Web version (React)
<div className="bg-white p-4 rounded-lg shadow">
  <h2 className="text-xl font-bold">{recipe.title}</h2>
  <img src={recipe.image} alt={recipe.title} />
</div>

// React Native version
<View style={styles.card}>
  <Text style={styles.title}>{recipe.title}</Text>
  <Image source={{ uri: recipe.image }} style={styles.image} />
</View>

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3 // Android shadow
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover'
  }
});
```

**Deliverables:**
- All screens migrated to React Native
- Navigation working correctly
- UI matches design specifications
- Responsive layout for different devices

---

### Phase 3: Storage Layer (Weeks 7-8)

**Objective:** Implement native storage solution

**Storage Strategy:**

```javascript
// Current: localStorage (web)
await window.storage.set('recipe:123', JSON.stringify(recipe));

// Future: AsyncStorage (React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

await AsyncStorage.setItem('recipe:123', JSON.stringify(recipe));
```

**For Complex Data: SQLite**

```javascript
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('familyplate.db');

// Create tables
db.transaction(tx => {
  tx.executeSql(
    `CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY,
      title TEXT,
      image TEXT,
      servings TEXT,
      prepTime TEXT,
      cookTime TEXT,
      dateAdded TEXT,
      ingredientSections TEXT,
      instructions TEXT
    )`
  );
});

// Insert recipe
db.transaction(tx => {
  tx.executeSql(
    'INSERT INTO recipes VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [recipe.id, recipe.title, /* ... */]
  );
});
```

**Migration Tasks:**
1. Set up AsyncStorage
2. Implement SQLite for structured data
3. Create storage abstraction layer
4. Migrate existing storage API
5. Implement data migration utility
6. Test offline functionality

**Deliverables:**
- Working storage layer
- Data persistence functional
- Migration from web storage
- Unit tests for storage operations

---

### Phase 4: Native Features Integration (Weeks 9-11)

**Objective:** Leverage native device capabilities

#### Camera Integration (Week 9)

```javascript
import * as ImagePicker from 'expo-image-picker';

const takePicture = async () => {
  // Request camera permission
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
  if (status !== 'granted') {
    alert('Camera permission required');
    return;
  }
  
  // Launch camera
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8
  });
  
  if (!result.canceled) {
    setPreviewImage(result.assets[0].uri);
  }
};
```

#### Native Sharing (Week 10)

```javascript
import * as Sharing from 'expo-sharing';

const shareRecipe = async (recipe) => {
  // Create shareable text
  const text = `
${recipe.title}

Ingredients:
${recipe.ingredientSections.map(s => 
  s.items.join('\n')
).join('\n')}

Instructions:
${recipe.instructions.map((inst, i) => 
  `${i + 1}. ${inst}`
).join('\n')}
  `;
  
  // Share via native share sheet
  await Sharing.shareAsync(text);
};
```

#### File System Access (Week 11)

```javascript
import * as FileSystem from 'expo-file-system';

// Save image to device
const saveImageToDevice = async (uri, filename) => {
  const path = `${FileSystem.documentDirectory}${filename}`;
  await FileSystem.copyAsync({
    from: uri,
    to: path
  });
  return path;
};

// Export recipes as JSON
const exportRecipes = async (recipes) => {
  const json = JSON.stringify(recipes, null, 2);
  const path = `${FileSystem.documentDirectory}recipes-backup.json`;
  await FileSystem.writeAsStringAsync(path, json);
  
  // Share file
  await Sharing.shareAsync(path);
};
```

**Deliverables:**
- Native camera integration
- Photo library access
- Native sharing functionality
- File import/export
- Permission handling

---

### Phase 5: API Integration (Weeks 12-13)

**Objective:** Connect to Anthropic API for recipe extraction

**API Layer Migration:**

```javascript
// Create API client
class AnthropicClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.anthropic.com/v1/messages';
  }
  
  async extractRecipe(imageUri) {
    // Read image as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Call API
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': this.apiKey
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: base64
              }
            },
            {
              type: 'text',
              text: 'Extract recipe as JSON...'
            }
          ]
        }]
      })
    });
    
    return await response.json();
  }
}
```

**Security Considerations:**
- Store API key securely (Expo SecureStore)
- Implement request rate limiting
- Handle network errors gracefully
- Add retry logic for failed requests

**Deliverables:**
- API client implementation
- Recipe extraction working
- Error handling
- Loading states
- Network connectivity detection

---

### Phase 6: Polish & Testing (Weeks 14-16)

**Objective:** Refine UX and ensure quality

**Tasks:**

1. **Performance Optimization** (Week 14)
   - Optimize list rendering with FlatList
   - Implement image caching
   - Reduce bundle size
   - Lazy load screens

2. **UX Polish** (Week 15)
   - Smooth animations (react-native-reanimated)
   - Haptic feedback
   - Loading skeletons
   - Empty states
   - Error messages

3. **Testing** (Week 16)
   - Unit tests (Jest)
   - Component tests (React Native Testing Library)
   - E2E tests (Detox)
   - Manual QA on real devices

**Deliverables:**
- Optimized performance
- Polished UI/UX
- Comprehensive test suite
- Bug-free experience

---

### Phase 7: Beta Release (Week 17)

**Objective:** Release to beta testers

**Tasks:**
1. Set up TestFlight (iOS)
2. Set up Google Play Internal Testing (Android)
3. Recruit beta testers
4. Gather feedback
5. Fix critical issues
6. Iterate based on feedback

**Success Metrics:**
- 50+ beta testers
- <5% crash rate
- 4+ star average rating
- Positive qualitative feedback

---

### Phase 8: Production Release (Week 18-20)

**Objective:** Launch on app stores

**Pre-Launch Checklist:**
- [ ] App Store submission requirements met
- [ ] Privacy policy published
- [ ] Terms of service created
- [ ] App store screenshots prepared
- [ ] App store descriptions written
- [ ] Support email set up
- [ ] Analytics configured
- [ ] Crash reporting enabled
- [ ] Final QA passed
- [ ] Marketing materials ready

**Launch Day:**
1. Submit to App Store (iOS)
2. Submit to Play Store (Android)
3. Announce on social media
4. Send email to beta testers
5. Monitor crash reports
6. Respond to reviews

---

## Code Reusability Analysis

### Directly Reusable (~40%)

These can be migrated with minimal changes:

- Business logic functions
- Data models and types
- API integration code
- Storage abstraction layer
- Utility functions (date formatting, etc.)

### Requires Adaptation (~30%)

These need React Native equivalents:

- UI components (div → View, img → Image)
- Styling (CSS → StyleSheet)
- Routing (React Router → React Navigation)
- Local storage (localStorage → AsyncStorage)

### Requires Rewrite (~30%)

These are platform-specific:

- Camera integration
- File system access
- Native sharing
- Push notifications
- App lifecycle management

---

## Risk Assessment

### High-Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| **API Key Security** | High | Use Expo SecureStore, implement backend proxy |
| **Performance Issues** | High | Early performance testing, optimization sprints |
| **Platform Differences** | Medium | Test on both platforms continuously |
| **App Store Rejection** | High | Follow guidelines strictly, prepare appeals |
| **Data Migration** | Medium | Thorough testing, rollback plan |

### Mitigation Strategies

1. **Security:** Implement backend API proxy to hide API key
2. **Performance:** Profile early and often, use native components
3. **Platform Differences:** Use platform-specific code where necessary
4. **App Store:** Follow all guidelines, prepare detailed submissions
5. **Data Migration:** Test migration with real user data, provide rollback

---

## Resource Requirements

### Team Structure

| Role | Allocation | Responsibilities |
|------|-----------|------------------|
| **React Native Developer** | 1 FTE | Core development |
| **UI/UX Designer** | 0.5 FTE | Mobile UI design |
| **QA Engineer** | 0.5 FTE | Testing |
| **DevOps Engineer** | 0.25 FTE | Build pipeline, deployment |

### Infrastructure

- **Expo EAS Build:** $29/month (priority builds)
- **TestFlight:** Free (Apple Developer)
- **Google Play Internal Testing:** Free
- **Crash Reporting:** Free tier (Sentry)
- **Analytics:** Free tier (Firebase)

### Total Cost Estimate

- Development: $80,000 - $120,000 (20 weeks)
- Infrastructure: $500/year
- App Store Fees: $99/year (Apple) + $25 one-time (Google)

---

## Success Criteria

### Technical Metrics

- [ ] App loads in <2 seconds
- [ ] <1% crash rate
- [ ] 60 FPS animations
- [ ] Offline functionality working
- [ ] 100% of web features implemented

### Business Metrics

- [ ] 1,000+ downloads in first month
- [ ] 4+ star average rating
- [ ] <10% uninstall rate
- [ ] 50%+ daily active users
- [ ] Positive user reviews

---

## Maintenance Plan

### Post-Launch Support

**Weeks 1-4 (Critical):**
- Daily monitoring of crash reports
- Quick fixes for critical bugs
- Respond to all app store reviews
- Hot-fix deployments via OTA updates

**Months 2-3 (Stabilization):**
- Weekly updates addressing feedback
- Performance improvements
- Feature enhancements
- Bug fixes

**Ongoing:**
- Monthly feature releases
- Quarterly major updates
- Continuous monitoring
- Community engagement

---

## Related Documentation

- [Migration Comparison](./comparison.md)
- [Migration Timeline](./timeline.md)
- [Architecture Overview](../architecture/overview.md)
- [API Documentation](../api/overview.md)

---

## Changelog

### Version 1.0.0 (December 10, 2025)
- Initial React Native migration plan
- 8-phase migration strategy defined
- Risk assessment completed
- Resource requirements estimated
- Timeline established (20 weeks)