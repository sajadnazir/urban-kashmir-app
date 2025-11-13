import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

const { width } = Dimensions.get('window');

export interface Reel {
  id: string;
  thumbnail: string;
  title: string;
  views: string;
  duration: string;
}

interface ReelCardProps {
  reel: Reel;
  onPress: (reel: Reel) => void;
}

export const ReelCard: React.FC<ReelCardProps> = ({ reel, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(reel)}
      activeOpacity={0.9}
    >
      {/* Thumbnail */}
      <Image source={{ uri: reel.thumbnail }} style={styles.thumbnail} />

      {/* Overlay Gradient Effect */}
      <View style={styles.overlay} />

      {/* Play Icon */}
      <View style={styles.playButton}>
        <Icon name="play" size={24} color={COLORS.background} />
      </View>

      {/* Duration Badge */}
      <View style={styles.durationBadge}>
        <Text style={styles.durationText}>{reel.duration}</Text>
      </View>

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {reel.title}
        </Text>
        <View style={styles.viewsContainer}>
          <Icon name="eye" size={12} color={COLORS.background} />
          <Text style={styles.viewsText}>{reel.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.4,
    height: 220,
    borderRadius: 16,
    marginRight: SPACING.md,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.background,
  },
});
