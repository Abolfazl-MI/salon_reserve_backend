const { body } = require("express-validator");

function updateOrderPaymentValidation(req, res, next) {
  return [
    body("id")
      .custom((id, ctx) => {
        if (!id) {
          throw "id should not be empty";
        }
        return true;
      })
      .isMongoId()
      .withMessage("invalid id"),
    body("payment_method").optional().custom((payment_method,ctx)=>{
        if(!payment_method) throw "payment method should not be empty"
        let whitePaymentMethods=["one-time","installment"]
        if(!whitePaymentMethods.includes(payment_method)) throw "invalid payment method"
        return true
    }),
    body('payment_amount').custom((payment_amount,ctx)=>{
        if(!payment_amount) throw "payment amount should not be empty"
        return true
    }).isNumeric().withMessage('invalid payment amount')
  ];
}

module.exports={
    updateOrderPaymentValidation
}