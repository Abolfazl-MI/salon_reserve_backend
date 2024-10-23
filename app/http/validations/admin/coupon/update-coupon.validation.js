let { body } = require("express-validator");
function updateCouponValidation(req, res, next) {
  return [
    body("id")
      .notEmpty()
      .withMessage("coupon id is required")
      .isMongoId()
      .withMessage("provided id must be be valid"),
    body("discount")
      .optional()
      .notEmpty()
      .withMessage("coupon discount is required")
      .isNumeric()
      .withMessage("invalid coupon discount value"),
    body("status")
      .optional()
      .custom((status, ctx) => {
        if (!status) throw "coupon status is required for updated";
        let whiteStatuses = ["fill", "free"];
        if (!whiteStatuses.includes(status))
          throw "provided status is not exists";
        return true;
      }),
  ];
}
module.exports = updateCouponValidation;
