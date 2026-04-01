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
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily, APP_VERSION } from '../constants';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { ActivityIndicator, Alert } from 'react-native';

interface ProfileScreenProps {
  onBack?: () => void;
  onTabPress?: (tab: TabName) => void;
  onEditProfile?: () => void;
  onMenuPress?: (menuId: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onTabPress,
  onEditProfile,
  onMenuPress,
}) => {
  const [activeTab, setActiveTab] = useState<TabName>('profile');
  const { profile, fetchProfile, isLoading } = useUserStore();
  const { logout, isLoading: isLoggingOut } = useAuthStore();

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const menuItems: ProfileMenuItemData[] = [
    // {
    //   id: 'profile',
    //   icon: 'user',
    //   title: 'Profile',
    //   subtitle: 'Shopping, Email, Password, Shoe Size',
    // },
    {
      id: 'orders',
      icon: 'package',
      title: 'My Orders',
      subtitle: 'View your order history',
    },
  
    {
      id: 'address',
      icon: 'map-pin', // Fix icon name map-pin vs address
      title: 'Address',
      subtitle: 'Manage your delivery addresses',
    },
    {
      id: 'wishlist',
      icon: 'heart',
      title: 'My Wishlist',
      subtitle: 'Items You\'ve Saved',
    },

    {
      id: 'support',
      icon: 'help-circle',
      title: 'Help & Support',
      subtitle: 'Create and view support tickets',
    },
    // {
    //   id: 'portfolio',
    //   icon: 'briefcase',
    //   title: 'Portfolio',
    //   subtitle: 'See The Value of Your Items',
    // },
  ];

  const handleMenuPress = (id: string) => {
    console.log('Menu item pressed:', id);
    if ((id === 'wishlist' || id === 'address' || id === 'orders' || id === 'support') && onMenuPress) {
      onMenuPress(id);
    }
  };

  const handleTabPress = (tab: TabName) => {
    setActiveTab(tab);
    onTabPress?.(tab);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        },
      ]
    );
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
        {isLoading && !profile ? (
          <View style={[styles.scrollView, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Header */}
            <ProfileHeader
              name={profile?.name || 'User'}
              email={profile?.email || profile?.mobile || ''}
              avatarUrl={profile?.avatar || "https://i.pravatar.cc/150?img=12"}
              onEditPress={onEditProfile}
              version={APP_VERSION}
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


          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color={COLORS.error} size="small" />
            ) : (
              <>
                <Icon name="log-out" size={20} color={COLORS.error} />
                <Text style={styles.logoutText}>Log Out</Text>
              </>
            )}
          </TouchableOpacity>
          

            {/* Bottom spacing */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        )}

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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    marginTop: SPACING.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.1)',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
  },
});
