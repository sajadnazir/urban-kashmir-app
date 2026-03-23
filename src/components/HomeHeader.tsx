import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { normalizeFont } from '../utils/responsive';

interface HomeHeaderProps {
  location?: string;
  isLoggedIn?: boolean;
  hasAddress?: boolean;
  hasUnreadNotifications?: boolean;
  wishlistCount?: number;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onWishlistPress?: () => void;
  onLocationPress?: () => void;
  onScanPress?: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  location,
  isLoggedIn = false,
  hasAddress = false,
  hasUnreadNotifications = false,
  wishlistCount = 0,
  notificationCount = 0,
  onNotificationPress,
  onWishlistPress,
  onLocationPress,
  onScanPress,
  searchQuery,
  onSearchChange,
}) => {
  const displayLocation = isLoggedIn 
    ? (hasAddress ? location : 'Add Address')
    : (location || '');

  return (
    <View style={styles.container}>
      {/* Top Row: Location and Notifications */}
      <View style={styles.topRow}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <Icon name="truck" size={18} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.locationContainer} 
          onPress={onLocationPress}
          activeOpacity={0.7}
        >
          <Text style={styles.locationLabel}>Delivery to</Text>
          <Text 
            style={[
              styles.locationText, 
              isLoggedIn && !hasAddress && { color: COLORS.primary }
            ]} 
            numberOfLines={1}
          >
            {displayLocation}
          </Text>
        </TouchableOpacity>

        <View style={styles.rightIcons}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onWishlistPress}
            activeOpacity={0.7}
          >
            <View>
              <Icon name="heart" size={18} color={COLORS.text} />
              {wishlistCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{wishlistCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={onNotificationPress}
            activeOpacity={0.7}
          >
            <View>
              <Icon name="bell" size={18} color={COLORS.text} />
              {hasUnreadNotifications && (
                <View style={styles.dotBadge} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Row: Search and Scan */}
      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={COLORS.gray}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>

        <TouchableOpacity 
          style={styles.scanButton} 
          onPress={onScanPress}
          activeOpacity={0.8}
        >
          <Icon name="maximize" size={18} color={COLORS.background} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 0 : SPACING.sm,
    paddingBottom: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F7F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
  },
  locationLabel: {
    fontSize: normalizeFont(12),
    fontFamily: getFontFamily('regular'),
    color: COLORS.gray,
    marginBottom: 2,
  },
  locationText: {
    fontSize: normalizeFont(FONT_SIZES.md),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF5E5E',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: normalizeFont(8),
    fontFamily: getFontFamily('bold'),
    fontWeight: 'bold',
  },
  dotBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5E5E',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.background,
  },
  rightIcons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 25,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: normalizeFont(FONT_SIZES.md),
    fontFamily: getFontFamily('regular'),
    color: COLORS.text,
    padding: 0,
  },
  scanButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
