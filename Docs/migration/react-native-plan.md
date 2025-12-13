# React Native Web Migration Plan

## Overview

This document outlines the strategic plan for migrating FamilyPlate from a React web application to a **React Native Web** application using Expo. This migration will create a single codebase that runs on web, iOS, and Android platforms.

**Version:** 2.0.0  
**Last Updated:** December 10, 2025  
**Status:** Planning Phase  
**Target Timeline:** 9 weeks  
**Target Completion:** Q2 2026

---

## Executive Summary

### Client Requirement

**Company Mandate:** Single codebase for all platforms (web + mobile)

This requirement drives our decision to use **React Native Web with Expo** instead of maintaining separate codebases for web and native mobile applications.

### Migration Goals

1. **Single Codebase** - One React Native codebase for web, iOS, and Android
2. **Native Mobile Experience** - True native performance on mobile devices
3. **Web Compatibility** - Functional web application using React Native Web
4. **Offline-First Architecture** - Full functionality without internet connection
5. **Device Integration** - Access camera, files, and native sharing
6. **Faster Time to Market** - 9 weeks vs 20 weeks for separate apps

### Key Benefits

| Benefit | Impact |
|---------|--------|
| Single codebase | 50% reduction in maintenance cost |
| Faster development | 9 weeks vs 20 weeks |
| Consistent UI | Same experience across all platforms |
| Shared business logic | 95%+ code reuse |
| Lower complexity | One team, one codebase |
| Unified updates | Deploy once, update everywhere |

---

## Strategic Approach

### Technology Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| **Framework** | React Native 0.72+ | Cross-platform native development |
| **Web Support** | React Native Web | Run RN code in browsers |
| **Build Tool** | Expo SDK 49+ | Simplified development and builds |
| **Storage** | AsyncStorage | Cross-platform local storage |
| **Navigation** | React Navigation 6 | Universal navigation system |
| **State Management** | React Context + Hooks | Simple, built-in solution |
| **Image Handling** | expo-image-picker | Camera and photo library access |
| **HTTP Client** | Fetch API | Native, standard |
| **AI Integration** | Anthropic API | Same as current implementation |

### Why React Native Web?

**Client Requirement:**
- Single codebase mandate
- Reduces maintenance overhead
- Ensures consistency across platforms

**Technical Benefits:**
- Write once, run everywhere
- Native performance on mobile
- Acceptable performance on web
- Shared components and logic
- Single deployment pipeline

**Trade-offs Accepted:**
- Slightly larger web bundle (~300KB vs 50KB)
- Web UI feels more "mobile-like"
- Some web-specific optimizations harder
- SEO requires extra configuration

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│     React Native Application            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   React Native Components       │   │
│  │   (View, Text, Image, etc.)     │   │
│  └─────────────────────────────────┘   │
│              │                          │
│              ▼                          │
│  ┌──────────┬──────────┬──────────┐   │
│  │   iOS    │ Android  │   Web    │   │
│  │  Native  │  Native  │   DOM    │   │
│  └──────────┴──────────┴──────────┘   │
│                                         │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  Business   │◄──►│   Storage   │   │
│  │   Logic     │    │   Layer     │   │
│  └─────────────┘    └─────────────┘   │
│         │                  │            │
│         ▼                  ▼            │
│  ┌─────────────┐    ┌─────────────┐   │
│  │  API Layer  │    │AsyncStorage │   │
│  │  (Anthropic)│    │             │   │
│  └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────┘
```

---

## Migration Phases

### Phase 1: Project Setup & Foundation (Week 1)

**Objective:** Create and configure React Native Web project with Expo

#### Tasks

**Day 1-2: Environment Setup**
- Install Expo CLI globally
- Create new Expo project with blank template
- Install React Native Web dependencies
- Configure project for all three platforms
- Set up development environment

**Day 3-4: Core Dependencies**
- Install React Navigation (drawer + stack)
- Install AsyncStorage for storage
- Install expo-image-picker for camera
- Install vector icons
- Configure platform-specific settings

**Day 5: Initial Testing**
- Test web version in browser
- Test iOS on iPhone with Expo Go
- Set up Android emulator
- Test hot reload on all platforms
- Verify all platforms working

#### Commands

```bash
# Install Expo CLI
npm install -g expo-cli

# Create project
npx create-expo-app FamilyPlateNative --template blank
cd FamilyPlateNative

# Install React Native Web
npx expo install react-native-web react-dom @expo/metro-runtime

