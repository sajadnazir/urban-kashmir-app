import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface HeaderTwoProps {
  title?: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}

export const HeaderTwo: React.FC<HeaderTwoProps> = ({
  title,
  subtitle,
  leftIcon = 'chevron-left',
  rightIcon = 'share-2',
  onLeftPress,
  onRightPress,
  showLeftIcon = true,
  showRightIcon = true,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Left Icon */}
        {showLeftIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
            activeOpacity={0.7}
          >
            <Icon name={leftIcon} size={24} color={COLORS.text} />
          </TouchableOpacity>
        )}

        {/* Center Content */}
        {(title || subtitle) && (
          <View style={styles.centerContent}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}

        {/* Right Icon */}
        {showRightIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
            activeOpacity={0.7}
          >
            <Icon name={rightIcon} size={20} color={COLORS.text} />
          </TouchableOpacity>
        )}

        {/* Spacer when no right icon but need to center title */}
        {!showRightIcon && (title || subtitle) && (
          <View style={styles.spacer} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: 20,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  spacer: {
    width: 40,
  },
});
