# React Native Web Migration Timeline

## Overview

This document provides a detailed week-by-week timeline for migrating FamilyPlate from a React web application to a React Native Web application using Expo. This timeline reflects the single codebase approach required by the client.

**Version:** 2.0.0  
**Last Updated:** December 10, 2025  
**Status:** Planning  
**Total Duration:** 9 weeks  
**Target Start:** Q2 2026  
**Target Completion:** Q2 2026

---

## Timeline Summary

| Week | Phase | Key Deliverable | Status |
|------|-------|----------------|--------|
| **Week 1** | Project Setup | Expo project running on all platforms | Planned |
| **Week 2** | Navigation | All screens navigable | Planned |
| **Week 3** | Recipe Library UI | Library and detail views complete | Planned |
| **Week 4** | Camera & Upload | Photo capture working | Planned |
| **Week 5** | Storage Layer | Data persistence functional | Planned |
| **Week 6** | API Integration | Recipe extraction working | Planned |
| **Week 7** | UI Polish | Animations and responsive design | Planned |
| **Week 8** | Testing & QA | All platforms tested, bugs fixed | Planned |
| **Week 9** | Deployment | Live on web, iOS, Android | Planned |

---

## Detailed Weekly Breakdown

### Week 1: Project Setup & Foundation

**Dates:** TBD (Q2 2026)  
**Objective:** Create and configure React Native Web project with Expo

#### Monday: Environment Setup

**Tasks:**
- [ ] Install Node.js (verify version 18+)
- [ ] Install Expo CLI globally
- [ ] Create new Expo project
- [ ] Initialize Git repository
- [ ] Set up project structure

**Commands:**
```bash
# Check Node version
node --version  # Should be 18+ 

# Install Expo CLI
npm install -g expo-cli

# Create project
npx create-expo-app FamilyPlateNative --template blank
cd FamilyPlateNative

# Initialize git
git init
git add .
git commit -m "Initial Expo project setup"
```

**Success Criteria:**
- ✅ Expo project created
- ✅ Can run `npx expo start`
- ✅ Git initialized

---

#### Tuesday: Install Dependencies

**Tasks:**
- [ ] Install React Native Web
- [ ] Install React Navigation
- [ ] Install AsyncStorage
- [ ] Install image picker
- [ ] Install vector icons

**Commands:**
```bash
# React Native Web
npx expo install react-native-web react-dom @expo/metro-runtime

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# Storage
npx expo install @react-native-async-storage/async-storage

# Camera/Images
npx expo install expo-image-picker expo-camera expo-file-system

# Icons
npm install @expo/vector-icons

# Other utilities
npx expo install expo-status-bar
```

**Success Criteria:**
- ✅ All dependencies installed
- ✅ No installation errors
- ✅ package.json updated

---

#### Wednesday: Configure Platforms

**Tasks:**
- [ ] Configure app.json for all platforms
- [ ] Set up iOS configuration
- [ ] Set up Android configuration
- [ ] Set up web configuration
- [ ] Test platform detection

**app.json Configuration:**
```json
{
  "expo": {
    "name": "FamilyPlate",
    "slug": "familyplate",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFF7ED"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.familyplate.app",
      "infoPlist": {
        "NSCameraUsageDescription": "FamilyPlate needs access to your camera to capture recipe photos.",
        "NSPhotoLibraryUsageDescription": "FamilyPlate needs access to your photo library to select recipe photos."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFF7ED"
      },
      "package": "com.familyplate.app",
      "permissions": ["CAMERA", "READ_EXTERNAL_STORAGE"]
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
}
```

**Success Criteria:**
- ✅ app.json configured
- ✅ Platform-specific settings in place
- ✅ Permissions declared

---

#### Thursday: Test All Platforms

**Tasks:**
- [ ] Test web in browser
- [ ] Test iOS on iPhone with Expo Go
- [ ] Set up Android emulator
- [ ] Test Android on emulator
- [ ] Verify hot reload works

**Commands:**
```bash
# Start Expo dev server
npx expo start

# Then press:
# 'w' for web
# 'i' for iOS simulator (Mac only)
# 'a' for Android emulator

# For iPhone with Expo Go:
# Scan QR code with camera app
```

**Success Criteria:**
- ✅ See "Hello World" on web
- ✅ App running on iPhone via Expo Go
- ✅ App running on Android emulator
- ✅ Hot reload working on all platforms

---

#### Friday: Sprint Review & Planning

**Tasks:**
- [ ] Team review of Week 1 progress
- [ ] Demo app on all three platforms
- [ ] Document any setup issues
- [ ] Plan Week 2 tasks
- [ ] Git commit and push

