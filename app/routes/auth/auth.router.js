const express = require("express");
const { authMiddleware } = require("../../http/middlewares/auth.mid");
const { confirmCodeValidation } = require("../../http/validations/user/confirm-code.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const multer = require("multer");
const { UserController } = require("../../http/controller/user.controller");
const router = express.Router();

router.route('/confirm-code').post(
    multer().none(),
    confirmCodeValidation(),
    validateRequest,
    UserController.authorizeUser
)

module.exports={
    authRouter:router
}