# Install navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/drawer
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated

# Install storage
npx expo install @react-native-async-storage/async-storage

# Install camera/images
npx expo install expo-image-picker expo-camera

# Install icons
npm install @expo/vector-icons

# Start development
npx expo start
```

#### Deliverables
- ✅ Working Expo project
- ✅ Can run on web, iOS, Android
- ✅ All core dependencies installed
- ✅ Hot reload functional
- ✅ Team can run locally

#### Success Criteria
- See "Hello World" on all three platforms
- No build errors
- Expo Go connects successfully
- Web opens in browser without errors

---

### Phase 2: Navigation & Screen Structure (Week 2)

**Objective:** Implement complete navigation system

#### Tasks

**Navigation Setup**
```javascript
// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={MainStack} />
        <Drawer.Screen name="Upload" component={UploadScreen} />
        <Drawer.Screen name="Library" component={LibraryScreen} />
        <Drawer.Screen name="Shopping" component={ShoppingScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

**Create Screen Components**
- HomeScreen (welcome/stats)
- UploadScreen (camera/upload)
- LibraryScreen (recipe list)
- RecipeDetailScreen (full recipe)
- ShoppingScreen (placeholder)

**Theme System**
```javascript
// styles/theme.js
export const theme = {
  colors: {
    primary: '#EA580C',
    secondary: '#FB923C',
    background: '#FFF7ED',
    card: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
};
```

#### Deliverables
- ✅ Drawer navigation working
- ✅ Stack navigation working
- ✅ All screens created
- ✅ Theme system established
- ✅ Navigation tested on all platforms

---

### Phase 3: Recipe Library UI (Week 3)

**Objective:** Build recipe browsing and viewing interface

#### Tasks

**Recipe List Component**
```javascript
import { FlatList, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const RecipeList = ({ recipes, onRecipePress }) => {
  return (
    <FlatList
      data={recipes}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onRecipePress(item)} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.date}>{item.dateAdded}</Text>
          </View>
        </TouchableOpacity>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
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
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
```

**Recipe Detail Screen**
```javascript
import { ScrollView, View, Text, Image, StyleSheet } from 'react-native';

const RecipeDetailScreen = ({ route }) => {
  const { recipe } = route.params;
  
  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.headerImage} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.metadata}>
          {recipe.servings && (
            <Text style={styles.metaText}>Servings: {recipe.servings}</Text>
          )}
          {recipe.prepTime && (
            <Text style={styles.metaText}>Prep: {recipe.prepTime}</Text>
          )}
          {recipe.cookTime && (
            <Text style={styles.metaText}>Cook: {recipe.cookTime}</Text>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredientSections.map((section, idx) => (
          <View key={idx} style={styles.section}>
            {section.title && (
              <Text style={styles.sectionSubtitle}>{section.title}</Text>
            )}
            {section.items.map((item, i) => (
              <Text key={i} style={styles.ingredient}>• {item}</Text>
            ))}
          </View>
        ))}
        
        <Text style={styles.sectionTitle}>Instructions</Text>
        {recipe.instructions.map((instruction, idx) => (
          <View key={idx} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{instruction}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
```

**Empty State**
```javascript
const EmptyState = ({ onAddRecipe }) => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyTitle}>No recipes yet</Text>
    <Text style={styles.emptyText}>
      Add your first recipe to get started
    </Text>
    <TouchableOpacity style={styles.button} onPress={onAddRecipe}>
      <Text style={styles.buttonText}>Add Recipe</Text>
    </TouchableOpacity>
  </View>
);
```

#### Deliverables
- ✅ Recipe list with grid layout
- ✅ Recipe detail view complete
- ✅ Empty states implemented
- ✅ Responsive on all screen sizes
- ✅ Images loading correctly

---

### Phase 4: Camera & Upload (Week 4)

**Objective:** Implement photo capture and upload functionality

#### Tasks

**Camera Integration**
```javascript
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos');
        return false;
      }
    }
    return true;
  };
  
  const takePicture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  return (
    <View style={styles.container}>
      {!image ? (
        <View style={styles.uploadOptions}>
          <TouchableOpacity style={styles.option} onPress={takePicture}>
            <Text style={styles.optionText}>📷 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={pickImage}>
            <Text style={styles.optionText}>🖼️ Choose from Library</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <PreviewScreen image={image} onRetake={() => setImage(null)} />
      )}
    </View>
  );
};
```

**Platform-Specific Handling**
```javascript
import { Platform } from 'react-native';

const CameraButton = () => {
  if (Platform.OS === 'web') {
    return (
      <input
        type="file"
        accept="image/*"
        onChange={handleWebUpload}
        style={{ display: 'none' }}
        ref={fileInputRef}
      />
    );
  }
  
  return (
    <TouchableOpacity onPress={takePicture}>
      <Text>Take Photo</Text>
    </TouchableOpacity>
  );
};
```

#### Deliverables
- ✅ Camera working on iOS/Android
- ✅ File picker working on web
- ✅ Image preview functional
- ✅ Platform differences handled
- ✅ Permissions managed correctly

---

### Phase 5: Storage Layer (Week 5)

**Objective:** Implement cross-platform data persistence

#### Tasks

**AsyncStorage Wrapper**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async get(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? { key, value } : null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },
  
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      return { key, value };
    } catch (e) {
      console.error('Storage set error:', e);
      return null;
    }
  },
  
  async delete(key) {
    try {
      await AsyncStorage.removeItem(key);
      return { key, deleted: true };
    } catch (e) {
      console.error('Storage delete error:', e);
      return null;
    }
  },
  
  async list(prefix) {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const filtered = keys.filter(k => k.startsWith(prefix));
      return { keys: filtered };
    } catch (e) {
      console.error('Storage list error:', e);
      return { keys: [] };
    }
  },
};
```

**Recipe Management**
```javascript
export const RecipeService = {
  async loadAllRecipes() {
    const result = await storage.list('recipe:');
    const recipes = [];
    
    for (const key of result.keys) {
      const data = await storage.get(key);
      if (data && data.value) {
        recipes.push(JSON.parse(data.value));
      }
    }
    
    return recipes.sort((a, b) => b.id - a.id);
  },
  
  async saveRecipe(recipe) {
    const key = `recipe:${recipe.id}`;
    const value = JSON.stringify(recipe);
    return await storage.set(key, value);
  },
  
  async deleteRecipe(id) {
    return await storage.delete(`recipe:${id}`);
  },
};
```

**Data Migration from Web**
```javascript
export const migrateFromLocalStorage = async () => {
  // For web platform only
  if (Platform.OS !== 'web') return;
  
  try {
    // Check if localStorage has data
    const keys = Object.keys(localStorage).filter(k => k.startsWith('recipe:'));
    
    for (const key of keys) {
      const value = localStorage.getItem(key);
      await AsyncStorage.setItem(key, value);
    }
    
    return { migrated: keys.length };
  } catch (e) {
    console.error('Migration error:', e);
    return { migrated: 0 };
  }
};
```

#### Deliverables
- ✅ AsyncStorage wrapper complete
- ✅ CRUD operations working
- ✅ Data persists across sessions
- ✅ Works on all platforms
- ✅ Migration utility ready

---

### Phase 6: API Integration (Week 6)

**Objective:** Connect to Anthropic API for recipe extraction

#### Tasks

**API Client**
```javascript
import * as FileSystem from 'expo-file-system';

