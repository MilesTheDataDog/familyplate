import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

// Import theme
import { theme } from './constants/theme';


// Import screens
import HomeScreen from './screens/HomeScreen';
import UploadScreen from './screens/UploadScreen';
import LibraryScreen from './screens/LibraryScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import ShoppingScreen from './screens/ShoppingScreen';

// Create Drawer Navigator
const Drawer = createDrawerNavigator();

/**
 * FamilyPlate App - Main application component with navigation
 * @returns {JSX.Element} App component with drawer navigation
 */
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textSecondary,
          drawerStyle: {
            backgroundColor: theme.colors.background,
          },
          drawerLabelStyle: {
            fontSize: 16,
            fontWeight: '600',
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'FamilyPlate',
            drawerLabel: '🏠 Home',
          }}
        />
        <Drawer.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            title: 'Add Recipe',
            drawerLabel: '📷 Add Recipe',
          }}
        />
        <Drawer.Screen
          name="Library"
          component={LibraryScreen}
          options={{
            title: 'Recipe Library',
            drawerLabel: '📚 Library',
          }}
        />
        <Drawer.Screen
          name="RecipeDetail"
          component={RecipeDetailScreen}
          options={{
            title: 'Recipe Details',
            drawerLabel: '📖 Recipe Details',
          }}
        />
        <Drawer.Screen
          name="Shopping"
          component={ShoppingScreen}
          options={{
            title: 'Shopping List',
            drawerLabel: '🛒 Shopping List',
          }}
        />
      </Drawer.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}