import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { addressService, orderService } from '../api';
import type { Address } from '../types/address';
import type { PaymentMethod } from '../types/order';

interface CheckoutScreenProps {
  onBack?: () => void;
  onOrderSuccess?: (orderId: number, orderNumber?: string) => void;
  onOrderError?: (errorMessage: string) => void;
  cartTotal: number;
  cartSubtotal: number;
  cartTax: number;
  cartDiscount: number;
  itemCount: number;
}

const SHIPPING_METHODS = [
  { key: 'standard', label: 'Standard Delivery', time: '3–5 days', price: 0 },
  { key: 'express', label: 'Express Delivery', time: '1–2 days', price: 120 },
];

const PAYMENT_ICONS: Record<string, string> = {
  cod: 'dollar-sign',
  razorpay: 'credit-card',
  paytm: 'smartphone',
};

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  onBack,
  onOrderSuccess,
  onOrderError,
  cartTotal,
  cartSubtotal,
  cartTax,
  cartDiscount,
  itemCount,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const extraShippingCharge = SHIPPING_METHODS.find(m => m.key === selectedShipping)?.price ?? 0;
  const codCharge = selectedPayment === 'cod' ? (paymentMethods.find(p => p.method === 'cod')?.charges ?? 0) : 0;
  const grandTotal = cartTotal + extraShippingCharge + codCharge;

  const loadData = useCallback(async () => {
    try {
      setIsLoadingAddresses(true);
      const addrs = await addressService.getAddresses();
      const list = Array.isArray(addrs) ? addrs : (addrs as any)?.data ?? [];
      setAddresses(list);
      const defaultAddr = list.find((a: Address) => a.is_default) ?? list[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load addresses' });
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  const loadPaymentMethods = useCallback(async () => {
    try {
      setIsLoadingPayments(true);
      const methods = await orderService.getPaymentMethods();
      const active = methods.filter(m => m.is_active);
      setPaymentMethods(active);
      if (active.length > 0 && !active.find(m => m.method === selectedPayment)) {
        setSelectedPayment(active[0].method);
      }
    } catch {
      // Fall back to COD only
      setPaymentMethods([{ method: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive', is_active: true, icon_url: null, charges: 50 }]);
    } finally {
      setIsLoadingPayments(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    loadPaymentMethods();
  }, [loadData, loadPaymentMethods]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      Toast.show({ type: 'error', text1: 'Select Address', text2: 'Please select a delivery address to continue' });
      return;
    }
    try {
      setIsPlacingOrder(true);
      const order = await orderService.placeOrder({
        shipping_address_id: selectedAddressId,
        billing_address_id: selectedAddressId,
        shipping_method: selectedShipping,
        payment_method: selectedPayment,
      });
      Toast.show({ type: 'success', text1: '🎉 Order Placed!', text2: `Order #${order.order_number || order.id} confirmed` });
      onOrderSuccess?.(order.id, order.order_number);
    } catch (error: any) {
      const msg = error?.response?.data?.message ?? error?.message ?? 'Failed to place order';
      Toast.show({ type: 'error', text1: 'Order Failed', text2: msg });
      onOrderError?.(msg);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const isLoading = isLoadingAddresses || isLoadingPayments;

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <HeaderTwo
        title="Checkout"
        leftIcon="chevron-left"
        onLeftPress={onBack}
        showRightIcon={false}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ────────── DELIVERY ADDRESS ────────── */}
          <SectionHeader title="Delivery Address" icon="map-pin" />
          {addresses.length === 0 ? (
            <View style={styles.emptyCard}>
              <Icon name="map-pin" size={24} color={COLORS.gray} />
              <Text style={styles.emptyCardText}>No addresses saved. Please add one first.</Text>
            </View>
          ) : (
            <FlatList
              data={addresses}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.addressListContent}
              renderItem={({ item: addr }) => {
                const selected = addr.id === selectedAddressId;
                return (
                  <TouchableOpacity
                    style={[styles.addrCard, selected && styles.addrCardSelected]}
                    onPress={() => setSelectedAddressId(addr.id)}
                    activeOpacity={0.7}
                  >
                    {/* Top row: type badge + check */}
                    <View style={styles.addrCardTop}>
                      <View style={[styles.typeBadge, selected && styles.typeBadgeSelected]}>
                        <Text style={[styles.typeBadgeText, selected && styles.typeBadgeTextSelected]}>
                          {(addr.type || 'home').toUpperCase()}
                        </Text>
                      </View>
                      {selected && (
                        <View style={styles.checkCircle}>
                          <Icon name="check" size={10} color="#fff" />
                        </View>
                      )}
                    </View>

                    {/* Name */}
                    <Text style={styles.addrName} numberOfLines={1}>{addr.full_name ?? '—'}</Text>

                    {/* Address */}
                    <Text style={styles.addrText} numberOfLines={2}>
                      {[addr.address_line_1, addr.city, addr.state]
                        .filter(Boolean).join(', ')}
                    </Text>

                    {addr.is_default && (
                      <View style={styles.defaultPill}>
                        <Text style={styles.defaultPillText}>Default</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}

          {/* ────────── SHIPPING METHOD ────────── */}
          <SectionHeader title="Shipping Method" icon="truck" />
          {SHIPPING_METHODS.map(m => {
            const selected = m.key === selectedShipping;
            return (
              <TouchableOpacity
                key={m.key}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => setSelectedShipping(m.key)}
                activeOpacity={0.7}
              >
                <View style={styles.cardRadio}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.methodLabel}>{m.label}</Text>
                  <Text style={styles.methodSub}>{m.time}</Text>
                </View>
                <Text style={[styles.methodPrice, m.price === 0 && styles.free]}>
                  {m.price === 0 ? 'FREE' : `₹${m.price}`}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* ────────── PAYMENT METHOD ────────── */}
          <SectionHeader title="Payment Method" icon="credit-card" />
          {paymentMethods.map(pm => {
            const selected = pm.method === selectedPayment;
            const iconName = PAYMENT_ICONS[pm.method] ?? 'credit-card';
            return (
              <TouchableOpacity
                key={pm.method}
                style={[styles.card, selected && styles.cardSelected]}
                onPress={() => setSelectedPayment(pm.method)}
                activeOpacity={0.7}
              >
                <View style={styles.cardRadio}>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                </View>
                <View style={[styles.paymentIconBox, selected && styles.paymentIconBoxActive]}>
                  <Icon name={iconName} size={18} color={selected ? COLORS.primary : COLORS.gray} />
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.methodLabel}>{pm.name}</Text>
                  <Text style={styles.methodSub}>{pm.description}</Text>
                  {pm.charges && pm.charges > 0 ? (
                    <Text style={styles.codCharge}>+₹{pm.charges} handling charge</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* ────────── ORDER SUMMARY ────────── */}
          <SectionHeader title="Order Summary" icon="file-text" />
          <View style={styles.summaryCard}>
            <SummaryRow label={`Subtotal (${itemCount} items)`} value={`₹${cartSubtotal.toFixed(2)}`} />
            {cartDiscount > 0 && (
              <SummaryRow label="Discount" value={`−₹${cartDiscount.toFixed(2)}`} color="#22C55E" />
            )}
            {cartTax > 0 && <SummaryRow label="Tax" value={`₹${cartTax.toFixed(2)}`} />}
            <SummaryRow
              label={`${SHIPPING_METHODS.find(s => s.key === selectedShipping)?.label}`}
              value={extraShippingCharge === 0 ? 'FREE' : `₹${extraShippingCharge}`}
              color={extraShippingCharge === 0 ? '#22C55E' : undefined}
            />
            {codCharge > 0 && <SummaryRow label="COD Charge" value={`₹${codCharge}`} />}
            <View style={styles.summaryDivider} />
            <SummaryRow label="Grand Total" value={`₹${grandTotal.toFixed(2)}`} bold />
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>
      )}

      {/* ────────── PLACE ORDER BUTTON ────────── */}
      {!isLoading && (
        <View style={styles.footer}>
          <View style={styles.footerTotal}>
            <Text style={styles.footerTotalLabel}>Total</Text>
            <Text style={styles.footerTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.placeOrderBtn, isPlacingOrder && styles.placeOrderBtnDisabled]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            activeOpacity={0.85}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.placeOrderText}>Confirm Order</Text>
                <Icon name="arrow-right" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

/* ─── Sub-Components ─────────────────────── */

const SectionHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <Icon name={icon} size={16} color={COLORS.primary} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const SummaryRow: React.FC<{
  label: string;
  value: string;
  bold?: boolean;
  color?: string;
}> = ({ label, value, bold, color }) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && styles.summaryBold]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && styles.summaryBold, color ? { color } : {}]}>
      {value}
    </Text>
  </View>
);

/* ─── Styles ──────────────────────────────── */

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#F8F9FA' },
  loader: { flex: 1, marginTop: 80 },
  scrollContent: { padding: SPACING.md, paddingBottom: 32 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    letterSpacing: -0.3,
  },

  // Cards
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
    gap: 12,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7F3',
  },
  cardRadio: { justifyContent: 'center' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: COLORS.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  cardBody: { flex: 1 },

  // Address horizontal scroll
  addressListContent: {
    paddingHorizontal: 4,
    paddingBottom: SPACING.sm,
    gap: 10,
  },
  addrCard: {
    width: 160,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  addrCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFF7F3',
  },
  addrCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#E0F2FE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  typeBadgeSelected: {
    backgroundColor: '#FEE8DF',
  },
  typeBadgeText: { fontSize: 10, fontWeight: FONT_WEIGHTS.bold, color: '#0284C7' },
  typeBadgeTextSelected: { color: COLORS.primary },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addrName: {
    fontSize: 13,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  addrText: {
    fontSize: 11,
    color: COLORS.gray,
    lineHeight: 16,
    marginBottom: 6,
  },
  defaultPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginTop: 2,
  },
  defaultPillText: { fontSize: 9, fontWeight: FONT_WEIGHTS.bold, color: '#16A34A' },

  emptyCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    marginBottom: SPACING.sm,
  },
  emptyCardText: { fontSize: FONT_SIZES.sm, color: COLORS.gray, flex: 1 },

  // Shipping & Payment
  methodLabel: { fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.semiBold, color: COLORS.text, marginBottom: 2 },
  methodSub: { fontSize: FONT_SIZES.sm, color: COLORS.gray },
  methodPrice: { fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text },
  free: { color: '#22C55E' },
  codCharge: { fontSize: 11, color: '#F59E0B', marginTop: 3 },

  paymentIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentIconBoxActive: { backgroundColor: '#FFF3EE' },

  // Summary card
  summaryCard: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: FONT_SIZES.sm, color: COLORS.gray },
  summaryValue: { fontSize: FONT_SIZES.sm, color: COLORS.text },
  summaryBold: { fontWeight: FONT_WEIGHTS.bold, fontSize: FONT_SIZES.md, color: COLORS.text },
  summaryDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: SPACING.sm },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  footerTotal: { flex: 1 },
  footerTotalLabel: { fontSize: 12, color: COLORS.gray, marginBottom: 2 },
  footerTotalValue: { fontSize: 20, fontWeight: FONT_WEIGHTS.bold, color: COLORS.text },
  placeOrderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  placeOrderBtnDisabled: { opacity: 0.7 },
  placeOrderText: { fontSize: FONT_SIZES.md, fontWeight: FONT_WEIGHTS.bold, color: '#fff' },
});