**Deliverables:**
- ✅ Working Expo project
- ✅ Runs on web, iOS, Android
- ✅ All dependencies installed
- ✅ Team can run locally
- ✅ Documentation updated

---

### Week 2: Navigation & Screen Structure

**Objective:** Implement complete navigation system with all screens

#### Monday-Tuesday: Navigation Setup

**Tasks:**
- [ ] Set up NavigationContainer
- [ ] Create Drawer Navigator (hamburger menu)
- [ ] Create Stack Navigator
- [ ] Configure navigation options
- [ ] Test navigation on all platforms

**Implementation:**
```javascript
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#EA580C',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Upload" component={UploadScreen} />
        <Drawer.Screen name="Library" component={LibraryScreen} />
        <Drawer.Screen name="Shopping" component={ShoppingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

---

#### Wednesday-Thursday: Create Screen Components

**Tasks:**
- [ ] Create HomeScreen component
- [ ] Create UploadScreen component
- [ ] Create LibraryScreen component
- [ ] Create RecipeDetailScreen component
- [ ] Create ShoppingScreen component (placeholder)

**Screen Templates:**
```javascript
// screens/HomeScreen.js
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FamilyPlate</Text>
      <Text style={styles.subtitle}>Preserve your family recipes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EA580C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
  },
});
```

---

#### Friday: Theme System & Review

**Tasks:**
- [ ] Create theme configuration
- [ ] Define colors, spacing, typography
- [ ] Apply theme to all screens
- [ ] Test navigation flow
- [ ] Sprint review

**Theme System:**
```javascript
// constants/theme.js
export const theme = {
  colors: {
    primary: '#EA580C',
    secondary: '#FB923C',
    background: '#FFF7ED',
    card: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#10B981',
    error: '#EF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    title: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    subheading: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
    },
  },
};
```

**Deliverables:**
- ✅ Navigation system complete
- ✅ All screens created
- ✅ Theme system established
- ✅ Navigation tested on all platforms

---

### Week 3: Recipe Library UI

**Objective:** Build recipe browsing and viewing interface

#### Monday-Tuesday: Recipe List Component

**Tasks:**
- [ ] Create RecipeCard component
- [ ] Create RecipeList with FlatList
- [ ] Implement grid layout (2 columns mobile, 3+ web)
- [ ] Add empty state
- [ ] Mock data for testing

**Implementation:**
```javascript
// components/RecipeCard.js
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export default function RecipeCard({ recipe, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <Text style={styles.date}>{recipe.dateAdded}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
```

---

#### Wednesday-Thursday: Recipe Detail Screen

**Tasks:**
- [ ] Create RecipeDetailScreen layout
- [ ] Display recipe image
- [ ] Show ingredients list
- [ ] Show instructions
- [ ] Add delete button
- [ ] Test navigation to detail

**Detail Screen Structure:**
- Header image (full width)
- Recipe title
- Metadata (servings, prep time, cook time)
- Ingredients sections
- Instructions with step numbers
- Delete button

---

#### Friday: Testing & Polish

**Tasks:**
- [ ] Test recipe list responsiveness
- [ ] Test detail screen on all platforms
- [ ] Add loading states (skeletons)
- [ ] Test with 0, 1, 10, 100+ recipes
- [ ] Sprint review

**Deliverables:**
- ✅ Recipe list with grid layout
- ✅ Recipe detail view complete
- ✅ Empty states
- ✅ Responsive on all sizes
- ✅ Loading states

---

### Week 4: Camera & Upload

**Objective:** Implement photo capture and upload functionality

#### Monday-Tuesday: Camera Integration

**Tasks:**
- [ ] Request camera permissions
- [ ] Implement takePicture function
- [ ] Implement pickImage function
- [ ] Handle platform differences (web vs native)
- [ ] Test on real devices

---

#### Wednesday-Thursday: Image Preview & Compression

**Tasks:**
- [ ] Create PreviewScreen
- [ ] Show captured image
- [ ] Add retake/confirm buttons
- [ ] Implement image compression
- [ ] Test image quality

---

#### Friday: Upload Flow Testing

**Tasks:**
- [ ] Test camera on iOS
- [ ] Test camera on Android  
- [ ] Test file picker on web
- [ ] End-to-end upload flow
- [ ] Sprint review

**Deliverables:**
- ✅ Camera working on mobile
- ✅ File picker working on web
- ✅ Image preview functional
- ✅ Platform differences handled
- ✅ Permissions managed

---

### Week 5: Storage Layer

**Objective:** Implement cross-platform data persistence

#### Monday-Tuesday: AsyncStorage Wrapper

**Tasks:**
- [ ] Create storage utility module
- [ ] Implement get/set/delete/list methods
- [ ] Add error handling
- [ ] Write unit tests
- [ ] Test on all platforms

---

#### Wednesday-Thursday: Recipe CRUD Operations

**Tasks:**
- [ ] Create RecipeService
- [ ] Implement loadAllRecipes
- [ ] Implement saveRecipe
- [ ] Implement deleteRecipe
- [ ] Implement updateRecipe
- [ ] Integration tests

---

#### Friday: Data Migration & Testing

**Tasks:**
- [ ] Create migration utility (localStorage → AsyncStorage)
- [ ] Test with large datasets (100+ recipes)
- [ ] Test offline functionality
- [ ] Performance testing
- [ ] Sprint review

**Deliverables:**
- ✅ AsyncStorage wrapper complete
- ✅ CRUD operations working
- ✅ Data persists across sessions
- ✅ Works on all platforms
- ✅ Unit tests passing

---

### Week 6: API Integration

**Objective:** Connect to Anthropic API for recipe extraction

#### Monday-Tuesday: API Client

**Tasks:**
- [ ] Create AnthropicAPI module
- [ ] Implement extractRecipe method
- [ ] Handle image to base64 conversion
- [ ] Call Vercel serverless function
- [ ] Parse JSON response

---

#### Wednesday-Thursday: Extraction Flow

**Tasks:**
- [ ] Integrate API with upload flow
- [ ] Add loading states
- [ ] Handle errors gracefully
- [ ] Test with various recipe types
- [ ] Test with poor quality images

---

#### Friday: End-to-End Testing

**Tasks:**
- [ ] Test full flow: camera → extract → save
- [ ] Test with 10+ different recipes
- [ ] Error handling tests
- [ ] Network failure tests
- [ ] Sprint review

**Deliverables:**
- ✅ API integration working
- ✅ Recipe extraction functional
- ✅ Loading states implemented
- ✅ Error handling complete
- ✅ End-to-end flow tested

---

### Week 7: UI Polish & Animations

**Objective:** Polish user interface and add smooth animations

#### Monday-Tuesday: Animations

**Tasks:**
- [ ] Add fade-in animations
- [ ] Add list item animations
- [ ] Add navigation transitions
- [ ] Implement skeleton loaders
- [ ] Test 60 FPS on mobile

---

#### Wednesday-Thursday: Responsive Design

**Tasks:**
- [ ] Handle different screen sizes
- [ ] Tablet layouts (3-4 column grid)
- [ ] Desktop layouts (web)
- [ ] Test on various devices
- [ ] Platform-specific styling

---

#### Friday: Final Polish

**Tasks:**
- [ ] Color and spacing refinements
- [ ] Typography consistency
- [ ] Touch target sizes (44px minimum)
- [ ] Accessibility review
- [ ] Sprint review

**Deliverables:**
- ✅ Smooth animations
- ✅ Platform-appropriate styling
- ✅ Responsive layouts
- ✅ 60 FPS performance
- ✅ Polished appearance

---

### Week 8: Testing & Bug Fixes

**Objective:** Comprehensive testing and issue resolution

#### Monday: Platform Testing

**Test Matrix:**
- [ ] iOS - iPhone (Expo Go) - All features
- [ ] Android - Emulator - All features
- [ ] Web - Chrome - All features
- [ ] Web - Safari - Compatibility
- [ ] Web - Firefox - Compatibility

---

#### Tuesday-Wednesday: Bug Fixing

**Tasks:**
- [ ] Triage all found issues
- [ ] Fix critical bugs (crashes, data loss)
- [ ] Fix high priority bugs (broken features)
- [ ] Fix medium priority bugs (UX issues)
- [ ] Retest fixes

---

#### Thursday: Unit & Integration Tests

**Tasks:**
- [ ] Write unit tests for storage
- [ ] Write unit tests for API client
- [ ] Write integration tests for recipe flow
- [ ] Achieve 70%+ test coverage
- [ ] All tests passing

---

#### Friday: Final QA & Sign-off

**Tasks:**
- [ ] Full regression testing
- [ ] Performance testing
- [ ] Load testing (100+ recipes)
- [ ] Final bug fixes
- [ ] Sign-off for production

**Deliverables:**
- ✅ All platforms tested
- ✅ Critical bugs fixed
- ✅ Tests passing
- ✅ Performance acceptable
- ✅ Production ready

---

### Week 9: Deployment

**Objective:** Deploy to production on all platforms

#### Monday: Web Deployment

**Tasks:**
- [ ] Build web version (`npx expo export --platform web`)
- [ ] Deploy to Vercel
- [ ] Configure domain
- [ ] Test production build
- [ ] Monitor errors

**Commands:**
```bash
# Build for web
npx expo export --platform web

# Upload dist/ folder to Vercel
# Or connect GitHub repo for auto-deploy
```

---

#### Tuesday: iOS Build

**Tasks:**
- [ ] Set up EAS Build
- [ ] Configure iOS credentials
- [ ] Build iOS app (`eas build --platform ios`)
- [ ] Test build on TestFlight
- [ ] Submit to App Store

**Commands:**
```bash
# Set up EAS
npm install -g eas-cli
eas login
eas build:configure

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

---

#### Wednesday: Android Build

**Tasks:**
- [ ] Configure Android credentials
- [ ] Build Android app (`eas build --platform android`)
- [ ] Test build internally
- [ ] Submit to Play Store

**Commands:**
```bash
# Build
eas build --platform android --profile production

# Submit
eas submit --platform android
```

---

#### Thursday: Monitoring & Documentation

**Tasks:**
- [ ] Set up crash reporting (Sentry)
- [ ] Set up analytics
- [ ] Create user documentation
- [ ] Create support materials
- [ ] Monitor initial usage

---

#### Friday: Launch & Celebration

**Tasks:**
- [ ] Announce launch (social media, email)
- [ ] Monitor app store reviews
- [ ] Respond to user feedback
- [ ] Fix any critical issues
- [ ] Team celebration 🎉

**Deliverables:**
- ✅ Web live on Vercel
- ✅ iOS in App Store
- ✅ Android in Play Store
- ✅ Monitoring in place
- ✅ Launch complete

---

## Milestones & Gates

### Milestone 1: Foundation (End of Week 1)
**Gate Criteria:**
- [ ] App runs on web, iOS, Android
- [ ] All dependencies installed
- [ ] Team can run locally
- [ ] No blockers

---

### Milestone 2: Navigation Complete (End of Week 2)
**Gate Criteria:**
- [ ] All screens navigable
- [ ] Theme system in place
- [ ] No navigation bugs

---

### Milestone 3: Core UI Complete (End of Week 4)
**Gate Criteria:**
- [ ] Recipe list working
- [ ] Recipe detail working
- [ ] Camera working
- [ ] No major UI issues

---

### Milestone 4: Feature Complete (End of Week 6)
**Gate Criteria:**
- [ ] Storage working
- [ ] API integration working
- [ ] All features implemented
- [ ] Ready for polish

---

### Milestone 5: Production Ready (End of Week 8)
**Gate Criteria:**
- [ ] All platforms tested
- [ ] No critical bugs
- [ ] Tests passing
- [ ] Performance acceptable

---

### Milestone 6: Launch (End of Week 9)
**Gate Criteria:**
- [ ] Deployed to all platforms
- [ ] Monitoring active
- [ ] No showstoppers
- [ ] Team ready for support

---

## Risk Management

### High-Risk Periods

| Week | Risk | Mitigation |
|------|------|------------|
| **Week 1** | Setup issues | Detailed setup guide, team support |
| **Week 4** | Camera platform differences | Early testing, platform detection |
| **Week 6** | API integration problems | Test API early, mock responses |
| **Week 9** | App store rejection | Follow guidelines, prepare appeals |

---

## Resource Allocation

### Developer Time

| Week | Lead Dev | Support | Total |
|------|----------|---------|-------|
| 1-2 | 100% | 20% | 1.2 FTE |
| 3-6 | 100% | 30% | 1.3 FTE |
| 7-8 | 100% | 50% | 1.5 FTE |
| 9 | 100% | 30% | 1.3 FTE |

---

## Success Metrics

### Development Metrics

| Metric | Target | Measured At |
|--------|--------|-------------|
| **Test Coverage** | 70%+ | Week 8 |
| **Crash Rate** | <1% | Week 9 |
| **Build Success** | 95%+ | Ongoing |
| **Performance** | 60 FPS | Week 7 |

---

## Post-Launch Roadmap

### Week 10-12 (Stabilization)
- Monitor crash reports
- Fix user-reported bugs
- Performance improvements
- Respond to reviews

### Month 4-6 (Enhancement)
- Shopping list feature
- Recipe categories
- Advanced search
- User feedback features

---

## Related Documentation

- [React Native Web Migration Plan](./react-native-plan.md)
- [Migration Comparison](./comparison.md)
- [Project Roadmap](../project-management/roadmap.md)
- [Architectural Decisions](../project-management/decisions.md)

---

## Changelog

### Version 2.0.0 (December 10, 2025)
- **MAJOR CHANGE:** Updated for React Native Web (9-week plan)
- Changed from 20-week separate apps to 9-week single codebase
- Updated all weekly breakdowns
- Added platform-specific testing
- Revised resource allocation

### Version 1.0.0 (December 10, 2025)
- Initial timeline (20-week separate apps approach)
