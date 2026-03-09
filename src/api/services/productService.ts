import { apiService, PaginatedResponse } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { Product } from '../../components/ProductCard';

export interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  brand: string;
  status: string;
  category_id: number;
  vendor_id: number;
  default_variant?: {
    id: number;
    price: number;
    sale_price: number;
  };
  images?: Array<{ url: string }>;
  price_range?: {
    min: string;
    max: string;
  };
}

export const productService = {
  getProducts: async (
    page: number = 1,
    perPage: number = 20,
    categoryId?: string
  ): Promise<PaginatedResponse<Product[]>> => {
    const params: Record<string, any> = { page, per_page: perPage };
    if (categoryId && categoryId !== 'all') {
      params.category_id = categoryId;
    }

    const response = await apiService.getPaginated<ApiProduct[]>(
      ENDPOINTS.PRODUCTS.LIST,
      params
    );

    // Map ApiProduct -> UI Product
    const mappedProducts: Product[] = response.data.map(apiProduct => {
      // Find the best price to display
      let price = 0;
      if (apiProduct.default_variant?.sale_price) {
        // Assuming API returns prices in smallest denomination or we just use it directly
        // Usually if a price is 29000, it might be 290.00 or 29000. For now, use as provided.
        price = apiProduct.default_variant.sale_price;
      } else if (apiProduct.price_range?.min) {
        price = parseFloat(apiProduct.price_range.min);
      }

      // Pick the first image if available
      const image = apiProduct.images && apiProduct.images.length > 0
        ? apiProduct.images[0].url
        : undefined;

      return {
        id: String(apiProduct.id),
        name: apiProduct.title,
        price,
        rating: 5, // Default/Placeholder as API doesn't return rating
        isFavorite: false,
        image,
        variantId: apiProduct.default_variant?.id,
      };
    });

    return {
      data: mappedProducts,
      pagination: response.pagination,
    };
  },

  searchProducts: async (
    query: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<PaginatedResponse<Product[]>> => {
    const response = await apiService.getPaginated<ApiProduct[]>(
      ENDPOINTS.PRODUCTS.SEARCH,
      { q: query, page, per_page: perPage }
    );

    // Map ApiProduct -> UI Product
    const mappedProducts: Product[] = response.data.map(apiProduct => {
      let price = 0;
      if (apiProduct.default_variant?.sale_price) {
        price = apiProduct.default_variant.sale_price;
      } else if (apiProduct.price_range?.min) {
        price = parseFloat(apiProduct.price_range.min);
      }

      const image = apiProduct.images && apiProduct.images.length > 0
        ? apiProduct.images[0].url
        : undefined;

      return {
        id: String(apiProduct.id),
        name: apiProduct.title,
        price,
        rating: 5,
        isFavorite: false,
        image,
        variantId: apiProduct.default_variant?.id,
      };
    });

    return {
      data: mappedProducts,
      pagination: response.pagination,
    };
  },
};
