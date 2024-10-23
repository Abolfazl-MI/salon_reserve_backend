const { body } = require("express-validator");

function deleteSalonImageValidation(req, res, next) {
  return [
    body("id")
      .notEmpty()
      .withMessage("salon id is required")
      .isMongoId()
      .withMessage("invalid salon id"),
    body("images")
      .notEmpty()
      .withMessage("images is required")
      
  ];
}
module.exports={
    deleteSalonImageValidation
}