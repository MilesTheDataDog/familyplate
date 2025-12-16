# Navigation Setup Documentation

**Week 2, Day 1**  
**Date:** December 15, 2025  
**Status:** ✅ Complete

---

## Overview

This document describes the navigation system implemented for FamilyPlate using React Navigation 7. The app uses a Drawer Navigator to provide a hamburger menu for accessing all main screens.

---

## Navigation Architecture

### Navigator Type: Drawer Navigator

**Rationale:** 
- Provides easy access to all main screens
- Common pattern in mobile apps
- Works well on both mobile and web
- Allows for future expansion

### Navigation Flow

```
NavigationContainer
└── DrawerNavigator
    ├── Home (HomeScreen)
    ├── Upload (UploadScreen)
    ├── Library (LibraryScreen)
    ├── RecipeDetail (RecipeDetailScreen)
    └── Shopping (ShoppingScreen)
```

---

## Implemented Screens

### 1. HomeScreen
**Route:** `Home`  
**Purpose:** Welcome screen with app overview and quick actions

**Features:**
- Welcome message
- Recipe statistics (0 recipes initially)
- Quick action buttons (Add Recipe, View Library)
- Footer with guidance text

**Navigation Actions:**
- Navigate to Upload screen
- Navigate to Library screen

---

### 2. UploadScreen
**Route:** `Upload`  
**Purpose:** Camera/photo upload interface for adding recipes

**Features:**
- Two upload options (Take Photo, Choose from Library)
- Tips for best photo capture results
- Placeholder for Week 4 camera implementation

**Future Implementation (Week 4):**
- Camera integration
- Image picker
- Image preview

---

### 3. LibraryScreen
**Route:** `Library`  
**Purpose:** Display all saved recipes in grid layout

**Features:**
- Header with recipe count
- Empty state with "Add Recipe" call-to-action
- Placeholder for recipe grid (Week 3)

**Future Implementation (Week 3):**
- Recipe card components
- Grid layout (2 columns mobile, 3+ columns web)
- Recipe search and filtering

---

### 4. RecipeDetailScreen
**Route:** `RecipeDetail`  
**Purpose:** Display full recipe details

**Features:**
- Recipe title and metadata (servings, prep time, cook time)
- Ingredients list with sections
- Step-by-step instructions with numbered steps
- Edit and Delete action buttons
- Mock data for demonstration

**Future Implementation:**
- Accept recipe data via route params (Week 3)
- Delete functionality (Week 5)
- Edit functionality (future version)

---

### 5. ShoppingScreen
**Route:** `Shopping`  
**Purpose:** Placeholder for future shopping list feature

**Features:**
- "Coming Soon" message
- List of planned features
- Informational card

**Future Implementation:**
- Generate shopping lists from recipes
- Check off items
- Combine multiple recipes
- Organize by store sections

---

## Theme Integration

All screens use the centralized theme system created in Week 1:

### Theme Applied To:
- **Colors:** Primary, secondary, background, surface, text colors
- **Spacing:** Consistent padding and margins using theme.spacing
- **Typography:** Unified text styles (title, heading, subheading, body)
- **Border Radius:** Consistent rounded corners
- **Shadows:** Elevation effects for cards

### Navigation-Specific Theming:
```javascript
screenOptions={{
  headerStyle: {
    backgroundColor: theme.colors.primary,  // Orange header
  },
  headerTintColor: '#FFFFFF',              // White text
  headerTitleStyle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  drawerActiveTintColor: theme.colors.primary,
  drawerInactiveTintColor: theme.colors.textSecondary,
  drawerStyle: {
    backgroundColor: theme.colors.background,
  },
}}
```

---

## File Structure

```
FamilyPlateNative/
├── App.js                          # Navigation setup
├── constants/
│   └── theme.js                    # Theme configuration (Week 1)
├── screens/
│   ├── HomeScreen.js              # Home/welcome screen
│   ├── UploadScreen.js            # Photo upload interface
│   ├── LibraryScreen.js           # Recipe library grid
│   ├── RecipeDetailScreen.js     # Recipe details view
│   └── ShoppingScreen.js          # Shopping list (placeholder)
└── docs/
    └── week2/
        └── navigation-setup.md    # This document
```

---

## Dependencies Used

All dependencies verified as installed (from package.json):

```json
{
  "@react-navigation/native": "^7.1.25",
  "@react-navigation/drawer": "^7.7.9",
  "@react-navigation/stack": "^7.6.12",
  "react-native-screens": "~4.16.0",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-gesture-handler": "~2.28.0",
  "react-native-reanimated": "~4.1.1"
}
```

---

## Code Quality

### JSDoc Comments
✅ All components documented with JSDoc comments including:
- Component description
- @param tags for props
- @returns tags for return values
- Function-level documentation for handlers

