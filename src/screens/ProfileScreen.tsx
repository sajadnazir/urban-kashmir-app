import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import {
  ProfileHeader,
  ProfileMenuItem,
  ProfileMenuItemData,
  BottomNavigation,
  TabName,
  HeaderTwo,
} from '../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

interface ProfileScreenProps {
  onBack?: () => void;
  onTabPress?: (tab: TabName) => void;
  onEditProfile?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onTabPress,
  onEditProfile,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('profile');

  const menuItems: ProfileMenuItemData[] = [
    {
      id: 'profile',
      icon: 'user',
      title: 'Profile',
      subtitle: 'Shopping, Email, Password, Shoe Size',
    },
    {
      id: 'buying',
      icon: 'shopping-bag',
      title: 'Buying',
      subtitle: 'Active Bids, In Progress, Orders',
    },
    {
      id: 'selling',
      icon: 'users',
      title: 'Selling',
      subtitle: 'Active Asks, Sales, Seller Profile',
    },
    {
      id: 'favorites',
      icon: 'heart',
      title: 'Favorites',
      subtitle: 'Items and Lists You,ve Saved',
    },
    {
      id: 'portfolio',
      icon: 'briefcase',
      title: 'Portfolio',
      subtitle: 'See The Value of Your Items',
    },
  ];

  const settingsItems: ProfileMenuItemData[] = [
    {
      id: 'wallet',
      icon: 'credit-card',
      title: 'Wallet',
      subtitle: 'Payments, Payout, Gift Cards, Credits',
    },
    {
      id: 'settings',
      icon: 'settings',
      title: 'Settings',
      subtitle: 'Security And Notifications',
    },
  ];

  const handleMenuPress = (id: string) => {
    console.log('Menu item pressed:', id);
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.darkGray}
        translucent={false}
      />
      <View style={styles.container}>
        {/* Header */}
        {/* <HeaderTwo
          title="Profile"
          leftIcon="chevron-left"
          rightIcon="home"
          onLeftPress={onBack}
          onRightPress={() => handleTabPress('home')}
        /> */}

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <ProfileHeader
            name="Sajad Nazir"
            email="sajadnazir@gmail.com"
            avatarUrl="https://i.pravatar.cc/150?img=12"
            onEditPress={onEditProfile}
          />

          {/* Main Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map(item => (
              <ProfileMenuItem
                key={item.id}
                item={item}
                onPress={handleMenuPress}
              />
            ))}
          </View>

          {/* Settings Section */}
          <View style={styles.menuSection}>
            {settingsItems.map(item => (
              <ProfileMenuItem
                key={item.id}
                item={item}
                onPress={handleMenuPress}
              />
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.darkGray,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.darkGray,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: 100,
  },
  menuSection: {
    marginBottom: SPACING.md,
  },
  bottomSpacer: {
    height: 20,
  },
});
