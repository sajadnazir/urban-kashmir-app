import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { orderService } from '../api';
import { Order } from '../types/order';
import Icon from 'react-native-vector-icons/Feather';

interface OrdersScreenProps {
  onBack: () => void;
  onOrderPress: (order: Order) => void;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({ onBack, onOrderPress }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (pageNum: number, refresh: boolean = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else if (pageNum === 1) setIsLoading(true);

      const response = await orderService.getOrders(pageNum);
      // Handle various response structures
      const newOrders = response.data || (Array.isArray(response) ? response : []);
      
      if (refresh) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }
      
      // Handle meta or pagination keys
      const meta = (response as any).meta || (response as any).pagination;
      if (meta) {
        setHasMore(meta.current_page < meta.last_page);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(1);
  }, [fetchOrders]);

  const handleRefresh = () => {
    setPage(1);
    fetchOrders(1, true);
  };

  const loadMore = () => {
    if (hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOrders(nextPage);
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

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard} 
      onPress={() => onOrderPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
          <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {(item.status || 'pending').toUpperCase()}
          </Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹{(item.total || 0).toFixed(2)}</Text>
      </View>
      
      <View style={styles.viewDetails}>
        <Text style={styles.viewDetailsText}>View Details</Text>
        <Icon name="chevron-right" size={16} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <HeaderTwo 
        title="My Orders" 
        leftIcon="chevron-left" 
        onLeftPress={onBack} 
        showRightIcon={false}
      />
      
      <View style={styles.container}>
        {isLoading && page === 1 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.centerContainer}>
            <View style={styles.emptyIconContainer}>
              <Icon name="package" size={48} color={COLORS.gray} />
            </View>
            <Text style={styles.emptyTitle}>No Orders Yet</Text>
            <Text style={styles.emptySubtitle}>When you place an order, it will appear here.</Text>
          </View>
        ) : (
          <FlatList
            data={orders || []}
            renderItem={renderOrderItem}
            keyExtractor={item => (item?.id || Math.random()).toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[COLORS.primary]} />
            }
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={hasMore ? <ActivityIndicator style={styles.footerLoader} color={COLORS.primary} /> : null}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: 40,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
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
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  totalLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.primary,
  },
  footerLoader: {
    marginVertical: SPACING.md,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
