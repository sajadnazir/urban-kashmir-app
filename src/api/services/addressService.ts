import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { Address, CreateAddressPayload, UpdateAddressPayload } from '../../types/address';

export const addressService = {
  /**
   * Fetch all user addresses.
   */
  getAddresses: async (): Promise<Address[]> => {
    return apiService.get<Address[]>(ENDPOINTS.ADDRESSES.LIST);
  },

  /**
   * Create a new address.
   */
  createAddress: async (data: CreateAddressPayload): Promise<Address> => {
    return apiService.post<Address, CreateAddressPayload>(
      ENDPOINTS.ADDRESSES.CREATE,
      data
    );
  },

  /**
   * Update an existing address.
   */
  updateAddress: async (id: number, data: UpdateAddressPayload): Promise<Address> => {
    return apiService.put<Address, UpdateAddressPayload>(
      ENDPOINTS.ADDRESSES.UPDATE(id),
      data
    );
  },

  /**
   * Delete an existing address.
   */
  deleteAddress: async (id: number): Promise<void> => {
    return apiService.delete<void>(ENDPOINTS.ADDRESSES.DELETE(id));
  },

  /**
   * Set an address as the default address.
   */
  setDefaultAddress: async (id: number): Promise<void> => {
    return apiService.post<void, {}>(ENDPOINTS.ADDRESSES.SET_DEFAULT(id), {});
  },
};
