const { body } = require("express-validator");

function confirmCodeValidation() {
  return [
    body("phone")
      .custom((phone, ctx) => {
        if (!phone) throw "user phone number must not be empty";
        return true;
      })
      .isMobilePhone("fa-IR")
      .withMessage("invalid phone number"),
    body("confirm_code")
      .custom((code, ctx) => {
        if (!code) {
          throw "confirm code should not be empty";
        }
        return true;
      })
      .isNumeric({ no_symbols: true })
      .withMessage("invalid confirm code"),
  ];
}

module.exports={
    confirmCodeValidation
}