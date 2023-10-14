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
        let parsed_data;
        if (!value) {
          throw "reserved days should not be empty";
        }
        if (typeof value === "string" || value instanceof String) {
          try {
            parsed_data = JSON.parse(value);
          } catch (e) {
            throw e;
          }
        } else if (Array.isArray(value)) {
          parsed_data=value
        }else{
          throw 'unsupported data type'
        }
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
