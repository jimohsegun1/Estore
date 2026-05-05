import { COUPONS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPONS_URL}/validate`,
        method: "POST",
        body: data,
      }),
    }),
    getCoupons: builder.query({
      query: () => COUPONS_URL,
      providesTags: ["Coupon"],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: COUPONS_URL,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupon"],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${COUPONS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupon"],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetCouponsQuery,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} = couponApiSlice;
