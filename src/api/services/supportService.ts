import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import {
  SupportTicket,
  TicketThread,
  CreateTicketPayload,
  ReplyTicketPayload,
} from '../../types/support';

export const supportService = {
  /**
   * Get all support tickets for the current user
   */
  getTickets: async () => {
    return apiService.get<SupportTicket[]>(ENDPOINTS.SUPPORT.LIST);
  },

  /**
   * Create a new support ticket
   */
  createTicket: async (payload: CreateTicketPayload) => {
    return apiService.post<any, CreateTicketPayload>(ENDPOINTS.SUPPORT.CREATE, payload);
  },

  /**
   * Get ticket details and full message thread
   */
  getTicketThread: async (id: string | number) => {
    return apiService.get<TicketThread>(ENDPOINTS.SUPPORT.DETAIL(id));
  },

  /**
   * Reply to an existing ticket
   */
  replyToTicket: async (id: string | number, payload: ReplyTicketPayload) => {
    return apiService.post<any, ReplyTicketPayload>(ENDPOINTS.SUPPORT.REPLY(id), payload);
  },

  /**
   * Mark all messages in a ticket as read
   */
  markAsRead: async (id: string | number) => {
    return apiService.post<void, {}>(ENDPOINTS.SUPPORT.MARK_READ(id), {});
  },
};
