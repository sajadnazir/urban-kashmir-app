import { create } from 'zustand';
import { ApiBanner } from '../types/banner';

interface BannerState {
  banners: ApiBanner[];
  lastFetched: number | null;
  setBanners: (banners: ApiBanner[]) => void;
}

export const useBannerStore = create<BannerState>((set) => ({
  banners: [],
  lastFetched: null,
  setBanners: (banners) => set({ banners, lastFetched: Date.now() }),
}));
