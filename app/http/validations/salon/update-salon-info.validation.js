const { body } = require("express-validator");

function updateSalonInfoValidation(req, res, next) {
  return [
    body("id")
      .custom((id, ctx) => {
        if (!id) throw "salon id is required";
        return true;
      })
      .isMongoId()
      .withMessage("provided id is invalid "),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("salon name should not be empty"),
    body("rent_cost")
      .optional()
      .notEmpty()
      .withMessage("salon name should not be empty")
      .isNumeric()
      .withMessage("rent cost should be number"),
    body("features")
      .optional()
      .notEmpty()
      .withMessage("salon features should not be empty"),
    body("area") .optional()
    .notEmpty()
    .withMessage("salon area should not be empty")
    .isNumeric()
    .withMessage(" area should be number"),
  ];
}

module.exports={
    updateSalonInfoValidation
}