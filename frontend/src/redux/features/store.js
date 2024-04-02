import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./features/auth/authReducer"

const store = configureStore({
  reducer: { [apiSlice.reducerPath]: apiSlice.reducer },
  auth: authReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devtools: true,
});

setupListeners(store.dispatch);
export default store;
