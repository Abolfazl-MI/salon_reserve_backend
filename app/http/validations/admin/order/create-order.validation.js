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
    body("reserve_days").custom((reserved_days, ctx) => {
      if(!reserved_days){
        throw 'reserve days must not be empty'
      }
      if(Array.isArray(reserved_days)){
        let is_valid=reserved_days.every((item)=>item.hasOwnProperty("hours") && item.hasOwnProperty("day"))
        if(!is_valid){
          throw 'invalid reserved days format'
        }
        return true
      }else{
        try{
          let parsed_data=JSON.parse(reserved_days)
          let is_valid=parsed_data.every((item)=>item.hasOwnProperty("hours") && item.hasOwnProperty("day"))
          if(!is_valid){
            throw 'invalid reserved days format'
          }
          return true
        }catch(e){
          throw e+""
        }
      }
    }),
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
