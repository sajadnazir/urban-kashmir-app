import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface BuyButtonProps {
  price: number;
  onPress: () => void;
  buttonText?: string;
  disabled?: boolean;
}

export const BuyButton: React.FC<BuyButtonProps> = ({
  price,
  onPress,
  buttonText = 'Buy Now',
  disabled = false,
}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>₹ {price.toFixed(1)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.8}
        >
          <Icon name="shopping-bag" size={18} color={COLORS.background} />
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGray,
    borderRadius: 35,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  priceContainer: {
    paddingLeft: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkGray,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 25,
    gap: SPACING.xs,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
});
