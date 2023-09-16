const express = require("express");
let{upload, validateUploadedFiles}=require('../../utils/multer.config');
const { authMiddleware,authorizeAdmin } = require("../../http/middlewares/auth.mid");
const { createSalonValidation } = require("../../http/validations/salon/create-salon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const { AdminController } = require("../../http/controller/admin.controller");
const { imageMiddleWare } = require("../../http/middlewares/image.mid");
const router = express.Router();

router.route('/create-salon').post(
    upload.fields([{name:'images',maxCount:4}]),
    authMiddleware,
    authorizeAdmin,
    createSalonValidation(),
    validateRequest,
    
    AdminController.createSalon
)


module.exports = {
  salonAdminRouter: router,
};
