export interface BannerAction {
  type: 'vendor' | 'product' | 'category' | string;
  id: number | string;
}

export interface ApiBanner {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  position: number;
  link_type: string;
  link_value: string;
  action?: BannerAction;
}
