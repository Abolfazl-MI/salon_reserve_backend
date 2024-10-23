const { body } = require("express-validator");

function updateUserValidation(req, res, next) {
  return [
    body("user_id")
    .notEmpty()
    .withMessage("user id is required")
    .isMongoId().withMessage('provided id must be be valid'),
    body("name")
      .optional()
      .custom((name, ctx) => {
        if (!name) throw "name should not be empty";
        let nameRegex = /^[\p{L}\s]+$/u;
        if (!nameRegex.test(name)) throw "enter valid name";
        return true;
      }),
    body("family_name")
      .optional()
      .custom((fname, ctx) => {
        if (!fname) throw "family name should not be empty";
        let nameRegex = /^[\p{L}\s]+$/u;
        if (!nameRegex.test(fname)) throw "enter valid family name";
        return true;
      }),
    body("group_name")
      .optional()
      .custom((group_name, ctx) => {
        if (!group_name) throw "group name should not be empty";
        let nameRegex = /^[\p{L}\s]+$/u;
        if (!nameRegex.test(group_name)) throw "enter valid group name";
        return true;
      }),
    body("instagram_page_address")
      .optional()
      .notEmpty()
      .withMessage("page address should not be empty"),
    body("email").optional().isEmail().withMessage("enter valid email address"),
    body("coupon_discount")
      .optional()
      .notEmpty()
      .withMessage("coupon discount value should not be empty"),
  ];
}

module.exports = updateUserValidation;
