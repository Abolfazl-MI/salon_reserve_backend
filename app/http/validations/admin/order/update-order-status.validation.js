const { body } = require("express-validator");

function adminUpdateOrderStatusValidation(req, res, next) {
  return [
    body("id")
      .notEmpty()
      .withMessage("order id must not empty")
      .isMongoId()
      .withMessage("order id is invalid"),
    body("status")
      .custom((status, ctx) => {
        let whiteStatus = ["pending", "canceled", "completed"];
        if (!whiteStatus.includes(status)) {
          throw "invalid status";
        }
        if (!status) {
          throw "status should not be empty";
        }
        return true;
      }),
    
  ];
}

module.exports={
  adminUpdateOrderStatusValidation
}