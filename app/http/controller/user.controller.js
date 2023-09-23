const { DataBaseService } = require("../../database/mongo_db_client");
const { generateUserToken, generatePaginationInfo } = require("../../utils/functions");

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
      let salon_reserved_days_length = JSON.parse(reserve_days).length;
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
      for (let data of JSON.parse(reserve_days)) {
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
      return res.status(200).json({
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
}

module.exports = {
  UserController: new UserController(),
};