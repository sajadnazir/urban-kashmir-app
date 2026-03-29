import { create } from 'zustand';
import { cartService } from '../api';

interface CartState {
  cartItemCount: number;
  cartProductIds: Set<string>; // IDs of products currently in cart
  isLoading: boolean;
  fetchCartCount: () => Promise<void>;
  updateCartCount: (count: number) => void;
  addProductToCart: (productId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItemCount: 0,
  cartProductIds: new Set<string>(),
  isLoading: false,

  fetchCartCount: async () => {
    set({ isLoading: true });
    try {
      const data = await cartService.getCart();
      const ids = new Set<string>(
        (data.items || []).map((item: any) => String(item.product_id))
      );
      set({ cartItemCount: data.items_count || 0, cartProductIds: ids, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
      set({ isLoading: false });
    }
  },

  updateCartCount: (count: number) => {
    set({ cartItemCount: count });
  },

  addProductToCart: (productId: string) => {
    set((state) => ({
      cartProductIds: new Set([...state.cartProductIds, productId]),
      cartItemCount: state.cartItemCount + 1,
    }));
  },
}));
