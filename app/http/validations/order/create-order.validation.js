const { body } = require("express-validator");

function adminCreateOrderValidation(req, res, next) {
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
      .withMessage("reserve_days must not be empty"),
    body("coupon_code")
      .optional()
      .notEmpty()
      .withMessage("coupon code should not be empty"),
    body("payment_method")
      .optional()
      .notEmpty()
      .withMessage("payment method should not be empty")
      .custom((payment_method, ctx) => {
        console.log(payment_method);
        let whitePaymentMethods = ["one-time", "installment"];
        if (!whitePaymentMethods.includes(payment_method))
          throw "payment method not exists";
        return true;
      }),
    body("payment_amount").custom((payment_amount, context) => {
      let payment_method = context.req.body.payment_method;
      if (!payment_method) return true;
      if (payment_method && payment_method == "installment") {
        if (!payment_amount) {
          throw "installment payment require field payment_amount";
        }
        let number_regex = /^[0-9]*$/;
        if (!number_regex.test(payment_amount)) {
          throw "payment amount should be number";
        }
        return true;
      }
    }),
  ];
}

module.exports = {
  adminCreateOrderValidation,
};
