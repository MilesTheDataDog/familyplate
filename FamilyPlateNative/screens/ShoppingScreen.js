import { View, Text, StyleSheet } from 'react-native';
import { theme, getShadow } from '../constants/theme';

/**
 * ShoppingScreen - Placeholder screen for future shopping list feature
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} ShoppingScreen component
 */
export default function ShoppingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.placeholderContainer}>
        <Text style={styles.icon}>🛒</Text>
        <Text style={styles.title}>Shopping List</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
        <Text style={styles.description}>
          This feature will allow you to create shopping lists from your
          recipes. Stay tuned for updates!
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>📝 Planned Features:</Text>
        <Text style={styles.infoItem}>• Generate shopping lists from recipes</Text>
        <Text style={styles.infoItem}>• Combine multiple recipes into one list</Text>
        <Text style={styles.infoItem}>• Check off items as you shop</Text>
        <Text style={styles.infoItem}>• Organize by grocery store sections</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.heading,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...getShadow(),
  },
  infoTitle: {
    ...theme.typography.subheading,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
});