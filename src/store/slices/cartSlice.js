import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  products: [],
  totalItems: 0,
  totalValue: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.totalItems = action.payload.reduce((sum, item) => sum + item.qty, 0);
      state.totalValue = action.payload.reduce((sum, item) => sum + item.cost * item.qty, 0);
    },
    addToCart: (state, action) => {
      const { product, qty } = action.payload;
      const existingItem = state.items.find(item => item.productId === product._id);
      
      if (existingItem) {
        existingItem.qty += qty;
      } else {
        state.items.push({
          productId: product._id,
          name: product.name,
          cost: product.cost,
          image: product.image,
          qty: qty,
        });
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
      state.totalValue = state.items.reduce((sum, item) => sum + item.cost * item.qty, 0);
    },
    updateCartItem: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.items.find(item => item.productId === productId);
      if (item) {
        item.qty = qty;
      }
      state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
      state.totalValue = state.items.reduce((sum, item) => sum + item.cost * item.qty, 0);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.productId !== productId);
      state.totalItems = state.items.reduce((sum, item) => sum + item.qty, 0);
      state.totalValue = state.items.reduce((sum, item) => sum + item.cost * item.qty, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalValue = 0;
    },
  },
});

export const { 
  setLoading, 
  setError, 
  setProducts, 
  setCartItems, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = cartSlice.actions;

export default cartSlice.reducer;

