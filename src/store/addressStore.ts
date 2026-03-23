import { create } from 'zustand';
import { addressService } from '../api/services/addressService';
import { Address } from '../types/address';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  fetchAddresses: () => Promise<void>;
  getDefaultAddress: () => Address | null;
  createAddress: (payload: any) => Promise<void>;
  updateAddress: (id: number | string, payload: any) => Promise<void>;
  deleteAddress: (id: number | string) => Promise<void>;
  setDefaultAddress: (id: number | string) => Promise<void>;
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

  createAddress: async (payload) => {
    await addressService.createAddress(payload);
    await get().fetchAddresses();
  },

  updateAddress: async (id, payload) => {
    await addressService.updateAddress(Number(id), payload);
    await get().fetchAddresses();
  },

  deleteAddress: async (id) => {
    await addressService.deleteAddress(Number(id));
    await get().fetchAddresses();
  },

  setDefaultAddress: async (id) => {
    await addressService.setDefaultAddress(Number(id));
    await get().fetchAddresses();
  },
}));
