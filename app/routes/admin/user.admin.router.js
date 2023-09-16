const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createUserValidation,
} = require("../../http/validations/user/create.user.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const {
  getSingleUserValidation,
} = require("../../http/validations/user/get-single-user.validation");
const updateUserValidation = require("../../http/validations/user/update-user.validation");
const deleteUserValidation = require("../../http/validations/user/delete-user.validation");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");

///------------router--------------------------

router
  .route("/create-user")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    createUserValidation(),
    validateRequest,
    AdminController.createUserWithPhone
  );

router
  .route("/")
  .get(authMiddleware, authorizeAdmin, AdminController.getAllUsers);

router
  .route("/single/:id")
  .get(
    authMiddleware,
    authorizeAdmin,
    getSingleUserValidation(),
    validateRequest,
    AdminController.getSingleUser
  );

router
  .route("/update-user")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    updateUserValidation(),
    validateRequest,
    AdminController.updateUserInfo
  );

router
  .route("/delete-user")
  .delete(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    deleteUserValidation(),
    validateRequest,
    AdminController.deleteUserData
  );
module.exports = {
  userAdminRouter: router,
};
