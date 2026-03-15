import { create } from 'zustand';
import { cartService } from '../api';

interface CartState {
  cartItemCount: number;
  isLoading: boolean;
  fetchCartCount: () => Promise<void>;
  updateCartCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItemCount: 0,
  isLoading: false,
  
  fetchCartCount: async () => {
    set({ isLoading: true });
    try {
      const data = await cartService.getCart();
      set({ cartItemCount: data.items_count || 0, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      set({ isLoading: false });
    }
  },
  
  updateCartCount: (count: number) => {
    set({ cartItemCount: count });
  },
}));
