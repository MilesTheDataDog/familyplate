import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme, getShadow } from '../constants/theme';

/**
 * RecipeDetailScreen - Displays full recipe details including ingredients and instructions
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @param {Object} props.route - Route object containing recipe data
 * @returns {JSX.Element} RecipeDetailScreen component
 */
export default function RecipeDetailScreen({ navigation, route }) {
  // Mock recipe data - will be replaced with actual data from route params in Week 3
  const recipe = route.params?.recipe || {
    title: 'Sample Recipe',
    servings: '4',
    prepTime: '15 minutes',
    cookTime: '30 minutes',
    ingredientSections: [
      {
        title: 'Ingredients',
        items: ['2 cups flour', '1 cup sugar', '3 eggs', '1 tsp vanilla'],
      },
    ],
    instructions: [
      'Preheat oven to 350°F',
      'Mix dry ingredients in a bowl',
      'Add wet ingredients and stir',
      'Bake for 30 minutes',
    ],
  };

  /**
   * Handles recipe deletion
   */
  const handleDelete = () => {
    // TODO: Implement in Week 5 with storage
    console.log('Delete recipe');
  };

  /**
   * Handles recipe editing
   */
  const handleEdit = () => {
    // TODO: Implement in future versions
    console.log('Edit recipe');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.metadataContainer}>
          {recipe.servings && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Servings:</Text>
              <Text style={styles.metadataValue}>{recipe.servings}</Text>
            </View>
          )}
          {recipe.prepTime && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Prep:</Text>
              <Text style={styles.metadataValue}>{recipe.prepTime}</Text>
            </View>
          )}
          {recipe.cookTime && (
            <View style={styles.metadataItem}>
              <Text style={styles.metadataLabel}>Cook:</Text>
              <Text style={styles.metadataValue}>{recipe.cookTime}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredientSections.map((section, idx) => (
          <View key={idx} style={styles.ingredientSection}>
            {section.title && section.title !== 'Ingredients' && (
              <Text style={styles.sectionSubtitle}>{section.title}</Text>
            )}
            {section.items.map((item, i) => (
              <Text key={i} style={styles.ingredientItem}>• {item}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {recipe.instructions.map((instruction, idx) => (
          <View key={idx} style={styles.instructionStep}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <Text style={styles.stepText}>{instruction}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    ...getShadow(),
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  metadataLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  metadataValue: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.heading,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  sectionSubtitle: {
    ...theme.typography.subheading,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  ingredientSection: {
    marginBottom: theme.spacing.md,
  },
  ingredientItem: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepNumberText: {
    ...theme.typography.subheading,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
    paddingTop: theme.spacing.xs,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  editButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  editButtonText: {
    ...theme.typography.subheading,
    color: theme.colors.primary,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF4444',
  },
  deleteButtonText: {
    ...theme.typography.subheading,
    color: '#EF4444',
  },
});