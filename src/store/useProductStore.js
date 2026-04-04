// ================================
// Zustand — Product Store
// ================================

import { create } from 'zustand'
import axios from 'axios'

const API_URL = '/api'

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  activeCategory: 'all',
  selectedProduct: null,
  searchQuery: '',

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      set({ products: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Add Product
  addProduct: async (formData) => {
    try {
      const { data } = await axios.post(`${API_URL}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      set((state) => ({ products: [...state.products, data] }));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to add product');
    }
  },

  // Update Product
  updateProduct: async (id, formData) => {
    try {
      const { data } = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      set((state) => ({
        products: state.products.map((p) => (p._id === id ? data : p))
      }));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update product');
    }
  },

  // Delete Product
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
      set((state) => ({
        products: state.products.filter((p) => p._id !== id)
      }));
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to delete product');
    }
  },

  // Filtered product list
  getFiltered: () => {
    const { products, activeCategory, searchQuery } = get()
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q)
      )
    }
    return list
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectProduct: (id) => set({ selectedProduct: get().products.find(p => p._id === id) || null }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  // Media URL Helper
  getMediaUrl: (id) => id ? `${API_URL}/media/${id}` : null,
}))

export default useProductStore
