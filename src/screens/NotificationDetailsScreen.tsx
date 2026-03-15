import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { HeaderTwo } from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import type { Notification } from '../types/notification';

interface NotificationDetailsScreenProps {
  notification: Notification;
  onBack?: () => void;
}

const getIconForType = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case 'order': return 'package';
    case 'promo': case 'offer': return 'tag';
    case 'payment': return 'credit-card';
    case 'system': return 'settings';
    default: return 'bell';
  }
};

const getIconColor = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case 'order': return '#007AFF';
    case 'promo': case 'offer': return '#FF9500';
    case 'payment': return '#34C759';
    case 'system': return '#8E8E93';
    default: return COLORS.primary;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const NotificationDetailsScreen: React.FC<NotificationDetailsScreenProps> = ({
  notification,
  onBack,
}) => {
  const iconName = getIconForType(notification.type);
  const iconColor = getIconColor(notification.type);

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <HeaderTwo
        title="Notification"
        leftIcon="chevron-left"
        onLeftPress={onBack}
        showRightIcon={false}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.heroIcon, { backgroundColor: `${iconColor}18` }]}>
            <Icon name={iconName} size={36} color={iconColor} />
          </View>
          {notification.type && (
            <View style={[styles.typeBadge, { backgroundColor: `${iconColor}18` }]}>
              <Text style={[styles.typeBadgeText, { color: iconColor }]}>
                {notification.type.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{notification.title || 'Notification'}</Text>

        {/* Timestamp */}
        <Text style={styles.timestamp}>{formatDate(notification.created_at)}</Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Message Body */}
        <Text style={styles.message}>{notification.message}</Text>

        {/* Extra data if present */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <View style={styles.dataCard}>
            {Object.entries(notification.data).map(([key, value]) => (
              <View key={key} style={styles.dataRow}>
                <Text style={styles.dataKey}>{key.replace(/_/g, ' ')}</Text>
                <Text style={styles.dataValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: 48 },
  heroSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.md,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: SPACING.sm,
  },
  timestamp: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginBottom: SPACING.lg,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  dataCard: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataKey: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    textTransform: 'capitalize',
  },
  dataValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
});
