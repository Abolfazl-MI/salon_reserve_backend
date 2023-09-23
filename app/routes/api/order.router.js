
const express = require("express");
const { authMiddleware } = require("../../http/middlewares/auth.mid");
const { userCreateOrderValidation } = require("../../http/validations/user/order/create-order.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { UserController } = require("../../http/controller/user.controller");
const multer = require("multer");
const router = express.Router();


router.route('/create-order').post(
    multer().none(),
    authMiddleware,
    userCreateOrderValidation(),
    validateRequest,
    UserController.createOrder
)

router.route('/').get(
    authMiddleware,
   UserController.getAllUserOrder
)

module.exports = {
    orderRouter: router
}