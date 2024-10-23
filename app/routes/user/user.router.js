

const express = require("express");
const { authMiddleware } = require("../../http/middlewares/auth.mid");
const { updateProfileValidation } = require("../../http/validations/user/profile/update-profile.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const multer = require("multer");
const { UserController } = require("../../http/controller/user.controller");
const userController = require("../../http/controller/user.controller");
const router = express.Router();
// complete profile route


router.route('/complete-profile').post(
    multer().none(),
    authMiddleware,
    updateProfileValidation(),
    validateRequest,
    UserController.completeProfile
)

module.exports ={
    userRouter:router
}