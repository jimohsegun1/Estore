import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const wishlistApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => `${USERS_URL}/wishlist`,
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/wishlist`,
        method: "POST",
        body: { productId },
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `${USERS_URL}/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} = wishlistApiSlice;
