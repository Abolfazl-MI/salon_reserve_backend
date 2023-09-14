let { param } = require("express-validator");

function getSingleUserValidation(req, res, next) {
  return [
    param("id")
      .notEmpty()
      .withMessage("id is required")
      .isMongoId().withMessage('provided id must be be valid'),
  ];
}

module.exports = {
  getSingleUserValidation,
};
