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
      // list of already reserve times
      let already_reserved_times = [];
      // get all reserved time to
      let all_reserved_times = await DataBaseService.getAllReservedTimes();
      // sent days
      let order_reserved_times = JSON.parse(reserve_days);
      // check if already reserved times
      for (let i = 0; i < order_reserved_times.length; i++) {
        let time_data = order_reserved_times[i];

        let filtered_data = all_reserved_times.filter((data) => {
          data.day == time_data.day;
        });
        if (filtered_data.includes(time_data)) {
          already_reserved_times.push(time_data);
        }
      }
      if (already_reserved_times.length > 0) {
        return next({
          status: 400,
          message: "this days is already reserved",
          data: already_reserved_times,
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
      if (status == "canceled") {
        let delete_reserved_days =
          await DataBaseService.deleteReservedDaysByOrderId(id);
        let update_order = await DataBaseService.updateOrderStatus(id, status);
        return res.status(200).json({
          statusCode: res.statusCode,
          message: "order canceled successfully",
        });
      } else {
        return res.status(403).json({
          statusCode: res.statusCode,
          message: "order not canceled",
        });
      }
    } catch (e) {}
  }
}

module.exports = {
  UserController: new UserController(),
};
