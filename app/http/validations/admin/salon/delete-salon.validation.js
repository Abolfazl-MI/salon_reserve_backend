const { body } = require("express-validator");

function deleteSalonValidation(req, res, next) {
  return body("id")
    .custom((id,ctx)=>{
        if(!id) throw 'salon id must not be empty'
        return true;
    })
    .isMongoId()
    .withMessage("provided id is invalid");
}
module.exports={
    deleteSalonValidation
}