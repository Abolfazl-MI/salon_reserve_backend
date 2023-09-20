const { body } = require("express-validator");

function adminUpdateReservedDaysValidation(req, res, next) {
  return [
    body("id")
      .notEmpty()
      .withMessage("id must not empty")
      .isMongoId()
      .withMessage("id is invalid"),
    body("reserve_days")
      .notEmpty()
      .withMessage("reserve_days must not be empty")
      .custom((value, ctx) => {
        if (!value) {
          throw "reserved days should not be empty";
        }
        let parsed_data = JSON.parse(value);
        let is_valid = parsed_data.every(
          (item) => item.hasOwnProperty("hours") && item.hasOwnProperty("day")
        );
        if (!is_valid) {
          throw "invalid reserved data";
        }
        return true;
      }),
    body("salon_id")
      .notEmpty()
      .withMessage("salon id must not be empty")
      .isMongoId()
      .withMessage("salon id is invalid"),
  ];
}
module.exports = {
  adminUpdateReservedDaysValidation,
};
