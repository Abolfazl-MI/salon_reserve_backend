const { body } = require("express-validator");

function createOrderValidation(req, res, next) {
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
      .withMessage("reserve_days must not be empty")
      .isArray({ min: 1, max: 100 })
      .withMessage("reserve_days must be an array"),
  ];
}

module.exports={
    createOrderValidation
}