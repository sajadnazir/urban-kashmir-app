# Reels Player Feature

## Overview
Created a full-screen vertical reels player similar to Instagram/TikTok with swipeable videos, interactive actions, and social features.

## ReelsPlayerScreen

### **Features:**

1. **Full-Screen Vertical Video Player**
   - Full screen height and width
   - Vertical swipe to navigate between reels
   - Smooth pagination with snap-to-interval
   - FlatList with optimized rendering

2. **Video Display**
   - Thumbnail images (production: use react-native-video)
   - Gradient overlay at bottom for text readability
   - Play/pause button in center
   - Auto-play on scroll (ready for video integration)

3. **Top Bar**
   - Back button (left) - returns to previous screen
   - "Reels" title (center)
   - Camera button (right) - for creating reels

4. **Author Section**
   - Circular avatar with white border
   - Author name
   - Follow/Following button with toggle state
   - Changes color when following

5. **Content Information**
   - Video title (bold, large)
   - Description with hashtags (2 lines max)
   - View count with eye icon

6. **Right Side Actions** (Vertical Stack)
   - **Like Button**: Heart icon, toggles color on tap, shows count
   - **Comment Button**: Message icon, shows comment count
   - **Share Button**: Share icon, shows share count
   - **More Button**: Three dots for additional options

7. **Interactive Elements**
   - Like toggle (changes to primary color when liked)
   - Follow toggle (changes appearance when following)
   - All buttons have tap feedback
   - Action counts displayed below icons

### **Dummy Data (5 Reels):**

1. **New Sneaker Collection 2024**
   - Author: SneakerHead
   - 12.5K likes, 234 comments, 89 shares
   - 45K views

2. **How to Style Your Kicks**
   - Author: StyleGuru
   - 8.3K likes, 156 comments, 45 shares
   - 32K views

3. **Unboxing Limited Edition**
   - Author: UnboxKing
   - 15.2K likes, 567 comments, 234 shares
   - 78K views

4. **Best Sneakers of 2024**
   - Author: SneakerReview
   - 20.1K likes, 789 comments, 456 shares
   - 95K views

5. **Sneaker Cleaning Tutorial**
   - Author: CleanKicks
   - 6.7K likes, 123 comments, 67 shares
   - 28K views

## Navigation Flow

```
StoreHomeScreen
  ↓ Click on Reel Card
ReelsPlayerScreen
  ├─ Swipe Up/Down → Next/Previous Reel
  ├─ Tap Like → Toggle Like
  ├─ Tap Follow → Toggle Follow
  ├─ Tap Comment → Open Comments (future)
  ├─ Tap Share → Share Reel (future)
  └─ Tap Back → Return to Store
```

## Technical Implementation

### **Vertical Scrolling:**
```typescript
<FlatList
  data={reels}
  pagingEnabled
  snapToInterval={height}
  snapToAlignment="start"
  decelerationRate="fast"
  onMomentumScrollEnd={handleScroll}
/>
```

### **State Management:**
- `currentIndex` - Tracks current reel
- `isLiked` - Like button state
- `isFollowing` - Follow button state

### **Styling:**
- Full screen black background
- Absolute positioned overlays
- Gradient overlay: `rgba(0, 0, 0, 0.6)`
- White text with shadows for readability
- Primary color (#ED7745) for active states

## UI Layout

```
┌─────────────────────────┐
│ ← Reels          📷     │ Top Bar
├─────────────────────────┤
│                         │
│                         │
│        VIDEO            │
│      THUMBNAIL          │
│                         │
│         ▶️              │ Play Button
│                         │
│                    ❤️   │ Like
│                    💬   │ Comment
│                    ↗️   │ Share
│                    ⋮   │ More
├─────────────────────────┤
│ 👤 Author [Follow]      │ Author Info
│ Video Title             │ Content
│ Description #hashtags   │
│ 👁️ 45K views           │ Stats
└─────────────────────────┘
```

## Props

```typescript
interface ReelsPlayerScreenProps {
  initialIndex?: number;  // Start at specific reel
  onBack?: () => void;    // Back navigation
}
```

## Styling Details

### **Colors:**
- Background: Black (#000000)
- Text: White (#FFFFFF)
- Active/Liked: Primary (#ED7745)
- Overlay: rgba(0, 0, 0, 0.6)

### **Dimensions:**
- Full screen width and height
- Avatar: 36x36 circular
- Action icons: 28px
- Play button: 60x60 circular

### **Typography:**
- Title: Large, bold
- Description: Small, regular
- Author: Medium, semi-bold
- Stats: Extra small, regular

## Files Created

1. `/src/screens/ReelsPlayerScreen.tsx` - Reels player screen

## Files Updated

1. `/src/screens/index.ts` - Exported ReelsPlayerScreen
2. `/App.tsx` - Added reels navigation
3. `/src/screens/StoreHomeScreen.tsx` - Connected reel press handler

## Future Enhancements

### **Video Integration:**
```bash
npm install react-native-video
```

Replace Image component with Video:
```typescript
import Video from 'react-native-video';

<Video
  source={{ uri: item.videoUrl }}
  style={styles.video}
  resizeMode="cover"
  repeat
  paused={currentIndex !== index}
/>
```

### **Additional Features:**
- [ ] Video playback controls
- [ ] Sound on/off toggle
- [ ] Progress bar
- [ ] Comments modal
- [ ] Share functionality
- [ ] Save to favorites
- [ ] Report/block options
- [ ] Swipe left for product links
- [ ] Double tap to like
- [ ] Long press for options
- [ ] Auto-play next video
- [ ] Preload adjacent videos
- [ ] Analytics tracking
- [ ] Live streaming support

## Usage

1. **Navigate to Reels**: Click any reel card in StoreHomeScreen
2. **Watch Reels**: Swipe up/down to navigate
3. **Interact**: Tap like, comment, share, or follow
4. **Exit**: Tap back button to return

## Performance Optimizations

- FlatList with `getItemLayout` for instant scrolling
- `initialScrollIndex` to start at specific reel
- Optimized re-renders with proper state management
- Ready for video preloading
- Lazy loading for better performance

## Notes

- Currently using static images as placeholders
- Video URLs are dummy - replace with actual video sources
- Integrate `react-native-video` for actual video playback
- Add video caching for offline viewing
- Implement analytics for view tracking
