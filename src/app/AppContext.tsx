import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Preference, NotebookEntry, mockShops } from './types';
import { Theme, ramenTheme } from './theme';

const NOTEBOOK_KEY = 'meomtantjeong_notebook_v1';
const AUTH_KEY = 'meomtantjeong_auth_v1';
const FAVORITES_KEY = 'meomtantjeong_favorites_v1';
const SPLASH_KEY = 'meomtantjeong_splash_v1';

const INITIAL_ENTRIES: NotebookEntry[] = [];

export interface NotebookEntryFull extends NotebookEntry {
  texture?: string;
  richness?: string;
  tasteMatch?: string;
  impression?: string;
}

interface AppContextType {
  preference: Preference;
  setPreference: (pref: Preference) => void;
  notebookEntries: NotebookEntry[];
  addNotebookEntry: (entry: Omit<NotebookEntry, 'id'>) => void;
  updateNotebookEntry: (id: string, updates: Partial<Omit<NotebookEntry, 'id'>>) => void;
  deleteNotebookEntry: (id: string) => void;
  isShopSaved: (shopId: string) => boolean;
  getEntriesByShop: (shopId: string) => NotebookEntry[];
  getRecommendedShops: () => typeof mockShops;
  theme: Theme;
  isLoggedIn: boolean;
  userName: string;
  login: (provider?: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
  hasSeenSplash: boolean;
  setHasSeenSplash: () => void;
  favoriteShopIds: string[];
  toggleFavorite: (shopId: string) => void;
  isFavorite: (shopId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<Preference>({
    broth: [],
    noodleThickness: null,
    texture: null,
    richness: null,
    spiceLevel: null,
  });

  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>(() => {
    try {
      const saved = localStorage.getItem(NOTEBOOK_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_ENTRIES;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try { return localStorage.getItem(AUTH_KEY) === 'true'; } catch { return false; }
  });
  const [userName, setUserName] = useState<string>(() => {
    try { return localStorage.getItem(AUTH_KEY + '_name') || ''; } catch { return ''; }
  });

  const [hasSeenSplash, setHasSeenSplashState] = useState<boolean>(() => {
    try { return localStorage.getItem(SPLASH_KEY) === 'true'; } catch { return false; }
  });

  const [favoriteShopIds, setFavoriteShopIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteShopIds)); } catch {}
  }, [favoriteShopIds]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(notebookEntries));
    } catch {}
  }, [notebookEntries]);

  const addNotebookEntry = (entry: Omit<NotebookEntry, 'id'>) => {
    const newEntry = { ...entry, id: Date.now().toString() };
    setNotebookEntries((prev) => [newEntry, ...prev]);
  };

  const updateNotebookEntry = (id: string, updates: Partial<Omit<NotebookEntry, 'id'>>) => {
    setNotebookEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const deleteNotebookEntry = (id: string) => {
    setNotebookEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const isShopSaved = (shopId: string) =>
    notebookEntries.some((e) => e.shopId === shopId);

  const getEntriesByShop = (shopId: string) =>
    notebookEntries.filter((e) => e.shopId === shopId);

  const login = (provider?: string) => {
    setIsLoggedIn(true);
    setUserName('신나면');
    try {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(AUTH_KEY + '_name', '신나면');
    } catch {}
  };

  const loginAsGuest = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY + '_name');
    } catch {}
  };

  const setHasSeenSplash = () => {
    setHasSeenSplashState(true);
    try { localStorage.setItem(SPLASH_KEY, 'true'); } catch {}
  };

  const toggleFavorite = (shopId: string) => {
    setFavoriteShopIds((prev) =>
      prev.includes(shopId) ? prev.filter((id) => id !== shopId) : [...prev, shopId]
    );
  };

  const isFavorite = (shopId: string) => favoriteShopIds.includes(shopId);

  const getRecommendedShops = () => {
    const scored = mockShops.filter((shop) => shop.isLocal).map((shop) => {
      let score = 0;
      // 선택한 육수 중 하나라도 가게 broth 배열에 포함되면 매칭
      const brothMatch = preference.broth.length > 0 &&
        preference.broth.some(b => shop.broth.includes(b));
      if (brothMatch) score += 3;
      if (preference.noodleThickness && shop.noodleThickness === preference.noodleThickness) score += 2;
      if (preference.texture && shop.texture === preference.texture) score += 2;
      if (preference.richness && shop.richness === preference.richness) score += 2;
      if (preference.spiceLevel && shop.spiceLevel === preference.spiceLevel) score += 2;
      if (shop.mustTry) score += 1;
      return { shop, score };
    });
    return scored.sort((a, b) => b.score - a.score).map((s) => s.shop);
  };

  return (
    <AppContext.Provider
      value={{
        preference,
        setPreference,
        notebookEntries,
        addNotebookEntry,
        updateNotebookEntry,
        deleteNotebookEntry,
        isShopSaved,
        getEntriesByShop,
        getRecommendedShops,
        theme: ramenTheme,
        isLoggedIn,
        userName,
        login,
        loginAsGuest,
        logout,
        hasSeenSplash,
        setHasSeenSplash,
        favoriteShopIds,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
