import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from './constants/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>FamilyPlate</Text>
        <Text style={styles.subtitle}>Preserve your family recipes</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Week 1 Complete! ✅</Text>
        <Text style={styles.cardText}>
          Your theme includes colors, spacing, typography, and shadows.
        </Text>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.title,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
    maxWidth: 400,
    width: '100%',
  },
  cardTitle: {
    ...theme.typography.heading,
    marginBottom: theme.spacing.sm,
  },
  cardText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});