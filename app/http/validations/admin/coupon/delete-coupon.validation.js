const { body } = require("express-validator");

function deleteCouponValidation(req, res, next) {
  return [
    body("id")
      .notEmpty()
      .withMessage("id should not be empty")
      .isMongoId()
      .withMessage("provided coupon id is invalid"),
  ];
}


module.exports=deleteCouponValidation