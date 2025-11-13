import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

interface PromoCodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onApply: () => void;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChangeText,
  onApply,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Promo Code"
        placeholderTextColor={COLORS.gray}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity
        style={styles.applyButton}
        onPress={onApply}
        activeOpacity={0.8}
      >
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: SPACING.lg,
    gap: SPACING.md,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.background,
    borderRadius: 28,
    paddingHorizontal: SPACING.lg,
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.regular,
    color: COLORS.text,
  },
  applyButton: {
    height: 56,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.darkGray,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    fontSize: FONT_SIZES.md,
    fontFamily: FONTS.semiBold,
    color: COLORS.background,
  },
});
