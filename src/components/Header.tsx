import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

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
          <Icon name="heart" size={20} color={COLORS.text} />
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
    // paddingTop: SPACING.sm,
    // paddingBottom: 10,
    backgroundColor: COLORS.darkGray,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    minHeight: 80,
    margin:5,
    borderRadius:20
  },
  profileSection: {
    flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
   height:"100%",
   alignContent:"center",
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
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  welcomeTextContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
    marginBottom: 2,
  },
  welcomeText: {
    fontSize: FONT_SIZES.sm,
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
});
