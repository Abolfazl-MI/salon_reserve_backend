const express = require("express");

const { couponAdminRouter } = require("./coupon.admin.router");
const {userAdminRouter} = require("./user.admin.router");
const router = express.Router();

router.use("/users", userAdminRouter);
router.use("/coupons", couponAdminRouter);
module.exports = {
  adminRouter: router,
};
