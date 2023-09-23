const { body } = require("express-validator");

function createSalonValidation(req, res, next) {
  return [
    body("name").notEmpty().withMessage("salon name must not be empty"),
    body("features")
      .optional()
      .custom((features, ctx) => {
        if (!features) throw "features should not be empty";
        return true;
      }),
    body("rent_cost")
      .notEmpty()
      .withMessage("rent cost must not be empty")
      .isNumeric()
      .withMessage("rent cost must be a number"),
    body("area")
      .notEmpty()
      .withMessage("salon area  must not be empty")
      .isNumeric()
      .withMessage("salon area  must be a number"),
  ];
}
module.exports = {
  createSalonValidation,
};
