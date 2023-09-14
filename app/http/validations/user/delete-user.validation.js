const { body } = require("express-validator");

function deleteUserValidation(req, res, next) {
  return body("user_id")
    .custom((user_id, ctx) => {
      if (!user_id) throw "user id should not be empty";
      return true;
    })
    .isMongoId()
    .withMessage("provided id is invalid");
}

module.exports=deleteUserValidation