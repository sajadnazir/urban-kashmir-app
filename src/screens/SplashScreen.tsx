import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { COLORS, FONT_SIZES, FONT_WEIGHTS, SPACING } from '../constants';

const { width, height } = Dimensions.get('window');

// High-quality Kashmiri craft background for premium feel
const SPLASH_BG = 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80';

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1.1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentMove = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.parallel([
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(contentMove, {
        toValue: 0,
        duration: 800,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, contentFade, contentMove]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Animated.View style={[styles.bgContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <ImageBackground 
          source={{ uri: SPLASH_BG }} 
          style={styles.background}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </Animated.View>

      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: contentFade,
            transform: [{ translateY: contentMove }]
          }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoRing}>
            <Text style={styles.logoText}>UK</Text>
          </View>
          <Text style={styles.appName}>Urban Kashmir</Text>
          <View style={styles.separator} />
          <Text style={styles.tagline}>AUTHENTIC CRAFTS • TIMELESS ART</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.footer, { opacity: contentFade }]}>
        <Text style={styles.loadingText}>The Valley awaits...</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkGray,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  bgContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 2,
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.bold,
    letterSpacing: 1,
    textAlign: 'center',
  },
  separator: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: SPACING.md,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.semiBold,
    letterSpacing: 4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: FONT_SIZES.xs,
    fontStyle: 'italic',
    letterSpacing: 1,
  },
});
