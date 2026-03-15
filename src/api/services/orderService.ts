import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { PaymentMethod, PlaceOrderPayload, Order } from '../../types/order';

export const orderService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const res = await apiService.get<{ data: PaymentMethod[] }>(ENDPOINTS.PAYMENTS.METHODS);
    return (res as any)?.data ?? res as any;
  },

  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    return apiService.post<Order, PlaceOrderPayload>(ENDPOINTS.ORDERS.PLACE, payload);
  },
};
