const { DataBaseService } = require("../../database/mongo_db_client");
const {
  generateUserToken,
  generatePaginationInfo,
} = require("../../utils/functions");

class UserController {
  async authorizeUser(req, res, next) {
    try {
      let { phone, confirm_code } = req.body;
      let user = await DataBaseService.getUserByPhone(phone);
      if (!user) {
        return next({
          status: 404,
          message: "user with phone number  not found",
        });
      }
      if (!user.otp_code) {
        return next({
          status: 404,
          message: "user with phone number  not found",
        });
      }
      if (confirm_code == user.otp_code) {
        let token = generateUserToken(user._id);
        return res.status(200).json({
          statusCode: res.statusCode,
          token,
        });
      } else {
        return next({ status: 400, message: "invalid otp code " });
      }
    } catch (e) {
      next(e);
    }
  }
  async completeProfile(req, res, next) {
    try {
      let update_data = req.body;
      let updateUserData = await DataBaseService.updateUserData(
        update_data,
        req.user._id
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "user updated successfully",
      });
    } catch (e) {
      next(e);
    }
  }
  async createOrder(req, res, next) {
    try {
      let { salon_id, reserve_days, coupon_code } = req.body;
      let applied_coupon_discount;
      // get salon data
      let salon = await DataBaseService.getSingleSalon(salon_id);
      // check if salon not found
      if (!salon) return next({ status: 404, message: "salon not found" });
      // variable to store salon rent
      let salon_rent_cost = salon.rent_cost;
      // get all reserved times by salon id
      let reserved_days = await DataBaseService.getReserveDaysBySalonId(
        salon._id
      );
      // already reserved times
      let already_reserved_times = [];
      // iterate over list of reserved days sent from client with every
      for (let index = 0; index < reserve_days.length; index++) {
        // pick the data by index
        let reserve_data = reserve_days[index];
        // parse the data from string to Date
        let reserve_day_date = new Date(reserve_data.day);
        // filter the reserved times by day
        let match_day = reserved_days.filter((item) => {
          if (item.day.toISOString() === reserve_day_date.toISOString()) {
            return true;
          }
        });
        // finds similar time request for reserve
        let similar_hours = match_day.find(
          (item) => item.hours === reserve_data.hours
        );
        //  if found similar time request for reserve add to list
        if (similar_hours) {
          already_reserved_times.push(similar_hours);
        }
      }
      // if already reserved times length is greater than 0 shows that we have reserved times before
      if (already_reserved_times.length > 0) {
        return next({
          status: 404,
          message: "you have already reserved this times",
        });
      }

      // check if coupon code provided
      if (coupon_code) {
        // get coupon data from db
        let coupon = await DataBaseService.getCouponByCode(coupon_code);
        // set value to applied_coupon variable
        applied_coupon_discount = coupon.discount;
        // check if coupon not used before
        if (coupon.status == "free") {
          salon_rent_cost = salon_rent_cost - coupon.discount;
          await DataBaseService.updateCouponStatus(coupon._id, "fill");
        } else {
          return next({ status: 404, message: "coupon has used before" });
        }
      }
      let salon_reserved_days_length = reserve_days.length;
      // calculate total cost
      let total_count = salon_rent_cost * salon_reserved_days_length;
      // create order model
      let orderData = {
        user: req.user._id,
        salon: salon_id,
        total_count,
      };
      if (applied_coupon_discount) {
        orderData.applied_coupon_discount = applied_coupon_discount;
      }
      let order = await DataBaseService.createOrder(orderData);
      let salon_reserved_days_data = [];
      for (let data of reserve_days) {
        data.reserver_id = req.user._id;
        data.salon_id = salon_id;
        data.order_id = order._id;
        salon_reserved_days_data.push(data);
      }
      console.log(salon_reserved_days_data);
      // create reserved days model
      let salon_reserved_days = await DataBaseService.createManyReservedTime(
        salon_reserved_days_data
      );
      return res.status(201).json({
        statusCode: res.statusCode,
        message: "order created successfully",
        order,
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllUserOrder(req, res, next) {
    try {
      let page = req.query.page || 0;
      let limit = req.query.limit || 10;
      let total_count = await DataBaseService.getUserOrdersCount(req.user._id);
      let metadata = generatePaginationInfo(total_count, limit, page);
      let skip = page * limit;
      let orders = await DataBaseService.getUserOrdersWithPopulate(
        req.user._id,
        limit,
        skip
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        metadata,
        orders,
      });
    } catch (e) {
      next(e);
    }
  }
  async getSingleOrder(req, res, next) {
    try {
      let order_id = req.params.id;
      let order = await DataBaseService.getSingleOrderWithPopulate(order_id);
      if (!order) {
        return next({ status: 404, message: "order not found" });
      }
      let reserve_days = await DataBaseService.getReservedDaysByOrderId(
        order._id
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        data: {
          order,
          reserve_days,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async updateOrderStatus(req, res, next) {
    try {
      let { id, status } = req.body;
      let order = await DataBaseService.getSingleOrder(id);
      if (!order) {
        return next({ status: 404, message: "order not found" });
      }
      order.status=status;
      await order.save()
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order status updated",
        data: order
      })
    } catch (e) {
      next(e)
    }
  }
  async updateOrderDays(req, res, next) {
    try{
      let {order_id,days}=req.body
      let order=await DataBaseService.getSingleOrder(order_id);
      if(!order){
        return next({status:404,message:"order not found"})
      }
      let salon=await DataBaseService.getSingleSalon(order.salon);
      let salon_rent_cost=salon.rent_cost
      let applied_coupon_discount=order.applied_coupon_discount;
      if(applied_coupon_discount){
        salon_rent_cost=salon_rent_cost-applied_coupon_discount
      }
      let reserved_days=await DataBaseService.getReservedDaysByOrderId(order._id,true)
      let already_times=[]
      for(let index=0;index<days.length;index++){
          let reserved_day_data=days[index];
          let reserved_day_date=new Date(reserved_day_data.day)
          let matched_days=reserved_days.filter((item)=>{
            if(item.day.toISOString()===reserved_day_date.toISOString()){
              return true;
            }
          })
          // finds similar time request for reserve
        let similar_hours = matched_days.find(
          (item) => item.hours === reserved_day_data.hours
        );
        //  if found similar time request for reserve add to list
        if (similar_hours) {
          already_times.push(similar_hours);
        }
      }
      if(already_times.length>0){
        return next({status:404,message:"you have already reserved this times"})
      }
    //  calculate newly days count added to salon
    let added_days_count=days.length*salon_rent_cost;
    // update order total count
    order.total_count=order.total_count+added_days_count
    await order.save();
    // create reserve time 
    let salon_reserved_days_data = [];
    for (let data of days) {
      data.reserver_id = req.user._id;
      data.salon_id = salon._id;
      data.order_id = order._id;
      salon_reserved_days_data.push(data);
    }
    console.log(salon_reserved_days_data);
    // create reserved days model
    let salon_reserved_days = await DataBaseService.createManyReservedTime(
      salon_reserved_days_data
    );
    return res.status(200).json({
      statusCode: res.statusCode,
      message: "order updated successfully",
    })
    }catch(e){
      next(e)
    }
  }
}

module.exports = {
  UserController: new UserController(),
};