export const AnthropicAPI = {
  async extractRecipe(imageUri) {
    try {
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Call Vercel serverless function
      const response = await fetch('YOUR_VERCEL_URL/api/extract-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          type: 'image/jpeg',
          prompt: `Extract this recipe as JSON with these fields: title, servings, prepTime, cookTime, ingredientSections, instructions.

Format:
{
  "title": "Recipe Name",
  "servings": "4",
  "prepTime": "15 minutes",
  "cookTime": "30 minutes", 
  "ingredientSections": [
    {"title": "Ingredients", "items": ["item 1", "item 2"]}
  ],
  "instructions": ["step 1", "step 2"]
}

Return only valid JSON, no markdown.`,
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Parse response
      const text = data.content.find(i => i.type === 'text').text
        .replace(/```json\n?/g, '')
        .replace(/```/g, '')
        .trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.error('Recipe extraction error:', error);
      throw error;
    }
  },
};
```

**Loading States**
```javascript
const [loading, setLoading] = useState(false);
const [progress, setProgress] = useState('');

const extractRecipe = async (imageUri) => {
  setLoading(true);
  setProgress('Analyzing image...');
  
  try {
    const extracted = await AnthropicAPI.extractRecipe(imageUri);
    
    setProgress('Creating recipe...');
    const recipe = {
      id: Date.now(),
      ...extracted,
      image: imageUri,
      dateAdded: new Date().toLocaleDateString(),
    };
    
    await RecipeService.saveRecipe(recipe);
    setProgress('Complete!');
    
    // Navigate to recipe
    navigation.navigate('RecipeDetail', { recipe });
  } catch (error) {
    Alert.alert('Error', 'Failed to extract recipe: ' + error.message);
  } finally {
    setLoading(false);
    setProgress('');
  }
};
```

#### Deliverables
- ✅ API integration working
- ✅ Recipe extraction functional
- ✅ Loading indicators implemented
- ✅ Error handling complete
- ✅ End-to-end flow working

---

### Phase 7: UI Polish & Animations (Week 7)

**Objective:** Polish user interface and add smooth animations

#### Tasks

**Animations**
```javascript
import { Animated } from 'react-native';

const FadeInView = ({ children, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};
```

**Platform-Specific Styles**
```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
});
```

**Responsive Design**
```javascript
import { useWindowDimensions } from 'react-native';

