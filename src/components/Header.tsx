import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, getFontFamily } from '../constants';
import { useWishlistStore } from '../store';
import { normalizeFont } from '../utils/responsive';

interface HeaderProps {
  userName: string;
  userImage?: string;
  onProfilePress?: () => void;
  onWishlistPress?: () => void;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  userImage,
  onProfilePress,
  onWishlistPress,
  onNotificationPress,
}) => {
  const { wishlistIds } = useWishlistStore();
  const wishlistCount = wishlistIds.size;

  return (
    <View style={styles.container}>
      {/* Left Side - Profile */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.profileImageContainer}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Text style={styles.profilePlaceholderText}>
                {userName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.welcomeText}>Welcome Back</Text>
        </View>
      </TouchableOpacity>

      {/* Right Side - Action Icons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onWishlistPress}
          activeOpacity={0.7}
        >
          <View>
            <Icon name="heart" size={20} color={COLORS.text} />
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
          <Icon name="bell" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.darkGray,
    minHeight: 80,
    margin: 5,
    borderRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    flex: 1,
    height: '100%',
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePlaceholderText: {
    fontSize: normalizeFont(FONT_SIZES.xl),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  welcomeTextContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: normalizeFont(FONT_SIZES.lg),
    fontFamily: getFontFamily('bold'),
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: normalizeFont(FONT_SIZES.sm),
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.lightGray,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    // marginTop: SPACING.md,
   height:"100%",
   justifyContent:"center",
   alignContent:"center"
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.primary, // Make sure it contrasts well
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.background, // Adds a nice separation
  },
  badgeText: {
    color: COLORS.background,
    fontSize: normalizeFont(10),
    fontWeight: 'bold',
  },
});
