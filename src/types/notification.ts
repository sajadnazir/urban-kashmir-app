export interface Notification {
  id: number;
  title: string;
  message: string;
  type?: string;
  data?: Record<string, any>;
  read_at: string | null;
  created_at: string;
  updated_at?: string;
}

export interface FcmTokenPayload {
  fcm_token: string;
  device_type: 'android' | 'ios';
  device_id: string;
}
