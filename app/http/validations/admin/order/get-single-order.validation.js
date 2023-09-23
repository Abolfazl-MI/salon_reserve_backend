const { param } = require("express-validator");

function adminGetSingleOrderValidation(req, res, next) {
  return [
    param("id")
      .exists()
      .notEmpty()
      .withMessage("order id is required ")
      .isMongoId()
      .withMessage("id is invalid"),
  ];
}
module.exports = {
  adminGetSingleOrderValidation,
};
