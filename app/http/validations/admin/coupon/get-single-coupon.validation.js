let { param } = require("express-validator");
function getSingleCouponValidation(req, res, next) {
  return [
    param("code")
      .exists()
      .notEmpty()
      .withMessage("coupon code should not be empty"),
  ];
}
module.exports = getSingleCouponValidation;
