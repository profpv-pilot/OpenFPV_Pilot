import { create } from 'zustand'
import axios from 'axios'

const API_URL = '/api/auth'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,
  profileUpdating: false,
  error: null,

  fetchUser: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/user`, { withCredentials: true })
      set({ user: data, loading: false })
    } catch (err) {
      set({ user: null, loading: false })
    }
  },

  login: async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
      set({ user: data, loading: false });
      return true;
    } catch (err) {
      console.error('Login failed', err);
      return false;
    }
  },

  getProfile: async () => {
    try {
      const { data } = await axios.get('/api/auth/profile');
      set({ user: { ...get().user, ...data } });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    }
  },

  updateProfile: async (profileData) => {
    set({ profileUpdating: true });
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });

      const { data } = await axios.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      set({ user: data, profileUpdating: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, profileUpdating: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.get(`${API_URL}/logout`, { withCredentials: true })
      set({ user: null })
      window.location.href = '/'
    } catch (err) {
      console.error('Logout failed', err)
    }
  },

  isAdmin: () => {
    const user = useAuthStore.getState().user
    return user && user.role === 'admin'
  },

  hasAccess: (level) => {
    const user = useAuthStore.getState().user
    if (!user) return false
    
    const roleLevels = {
      'admin': 4,
      'power_user': 3,
      'student': 2,
      'buyer': 1
    }
    
    return roleLevels[user.role] >= level
  }
}))
