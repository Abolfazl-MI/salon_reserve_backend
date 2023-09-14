const { DataBaseService } = require("../../database/mongo_db_client");
const { generateOTP, generateCoupon } = require("../../utils/functions");

class AdminController {
  async createUserWithPhone(req, res, next) {
    try {
      let { phone_number } = req.body;
      let isExists=await DataBaseService.getUserByPhone(phone_number);
      if(isExists){
        return next({
          status:400,
          message:"phone number already exists"
        })
      }
      let response={}
      let {coupon_discount}=req.body
      // create coupon if discount exists
      
      if(coupon_discount){
        let coupon_code=generateCoupon();
        let coupon=await DataBaseService.createCouponCode(coupon_code,coupon_discount);
        response.coupon=coupon
      }
      let otp_code = generateOTP();
      let user = await DataBaseService.createUserWithPhone(
        phone_number,
        otp_code
      );
      response.user=user
      
      return res.status(201).json({
        status:res.statusCode, 
        data:response
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  AdminController: new AdminController(),
};
