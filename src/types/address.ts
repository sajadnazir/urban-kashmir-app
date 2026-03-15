export interface Address {
  id: number;
  type: string;
  full_name: string;
  phone_number?: string;
  phone?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  country_code: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAddressPayload {
  type: string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  country_code: string;
  is_default: boolean;
}

export interface UpdateAddressPayload {
  type?: string;
  full_name?: string;
  phone_number?: string;
  phone?: string; // Some PUT requests use phone instead of phone_number based on the cURL
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  country_code?: string;
  is_default?: boolean;
}
