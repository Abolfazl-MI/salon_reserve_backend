const express = require("express");
const getSingleCouponValidation = require("../../http/validations/admin/coupon/get-single-coupon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const { authMiddleware } = require("../../http/middlewares/auth.mid");
const router = express.Router();

router
  .route("/single/:id")
  .get(
    authMiddleware,
    getSingleCouponValidation(),
    validateRequest,
    AdminController.getSingleCoupon
  );

module.exports = {
  couponRouter: router,
};
