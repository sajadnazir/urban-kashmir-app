import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { orderService } from '../api';
import { Order } from '../types/order';
import Icon from 'react-native-vector-icons/Feather';

interface OrderDetailsScreenProps {
  orderId: number;
  onBack: () => void;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({ orderId, onBack }) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('changed_mind');
  const [cancelComments, setCancelComments] = useState('');

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnComments, setReturnComments] = useState('');
  const [returnResolution, setReturnResolution] = useState('refund');

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

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

  const handleCancelOrder = async () => {
    try {
      setIsActionLoading(true);
      await orderService.cancelOrder(orderId, cancelReason, cancelComments);
      Alert.alert('Success', 'Order cancelled successfully');
      setShowCancelModal(false);
      fetchOrderDetails(); // Refresh
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to cancel order');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    try {
      if (!order?.items || order.items.length === 0) return;
      setIsActionLoading(true);
      
      // Returning all items for simplicity in this flow
      const itemsToReturn = order.items.map(item => ({
        order_item_id: item.id,
        quantity: item.quantity,
        reason: 'defective', // Default
        comments: returnComments,
      }));

      await orderService.returnOrder(orderId, {
        items: itemsToReturn,
        preferred_resolution: returnResolution,
      });

      Alert.alert('Success', 'Return request submitted successfully');
      setShowReturnModal(false);
      fetchOrderDetails(); // Refresh
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to submit return request');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return COLORS.gray;
    switch (status.toLowerCase()) {
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return COLORS.gray;
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <HeaderTwo title="Order Details" leftIcon="chevron-left" onLeftPress={onBack} showRightIcon={false} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <HeaderTwo title="Order Details" leftIcon="chevron-left" onLeftPress={onBack} showRightIcon={false} />
        <View style={styles.centerContainer}>
          <Text>Order not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.statusHeader}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                {(order.status || 'pending').toUpperCase()}
              </Text>
            </View>
          </View>
          <Text style={styles.orderDate}>Placed on {new Date(order.created_at).toLocaleString()}</Text>
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="map-pin" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Delivery Address</Text>
          </View>
          <View style={styles.addressContainer}>
            <Text style={styles.nameText}>{order.shipping_address?.full_name}</Text>
            <Text style={styles.addressText}>
                {[order.shipping_address?.address_line_1, order.shipping_address?.address_line_2, order.shipping_address?.city, order.shipping_address?.state, order.shipping_address?.postal_code]
                    .filter(Boolean).join(', ')}
            </Text>
            <Text style={styles.phoneText}>Phone: {order.shipping_address?.phone_number}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="package" size={20} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Order Items</Text>
          </View>
          {order.items?.map((item, index) => (
            <View key={item.id} style={[styles.itemRow, index === order.items!.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.itemImageContainer}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.itemImage} />
                ) : (
                  <View style={styles.itemImageFallback}>
                    <Icon name="image" size={20} color={COLORS.gray} />
                  </View>
                )}
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>{item.product_title}</Text>
                <Text style={styles.itemVariant}>{item.variant_name}</Text>
                <View style={styles.itemPriceQty}>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Payment & Shipping Info */}
        <View style={styles.card}>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Payment Method</Text>
              <Text style={styles.infoValue}>{(order.payment_method || 'N/A').toUpperCase()}</Text>
              <Text style={[styles.infoStatus, { color: order.payment_status === 'paid' ? '#10B981' : '#F59E0B' }]}>
                {(order.payment_status || 'unpaid').toUpperCase()}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Shipping Method</Text>
              <Text style={styles.infoValue}>{(order.shipping_method || 'Standard').toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Billing Summary */}
        <View style={[styles.card, styles.summaryCard]}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹{order.shipping_total.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹{order.tax.toFixed(2)}</Text>
          </View>
          {order.discount_total > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>-₹{order.discount_total.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {(order.status === 'pending' || order.status === 'processing') && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]} 
              onPress={() => setShowCancelModal(true)}
            >
              <Icon name="x-circle" size={20} color={COLORS.error} />
              <Text style={styles.cancelButtonText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {order.status === 'completed' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.returnButton]} 
              onPress={() => setShowReturnModal(true)}
            >
              <Icon name="rotate-ccw" size={20} color={COLORS.primary} />
              <Text style={styles.returnButtonText}>Return Order</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Cancel Modal */}
      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancel Order</Text>
            <Text style={styles.modalLabel}>Reason for cancellation</Text>
            <View style={styles.reasonOptions}>
              {['changed_mind', 'found_cheaper', 'delivery_delayed', 'wrong_items'].map(reason => (
                <TouchableOpacity 
                  key={reason}
                  style={[styles.reasonChip, cancelReason === reason && styles.reasonChipActive]}
                  onPress={() => setCancelReason(reason)}
                >
                  <Text style={[styles.reasonChipText, cancelReason === reason && styles.reasonChipTextActive]}>
                    {reason.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput 
              style={styles.textInput}
              placeholder="Additional comments (optional)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={cancelComments}
              onChangeText={setCancelComments}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.modalButtonSecondaryText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButtonPrimary, styles.cancelSubmitButton]} 
                onPress={handleCancelOrder}
                disabled={isActionLoading}
              >
                {isActionLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.modalButtonPrimaryText}>Confirm Cancellation</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Return Modal */}
      <Modal visible={showReturnModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Return Order</Text>
            <Text style={styles.modalDescription}>You are requesting a return for all items in this order.</Text>
            
            <Text style={styles.modalLabel}>Preferred Resolution</Text>
            <View style={styles.reasonOptions}>
              {['refund', 'replacement', 'repair'].map(res => (
                <TouchableOpacity 
                  key={res}
                  style={[styles.reasonChip, returnResolution === res && styles.reasonChipActive]}
                  onPress={() => setReturnResolution(res)}
                >
                  <Text style={[styles.reasonChipText, returnResolution === res && styles.reasonChipTextActive]}>
                    {res.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput 
              style={styles.textInput}
              placeholder="Why are you returning? (e.g. Defective, Wrong item)"
              placeholderTextColor="#9CA3AF"
              multiline
              value={returnComments}
              onChangeText={setReturnComments}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={() => setShowReturnModal(false)}>
                <Text style={styles.modalButtonSecondaryText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary} 
                onPress={handleReturnOrder}
                disabled={isActionLoading}
              >
                {isActionLoading ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.modalButtonPrimaryText}>Submit Request</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
  },
  orderDate: {
    fontSize: 13,
    color: '#6B7280',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: SPACING.md,
  },
  addressContainer: {
    paddingLeft: 30,
  },
  nameText: {
    fontSize: 15,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 14,
    color: '#6B7280',
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  itemImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemImageFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: '#111827',
    marginBottom: 2,
  },
  itemVariant: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
  },
  itemPriceQty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQty: {
    fontSize: 13,
    color: '#4B5563',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: '#111827',
  },
  infoStatus: {
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.bold,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#111827',
    paddingVertical: SPACING.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.medium,
    color: '#FFFFFF',
  },
  totalDivider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  actionContainer: {
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  cancelButton: {
    borderColor: COLORS.error,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  cancelButtonText: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
  },
  returnButton: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(237, 119, 69, 0.05)',
  },
  returnButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
    marginBottom: SPACING.sm,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: SPACING.md,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: '#4B5563',
    marginBottom: SPACING.sm,
  },
  reasonOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.md,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reasonChipActive: {
    backgroundColor: 'rgba(237, 119, 69, 0.1)',
    borderColor: COLORS.primary,
  },
  reasonChipText: {
    fontSize: 11,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#6B7280',
  },
  reasonChipTextActive: {
    color: COLORS.primary,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: SPACING.md,
    height: 100,
    textAlignVertical: 'top',
    color: '#111827',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#4B5563',
  },
  modalButtonPrimary: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  cancelSubmitButton: {
    backgroundColor: COLORS.error,
  },
  modalButtonPrimaryText: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
});
