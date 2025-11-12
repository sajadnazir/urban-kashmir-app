import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONTS } from '../constants';

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
                <Icon
                  name={tab.iconName}
                  size={22}
                  color={isActive ? COLORS.text : COLORS.background}
                />
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
    paddingHorizontal: SPACING.xxl,
    paddingBottom: SPACING.lg,
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
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
  },
});
