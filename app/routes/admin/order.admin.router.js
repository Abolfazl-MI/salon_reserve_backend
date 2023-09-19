const express = require("express");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const {
  adminCreateOrderValidation,
} = require("../../http/validations/order/create-order.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
let multer=require('multer');
const { adminGetAllOrderValidation } = require("../../http/validations/order/get-all-order.validation");
const router = express.Router();

router
  .route("/create-order")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    adminCreateOrderValidation(),
    validateRequest,
    AdminController.createOrder
  );

router.route('/').get(
  authMiddleware,
  authorizeAdmin,
  adminGetAllOrderValidation(),
  validateRequest,
  AdminController.getAllOrders
)

router.route('/single/:id').get(
  authMiddleware,
  authorizeAdmin,
  // AdminController.getSingleOrder
)

router.route('/update-order').post(
  authMiddleware,
  authorizeAdmin,
  // AdminController.updateOrder
)

router.route('/delete-order').delete(
  authMiddleware,
  authorizeAdmin,
  // AdminController.deleteOrder
)

module.exports = {
  orderAdminRouter: router,
};
