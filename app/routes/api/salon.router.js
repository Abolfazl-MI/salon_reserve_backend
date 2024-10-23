const express = require("express");
const { authMiddleware } = require("../../http/middlewares/auth.mid");
const { SalonController } = require("../../http/controller/salon.controller");
const { getSingleSalonValidation } = require("../../http/validations/admin/salon/get-single-salon.validation");
const { validateRequest } = require("../../http/middlewares/validatror.mid");
const router = express.Router();

router.route('/').get(
  authMiddleware,
  SalonController.getAllSalons
)
router.route('/single/:id').get(
  authMiddleware,
  getSingleSalonValidation(),
  validateRequest,
  SalonController.getSingleSalon
)
module.exports = {
  salonRouter: router,
};
