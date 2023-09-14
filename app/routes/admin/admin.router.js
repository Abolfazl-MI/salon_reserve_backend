const express = require("express");
const {
  createUserValidation,
} = require("../../http/validations/create.user.validation");
const multer = require("multer");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const router = express.Router();

router.route("/create-user").post(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  createUserValidation(),
  validateRequest,
  AdminController.createUserWithPhone
);

module.exports = {
  adminRouter: router,
};
