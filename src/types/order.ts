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
  // Required by backend when payment_method is 'razorpay'
  payment_details?: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  };
}

/** Returned by the react-native-razorpay SDK on successful payment */
export interface RazorpayPaymentResult {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

/** Thrown/returned by the react-native-razorpay SDK on failure */
export interface RazorpayPaymentError {
  code: number;
  description: string;
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
  tracking_number?: string;
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
