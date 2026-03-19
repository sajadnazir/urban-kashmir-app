export interface SupportTicket {
  id: number | string;
  user_id: number | string;
  order_id: number | string | null;
  subject: string;
  category: string;
  status: 'open' | 'closed' | 'resolved' | 'pending';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: number | string;
  message: string;
  sender_type: 'customer' | 'admin';
  sender_name?: string;
  read_at?: string | null;
  created_at: string;
}

export interface TicketThread extends SupportTicket {
  messages: TicketMessage[];
}

export interface CreateTicketPayload {
  subject: string;
  category: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  order_id?: number | string;
}

export interface ReplyTicketPayload {
  message: string;
}