### Example:
```javascript
/**
 * HomeScreen - Welcome screen with app overview and quick stats
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} HomeScreen component
 */
export default function HomeScreen({ navigation }) {
  // ...
}
```

---

## Testing Strategy

**Week 2:** Tests deferred to end of week as confirmed  
**Week 8:** Comprehensive testing phase

### Planned Tests:
- Navigation flow tests (screen transitions)
- Drawer open/close functionality
- Theme application verification
- Cross-platform compatibility (web, iOS, Android)

---

## Navigation Patterns

### Opening the Drawer
Users can access the drawer menu by:
1. Tapping the hamburger icon (☰) in the header
2. Swiping from the left edge of the screen (mobile)

### Screen Transitions
```javascript
// Navigate to another screen
navigation.navigate('ScreenName');

// Navigate with parameters
navigation.navigate('RecipeDetail', { recipe: recipeData });

// Go back
navigation.goBack();
```

---

## Platform Considerations

### Web
- Drawer appears as side menu
- Hamburger icon in header
- Mouse hover effects on drawer items

### Mobile (iOS/Android)
- Drawer slides in from left
- Swipe gesture to open/close
- Touch-friendly spacing

### Responsive Behavior
- All screens use `flex: 1` for full-screen layout
- Theme spacing scales appropriately
- Text remains readable on all screen sizes

---

## Known Limitations (To Be Addressed)

1. **Week 3:** Recipe grid not yet implemented in LibraryScreen
2. **Week 4:** Camera functionality placeholder in UploadScreen
3. **Week 5:** Delete/Edit actions not yet functional
4. **Future:** Shopping list feature not yet built

---

## Next Steps (Week 2, Day 2)

1. ✅ Verify navigation works on web browser
2. Test drawer open/close functionality
3. Test all screen transitions
4. Verify theme consistency across all screens
5. Document any issues found
6. Continue with Week 2 remaining tasks

---

## Compliance with 12 Factor App

### I. Codebase
✅ Single codebase tracked in Git, deployed to multiple platforms (web, iOS, Android)

### II. Dependencies
✅ All dependencies explicitly declared in package.json

### III. Config
✅ Theme configuration stored in `constants/theme.js` (can be moved to environment variables)

### IV. Backing Services
✅ Navigation treated as attached resource through React Navigation

### V. Build, Release, Run
✅ Separate build stages (Expo build) from runtime

### VI. Processes
✅ Stateless processes - navigation state managed by React Navigation

### X. Dev/Prod Parity
✅ Same navigation code runs in development and production

---

## Compliance with Sandi Metz Rules

### Rule 1: Classes < 100 Lines
✅ All screen files under 100 lines:
- HomeScreen.js: ~95 lines
- UploadScreen.js: ~90 lines
- LibraryScreen.js: ~85 lines
- RecipeDetailScreen.js: ~98 lines
- ShoppingScreen.js: ~70 lines
- App.js: ~50 lines

### Rule 2: Methods < 5 Lines
✅ All handler methods are simple and under 5 lines
- Example: `handleTakePhoto()`, `handleDelete()`

### Rule 3: < 4 Parameters
✅ All functions accept navigation/route props object (1-2 params max)

### Rule 4: Controllers Instantiate One Object
✅ Each screen instantiates only necessary components

### Rule 5: Views Know One Instance Variable
✅ Each screen component manages minimal state (mock data for now)

---

## Platform-Specific Considerations

### Shadow Handling (Web vs Native)

**Issue:** React Native Web does not support `shadowColor`, `shadowOffset`, `shadowOpacity`, or `shadowRadius` properties. These cause deprecation warnings on web.

**Solution:** Implemented `getShadow()` function in `theme.js` that returns platform-appropriate shadow styles.

```javascript
// theme.js
export const getShadow = (elevation = 3) => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
  }
  
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: elevation,
  };
};
```

**Usage in Screens:**
```javascript
import { theme, getShadow } from '../constants/theme';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...getShadow(),  // Platform-specific shadows
  },
});
```

**Benefits:**
- ✅ No warnings on web
- ✅ Proper shadows on iOS (shadowColor, shadowOffset, etc.)
- ✅ Proper shadows on Android (elevation)
- ✅ Consistent visual appearance across platforms

---

## Changelog

### Version 1.1.0 (December 15, 2025)
- **Fixed:** Shadow deprecation warnings on web
- **Added:** Platform-specific `getShadow()` function
- **Updated:** All 5 screens to use `getShadow()`
- **Updated:** theme.js with JSDoc comments for new function

### Version 1.0.0 (December 15, 2025)
- Initial navigation setup
- 5 screens created with theme integration
- Drawer navigator implemented
- JSDoc comments added to all components
- Documentation created

---

**Document Status:** ✅ Complete  
**Next Review:** End of Week 2