const { query } = require("express-validator");

function getAllCouponsValidation(req, res, next) {
  return [
    query("type")
      .optional()
      .exists().custom((type,ctx)=>{
        let whiteTypes=['free','fill']
        if(!whiteTypes.includes(type)) throw 'provided type is not exists'
        return true;
      })
  ];
}

module.exports = getAllCouponsValidation;
