import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../../../Utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal", couponCode: null, discountAmount: 0 };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { user, rating, numReviews, reviews, ...item } = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);
      if (existItem) {
        state.cartItems = state.cartItems.map((x) => (x._id === existItem._id ? item : x));
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state, item);
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      state.couponCode = null;
      state.discountAmount = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    applyCoupon: (state, action) => {
      state.couponCode = action.payload.couponCode;
      state.discountAmount = action.payload.discountAmount;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    removeCoupon: (state) => {
      state.couponCode = null;
      state.discountAmount = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },

    resetCart: (state) => (state = initialState),
  },
});

export const {
  addToCart,
  removeFromCart,
  savePaymentMethod,
  saveShippingAddress,
  clearCartItems,
  applyCoupon,
  removeCoupon,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
