const { body } = require("express-validator");

function createCouponCodeValidation(req,res,next) {
  return [
    body("coupon_discount")
      .notEmpty()
      .withMessage("coupon discount must not be empty")
      .isNumeric()
      .withMessage("invalid coupon discount value"),
  ];
}

module.exports=createCouponCodeValidation
