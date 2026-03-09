import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface OrderSummaryProps {
  subtotal: number;
  tax: number;
  discount?: number;
  total: number;
  itemCount: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal = 0,
  tax = 0,
  discount = 0,
  total = 0,
  itemCount = 0,
}) => {
  return (
    <View style={styles.container}>
      {/* Order Amount */}
      <View style={styles.row}>
        <Text style={styles.label}>Order Amount</Text>
        <Text style={styles.value}>₹ {(subtotal || 0).toFixed(2)}</Text>
      </View>

      {/* Tax */}
      <View style={styles.row}>
        <Text style={styles.label}>Tax</Text>
        <Text style={styles.value}>₹ {(tax || 0).toFixed(2)}</Text>
      </View>

      {/* Discount */}
      {(discount || 0) > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Discount</Text>
          <Text style={[styles.value, { color: COLORS.success }]}>
            - ₹ {(discount || 0).toFixed(2)}
          </Text>
        </View>
      )}

      {/* Total Payment */}
      <View style={styles.totalRow}>
        <View style={styles.totalLeft}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.itemCount}>({itemCount || 0} Items)</Text>
        </View>
        <Text style={styles.totalValue}>₹ {(total || 0).toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.text,
  },
  value: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.xs,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: SPACING.xs,
  },
  totalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  totalLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.light,
    color: COLORS.text,
  },
  itemCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.textSecondary,
  },
  totalValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
});
