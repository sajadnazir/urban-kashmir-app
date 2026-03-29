import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { orderService, tokenStorage } from '../api';
import { Order } from '../types/order';
import Icon from 'react-native-vector-icons/Feather';

// ─── Enum labels from spec ────────────────────────────────────────────────────

const CANCEL_REASONS: { value: string; label: string; icon: string }[] = [
  { value: 'changed_mind',         label: 'Changed my mind',       icon: 'refresh-cw' },
  { value: 'ordered_by_mistake',   label: 'Ordered by mistake',    icon: 'alert-triangle' },
  { value: 'found_better_price',   label: 'Found better price',    icon: 'tag' },
  { value: 'delivery_time_too_long', label: 'Delivery too slow',  icon: 'clock' },
  { value: 'other',                label: 'Other reason',          icon: 'more-horizontal' },
];

const RETURN_REASONS: { value: string; label: string; icon: string }[] = [
  { value: 'defective',        label: 'Defective product',     icon: 'tool' },
  { value: 'wrong_item',       label: 'Wrong item received',   icon: 'shuffle' },
  { value: 'damaged',          label: 'Damaged in transit',    icon: 'package' },
  { value: 'not_as_described', label: 'Not as described',      icon: 'file-text' },
  { value: 'changed_mind',     label: 'Changed my mind',       icon: 'refresh-cw' },
  { value: 'other',            label: 'Other reason',          icon: 'more-horizontal' },
];

const REFUND_METHODS: { value: string; label: string; desc: string; icon: string }[] = [
  { value: 'original',      label: 'Original Method', desc: 'Back to card/UPI',        icon: 'credit-card' },
  // { value: 'wallet',        label: 'Wallet',          desc: 'Instant credit',           icon: 'dollar-sign' },
  // { value: 'store_credit',  label: 'Store Credit',    desc: 'Use on future orders',     icon: 'gift' },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  pending:    { color: '#F59E0B', bg: '#FEF3C7', label: 'Pending' },
  paid:       { color: '#3B82F6', bg: '#EFF6FF', label: 'Paid' },
  processing: { color: '#8B5CF6', bg: '#EDE9FE', label: 'Processing' },
  shipped:    { color: '#0EA5E9', bg: '#E0F2FE', label: 'Shipped' },
  delivered:  { color: '#10B981', bg: '#D1FAE5', label: 'Delivered' },
  completed:  { color: '#10B981', bg: '#D1FAE5', label: 'Completed' },
  cancelled:  { color: '#EF4444', bg: '#FEE2E2', label: 'Cancelled' },
};

