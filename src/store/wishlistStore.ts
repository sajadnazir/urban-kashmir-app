import { create } from 'zustand';
import { wishlistService } from '../api';

interface WishlistState {
  wishlistIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchWishlist: () => Promise<void>;
  toggleWishlistItem: (productId: string | number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: new Set(),
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await wishlistService.getWishlist();
      const ids = new Set(data.map(item => String(item.product?.id)));
      set({ wishlistIds: ids, isLoading: false });
    } catch (error: any) {
      console.error('Failed to fetch wishlist:', error);
      set({ error: error.message || 'Failed to fetch wishlist', isLoading: false });
    }
  },

  toggleWishlistItem: async (productId: string | number) => {
    const idStr = String(productId);
    const { wishlistIds } = get();
    const isCurrentlyWishlisted = wishlistIds.has(idStr);
    
    // Optimistic UI update
    const newKeys = new Set(wishlistIds);
    if (isCurrentlyWishlisted) {
      newKeys.delete(idStr);
    } else {
      newKeys.add(idStr);
    }
    set({ wishlistIds: newKeys });
    
    try {
      if (isCurrentlyWishlisted) {
        // Find the specific wishlist ID to remove
        const data = await wishlistService.getWishlist();
        const wishlistItem = data.find(item => String(item.product?.id) === idStr);
        if (wishlistItem) {
          await wishlistService.removeFromWishlist(wishlistItem.id);
        }
      } else {
        await wishlistService.addToWishlist(productId);
      }
      
      // Sync it perfectly back to make sure it matches server state (eventual consistency)
      await get().fetchWishlist();
    } catch (error: any) {
      console.error('Failed to toggle wishlist item:', error);
      // Revert optimistic update on error
      set({ wishlistIds });
      throw error;
    }
  },

  clearWishlist: () => {
    set({ wishlistIds: new Set() });
  }
}));
