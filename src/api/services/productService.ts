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
  variants?: Array<{
    id: number;
    title: string;
    price: string;
    sale_price: string;
    stock: number;
  }>;
}

export interface FullProduct extends Product {
  description: string;
  images: string[];
  variants: Array<{
    id: number;
    name: string;
    price: number;
    stock: number;
  }>;
  category_id: number;
}


export const productService = {
  getProducts: async (
    page: number = 1,
    perPage: number = 20,
    search: string = '',
    sort: string = 'none',
    categoryId?: string,
    vendorId?: number | string
  ): Promise<PaginatedResponse<Product[]>> => {
    const params: Record<string, any> = { page, per_page: perPage };
    if (search) params.q = search;
    if (sort !== 'none') {
      const [sortBy, order] = sort.split(':');
      if (sortBy === 'price_low') { params.sort_by = 'price'; params.order = 'asc'; }
      else if (sortBy === 'price_high') { params.sort_by = 'price'; params.order = 'desc'; }
      else if (sortBy === 'on_sale') { params.on_sale = 1; }
      else if (sortBy === 'discount') { params.discount = 1; }
      else if (sortBy === 'newest') { params.sort_by = 'id'; params.order = 'desc'; }
    }
    if (categoryId && categoryId !== 'all') {
      params.category_id = categoryId;
    }
    if (vendorId) {
      params.vendor_id = vendorId;
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
    perPage: number = 20,
    sort: string = 'none'
  ): Promise<PaginatedResponse<Product[]>> => {
    // Note: Search API uses a different structure { data: { products: [], categories: [] } }
    // It doesn't seem to follow the standard PaginatedResponse envelope directly
    const params: any = { q: query, page, per_page: perPage };
    if (sort !== 'none') {
      if (sort === 'price_low') { params.sort_by = 'price'; params.order = 'asc'; }
      else if (sort === 'price_high') { params.sort_by = 'price'; params.order = 'desc'; }
      else if (sort === 'on_sale') { params.on_sale = 1; }
      else if (sort === 'discount') { params.discount = 1; }
      else if (sort === 'newest') { params.sort_by = 'id'; params.order = 'desc'; }
    }
    const response = await apiService.get<any>(
      ENDPOINTS.PRODUCTS.SEARCH,
      params
    );

    const apiProducts: ApiProduct[] = response.products || [];

    // Map ApiProduct -> UI Product
    const mappedProducts: Product[] = apiProducts.map(apiProduct => {
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
      pagination: {
        current_page: page,
        last_page: 1,
        per_page: perPage,
        total: mappedProducts.length,
        from: 1,
        to: mappedProducts.length,
      },
    };
  },

  getProductById: async (id: string | number): Promise<FullProduct> => {
    console.log(`Fetching product detail for ID: ${id}`);
    const response = await apiService.get<any>(ENDPOINTS.PRODUCTS.DETAIL(id));
    console.log('Raw API Product Response:', JSON.stringify(response, null, 2));
    
    // The API wraps the product in a 'product' field
    const apiProduct = response.product;
    
    // Map to FullProduct
    let price = 0;
    if (apiProduct.default_variant?.sale_price) {
      price = apiProduct.default_variant.sale_price;
    } else if (apiProduct.price_range?.min) {
      price = parseFloat(apiProduct.price_range.min);
    }

    const images = apiProduct.images?.map((img: any) => img.url) || [];
    const variants = apiProduct.variants?.map((v: any) => ({
      id: v.id,
      name: v.title || 'Standard',
      price: parseFloat(v.sale_price || v.price),
      stock: v.inventory?.available_quantity || 0,
    })) || [];

    return {
      id: String(apiProduct.id),
      name: apiProduct.title,
      price,
      rating: 5,
      isFavorite: false,
      image: images[0],
      variantId: apiProduct.default_variant?.id,
      description: apiProduct.description,
      images,
      variants,
      category_id: apiProduct.category_id,
    };
  },
};
