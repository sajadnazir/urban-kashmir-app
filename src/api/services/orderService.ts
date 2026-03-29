import apiClient from '../client';
import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import type { PaymentMethod, PlaceOrderPayload, Order, OrdersResponse } from '../../types/order';

const mapApiAddress = (addr: any) => addr ? ({
  ...addr,
  full_name: addr.full_name || 'User', // Fallback as it seems missing in some JSON
  address_line_1: addr.line1 || addr.address_line_1,
  address_line_2: addr.line2 || addr.address_line_2,
  postal_code: addr.pincode || addr.postal_code,
}) : undefined;

const calculatePriceFromTax = (item: any) => {
  if (item.tax_amount && item.tax_rate && item.tax_rate > 0) {
    return item.tax_amount / (item.tax_rate / 100);
  }
  return 0;
};

const mapApiOrder = (apiOrder: any): Order => ({
  id: apiOrder.id,
  order_number: apiOrder.order_number || apiOrder.order_no || apiOrder.number || `ORD-${apiOrder.id}`,
  status: apiOrder.status,
  total: apiOrder.total_amount || apiOrder.total || 0,
  subtotal: apiOrder.subtotal || 0,
  tax: apiOrder.tax_amount || apiOrder.tax || 0,
  shipping_total: apiOrder.shipping_amount || apiOrder.shipping_total || 0,
  discount_total: apiOrder.discount_amount || apiOrder.discount_total || 0,
  payment_method: apiOrder.payment_method || '',
  payment_status: apiOrder.payment_status || '',
  shipping_method: apiOrder.shipping_method || '',
  shipping_address: mapApiAddress(apiOrder.shipping_address),
  billing_address: mapApiAddress(apiOrder.billing_address),
  items: apiOrder.items?.map((item: any) => {
    const unitPrice = item.price !== 0 ? item.price : (item.subtotal !== 0 ? item.subtotal : (calculatePriceFromTax(item) || (item.total !== 0 ? item.total : 0)));
    return {
      id: item.id,
      product_id: item.product_id,
      product_title: item.product?.title || item.product_title || '',
      variant_id: item.variant_id,
      variant_name: item.variant_title || item.variant_name || 'Standard',
      quantity: item.quantity,
      price: unitPrice,
      total: item.total || (unitPrice * item.quantity) || 0,
      image_url: item.product?.image_url || ((item as any).product?.images?.[0]?.url) || item.image_url,
    };
  }),
  tracking_number: apiOrder.tracking_number || apiOrder.tracking_no,
  created_at: apiOrder.created_at,
});

export const orderService = {
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const res = await apiService.get<any>(ENDPOINTS.PAYMENTS.METHODS);
    return res?.data ?? (Array.isArray(res) ? res : []);
  },

  placeOrder: async (payload: PlaceOrderPayload): Promise<Order> => {
    const res = await apiService.post<any, PlaceOrderPayload>(ENDPOINTS.ORDERS.PLACE, payload);
    const data = res?.order || res?.data?.order || res?.data || res;
    return mapApiOrder(data);
  },

  getOrderInvoice: async (id: string | number): Promise<any> => {
    // For now, we'll return the full URL with base URL since we might need to open it
    const url = `${apiClient.defaults.baseURL}${ENDPOINTS.ORDERS.INVOICE(id)}`;
    return { url };
  },

  getOrders: async (page: number = 1, perPage: number = 20): Promise<OrdersResponse> => {
    const res = await apiService.get<any>(`${ENDPOINTS.ORDERS.LIST}?page=${page}&per_page=${perPage}`);
    const rawData = res?.data || (Array.isArray(res) ? res : []);
    const meta = (res as any).meta || (res as any).pagination || { current_page: 1, last_page: 1, per_page: perPage, total: rawData.length };
    
    return {
      data: rawData.map(mapApiOrder),
      meta: {
        current_page: meta.current_page,
        last_page: meta.last_page,
        per_page: meta.per_page,
        total: meta.total,
      },
    };
  },

  getOrderDetails: async (id: string | number): Promise<Order> => {
    const res = await apiService.get<any>(ENDPOINTS.ORDERS.DETAIL(id));
    const data = res?.order || res?.data?.order || res?.data || res;
    return mapApiOrder(data);
  },

  cancelOrder: async (id: string | number, reason: string, comments: string): Promise<any> => {
    const payload: any = { 
      reason,
      reason_details: comments?.trim() || undefined
    };
    return apiService.post<any>(ENDPOINTS.ORDERS.CANCEL(id), payload);
  },

  returnOrder: async (id: string | number, payload: any): Promise<any> => {
    // payload should already contain reason, reason_details, refund_method, etc.
    return apiService.post<any>(ENDPOINTS.ORDERS.RETURN(id), payload);
  },

  trackOrder: async (trackingNumber: string): Promise<any> => {
    return apiService.get<any>(ENDPOINTS.TRACKING(trackingNumber));
  },
};
