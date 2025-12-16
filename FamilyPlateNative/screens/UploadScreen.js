import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, getShadow } from '../constants/theme';

/**
 * UploadScreen - Screen for capturing or selecting recipe photos
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation object
 * @returns {JSX.Element} UploadScreen component
 */
export default function UploadScreen({ navigation }) {
  /**
   * Handles taking a photo with camera
   */
  const handleTakePhoto = () => {
    // TODO: Implement in Week 4
    console.log('Take photo');
  };

  /**
   * Handles selecting photo from library
   */
  const handleChoosePhoto = () => {
    // TODO: Implement in Week 4
    console.log('Choose photo');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Recipe</Text>
        <Text style={styles.subtitle}>
          Take a photo or upload an image of your recipe
        </Text>
      </View>

      <View style={styles.uploadOptions}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleTakePhoto}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📷</Text>
          </View>
          <Text style={styles.optionTitle}>Take Photo</Text>
          <Text style={styles.optionDescription}>
            Use your camera to capture a recipe
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleChoosePhoto}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🖼️</Text>
          </View>
          <Text style={styles.optionTitle}>Choose from Library</Text>
          <Text style={styles.optionDescription}>
            Select an existing photo from your device
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>📝 Tips for best results:</Text>
        <Text style={styles.tipText}>• Ensure good lighting</Text>
        <Text style={styles.tipText}>• Keep text clear and readable</Text>
        <Text style={styles.tipText}>• Capture the entire recipe</Text>
        <Text style={styles.tipText}>• Avoid shadows and glare</Text>
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
  header: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
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
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  uploadOptions: {
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  optionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...getShadow(),
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  icon: {
    fontSize: 64,
  },
  optionTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    ...getShadow(),
  },
  tipsTitle: {
    ...theme.typography.subheading,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
});