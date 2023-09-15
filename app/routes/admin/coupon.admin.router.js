const express = require("express");
const multer = require("multer");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const createCouponCodeValidation = require("../../http/validations/coupon/create-coupon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const getAllCouponsValidation = require("../../http/validations/coupon/get-all-coupons.validation");
const getSingleCouponValidation = require("../../http/validations/coupon/get-single-coupon.validation");
const updateCouponValidation = require("../../http/validations/coupon/update-coupon.validation");
const router = express.Router();

router
  .route("/create-coupon")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    createCouponCodeValidation(),
    validateRequest,
    AdminController.createCouponCode
  );
router
  .route("/")
  .get(
    authMiddleware,
    authorizeAdmin,
    getAllCouponsValidation(),
    validateRequest,
    AdminController.getAllCoupons
  );
router
  .route("/single/:id")
  .get(
    authMiddleware,
    authorizeAdmin,
    getSingleCouponValidation(),
    validateRequest,
    AdminController.getSingleCoupon
  );
router
  .route("/update-coupon")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    updateCouponValidation(),
    validateRequest,
    AdminController.updateCoupon
  );
module.exports = {
  couponAdminRouter: router,
};
