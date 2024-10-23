const { body } = require("express-validator");

function userCreateOrderValidation(req, res, next) {
  return [
    body("salon_id")
      .notEmpty()
      .withMessage("salon is should not be empty")
      .isMongoId()
      .withMessage("salon id is invalid"),
    body("reserve_days")
      .notEmpty()
      .withMessage("reserve_days must not be empty"),
    body("coupon_code")
      .optional()
      .notEmpty()
      .withMessage("coupon code should not be empty"),
      body("coupon_code")
      .optional()
      .notEmpty()
      .withMessage("coupon code should not be empty"),
  ];
}

module.exports = {
  userCreateOrderValidation,
};