function canCancel(status: string) {
  return ['pending', 'paid', 'processing'].includes(status);
}
function canReturn(status: string) {
  return ['completed', 'delivered'].includes(status);
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface OrderDetailsScreenProps {
  orderId: number;
  onBack: () => void;
  onTrackOrder?: (trackingNumber: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  orderId,
  onBack,
  onTrackOrder,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isInvoiceLoading, setIsInvoiceLoading] = useState(false);

  // Cancel state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('changed_mind');
  const [cancelComments, setCancelComments] = useState('');

  // Return state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('defective');
  const [returnComments, setReturnComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('original');

  useEffect(() => { fetchOrderDetails(); }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getOrderDetails(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      setIsInvoiceLoading(true);
      const { url } = await orderService.getOrderInvoice(orderId);
      const token = await tokenStorage.getAccessToken();
      const fullUrl = `${url}?token=${token}`;
      await Linking.openURL(fullUrl).catch(() =>
        Alert.alert('Error', 'Cannot open invoice link.')
      );
    } catch {
      Alert.alert('Error', 'Failed to generate invoice link');
    } finally {
      setIsInvoiceLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      setIsActionLoading(true);
      await orderService.cancelOrder(orderId, cancelReason, cancelComments);
      Toast.show({ type: 'success', text1: 'Cancelled', text2: 'Order cancelled successfully' });
      setShowCancelModal(false);
      fetchOrderDetails();
    } catch (error: any) {
      const msg = error?.message || 'Failed to cancel order';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    if (!order?.items?.length) return;
    try {
      setIsActionLoading(true);
      
      const itemsToReturn = order.items.map(item => ({
        order_item_id: item.id,
        quantity: item.quantity,
        reason: returnReason,
        comments: returnComments,
      }));

      // Send both root-level fields (from user's snippet) and items array (required by backend)
      const payload = {
        items: itemsToReturn,
        reason: returnReason,
        reason_details: returnComments,
        refund_method: refundMethod,
        images: [], 
      };

      await orderService.returnOrder(orderId, payload);
      Toast.show({ type: 'success', text1: 'Submitted', text2: 'Return request submitted successfully' });
      setShowReturnModal(false);
      fetchOrderDetails();
    } catch (error: any) {
      const msg = error?.message || 'Failed to submit return request';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    } finally {
      setIsActionLoading(false);
    }
  };

  // ─── Loading / Error States ────────────────────────────────────────────────

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <HeaderTwo title="Order Details" leftIcon="chevron-left" onLeftPress={onBack} showRightIcon={false} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading order…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <HeaderTwo title="Order Details" leftIcon="chevron-left" onLeftPress={onBack} showRightIcon={false} />
        <View style={styles.centerContainer}>
          <Icon name="alert-circle" size={48} color={COLORS.gray} />
          <Text style={styles.emptyText}>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusMeta = STATUS_META[order.status] || { color: COLORS.gray, bg: '#F3F4F6', label: order.status };

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <HeaderTwo
        title={`Order #${order.order_number}`}
        leftIcon="chevron-left"
        onLeftPress={onBack}
        showRightIcon={false}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* ── Status Card ── */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.sectionTitle}>Order Status</Text>
              <Text style={styles.dateText}>
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
              <View style={[styles.statusDot, { backgroundColor: statusMeta.color }]} />
              <Text style={[styles.statusLabel, { color: statusMeta.color }]}>
                {statusMeta.label}
              </Text>
            </View>
          </View>

          {/* Invoice / Track buttons */}
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickBtn} onPress={handleDownloadInvoice} disabled={isInvoiceLoading}>
              {isInvoiceLoading
                ? <ActivityIndicator size="small" color={COLORS.primary} />
                : <><Icon name="download" size={14} color={COLORS.primary} /><Text style={styles.quickBtnText}>Invoice</Text></>
              }
            </TouchableOpacity>
            {order.tracking_number && (
              <TouchableOpacity
                style={[styles.quickBtn, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' }]}
                onPress={() => onTrackOrder?.(order.tracking_number!)}
              >
                <Icon name="truck" size={14} color="#3B82F6" />
                <Text style={[styles.quickBtnText, { color: '#3B82F6' }]}>Track Order</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Items ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Icon name="package" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Items Ordered</Text>
          </View>
          {order.items?.map((item, i) => (
            <View key={item.id} style={[styles.itemRow, i === order.items!.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.itemImgWrap}>
                {item.image_url
                  ? <Image source={{ uri: item.image_url }} style={styles.itemImg} />
                  : <View style={styles.itemImgFallback}><Icon name="image" size={20} color={COLORS.gray} /></View>
                }
              </View>
              <View style={styles.itemMeta}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product_title}</Text>
                {item.variant_name ? <Text style={styles.itemVariant}>{item.variant_name}</Text> : null}
                <View style={styles.itemFooter}>
                  <Text style={styles.itemQty}>Qty {item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Delivery Address ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Icon name="map-pin" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressBlock}>
            <Text style={styles.addrName}>{order.shipping_address?.full_name}</Text>
            <Text style={styles.addrText}>
              {[
                order.shipping_address?.address_line_1,
                order.shipping_address?.address_line_2,
                order.shipping_address?.city,
                order.shipping_address?.state,
                order.shipping_address?.postal_code,
              ].filter(Boolean).join(', ')}
            </Text>
            <View style={styles.addrPhone}>
              <Icon name="phone" size={12} color={COLORS.gray} />
              <Text style={styles.addrPhoneText}>{order.shipping_address?.phone_number}</Text>
            </View>
          </View>
        </View>

        {/* ── Payment & Shipping ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconWrap}>
              <Icon name="credit-card" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>Payment & Shipping</Text>
          </View>
          <View style={styles.infoGrid}>
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>Payment</Text>
              <Text style={styles.infoCellValue}>{(order.payment_method || 'N/A').toUpperCase()}</Text>
              <View style={[styles.payStatusDot, { backgroundColor: order.payment_status === 'paid' ? '#10B981' : '#F59E0B' }]}>
                <Text style={styles.payStatusText}>{(order.payment_status || 'unpaid').toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.infoSeparator} />
            <View style={styles.infoCell}>
              <Text style={styles.infoCellLabel}>Shipping</Text>
              <Text style={styles.infoCellValue}>{(order.shipping_method || 'Standard').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* ── Summary ── */}
        <View style={[styles.card, styles.summaryCard]}>
          <Text style={[styles.sectionTitle, { color: '#F9FAFB', marginBottom: SPACING.md }]}>Order Summary</Text>
          {[
            { label: 'Subtotal', value: order.subtotal },
            { label: 'Shipping', value: order.shipping_total },
            { label: 'Tax', value: order.tax },
          ].map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>₹{row.value.toFixed(2)}</Text>
            </View>
          ))}
          {order.discount_total > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#34D399' }]}>-₹{order.discount_total.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* ── Action Buttons ── */}
        {(canCancel(order.status) || canReturn(order.status)) && (
          <View style={styles.actionsSection}>
            <Text style={styles.actionsSectionTitle}>Actions</Text>
            {canCancel(order.status) && (
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCancelModal(true)}>
                <Icon name="x-circle" size={18} color="#EF4444" />
                <View style={styles.actionBtnText}>
                  <Text style={styles.cancelBtnLabel}>Cancel Order</Text>
                  <Text style={styles.actionBtnSub}>Request order cancellation</Text>
                </View>
                <Icon name="chevron-right" size={18} color="#EF4444" />
              </TouchableOpacity>
            )}
            {canReturn(order.status) && (
              <TouchableOpacity style={styles.returnBtn} onPress={() => setShowReturnModal(true)}>
                <Icon name="rotate-ccw" size={18} color={COLORS.primary} />
                <View style={styles.actionBtnText}>
                  <Text style={styles.returnBtnLabel}>Return Order</Text>
                  <Text style={styles.actionBtnSub}>Request a return or refund</Text>
                </View>
                <Icon name="chevron-right" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ════════════════════════════════════════════════════════════
          CANCEL MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setShowCancelModal(false)} />
          <View style={styles.sheet}>
            {/* Handle */}
            <View style={styles.sheetHandle} />

            {/* Header */}
            <View style={styles.sheetHeader}>
              <View style={[styles.sheetIconCircle, { backgroundColor: '#FEE2E2' }]}>
                <Icon name="x-circle" size={22} color="#EF4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>Cancel Order</Text>
                <Text style={styles.sheetSub}>Order #{order.order_number}</Text>
              </View>
            </View>

            <View style={styles.sheetDivider} />

            {/* Reasons */}
            <Text style={styles.sheetLabel}>Why are you cancelling?</Text>
            {CANCEL_REASONS.map(r => (
              <TouchableOpacity
                key={r.value}
                style={[styles.reasonRow, cancelReason === r.value && styles.reasonRowActive]}
                onPress={() => setCancelReason(r.value)}
              >
                <View style={[styles.reasonIcon, cancelReason === r.value && styles.reasonIconActive]}>
                  <Icon name={r.icon as any} size={14} color={cancelReason === r.value ? COLORS.background : COLORS.textSecondary} />
                </View>
                <Text style={[styles.reasonLabel, cancelReason === r.value && styles.reasonLabelActive]}>
                  {r.label}
                </Text>
                <View style={[styles.radioOuter, cancelReason === r.value && styles.radioOuterActive]}>
                  {cancelReason === r.value && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.textInput}
              placeholder="Additional comments (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={cancelComments}
              onChangeText={setCancelComments}
            />

            {/* Buttons */}
            <View style={styles.sheetBtns}>
              <TouchableOpacity style={styles.sheetBtnSecondary} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.sheetBtnSecondaryText}>Keep Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sheetBtnPrimary, styles.sheetBtnDanger]}
                onPress={handleCancelOrder}
                disabled={isActionLoading}
              >
                {isActionLoading
                  ? <ActivityIndicator size="small" color="#FFF" />
                  : <Text style={styles.sheetBtnPrimaryText}>Confirm Cancellation</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════════════════════════
          RETURN MODAL
      ═══════════════════════════════════════════════════════════════ */}
      <Modal visible={showReturnModal} transparent animationType="slide">
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={() => setShowReturnModal(false)} />
          <ScrollView style={styles.sheetScroll} contentContainerStyle={styles.sheetScrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.sheet}>
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <View style={[styles.sheetIconCircle, { backgroundColor: 'rgba(237,119,69,0.12)' }]}>
                  <Icon name="rotate-ccw" size={22} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>Return Order</Text>
                  <Text style={styles.sheetSub}>Order #{order.order_number}</Text>
                </View>
              </View>

              <View style={styles.sheetDivider} />

              {/* Return reasons */}
              <Text style={styles.sheetLabel}>Reason for return</Text>
              <View style={styles.chipGrid}>
                {RETURN_REASONS.map(r => (
                  <TouchableOpacity
                    key={r.value}
                    style={[styles.chip, returnReason === r.value && styles.chipActive]}
                    onPress={() => setReturnReason(r.value)}
                  >
                    <Icon name={r.icon as any} size={12} color={returnReason === r.value ? COLORS.primary : COLORS.textSecondary} />
                    <Text style={[styles.chipText, returnReason === r.value && styles.chipTextActive]}>
                      {r.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Refund method */}
              <Text style={[styles.sheetLabel, { marginTop: SPACING.md }]}>Preferred refund method</Text>
              {REFUND_METHODS.map(m => (
                <TouchableOpacity
                  key={m.value}
                  style={[styles.refundMethodRow, refundMethod === m.value && styles.refundMethodRowActive]}
                  onPress={() => setRefundMethod(m.value)}
                >
                  <View style={[styles.refundIcon, refundMethod === m.value && styles.refundIconActive]}>
                    <Icon name={m.icon as any} size={16} color={refundMethod === m.value ? COLORS.background : COLORS.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.refundMethodLabel, refundMethod === m.value && styles.refundMethodLabelActive]}>
                      {m.label}
                    </Text>
                    <Text style={styles.refundMethodDesc}>{m.desc}</Text>
                  </View>
                  <View style={[styles.radioOuter, refundMethod === m.value && styles.radioOuterActive]}>
                    {refundMethod === m.value && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}

              <TextInput
                style={styles.textInput}
                placeholder="Describe the issue in detail…"
                placeholderTextColor="#9CA3AF"
                multiline
                value={returnComments}
                onChangeText={setReturnComments}
              />

              <View style={styles.sheetBtns}>
                <TouchableOpacity style={styles.sheetBtnSecondary} onPress={() => setShowReturnModal(false)}>
                  <Text style={styles.sheetBtnSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetBtnPrimary}
                  onPress={handleReturnOrder}
                  disabled={isActionLoading}
                >
                  {isActionLoading
                    ? <ActivityIndicator size="small" color="#FFF" />
                    : <Text style={styles.sheetBtnPrimaryText}>Submit Return</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  scrollContent: { padding: SPACING.lg, paddingTop: SPACING.md },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  loadingText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  emptyText: { fontSize: FONT_SIZES.md, color: COLORS.textSecondary, marginTop: SPACING.sm },

  // Card
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.md },
  cardIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(237,119,69,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  sectionTitle: { fontSize: 15, fontFamily: getFontFamily('bold'), fontWeight: FONT_WEIGHTS.bold, color: '#111827' },

  // Status row
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  dateText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusLabel: { fontSize: 11, fontWeight: FONT_WEIGHTS.bold },

  // Quick actions
  quickActions: { flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' },
  quickBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10,
    backgroundColor: 'rgba(237,119,69,0.08)', borderWidth: 1, borderColor: 'rgba(237,119,69,0.2)',
  },
  quickBtnText: { fontSize: 12, fontWeight: FONT_WEIGHTS.semiBold, color: COLORS.primary },

  // Items
  itemRow: {
    flexDirection: 'row', paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: '#F3F4F6', gap: 12,
  },
  itemImgWrap: { width: 70, height: 70, borderRadius: 12, backgroundColor: '#F3F4F6', overflow: 'hidden' },
  itemImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  itemImgFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemMeta: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 13, fontWeight: FONT_WEIGHTS.semiBold, color: '#111827', marginBottom: 2 },
  itemVariant: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 6 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemQty: { fontSize: 12, color: '#6B7280', backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  itemPrice: { fontSize: 14, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary },

  // Address
  addressBlock: { paddingLeft: 4 },
  addrName: { fontSize: 14, fontWeight: FONT_WEIGHTS.semiBold, color: '#111827', marginBottom: 4 },
  addrText: { fontSize: 13, color: '#4B5563', lineHeight: 20, marginBottom: 6 },
  addrPhone: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  addrPhoneText: { fontSize: 13, color: COLORS.textSecondary },

  // Info grid
  infoGrid: { flexDirection: 'row', alignItems: 'center' },
  infoCell: { flex: 1 },
  infoCellLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  infoCellValue: { fontSize: 14, fontWeight: FONT_WEIGHTS.semiBold, color: '#111827', marginBottom: 4 },
  payStatusDot: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' },
  payStatusText: { fontSize: 9, fontWeight: FONT_WEIGHTS.bold, color: '#FFF' },
  infoSeparator: { width: 1, height: 40, backgroundColor: '#F3F4F6', marginHorizontal: SPACING.md },

  // Summary
  summaryCard: { backgroundColor: '#111827' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: '#9CA3AF' },
  summaryValue: { fontSize: 13, fontWeight: FONT_WEIGHTS.medium, color: '#E5E7EB' },
  summaryDivider: { height: 1, backgroundColor: '#374151', marginVertical: 12 },
  totalLabel: { fontSize: 16, fontWeight: FONT_WEIGHTS.bold, color: '#F9FAFB' },
  totalValue: { fontSize: 18, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary },

  // Action section
  actionsSection: { marginTop: SPACING.xs },
  actionsSectionTitle: { fontSize: 13, color: COLORS.textSecondary, fontWeight: FONT_WEIGHTS.semiBold, marginBottom: SPACING.sm, marginLeft: 2 },
  cancelBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: SPACING.md, borderRadius: 16, marginBottom: SPACING.sm,
    backgroundColor: '#FFF5F5', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)',
  },
  returnBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: SPACING.md, borderRadius: 16, marginBottom: SPACING.sm,
    backgroundColor: 'rgba(237,119,69,0.06)', borderWidth: 1, borderColor: 'rgba(237,119,69,0.2)',
  },
  actionBtnText: { flex: 1 },
  cancelBtnLabel: { fontSize: 14, fontWeight: FONT_WEIGHTS.bold, color: '#EF4444' },
  returnBtnLabel: { fontSize: 14, fontWeight: FONT_WEIGHTS.bold, color: COLORS.primary },
  actionBtnSub: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },

  // ─── Bottom Sheet ─────────────────────────────────────────────────────────
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetScroll: { maxHeight: '90%' },
  sheetScrollContent: { justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: COLORS.background, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: SPACING.xl, paddingBottom: 36,
  },
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E5E7EB', alignSelf: 'center', marginBottom: SPACING.lg,
  },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: SPACING.md },
  sheetIconCircle: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  sheetTitle: { fontSize: 18, fontWeight: FONT_WEIGHTS.bold, color: '#111827' },
  sheetSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  sheetDivider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: SPACING.lg },
  sheetLabel: { fontSize: 13, fontWeight: FONT_WEIGHTS.semiBold, color: '#4B5563', marginBottom: SPACING.sm },

  // Reason rows (for cancel)
  reasonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, marginBottom: 8,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#F3F4F6',
  },
  reasonRowActive: { backgroundColor: 'rgba(237,119,69,0.06)', borderColor: 'rgba(237,119,69,0.4)' },
  reasonIcon: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center',
  },
  reasonIconActive: { backgroundColor: COLORS.primary },
  reasonLabel: { flex: 1, fontSize: 13, fontWeight: FONT_WEIGHTS.medium, color: '#374151' },
  reasonLabelActive: { color: COLORS.primary, fontWeight: FONT_WEIGHTS.semiBold },

  // Chip grid (for return reasons)
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: SPACING.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20,
    backgroundColor: '#F3F4F6', borderWidth: 1.5, borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: 'rgba(237,119,69,0.08)', borderColor: COLORS.primary },
  chipText: { fontSize: 11, fontWeight: FONT_WEIGHTS.semiBold, color: '#6B7280' },
  chipTextActive: { color: COLORS.primary },

  // Refund method rows
  refundMethodRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: SPACING.md, borderRadius: 14, marginBottom: 8,
    backgroundColor: '#F9FAFB', borderWidth: 1.5, borderColor: '#F3F4F6',
  },
  refundMethodRowActive: { backgroundColor: 'rgba(237,119,69,0.06)', borderColor: COLORS.primary },
  refundIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center',
  },
  refundIconActive: { backgroundColor: COLORS.primary },
  refundMethodLabel: { fontSize: 13, fontWeight: FONT_WEIGHTS.semiBold, color: '#111827' },
  refundMethodLabelActive: { color: COLORS.primary },
  refundMethodDesc: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },

  // Radio button
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: '#D1D5DB',
    justifyContent: 'center', alignItems: 'center',
  },
  radioOuterActive: { borderColor: COLORS.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

  // Text input
  textInput: {
    backgroundColor: '#F9FAFB', borderRadius: 14,
    padding: SPACING.md, height: 90,
    textAlignVertical: 'top', color: '#111827',
    fontSize: 13, borderWidth: 1.5, borderColor: '#E5E7EB',
    marginTop: SPACING.md, marginBottom: SPACING.lg,
  },

  // Sheet buttons
  sheetBtns: { flexDirection: 'row', gap: SPACING.sm },
  sheetBtnSecondary: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#F3F4F6', alignItems: 'center',
  },
  sheetBtnSecondaryText: { fontSize: 14, fontWeight: FONT_WEIGHTS.bold, color: '#374151' },
  sheetBtnPrimary: {
    flex: 2, paddingVertical: 14, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: 'center',
  },
  sheetBtnDanger: { backgroundColor: '#EF4444' },
  sheetBtnPrimaryText: { fontSize: 14, fontWeight: FONT_WEIGHTS.bold, color: '#FFF' },
});
