const express = require("express");
const authRouter = require("./auth/auth.router");
const userRouter = require("./user/user.router");
const salonRouter = require("./api/salon.router");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/salon", salonRouter);
router.use("/admin", adminRouter);
router.use("/order", orderRouter);

module.exports = {
  allRoutes: router,
};
