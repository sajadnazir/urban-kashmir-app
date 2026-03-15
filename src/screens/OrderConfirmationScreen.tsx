import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

const { width } = Dimensions.get('window');

interface OrderConfirmationScreenProps {
  success: boolean;
  orderNumber?: string;
  errorMessage?: string;
  onContinueShopping: () => void;
  onRetry?: () => void;
}

export const OrderConfirmationScreen: React.FC<OrderConfirmationScreenProps> = ({
  success,
  orderNumber,
  errorMessage,
  onContinueShopping,
  onRetry,
}) => {
  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={[
            styles.iconContainer,
            { backgroundColor: success ? '#ECFDF5' : '#FEF2F2' }
          ]}>
            <Icon 
              name={success ? "check-circle" : "alert-circle"} 
              size={64} 
              color={success ? '#10B981' : '#EF4444'} 
            />
          </View>

          <Text style={styles.title}>
            {success ? 'Thank You!' : 'Order Failed'}
          </Text>
          
          <Text style={styles.subtitle}>
            {success 
              ? `Your order has been placed successfully. ${orderNumber ? `Order number is #${orderNumber}` : 'We are processing your request.'}`
              : errorMessage || 'Something went wrong while placing your order. Please try again.'
            }
          </Text>

          {success && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="package" size={18} color={COLORS.gray} />
                <Text style={styles.infoText}>We'll send you an email confirmation shortly.</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="truck" size={18} color={COLORS.gray} />
                <Text style={styles.infoText}>Standard delivery usually takes 3-5 business days.</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          {!success && onRetry && (
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={onRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.continueButton, !success && styles.continueButtonSecondary]} 
            onPress={onContinueShopping}
            activeOpacity={0.8}
          >
            <Text style={[styles.continueButtonText, !success && styles.continueButtonTextSecondary]}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    justifyContent: 'space-between',
    paddingBottom: SPACING.xl,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
    marginBottom: SPACING.md,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: SPACING.md,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    width: '100%',
    gap: SPACING.md,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonSecondary: {
    backgroundColor: '#F3F4F6',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  continueButtonTextSecondary: {
    color: '#4B5563',
  },
  retryButton: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
});
