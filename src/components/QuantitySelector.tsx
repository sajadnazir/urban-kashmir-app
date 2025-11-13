import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, quantity <= min && styles.buttonDisabled]}
        onPress={onDecrease}
        disabled={quantity <= min}
        activeOpacity={0.7}
      >
        <Icon
          name="minus"
          size={16}
          color={quantity <= min ? COLORS.gray : COLORS.background}
        />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity
        style={[styles.button, quantity >= max && styles.buttonDisabled]}
        onPress={onIncrease}
        disabled={quantity >= max}
        activeOpacity={0.7}
      >
        <Icon
          name="plus"
          size={16}
          color={quantity >= max ? COLORS.gray : COLORS.background}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  quantity: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
    marginHorizontal: SPACING.md,
    minWidth: 24,
    textAlign: 'center',
  },
});
