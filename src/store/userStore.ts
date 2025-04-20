import { create } from 'zustand';
import { UserSettings } from '../types/settings';

interface UserState extends UserSettings {
  isLoggedIn: boolean;
  email: string;
  displayName: string;
  avatar: string;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateProfile: (profile: { displayName: string; avatar: string }) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isLoggedIn: false,
  email: '',
  displayName: '',
  avatar: '',
  accountCurrency: 'USD',
  initialBalance: 100,
  riskPercentage: 1,
  darkMode: false,
  defaultPairs: [],
  tags: [],
  setups: [],
  login: (email, password) => set({ isLoggedIn: true, email }),
  logout: () => set({ isLoggedIn: false, email: '', displayName: '', avatar: '' }),
  updateProfile: (profile) => set({ displayName: profile.displayName, avatar: profile.avatar }),
  updateSettings: (settings) => set(settings),
}));
