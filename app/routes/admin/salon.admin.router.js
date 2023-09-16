const express = require("express");
let { upload, validateUploadedFiles } = require("../../utils/multer.config");
const {
  authMiddleware,
  authorizeAdmin,
} = require("../../http/middlewares/auth.mid");
const {
  createSalonValidation,
} = require("../../http/validations/salon/create-salon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const { imageMiddleWare } = require("../../http/middlewares/image.mid");
let {getSingleSalonValidation}=require('../../http/validations/salon/get-single-salon.validation');
const { deleteSalonValidation } = require("../../http/validations/salon/delete-salon.validation");
const multer = require("multer");
const router = express.Router();

router.route("/create-salon").post(
  upload.fields([{ name: "images", maxCount: 4 }]),
  authMiddleware,
  authorizeAdmin,
  createSalonValidation(),
  validateRequest,

  AdminController.createSalon
);

router
  .route("/")
  .get(authMiddleware, authorizeAdmin, AdminController.getAllSalons);

router.route('/single/:id').get(
  authMiddleware,
  authorizeAdmin,
  getSingleSalonValidation(),
  validateRequest,
  AdminController.getSingleSalon
)
router.route('/delete-salon').delete(
  multer().none(),
  authMiddleware,
  authorizeAdmin,
  deleteSalonValidation(),
  validateRequest,
  AdminController.deleteSalon
)
module.exports = {
  salonAdminRouter: router,
};
