import { apiService, PaginatedResponse } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { Store } from '../../components/StoreCard';

export interface ApiVendor {
  id: number;
  name: string;
  display_name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  cover_url: string | null;
  logo_url: string | null;
  statistics: {
    total_products: number;
    total_published: number;
    total_categories: number;
    avg_rating: number | null;
  };
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    product_count: number;
  }>;
}

export type VendorsResponse = PaginatedResponse<ApiVendor[]>;

export const vendorService = {
  getVendors: async (page: number = 1, perPage: number = 20): Promise<VendorsResponse> => {
    return await apiService.getPaginated<ApiVendor[]>(ENDPOINTS.VENDORS.LIST, {
      page,
      per_page: perPage,
      sort_by: 'latest',
    });
  },

  getVendorBySlug: async (slug: string): Promise<ApiVendor> => {
    return await apiService.get<ApiVendor>(ENDPOINTS.VENDORS.DETAIL(slug));
  },
};
