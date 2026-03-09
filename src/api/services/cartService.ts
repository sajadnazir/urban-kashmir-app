import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { Product } from '../../components/ProductCard';

export interface ApiCartItem {
  id: number;
  product_id: number;
  variant_id: number;
  quantity: number;
  product?: {
    title: string;
    images?: Array<{ url: string }>;
  };
  variant?: {
    price: number;
    sale_price: number;
  };
}

export interface CartResponse {
  items: ApiCartItem[];
  total_quantity: number;
  total_price: number;
}

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    return await apiService.get<CartResponse>(ENDPOINTS.CART.LIST);
  },

  addToCart: async (productId: number, variantId: number, quantity: number = 1): Promise<any> => {
    return await apiService.post(ENDPOINTS.CART.ADD_ITEM, {
      product_id: productId,
      variant_id: variantId,
      quantity: quantity,
    });
  },

  updateCartItem: async (itemId: number, quantity: number): Promise<any> => {
    return await apiService.put(ENDPOINTS.CART.UPDATE_ITEM(itemId), {
      quantity: quantity,
    });
  },

  removeCartItem: async (itemId: number): Promise<any> => {
    return await apiService.delete(ENDPOINTS.CART.REMOVE_ITEM(itemId));
  },

  clearCart: async (): Promise<any> => {
    return await apiService.delete(ENDPOINTS.CART.CLEAR);
  },
};