const RecipeList = () => {
  const { width } = useWindowDimensions();
  
  // Responsive columns
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const cardWidth = (width - (numColumns + 1) * 16) / numColumns;
  
  return (
    <FlatList
      data={recipes}
      numColumns={numColumns}
      key={numColumns} // Force re-render on column change
      renderItem={({ item }) => (
        <View style={[styles.card, { width: cardWidth }]}>
          {/* ... */}
        </View>
      )}
    />
  );
};
```

#### Deliverables
- ✅ Smooth animations
- ✅ Platform-appropriate styling
- ✅ Responsive layouts
- ✅ Touch feedback
- ✅ Polish throughout

---

### Phase 8: Testing & Bug Fixes (Week 8)

**Objective:** Comprehensive testing and issue resolution

#### Tasks

**Test Matrix**

| Platform | Device | Test Cases |
|----------|--------|------------|
| **iOS** | iPhone (Expo Go) | Camera, storage, navigation, UI |
| **Android** | Emulator | Camera, storage, navigation, UI |
| **Web** | Chrome | File upload, storage, navigation, responsive |
| **Web** | Safari | Compatibility, storage |
| **Web** | Firefox | Compatibility |

**Unit Tests**
```javascript
// __tests__/storage.test.js
import { storage } from '../utils/storage';

describe('Storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });
  
  test('should save and retrieve data', async () => {
    await storage.set('test', 'value');
    const result = await storage.get('test');
    expect(result.value).toBe('value');
  });
  
  test('should list keys with prefix', async () => {
    await storage.set('recipe:1', 'data1');
    await storage.set('recipe:2', 'data2');
    await storage.set('other:1', 'data3');
    
    const result = await storage.list('recipe:');
    expect(result.keys.length).toBe(2);
  });
});
```

**Integration Tests**
```javascript
// __tests__/recipeFlow.test.js
describe('Recipe Flow', () => {
  test('should create and retrieve recipe', async () => {
    const recipe = {
      id: 123,
      title: 'Test Recipe',
      ingredients: ['flour', 'water'],
      instructions: ['mix', 'bake'],
    };
    
    await RecipeService.saveRecipe(recipe);
    const recipes = await RecipeService.loadAllRecipes();
    
    expect(recipes[0].title).toBe('Test Recipe');
  });
});
```

#### Deliverables
- ✅ All platforms tested
- ✅ Critical bugs fixed
- ✅ Unit tests passing
- ✅ Integration tests passing
- ✅ Performance acceptable

---

### Phase 9: Deployment (Week 9)

**Objective:** Deploy to production on all platforms

#### Web Deployment

```bash
# Build for web
npx expo export --platform web

# The output will be in the dist/ folder
# Deploy dist/ folder to Vercel
```

**Vercel Configuration**
```json
{
  "buildCommand": "npx expo export --platform web",
  "outputDirectory": "dist",
  "framework": null
}
```

#### iOS Build

```bash
# Set up EAS Build (first time)
npm install -g eas-cli
eas login
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### Android Build

