const { DataBaseService } = require("../../database/mongo_db_client");
const { generatePaginationInfo } = require("../../utils/functions");

class SalonController {
  async getAllSalons(req, res, next) {
    try {
      let page = req.query.page || 0;
      let limit = req.query.limit || 10;
      let total_count = await DataBaseService.getSalonsCount();
      let metadata = generatePaginationInfo(total_count, limit, page);
      let skip = page * limit;
      let salons = await DataBaseService.getAllSalons(limit, skip);
      return res.status(200).json({
        statusCode: res.statusCode,
        metadata,
        data: salons,
      })
    } catch (e) {
      next(e);
    }
  }
  async getSingleSalon(req, res, next) {
      try{
        console.log(req.params)
        let {id}=req.params
        let salon=await DataBaseService.getSingleSalon(id)
        console.log(salon)
        if(!salon){
            return next({status:404,message:"salon not found"})
        }
        let salon_reserve_days=await DataBaseService.getReserveDaysBySalonId(id)
        return res.status(200).json({
            statusCode:res.statusCode,
            data:{
                salon,
                salon_reserve_days
            }
        })
      }catch(e){
          next(e)
      }
  }
}

module.exports = {
  SalonController: new SalonController(),
};
