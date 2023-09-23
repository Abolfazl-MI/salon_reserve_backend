const { body } = require("express-validator");

function adminDeleteOrderValidation() {
  return [
    body("id")
      .notEmpty()
      .withMessage("order id mut not be empty")
      .isMongoId()
      .withMessage("id is invalid"),
  ];
}

module.exports={
    adminDeleteOrderValidation
}
