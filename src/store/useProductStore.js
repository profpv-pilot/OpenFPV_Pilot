// ================================
// Zustand — Product Store
// ================================

import { create } from 'zustand'
import { PRODUCTS, getProductById, getProductsByCategory } from '@data/products'

const useProductStore = create((set, get) => ({
  products: PRODUCTS,
  activeCategory: 'all',
  selectedProduct: null,
  searchQuery: '',

  // Filtered product list (computed via getter)
  getFiltered: () => {
    const { products, activeCategory, searchQuery } = get()
    let list = activeCategory === 'all' ? products : products.filter((p) => p.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    return list
  },

  setActiveCategory: (category) => set({ activeCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectProduct: (id) => set({ selectedProduct: getProductById(id) || null }),
  clearSelectedProduct: () => set({ selectedProduct: null }),
}))

export default useProductStore
