let { body } = require("express-validator");
function updateSalonImagesValidation(req, res, next) {
  return [
    body("id")
      .custom((id, ctx) => {
        if (!id) throw "salon id is required";
        return true;
      })
      .isMongoId()
      .withMessage("provided id is invalid "),
  ];
}

module.exports = {
  updateSalonImagesValidation,
};
