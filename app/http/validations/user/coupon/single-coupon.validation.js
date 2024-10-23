const { param } = require("express-validator");

function getSingleCouponValidation() {
  return [
    param("id")
      .exists()
      .notEmpty()
      .withMessage("id is required")
      .isMongoId()
      .withMessage("provided id must be be valid"),
  ];
}

module.exports={
    getSingleCouponValidation
}