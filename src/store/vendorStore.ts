import { create } from 'zustand';
import { vendorService } from '../api';
import type { ApiVendor } from '../api/services/vendorService';
import type { Store } from '../components/StoreCard';

interface VendorState {
  vendors: Store[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchVendors: (force?: boolean) => Promise<void>;
  setVendors: (vendors: Store[]) => void;
  clearVendors: () => void;
}

const CACHE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

export const useVendorStore = create<VendorState>((set, get) => ({
  vendors: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  fetchVendors: async (force = false) => {
    const { lastFetched, isLoading } = get();
    const now = Date.now();
    
    // Use cache if not forced and within timeout
    if (!force && lastFetched && (now - lastFetched < CACHE_TIMEOUT)) {
      return;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const response = await vendorService.getVendors(1, 10);
      const vendorArray = response.data || [];
      
      const organicFallbacks = [
        'https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1589135303604-b936d1ffbc90?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596040033229-a9821ebd05ed?q=80&w=400&auto=format&fit=crop',
      ];
      
      const mappedStores: Store[] = vendorArray.map((vendor: ApiVendor, index: number) => ({
        id: String(vendor.id),
        name: vendor.display_name || vendor.name,
        slug: vendor.slug,
        description: vendor.description || 'No description available',
        image: vendor.banner_url || vendor.logo_url || organicFallbacks[index % organicFallbacks.length],
        rating: Number(vendor.statistics?.avg_rating || 0),
        productsCount: vendor.statistics?.total_products || 0,
      }));

      set({ 
        vendors: mappedStores, 
        isLoading: false, 
        lastFetched: now 
      });
    } catch (error: any) {
      set({ 
        error: error?.message || 'Failed to fetch vendors', 
        isLoading: false 
      });
      throw error;
    }
  },

  setVendors: (vendors) => set({ vendors, lastFetched: Date.now() }),
  clearVendors: () => set({ vendors: [], lastFetched: null, error: null }),
}));
