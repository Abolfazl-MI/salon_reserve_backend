const { body } = require("express-validator");

function updateOrderDaysValidation(req, res, next) {
  return [
    body("order_id")
      .custom((order_id, ctx) => {
        if (!order_id) throw "order id should not be empty";
        return true;
      })
      .isMongoId()
      .withMessage("order id is invalid"),
    body("days").custom((days, ctx) => {
      if (!days) throw "days should not be empty";
      let is_valid = days.every(
        (item) => item.hasOwnProperty("hours") && item.hasOwnProperty("day")
      );
      if (!is_valid) {
        throw "invalid days data";
      }
      return true;
    })
  ];
}
module.exports={
    updateOrderDaysValidation
}