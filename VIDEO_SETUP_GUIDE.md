# Video Playback Setup Guide

## Package Installed
✅ `react-native-video` - Version installed successfully

## What's Been Done

### 1. **Package Installation**
```bash
npm install react-native-video
npm install --save-dev @types/react-native-video
```

### 2. **ReelsPlayerScreen Updated**
- Replaced Image components with Video components
- Added real video URLs from Google's sample video bucket
- Implemented play/pause functionality
- Added loading indicators
- Added video buffering states

### 3. **Video URLs (5 Sample Videos)**
All videos are from Google's public test video bucket:

1. **BigBuckBunny.mp4** - Animated short film
2. **ElephantsDream.mp4** - Open source animated film
3. **ForBiggerBlazes.mp4** - Sample video
4. **ForBiggerEscapes.mp4** - Sample video
5. **ForBiggerFun.mp4** - Sample video

## iOS Setup (Required)

Since you're on Mac, you need to link the native iOS module:

### Option 1: Using CocoaPods (Recommended)
```bash
cd ios
pod install
cd ..
```

### Option 2: If pod command fails
```bash
# Fix the pod symlink issue first
rm '/opt/homebrew/bin/pod'
brew link --overwrite cocoapods

# Then install pods
cd ios
pod install
cd ..
```

### Option 3: Manual linking
If CocoaPods continues to have issues, you can manually link:

1. Open `ios/UrbanKashmir.xcworkspace` in Xcode
2. The package should auto-link (React Native 0.60+)
3. Clean build folder: Product → Clean Build Folder
4. Rebuild the app

## Android Setup

For Android, the package should auto-link. Just rebuild:

```bash
cd android
./gradlew clean
cd ..
```

## Running the App

### iOS
```bash
npx react-native run-ios
```

### Android
```bash
npx react-native run-android
```

## Features Implemented

### Video Player Controls
- ✅ **Auto-play**: Videos auto-play when scrolled into view
- ✅ **Pause on scroll**: Current video pauses when scrolling away
- ✅ **Tap to pause/play**: Tap anywhere on video to toggle
- ✅ **Play button overlay**: Shows when video is paused
- ✅ **Loading indicator**: Shows while video is buffering
- ✅ **Repeat**: Videos loop automatically
- ✅ **Poster image**: Shows thumbnail while loading

### Video Properties
```typescript
<Video
  source={{ uri: videoUrl }}
  style={styles.video}
  resizeMode="cover"           // Fill screen
  repeat                       // Loop video
  paused={isPaused}           // Control playback
  onLoad={handleVideoLoad}    // Loading complete
  onBuffer={handleVideoBuffer} // Buffering state
  onEnd={handleVideoEnd}      // Video ended
  poster={thumbnail}          // Thumbnail image
  posterResizeMode="cover"    // Thumbnail resize
/>
```

## Testing the Videos

1. **Navigate to Store**: Click any store card on home screen
2. **Open Reels**: Click any reel card in the store
3. **Watch Videos**: Videos should auto-play
4. **Swipe**: Swipe up/down to navigate between videos
5. **Tap to Pause**: Tap screen to pause/play
6. **Check Loading**: Watch for loading indicator during buffering

## Troubleshooting

### Videos Not Playing

**iOS:**
```bash
# Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

**Android:**
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Black Screen
- Check internet connection (videos are streamed)
- Check video URLs are accessible
- Check console for errors: `npx react-native log-ios` or `npx react-native log-android`

### Videos Buffering Too Long
- Videos are streaming from internet
- Use local video files for better performance
- Implement video caching (react-native-video-cache)

### Audio Not Playing
- Check device volume
- Check mute switch on iOS
- Add audio configuration:
```typescript
import { AudioSession } from 'react-native-video';

// In component
useEffect(() => {
  AudioSession.setCategory('Playback');
}, []);
```

## Performance Optimization

### 1. **Preload Adjacent Videos**
```typescript
const [preloadedVideos, setPreloadedVideos] = useState<Set<number>>(new Set());

// Preload next and previous videos
useEffect(() => {
  const toPreload = new Set([
    currentIndex - 1,
    currentIndex,
    currentIndex + 1,
  ]);
  setPreloadedVideos(toPreload);
}, [currentIndex]);
```

### 2. **Use Local Videos**
For better performance, download videos and use local files:
```typescript
source={{ uri: 'file:///path/to/local/video.mp4' }}
```

### 3. **Video Caching**
Install caching library:
```bash
npm install react-native-video-cache
```

## Next Steps

### Recommended Enhancements

1. **Volume Control**
   - Add volume slider
   - Mute/unmute button

2. **Progress Bar**
   - Show video progress
   - Seek to position

3. **Quality Selection**
   - Multiple video qualities
   - Auto quality based on network

4. **Download for Offline**
   - Download videos
   - Offline playback

5. **Analytics**
   - Track view duration
   - Track completion rate
   - Track engagement

## Video Component Props Reference

```typescript
interface VideoProps {
  source: { uri: string };
  style: StyleProp<ViewStyle>;
  resizeMode?: 'contain' | 'cover' | 'stretch';
  repeat?: boolean;
  paused?: boolean;
  muted?: boolean;
  volume?: number; // 0.0 to 1.0
  rate?: number; // Playback speed
  onLoad?: (data: OnLoadData) => void;
  onProgress?: (data: OnProgressData) => void;
  onBuffer?: (data: { isBuffering: boolean }) => void;
  onEnd?: () => void;
  onError?: (error: LoadError) => void;
  poster?: string;
  posterResizeMode?: 'contain' | 'cover' | 'stretch';
}
```

## Current Implementation Status

✅ Package installed
✅ Video component integrated
✅ 5 sample videos added
✅ Play/pause functionality
✅ Loading indicators
✅ Auto-play on scroll
✅ Tap to pause/play
✅ Video looping
✅ Poster images

⏳ Pending iOS pod install (manual step required)
⏳ Testing on device/simulator

## Support

If videos still don't play after following these steps:

1. Check React Native version compatibility
2. Check react-native-video documentation: https://github.com/react-native-video/react-native-video
3. Check iOS/Android permissions
4. Try with local video files first
5. Check network connectivity

## Alternative Video URLs

If Google's videos don't work, try these alternatives:

```typescript
// Sample MP4 videos
'https://www.w3schools.com/html/mov_bbb.mp4'
'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4'
```
