const { body } = require("express-validator");

function updateProfileValidation() {
  return [
    body("name").custom((name, ctx) => {
      if (!name) throw "name must not be empty";
      return true;
    }),
    body("family_name").custom((family_name, ctx) => {
      if (!family_name) throw "family name must not be empty";
      return true;
    }),
    body("group_name")
      .optional()
      .custom((group_name, ctx) => {
        if (!group_name) throw "group name should not be empty";
        return true;
      }),
    body("instagram_page_address")
      .optional()
      .custom((instagram_page_address, ctx) => {
        if (!instagram_page_address)
          throw "instagram page address should not be empty";
        return true;
      }),
    body("email")
      .optional()
      .custom((email, ctx) => {
        if (!email) throw "email address should not be empty";
        return true;
      })
     .custom((email,ctx)=>{
        const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
        if(!emailRegex.test(email)){
            throw 'invalid email address'
        }
        return true
     })
  ];
}
module.exports = {
  updateProfileValidation,
};
