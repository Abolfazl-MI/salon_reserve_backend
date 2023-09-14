const express = require("express");
const multer = require("multer");
const { authMiddleware, authorizeAdmin } = require("../../http/middlewares/auth.mid");
const createCouponCodeValidation = require("../../http/validations/coupon/create-coupon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const router = express.Router();

router.route("/create-coupon").post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    createCouponCodeValidation(),
    validateRequest,
    AdminController.createCouponCode
);

module.exports = {
  couponAdminRouter: router,
};
