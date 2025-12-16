import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { theme, getShadow } from '../constants/theme';

/**
 * LibraryScreen - Displays all saved recipes in a grid layout
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} LibraryScreen component
 */
export default function LibraryScreen({ navigation }) {
  // Mock empty state for now - will be replaced with actual data in Week 5
  const recipes = [];

  /**
   * Renders empty state when no recipes exist
   * @returns {JSX.Element} Empty state component
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📚</Text>
      <Text style={styles.emptyTitle}>No recipes yet</Text>
      <Text style={styles.emptyText}>
        Add your first recipe to get started
      </Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Upload')}
      >
        <Text style={styles.addButtonText}>+ Add Recipe</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders recipe grid when recipes exist
   * @returns {JSX.Element} Recipe grid component
   */
  const renderRecipeGrid = () => (
    <ScrollView contentContainerStyle={styles.gridContainer}>
      {/* Recipe cards will be implemented in Week 3 */}
      <Text style={styles.placeholderText}>
        Recipe grid coming in Week 3
      </Text>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Library</Text>
        <Text style={styles.subtitle}>
          {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>

      {recipes.length === 0 ? renderEmptyState() : renderRecipeGrid()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...getShadow(),
  },
  title: {
    ...theme.typography.heading,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...getShadow(),
  },
  addButtonText: {
    ...theme.typography.subheading,
    color: '#FFFFFF',
  },
  gridContainer: {
    padding: theme.spacing.lg,
  },
  placeholderText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
});