```bash
# Build for Android
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

**EAS Configuration (eas.json)**
```json
{
  "build": {
    "production": {
      "node": "18.0.0",
      "ios": {
        "buildConfiguration": "Release",
        "scheme": "FamilyPlate"
      },
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-app-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account.json",
        "track": "production"
      }
    }
  }
}
```

#### Deliverables
- ✅ Web deployed to Vercel
- ✅ iOS build complete
- ✅ Android build complete
- ✅ All platforms in production

---

## Code Reusability Analysis

### Directly Reusable from Current App (~60%)

These can be migrated with adaptation to React Native:

- Business logic functions
- Data models and types
- API integration logic (with fetch)
- Recipe extraction prompts
- Storage abstraction pattern
- Image compression logic

### Requires React Native Adaptation (~35%)

UI components need React Native equivalents:

**Mapping:**
```javascript
// Web (Current)          →  React Native
<div>                     →  <View>
<span>, <p>               →  <Text>
<img>                     →  <Image>
<button>                  →  <TouchableOpacity> + <Text>
<input type="file">       →  <ImagePicker>
className="..."           →  style={styles...}
onClick                   →  onPress
```

### Platform-Specific (~5%)

Different implementation per platform:

- Camera (mobile) vs File picker (web)
- Navigation gestures
- Status bar handling
- Storage optimization
- Platform-specific styling

---

## Timeline & Milestones

### 9-Week Detailed Schedule

| Week | Focus | Deliverable |
|------|-------|-------------|
| **Week 1** | Setup | Working project on all platforms |
| **Week 2** | Navigation | All screens navigable |
| **Week 3** | Recipe List | Library UI complete |
| **Week 4** | Camera | Photo capture working |
| **Week 5** | Storage | Data persistence functional |
| **Week 6** | API | Recipe extraction working |
| **Week 7** | Polish | Animations and responsive design |
| **Week 8** | Testing | All bugs fixed, tests passing |
| **Week 9** | Deploy | Live on web, iOS, Android |

---

## Success Criteria

### Technical Metrics

- [ ] App loads in <2 seconds on all platforms
- [ ] <1% crash rate
- [ ] 60 FPS animations on mobile
- [ ] Offline functionality working
- [ ] All current features implemented

### Business Metrics

- [ ] Single codebase maintained
- [ ] 1,000+ downloads in first month
- [ ] 4+ star average rating
- [ ] 60%+ 30-day retention
- [ ] Positive user reviews

---

## Risk Assessment

### High-Risk Items

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Web performance** | Medium | Optimize bundle, lazy loading |
| **Platform differences** | Medium | Test continuously, platform-specific code |
| **App Store rejection** | High | Follow guidelines strictly |
| **Learning curve** | Medium | Team training, documentation |

### Mitigation Strategies

1. **Web Performance:** Code splitting, lazy loading, bundle optimization
2. **Platform Testing:** Test on real devices weekly
3. **App Store:** Follow all guidelines, prepare appeals
4. **Team Training:** React Native workshops, pair programming

---

## Resource Requirements

### Team Structure

| Role | Allocation | Responsibilities |
|------|-----------|------------------|
| **React Native Developer** | 1 FTE | Core development |
| **UI/UX Designer** | 0.3 FTE | Mobile UI design |
| **QA Engineer** | 0.5 FTE | Testing all platforms |
| **DevOps** | 0.2 FTE | EAS Build, deployment |

### Infrastructure

- **Expo EAS Build:** $29/month (priority builds)
- **Vercel Hosting:** Free tier (web)
- **Apple Developer:** $99/year
- **Google Play:** $25 one-time
- **Testing Devices:** iPhone + Android (existing)

### Total Cost Estimate

**Development:** $50,000 - $70,000 (9 weeks)
**Infrastructure:** ~$500/year
**Total Year 1:** $50,500 - $70,500

**Compared to separate apps:** $80,000 - $120,000 (20 weeks)
**Savings:** $29,500 - $49,500 (38-41% cost reduction)

---

## Post-Launch Maintenance

### Ongoing Support

**Weeks 1-4 (Critical):**
- Daily crash monitoring
- Quick fixes for critical bugs
- Respond to app store reviews
- OTA updates for minor fixes

**Months 2-3 (Stabilization):**
- Weekly updates
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
- [Architectural Decisions](../project-management/decisions.md)

---

## Changelog

### Version 2.0.0 (December 10, 2025)
- **MAJOR CHANGE:** Updated for React Native Web approach
- Changed from separate apps (20 weeks) to single codebase (9 weeks)
- Updated all code examples for React Native
- Revised timeline and cost estimates
- Added platform-specific guidance
- Client requirement documented (single codebase mandate)

### Version 1.0.0 (December 10, 2025)
- Initial React Native migration plan (separate apps approach)

---

**Document Status:** ✅ Complete and aligned with client requirements
**Next Review:** After Phase 1 completion
- Resource requirements estimated

- Timeline established (20 weeks)
