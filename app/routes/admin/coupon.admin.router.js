const express = require("express");
const multer = require("multer");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const createCouponCodeValidation = require("../../http/validations/admin/coupon/create-coupon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const getAllCouponsValidation = require("../../http/validations/admin/coupon/get-all-coupons.validation");
const getSingleCouponValidation = require("../../http/validations/admin/coupon/get-single-coupon.validation");
const updateCouponValidation = require("../../http/validations/admin/coupon/update-coupon.validation");
const deleteCouponValidation = require("../../http/validations/admin/coupon/delete-coupon.validation");
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
  .route("/single/:code")
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
router.route("/delete-coupon").delete(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  deleteCouponValidation(),
  validateRequest,
  AdminController.deleteCoupon
);
module.exports = {
  couponAdminRouter: router,
};
