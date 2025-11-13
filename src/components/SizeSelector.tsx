import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface SizeOption {
  id: string;
  label: string;
}

interface SizeSelectorProps {
  sizes: SizeOption[];
  selectedSize: string;
  onSelectSize: (sizeId: string) => void;
  title?: string;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  title = 'Sizes',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sizesContainer}>
        {sizes.map(size => (
          <TouchableOpacity
            key={size.id}
            style={[
              styles.sizeOption,
              selectedSize === size.id && styles.selectedSizeOption,
            ]}
            onPress={() => onSelectSize(size.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize === size.id && styles.selectedSizeText,
              ]}
            >
              {size.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  sizesContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flexWrap: 'wrap',
  },
  sizeOption: {
    minWidth: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  selectedSizeOption: {
    backgroundColor: COLORS.darkGray,
  },
  sizeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.textSecondary,
  },
  selectedSizeText: {
    color: COLORS.background,
  },
});
