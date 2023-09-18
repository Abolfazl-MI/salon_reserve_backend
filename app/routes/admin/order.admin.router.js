const express = require("express");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const {
  createOrderValidation,
} = require("../../http/validations/order/create-order.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const router = express.Router();

router
  .route("/create-order")
  .post(
    authMiddleware,
    authorizeAdmin,
    createOrderValidation(),
    validateRequest,
    AdminController.createOrder
  );

router.route('/').get(
  authMiddleware,
  authorizeAdmin,
  // AdminController.getAllOrders
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
