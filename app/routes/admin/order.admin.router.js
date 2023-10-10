const express = require("express");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const {
  adminCreateOrderValidation,
} = require("../../http/validations/admin/order/create-order.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
let multer=require('multer');
const { adminGetAllOrderValidation } = require("../../http/validations/admin/order/get-all-order.validation");
const {adminGetSingleOrderValidation} = require("../../http/validations/admin/order/get-single-order.validation");
const { adminDeleteOrderValidation } = require("../../http/validations/admin/order/delete-order.validation");
const { adminUpdateOrderStatusValidation } = require("../../http/validations/admin/order/update-order-status.validation");
const { adminUpdateReservedDaysValidation } = require("../../http/validations/admin/order/update-reseved-days");
const { adminDeleteOrderReserveDay } = require("../../http/validations/admin/order/delete-reseve-days.validation");
const { updateOrderPaymentValidation } = require("../../http/validations/admin/order/updatt-payment-method");

const router = express.Router();

router
  .route("/create-order")
  .post(
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
  adminGetSingleOrderValidation(),
  validateRequest,
  AdminController.getSingleOrder
)

router.route('/update-status').post(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  adminUpdateOrderStatusValidation(),
  validateRequest,
  AdminController.updateOrderStatus
)
router.route('/update-reserved-days').post(
  authMiddleware,
  authorizeAdmin,
  adminUpdateReservedDaysValidation(),
  validateRequest,
  AdminController.updateOrderReserveDays
)
router.route('/update-payment').post(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  updateOrderPaymentValidation(),
  validateRequest,
  AdminController.updateOrderPayment
)
router.route('/delete-reserved-days').delete(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  adminDeleteOrderReserveDay(),
  validateRequest,
  AdminController.deleteOrderReservedTimes
  // (req,res,next)=>{
  //   // console.log(req.body)
  //   console.log(JSON.parse(req.body.reserve_days))
  // }
)
router.route('/delete-order').delete(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  adminDeleteOrderValidation(),
  validateRequest,
  AdminController.deleteOrder
)

module.exports = {
  orderAdminRouter: router,
};
