import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../constants';

const { width, height } = Dimensions.get('window');

interface ReelData {
  id: string;
  videoUrl: string;
  thumbnail: string;
  title: string;
  description: string;
  likes: string;
  comments: string;
  shares: string;
  views: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface ReelsPlayerScreenProps {
  initialIndex?: number;
  onBack?: () => void;
}

export const ReelsPlayerScreen: React.FC<ReelsPlayerScreenProps> = ({
  initialIndex = 0,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Dummy reels data with real video URLs
  const reels: ReelData[] = [
    {
      id: '1',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
      title: 'New Sneaker Collection 2024',
      description: 'Check out the latest drops! 🔥 #sneakers #fashion',
      likes: '12.5K',
      comments: '234',
      shares: '89',
      views: '45K',
      author: {
        name: 'SneakerHead',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
    },
    {
      id: '2',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      title: 'How to Style Your Kicks',
      description: 'Easy styling tips for your sneakers 👟 #style #tips',
      likes: '8.3K',
      comments: '156',
      shares: '45',
      views: '32K',
      author: {
        name: 'StyleGuru',
        avatar: 'https://i.pravatar.cc/150?img=2',
      },
    },
    {
      id: '3',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      title: 'Unboxing Limited Edition',
      description: 'Rare sneaker unboxing! Limited to 100 pairs 📦',
      likes: '15.2K',
      comments: '567',
      shares: '234',
      views: '78K',
      author: {
        name: 'UnboxKing',
        avatar: 'https://i.pravatar.cc/150?img=3',
      },
    },
    {
      id: '4',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
      title: 'Best Sneakers of 2024',
      description: 'Top 10 must-have sneakers this year! 🏆',
      likes: '20.1K',
      comments: '789',
      shares: '456',
      views: '95K',
      author: {
        name: 'SneakerReview',
        avatar: 'https://i.pravatar.cc/150?img=4',
      },
    },
    {
      id: '5',
      videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400',
      title: 'Sneaker Cleaning Tutorial',
      description: 'Keep your kicks fresh! 🧼 #cleaning #tutorial',
      likes: '6.7K',
      comments: '123',
      shares: '67',
      views: '28K',
      author: {
        name: 'CleanKicks',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
    },
  ];

  const currentReel = reels[currentIndex];

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const togglePlayPause = () => {
    setIsPaused(!isPaused);
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoBuffer = () => {
    setIsLoading(true);
  };

  const handleVideoEnd = () => {
    setIsLoading(false);
  };

  const renderReel = ({ item, index }: { item: ReelData; index: number }) => {
    return (
      <View style={styles.reelContainer}>
        {/* Video Player */}
        <Video
          source={{ uri: item.videoUrl }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={currentIndex !== index || isPaused}
          onLoad={handleVideoLoad}
          onBuffer={handleVideoBuffer}
          onEnd={handleVideoEnd}
          poster={item.thumbnail}
          posterResizeMode="cover"
        />

        {/* Loading Indicator */}
        {isLoading && currentIndex === index && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.background} />
          </View>
        )}

        {/* Gradient Overlay */}
        <View style={styles.gradientOverlay} />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Icon name="chevron-left" size={28} color={COLORS.background} />
          </TouchableOpacity>
          <Text style={styles.reelsTitle}>Reels</Text>
          <TouchableOpacity style={styles.cameraButton}>
            <Icon name="camera" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          {/* Author Info */}
          <View style={styles.authorSection}>
            <Image
              source={{ uri: item.author.avatar }}
              style={styles.authorAvatar}
            />
            <Text style={styles.authorName}>{item.author.name}</Text>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={handleFollow}
            >
              <Text
                style={[
                  styles.followText,
                  isFollowing && styles.followingText,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Icon name="eye" size={14} color={COLORS.background} />
              <Text style={styles.statText}>{item.views} views</Text>
            </View>
          </View>
        </View>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          {/* Like */}
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon
              name={isLiked ? 'heart' : 'heart'}
              size={28}
              color={isLiked ? COLORS.primary : COLORS.background}
            />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>

          {/* Comment */}
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="message-circle" size={28} color={COLORS.background} />
            <Text style={styles.actionText}>{item.comments}</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-2" size={28} color={COLORS.background} />
            <Text style={styles.actionText}>{item.shares}</Text>
          </TouchableOpacity>

          {/* More */}
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="more-vertical" size={28} color={COLORS.background} />
          </TouchableOpacity>
        </View>

        {/* Play/Pause Button (Center) */}
        {isPaused && currentIndex === index && (
          <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
            <Icon name="play" size={40} color={COLORS.background} />
          </TouchableOpacity>
        )}

        {/* Tap to Pause/Play */}
        <TouchableOpacity
          style={styles.tapArea}
          activeOpacity={1}
          onPress={togglePlayPause}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.black} />
      <FlatList
        ref={flatListRef}
        data={reels}
        renderItem={renderReel}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={event => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / height
          );
          setCurrentIndex(index);
        }}
        initialScrollIndex={initialIndex}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  reelContainer: {
    width,
    height,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.black,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reelsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
  },
  cameraButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 80,
    paddingHorizontal: SPACING.lg,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
    marginRight: SPACING.sm,
  },
  followButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  followingButton: {
    backgroundColor: COLORS.background,
  },
  followText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
  followingText: {
    color: COLORS.black,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.background,
    marginBottom: SPACING.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: SPACING.md,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    color: COLORS.background,
  },
  rightActions: {
    position: 'absolute',
    right: SPACING.md,
    bottom: 100,
    gap: SPACING.lg,
  },
  actionButton: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semiBold,
    color: COLORS.background,
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tapArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
});
