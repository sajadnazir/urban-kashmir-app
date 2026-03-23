import { create } from 'zustand';
import { addressService } from '../api/services/addressService';
import { Address } from '../types/address';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  getDefaultAddress: () => Address | null;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const addresses = await addressService.getAddresses();
      set({ addresses, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error?.message || 'Failed to fetch addresses', 
        isLoading: false 
      });
    }
  },

  getDefaultAddress: () => {
    const { addresses } = get();
    return addresses.find(addr => addr.is_default) || addresses[0] || null;
  },
}));
