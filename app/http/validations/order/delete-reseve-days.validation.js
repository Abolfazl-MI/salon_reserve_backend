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
          console.log(reserve_days)
            if(!reserve_days){
                throw "reserve days should not be empty"
            }
            let parsed_data=JSON.parse(reserve_days)
            
            let id_pattern=/^[0-9a-fA-F]{24}$/
           let is_valid= parsed_data.every((item)=>id_pattern.test(item))
           if(!is_valid){
               throw "invalid reserve days id format"
           }
           return true
        }
    )
  ];
}
module.exports={
    adminDeleteOrderReserveDay  
}