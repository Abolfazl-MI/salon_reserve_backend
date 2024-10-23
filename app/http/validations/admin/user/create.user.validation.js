const { body } = require("express-validator");
function createUserValidation(req, res, next) {
  return [
    body("phone_number").custom((phone, ctx) => {
      if (!phone) throw "phone number should not be empty";
      const phoneRegex = /^(\+98|0)?9\d{9}$/;
      if (!phoneRegex.test(phone)) {
        throw "Invalid phone number format";
      }
      return true;
    }),
    body("coupon_discount")
      .optional()
      .isNumeric()
      .withMessage("discount should be valid int ").notEmpty().withMessage('coupon discount should not be empty'),
  ];
}

module.exports = {
  createUserValidation,
};
