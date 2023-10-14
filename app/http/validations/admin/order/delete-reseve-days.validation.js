const { body } = require("express-validator");

function adminDeleteOrderReserveDay(req, res, next) {
  return [
    body("id").custom(
      (id,ctx)=>{
        if(!id){
          throw 'id should not be empty'
        }
        let id_pattern=/^[0-9a-fA-F]{24}$/
        if(!id_pattern.test(id)){
          throw 'invalid id format'
        }
        return true
      }
    ),
    body('reserve_days').custom(
        (reserve_days,ctx)=>{
          let parsed_data;
          if (!value) {
            throw "reserved days should not be empty";
          }
          if (typeof value === "string" || value instanceof String) {
            try {
              parsed_data = JSON.parse(value);
            } catch (e) {
              throw e;
            }
          } else if (Array.isArray(value)) {
            parsed_data=value
          }else{
            throw 'unsupported data type'
          }
          let is_valid = parsed_data.every(
            (item) => item.hasOwnProperty("hours") && item.hasOwnProperty("day")
          );
          if (!is_valid) {
            throw "invalid reserved data";
          }
          return true;
        }
    )
  ];
}
module.exports={
    adminDeleteOrderReserveDay  
}