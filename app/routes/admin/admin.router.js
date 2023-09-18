const express = require("express");

const { couponAdminRouter } = require("./coupon.admin.router");
const {userAdminRouter} = require("./user.admin.router");
const {salonAdminRouter}=require("./salon.admin.router");
const orderAdminRouter = require("./order.admin.router");
const router = express.Router();

router.use("/users", userAdminRouter);
router.use("/coupons", couponAdminRouter);
router.use("/salons", salonAdminRouter);
router.use("/orders", orderAdminRouter);
module.exports = {
  adminRouter: router,
};
