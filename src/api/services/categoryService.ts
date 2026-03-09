import { apiService } from '../apiService';
import { ENDPOINTS } from '../endpoints';

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

// Map some common keywords to icons
const getCategoryIcon = (name: string): string => {
  const lower = name.toLowerCase();
  if (lower.includes('shawl')) return 'layers';
  if (lower.includes('carpet')) return 'map';
  if (lower.includes('dry fruit') || lower.includes('natural')) return 'coffee';
  if (lower.includes('spice') || lower.includes('saffron')) return 'sun';
  if (lower.includes('mache') || lower.includes('box')) return 'package';
  if (lower.includes('copper')) return 'coffee';
  if (lower.includes('wood')) return 'box';
  if (lower.includes('decor')) return 'home';
  if (lower.includes('embroider') || lower.includes('textile')) return 'scissors';
  return 'grid'; // default icon
};

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const categories = await apiService.get<ApiCategory[]>(ENDPOINTS.CATEGORIES.LIST);
      
      if (!categories || !Array.isArray(categories)) {
        console.warn('categoryService: Expected array but received', typeof categories);
        return [];
      }

      return categories
        .filter(cat => cat && cat.is_active !== false) // Be more permissive in filtering
        .map(cat => ({
          id: String(cat.id),
          name: cat.name || 'Unnamed',
          icon: getCategoryIcon(cat.name || ''),
        }));
    } catch (error) {
      console.error('categoryService error:', error);
      throw error;
    }
  },
};
