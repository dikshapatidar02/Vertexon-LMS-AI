import { INITIAL_DEMO_USERS } from '../utils/demoData';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  role?: 'student' | 'instructor';
}

export interface LoginPayload {
  email: string;
  password: string;
}

const userList = Object.values(INITIAL_DEMO_USERS);

export const authService = {
  async register(payload: RegisterPayload) {
    const newUser = {
      id: `usr-${Date.now()}`,
      full_name: payload.full_name,
      email: payload.email,
      role: payload.role || 'student',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      created_at: new Date().toISOString(),
    };

    const token = `vtx-token-${Date.now()}`;
    return { user: newUser, access_token: token };
  },

  async login(payload: LoginPayload) {
    const demoUser = userList.find(
      (u) => u.email.toLowerCase() === payload.email.toLowerCase()
    );

    const user = demoUser
      ? {
          id: demoUser.id,
          full_name: demoUser.full_name,
          email: demoUser.email,
          role: demoUser.role,
          avatar_url: demoUser.avatar_url,
          created_at: '2026-01-01',
        }
      : {
          id: `usr-${Date.now()}`,
          full_name: payload.email.split('@')[0].replace('.', ' '),
          email: payload.email,
          role: 'student' as const,
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          created_at: new Date().toISOString(),
        };

    const token = `vtx-token-${Date.now()}`;
    return { user, access_token: token };
  },

  async forgotPassword(email: string) {
    return { message: `Password reset instructions sent to ${email}` };
  },

  async resetPassword(payload: { token: string; password: string }) {
    return { message: 'Password has been successfully reset' };
  },

  async logout() {
    return { message: 'Logged out successfully' };
  },

  async me() {
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) {
      try {
        return { user: JSON.parse(savedUser) };
      } catch (e) {
        return null;
      }
    }
    return { user: userList[0] };
  },

  async updateProfile(payload: { full_name?: string; avatar_url?: string }) {
    const savedUser = localStorage.getItem('user_profile');
    let user = savedUser ? JSON.parse(savedUser) : userList[0];
    user = { ...user, ...payload };
    localStorage.setItem('user_profile', JSON.stringify(user));
    return { user };
  },

  async changePassword(payload: { current_password: string; new_password: string }) {
    return { message: 'Password updated successfully' };
  },
};
