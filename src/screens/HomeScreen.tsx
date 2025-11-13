import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Button } from '../components';
import { useAuthStore } from '../store';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

export const HomeScreen: React.FC = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Urban Kashmir!</Text>
        <Text style={styles.subtitle}>
          A clean and scalable React Native architecture
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>✨ Features</Text>
          <Text style={styles.infoText}>• Zustand for state management</Text>
          <Text style={styles.infoText}>• Axios for API calls</Text>
          <Text style={styles.infoText}>• Clean folder structure</Text>
          <Text style={styles.infoText}>• TypeScript support</Text>
          <Text style={styles.infoText}>• Custom hooks</Text>
          <Text style={styles.infoText}>• Standalone API services</Text>
        </View>

        {user && (
          <View style={styles.userBox}>
            <Text style={styles.userText}>Logged in as: {user.name}</Text>
            <Button
              title="Logout"
              variant="outline"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  infoBox: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.lg,
  },
  infoTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.darkGray,
    marginBottom: SPACING.sm,
  },
  userBox: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  userText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: SPACING.sm,
  },
});
