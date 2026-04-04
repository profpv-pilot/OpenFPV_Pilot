import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

const API_URL = '/api'

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      addItem: (product, isLoggedIn) => {
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id)
          let newCart
          if (existing) {
            newCart = state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            )
          } else {
            newCart = [...state.cart, { ...product, quantity: 1 }]
          }
          return { cart: newCart }
        })
        get().syncWithBackend(isLoggedIn)
      },

      removeItem: (productId, isLoggedIn) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }))
        get().syncWithBackend(isLoggedIn)
      },

      updateQuantity: (productId, quantity, isLoggedIn) => {
        if (quantity < 1) return
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }))
        get().syncWithBackend(isLoggedIn)
      },

      clearCart: () => set({ cart: [], total: 0 }),

      syncWithBackend: async (isLoggedIn) => {
        if (!isLoggedIn) return;
        const { cart } = useCartStore.getState();
        try {
          // Send local cart to server
          const formattedCart = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
          }));
          await axios.post(`${API_URL}/cart`, { cart: formattedCart }, { withCredentials: true });
        } catch (err) {
          console.error('Cart sync failed', err);
        }
      },

      fetchRemoteCart: async (isLoggedIn) => {
        if (!isLoggedIn) return;
        try {
          const { data } = await axios.get(`${API_URL}/cart`, { withCredentials: true });
          const mergedCart = data.map(item => ({
            ...item.productId,
            id: item.productId._id,
            quantity: item.quantity
          }));
          
          if (mergedCart.length > 0) {
            set({ cart: mergedCart });
          }
        } catch (err) {
          console.error('Remote cart fetch failed', err);
        }
      },

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0)
      }
    }),
    {
      name: 'openfpv-cart-storage',
    }
  )
)
