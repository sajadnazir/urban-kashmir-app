import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';
import { ApiBanner } from '../../types/banner';

export const bannerService = {
  /**
   * Get all active banners
   */
  getBanners: async () => {
    return apiService.get<ApiBanner[]>(ENDPOINTS.BANNERS.LIST);
  },
};
