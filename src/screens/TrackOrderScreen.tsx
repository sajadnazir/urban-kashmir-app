import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { orderService } from '../api';
import Icon from 'react-native-vector-icons/Feather';

interface TrackOrderScreenProps {
  trackingNumber: string;
  onBack: () => void;
}

interface TrackingEvent {
  status: string;
  date: string;
  description: string;
  location?: string;
  isCompleted: boolean;
  isCurrent?: boolean;
}

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({ trackingNumber, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [trackingData, setTrackingData] = useState<any>(null);

  useEffect(() => {
    fetchTrackingInfo();
  }, [trackingNumber]);

  const fetchTrackingInfo = async () => {
    try {
      setLoading(true);
      const data = await orderService.trackOrder(trackingNumber);
      setTrackingData(data);
    } catch (error) {
      console.error('Failed to fetch tracking info:', error);
      Alert.alert('Error', 'Could not fetch tracking information. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Modern timeline rendering logic
  const renderTimelineItem = (event: TrackingEvent, isLast: boolean) => (
    <View key={event.status} style={styles.timelineItem}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineDot,
          event.isCompleted ? styles.dotCompleted : styles.dotPending,
          event.isCurrent && styles.dotCurrent
        ]}>
          {event.isCompleted && <Icon name="check" size={12} color="#FFF" />}
        </View>
        {!isLast && <View style={[styles.timelineLine, event.isCompleted && styles.lineCompleted]} />}
      </View>
      <View style={styles.timelineRight}>
        <Text style={[styles.eventTitle, event.isCurrent && styles.eventTitleCurrent]}>
          {event.status.replace('_', ' ').toUpperCase()}
        </Text>
        <Text style={styles.eventDate}>{event.date}</Text>
        <Text style={styles.eventDesc}>{event.description}</Text>
        {event.location && <Text style={styles.eventLoc}><Icon name="map-pin" size={12} /> {event.location}</Text>}
      </View>
    </View>
  );

  // Fallback UI events since real API data structure might vary
  const mockEvents: TrackingEvent[] = [
    { status: 'Order Placed', date: 'Oct 12, 10:30 AM', description: 'Your order has been placed successfully.', isCompleted: true },
    { status: 'Processed', date: 'Oct 12, 02:45 PM', description: 'Seller has processed your order.', isCompleted: true },
    { status: 'Shipped', date: 'Oct 13, 11:00 AM', description: 'Handed over to logistics partner.', isCompleted: true, isCurrent: true },
    { status: 'Out for Delivery', date: 'Estimated Oct 15', description: 'Order reaching your nearest hub.', isCompleted: false },
    { status: 'Delivered', date: 'Estimated Oct 16', description: 'Package at your doorstep.', isCompleted: false },
  ];

  const eventsToDisplay = trackingData?.events || mockEvents;

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <HeaderTwo title="Track Order" leftIcon="chevron-left" onLeftPress={onBack} showRightIcon={false} />
      
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
          <View style={styles.headerCard}>
            <View style={styles.headerInfo}>
              <Text style={styles.headerLabel}>Tracking ID</Text>
              <Text style={styles.trackingID}>{trackingNumber}</Text>
            </View>
            <View style={styles.headerStatus}>
              <Text style={styles.statusLabel}>Current Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{(trackingData?.status || 'In Transit').toUpperCase()}</Text>
              </View>
            </View>
          </View>

          <View style={styles.timelineCard}>
            <Text style={styles.sectionTitle}>Delivery Journey</Text>
            <View style={styles.timelineContainer}>
              {eventsToDisplay.map((event: any, index: number) => 
                renderTimelineItem(event, index === eventsToDisplay.length - 1)
              )}
            </View>
          </View>

          <View style={styles.supportCard}>
            <Icon name="headphones" size={24} color={COLORS.primary} />
            <View style={styles.supportInfo}>
              <Text style={styles.supportTitle}>Need help with your delivery?</Text>
              <Text style={styles.supportSub}>Our support team is available 24/7</Text>
            </View>
            <TouchableOpacity style={styles.supportBtn}>
              <Text style={styles.supportBtnText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  headerCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  headerInfo: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  trackingID: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  headerStatus: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(237, 119, 69, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  statusText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
  },
  timelineCard: {
    backgroundColor: COLORS.background,
    borderRadius: 24,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
    marginBottom: SPACING.xl,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 80,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  dotPending: {
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  dotCurrent: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  lineCompleted: {
    backgroundColor: '#10B981',
  },
  timelineRight: {
    flex: 1,
    marginLeft: 16,
    paddingBottom: 24,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#4B5563',
    marginBottom: 4,
  },
  eventTitleCurrent: {
    color: COLORS.primary,
  },
  eventDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  eventDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  eventLoc: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: FONT_WEIGHTS.medium,
  },
  supportCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#111827',
  },
  supportSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  supportBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  supportBtnText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#4B5563',
  },
  timelineContainer: {
    paddingLeft: 4,
  }
});
