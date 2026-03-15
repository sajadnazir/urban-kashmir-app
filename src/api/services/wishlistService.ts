import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';

// Defines the shape of the individual item coming from the API
export interface WishlistItem {
  id: number;
  product: {
    id: number;
    title: string;
    description: string;
    price: number | string;
    sale_price: number | string | null;
    images: Array<{
      url: string;
    }>;
    category?: {
      id: number;
      name: string;
    } | null;
    default_variant?: {
      id: number;
      price: number;
      sale_price: number;
    };
    price_range?: {
      min: string;
      max: string;
    };
  };
}

export const wishlistService = {
  /**
   * Get all wishlist items for the authenticated user
   */
  getWishlist: () => {
    return apiService.get<WishlistItem[]>(ENDPOINTS.WISHLIST.LIST);
  },

  /**
   * Add a product to the wishlist
   */
  addToWishlist: (productId: number | string) => {
    return apiService.post<any, { product_id: number | string }>(
      ENDPOINTS.WISHLIST.ADD_ITEM,
      { product_id: productId }
    );
  },

  /**
   * Remove an item from the wishlist using the wishlist item ID
   */
  removeFromWishlist: (id: number | string) => {
    return apiService.delete<any>(ENDPOINTS.WISHLIST.REMOVE_ITEM(id));
  },

  /**
   * Move a wishlist item to the cart
   */
  moveToCart: (id: number | string) => {
    return apiService.post<any>(ENDPOINTS.WISHLIST.MOVE_TO_CART(id));
  },
};
