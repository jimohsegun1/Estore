import asyncHandler from "../middlewares/asyncHandler.js";
import Coupon from "../models/couponModel.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercent, minOrderValue, maxUses, expiresAt } = req.body;
  if (!code || !discountPercent) {
    return res.status(400).json({ error: "Code and discountPercent are required" });
  }
  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) return res.status(400).json({ error: "Coupon code already exists" });

  const coupon = await Coupon.create({ code, discountPercent, minOrderValue, maxUses, expiresAt });
  res.status(201).json(coupon);
});

const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json(coupons);
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(404).json({ error: "Coupon not found" });
  res.json({ message: "Coupon deleted" });
});

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code required" });

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) return res.status(404).json({ error: "Invalid or inactive coupon" });

  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return res.status(400).json({ error: "Coupon has expired" });
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ error: "Coupon usage limit reached" });
  }
  if (orderTotal < coupon.minOrderValue) {
    return res.status(400).json({
      error: `Minimum order value is $${coupon.minOrderValue}`,
    });
  }

  const discountAmount = ((orderTotal * coupon.discountPercent) / 100).toFixed(2);
  res.json({ valid: true, discountPercent: coupon.discountPercent, discountAmount: parseFloat(discountAmount) });
});

export { createCoupon, listCoupons, deleteCoupon, validateCoupon };
