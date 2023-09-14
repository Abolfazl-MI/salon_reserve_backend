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
const {
  getSingleUserValidation,
} = require("../../http/validations/get-single-user.validation");
const updateUserValidation = require("../../http/validations/update-user.validation");
const deleteUserValidation = require("../../http/validations/delete-user.validation");
const router = express.Router();

router
  .route("/users/create-user")
  .post(
    multer().none(),
    authMiddleware,
    authorizeAdmin,
    createUserValidation(),
    validateRequest,
    AdminController.createUserWithPhone
  );

router
  .route("/users")
  .get(authMiddleware, authorizeAdmin, AdminController.getAllUsers);

router
  .route("/users/single/:id")
  .get(
    authMiddleware,
    authorizeAdmin,
    getSingleUserValidation(),
    validateRequest,
    AdminController.getSingleUser
  );

router.route('/users/update-user').post(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  updateUserValidation(),
  validateRequest,
  AdminController.updateUserInfo
)
router.route('/users/delete-user').delete(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  deleteUserValidation(),
  validateRequest,
  AdminController.deleteUserData
)
module.exports = {
  adminRouter: router,
};
