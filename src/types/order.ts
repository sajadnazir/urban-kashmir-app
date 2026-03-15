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

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
}
