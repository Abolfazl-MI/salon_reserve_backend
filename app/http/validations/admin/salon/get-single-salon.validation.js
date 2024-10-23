const { param } = require("express-validator");

function getSingleSalonValidation() {
  return param("id")
    .exists()
    .notEmpty()
    .withMessage("salon id must not be empty")
    .isMongoId()
    .withMessage("provided id is invalid");
}
module.exports={getSingleSalonValidation}