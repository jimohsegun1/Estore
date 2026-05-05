import express from "express";
import { createCoupon, listCoupons, deleteCoupon, validateCoupon } from "../controllers/couponController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(authenticate, authorizeAdmin, listCoupons).post(authenticate, authorizeAdmin, createCoupon);
router.route("/validate").post(authenticate, validateCoupon);
router.route("/:id").delete(authenticate, authorizeAdmin, deleteCoupon);

export default router;
