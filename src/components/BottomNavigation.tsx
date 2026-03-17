import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';
import { useCartStore } from '../store';
import { normalizeFont } from '../utils/responsive';

export type TabName = 'home' | 'search' | 'cart' | 'profile';

interface Tab {
  id: TabName;
  iconName: string;
  label: string;
}

interface BottomNavigationProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs: Tab[] = [
  { id: 'home', iconName: 'home', label: 'Home' },
  { id: 'search', iconName: 'search', label: 'Search' },
  { id: 'cart', iconName: 'shopping-bag', label: 'Cart' },
  { id: 'profile', iconName: 'user', label: 'Profile' },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabPress,
}) => {
  const { cartItemCount } = useCartStore();

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabItem, isActive && styles.tabItemActive]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <View style={styles.tabContent}>
                <View>
                  <Icon
                    name={tab.iconName}
                    size={22}
                    color={isActive ? COLORS.text : COLORS.background}
                  />
                  {tab.id === 'cart' && cartItemCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{cartItemCount > 99 ? '99+' : cartItemCount}</Text>
                    </View>
                  )}
                </View>
                {isActive && <Text style={styles.tabLabel}>{tab.label}</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: 'transparent',
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkGray,
    borderRadius: 30,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: 30,
  },
  tabItemActive: {
    backgroundColor: COLORS.background,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  tabLabel: {
    fontSize: normalizeFont(FONT_SIZES.sm),
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.text,
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
  },
  badgeText: {
    color: COLORS.background,
    fontSize: normalizeFont(9),
    fontWeight: 'bold',
  },
});
