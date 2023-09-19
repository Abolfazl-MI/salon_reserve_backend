const { body } = require("express-validator");

function adminCreateOrderValidation(req, res, next) {
  return [
    body("user_id")
      .notEmpty()
      .withMessage("user is should not be empty")
      .isMongoId()
      .withMessage("user id is invalid"),
    body("salon_id")
      .notEmpty()
      .withMessage("user is should not be empty")
      .isMongoId()
      .withMessage("user id is invalid"),
    body("reserve_days")
      .notEmpty()
      .withMessage("reserve_days must not be empty"),
    body("coupon_code")
      .optional()
      .notEmpty()
      .withMessage("coupon code should not be empty"),
  ];
}

module.exports = {
  adminCreateOrderValidation,
};
