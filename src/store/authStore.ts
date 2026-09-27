import { create } from 'zustand';

export interface UserProfile {
  id: string;
  full_name: string;
  name?: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string;
  is_active?: boolean;
  status?: string;
  created_at?: string;
  createdAt?: string;
  last_login_at?: string;
  lastLoginAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  updateUser: (fields: Partial<UserProfile>) => void;
  logout: () => void;
  toggleDarkMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const savedUserStr = localStorage.getItem('user_profile');
  const savedToken = localStorage.getItem('access_token');
  const savedDarkMode = localStorage.getItem('dark_mode') === 'true';

  let initialUser: UserProfile | null = null;
  if (savedUserStr) {
    try {
      initialUser = JSON.parse(savedUserStr);
    } catch (e) {
      initialUser = null;
    }
  }

  if (savedDarkMode) {
    document.documentElement.classList.add('dark');
  }

  return {
    user: initialUser,
    token: savedToken || null,
    isAuthenticated: Boolean(initialUser && savedToken),
    darkMode: savedDarkMode,

    setAuth: (user, token) => {
      localStorage.setItem('user_profile', JSON.stringify(user));
      localStorage.setItem('access_token', token);
      set({ user, token, isAuthenticated: true });
    },

    updateUser: (fields) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...fields };
        localStorage.setItem('user_profile', JSON.stringify(updatedUser));
        return { user: updatedUser };
      });
    },

    logout: () => {
      localStorage.removeItem('user_profile');
      localStorage.removeItem('access_token');
      set({ user: null, token: null, isAuthenticated: false });
    },

    toggleDarkMode: () => {
      set((state) => {
        const nextMode = !state.darkMode;
        localStorage.setItem('dark_mode', String(nextMode));
        if (nextMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { darkMode: nextMode };
      });
    },
  };
});

