export interface PaymentMethod {
  method: string;
  name: string;
  description: string;
  is_active: boolean;
  icon_url: string | null;
  charges?: number;
  max_amount?: number;
}

export interface PlaceOrderPayload {
  shipping_address_id: number;
  billing_address_id: number;
  shipping_method: string;
  payment_method: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_title: string;
  variant_id: number;
  variant_name: string;
  quantity: number;
  price: number;
  total: number;
  image_url?: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping_total: number;
  discount_total: number;
  payment_method: string;
  payment_status: string;
  shipping_method: string;
  shipping_address?: any; // Reusing Address type from address.ts is better but keeping it simple for now
  billing_address?: any;
  items?: OrderItem[];
  created_at: string;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
