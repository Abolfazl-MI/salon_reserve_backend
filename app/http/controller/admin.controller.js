const { DataBaseService } = require("../../database/mongo_db_client");
const {
  generateOTP,
  generateCoupon,
  generatePaginationInfo,
} = require("../../utils/functions");

class AdminController {
  async createUserWithPhone(req, res, next) {
    try {
      let { phone_number } = req.body;
      let isExists = await DataBaseService.getUserByPhone(phone_number);
      if (isExists) {
        return next({
          status: 400,
          message: "phone number already exists",
        });
      }
      let response = {};
      let { coupon_discount } = req.body;
      // create coupon if discount exists

      if (coupon_discount) {
        let coupon_code = generateCoupon();
        let coupon = await DataBaseService.createCouponCode(
          coupon_code,
          coupon_discount
        );
        response.coupon = coupon;
      }
      let otp_code = generateOTP();
      let user = await DataBaseService.createUserWithPhone(
        phone_number,
        otp_code
      );
      response.user = user;

      return res.status(201).json({
        status: res.statusCode,
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllUsers(req, res, next) {
    try {
      let page = req.query.page || 0;
      let limit = req.query.limit || 10;
      let total_count = await DataBaseService.usersTotalCount();
      let metadata = generatePaginationInfo(total_count, limit, page);
      let skip = page * limit;
      let users = await DataBaseService.getAllUsers(limit, skip);
      return res.status(200).json({
        status: res.statusCode,
        metadata,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSingleUser(req, res, next) {
    try {
      let user = await DataBaseService.getSingleUser(req.params.id);
      if (!user) {
        return next({
          status: 404,
          message: "user not found",
        });
      }
      return res.status(200).json({
        status: res.statusCode,
        user,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateUserInfo(req, res, next) {
    try {
      let passed_data = req.body;
      let user_id = passed_data.user_id;
      delete passed_data.user_id;
      // TODO COUPON UPDATE DISCUSS
      let updateUserData = await DataBaseService.updateUserData(
        passed_data,
        user_id
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "user updated",
        data: updateUserData,
      });
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
  async deleteUserData(req, res, next) {
    try {
      let { user_id } = req.body;
      await DataBaseService.deleteUser(user_id);
      return res.status(200).json({
        status: res.statusCode,
        message: "deleted user",
      });
    } catch (e) {
      next(e);
    }
  }

  async createCouponCode(req, res, next) {
    try {
      let coupon_code = generateCoupon();
      let coupon_discount = req.body.coupon_discount;
      let coupon = await DataBaseService.createCouponCode(
        coupon_code,
        coupon_discount
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        data: coupon,
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllCoupons(req, res, next) {
    try {
      let page = req.query.page || 0;
      let limit = req.query.limit || 10;
      let total_count = await DataBaseService.getCouponCount();
      let metadata = generatePaginationInfo(total_count, limit, page);
      let skip = page * limit;
      let coupons;
      // check if type exists in query to query specific type
      let type = req.query.type;
      if (type) {
        let queried_count = await DataBaseService.getCouponCount(type);

        coupons = await DataBaseService.getCouponByStatus(limit, skip, type);
        metadata.queried_count = queried_count;
      } else {
        coupons = await DataBaseService.getAllCoupons(limit, skip);
      }
      return res.status(200).json({
        status: res.statusCode,
        metadata,
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSingleCoupon(req, res, next) {
    try {
      let coupon_code = req.params.code;
      let coupon = await DataBaseService.getCouponByCode(coupon_code);
      console.log(coupon);
      if (!coupon) return next({ status: 404, message: "coupon not found" });
      return res.status(200).json({
        status: res.statusCode,
        data: coupon,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateCoupon(req, res, next) {
    try {
      let data = req.body;
      let coupon_id = req.body.id;
      delete data.id;
      await DataBaseService.updateCoupon(coupon_id, data);
      return res.status(200).json({
        status: res.statusCode,
        message: "coupon updated",
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteCoupon(req, res, next) {
    try {
      let { id } = req.body;
      let deleted = await DataBaseService.deleteCoupon(id);
      console.log(deleted);
      return res.status(200).json({
        status: res.statusCode,
        message: "coupon deleted",
      });
    } catch (e) {
      next(e);
    }
  }
  async createSalon(req, res, next) {
    try {
      let data = {};
      let { name, rent_cost } = req.body;
      let features = req.body.features;
      data.name = name;
      data.rent_cost = rent_cost;
      data.area = req.body.area;
      if (features) {
        let salon_features = [];
        let parsed_features = JSON.parse(features);
        for (let description of parsed_features) {
          let feature = await DataBaseService.createFeatureData({
            description,
          });
          salon_features.push(feature);
        }
        data.features = salon_features;
      }
      if (Object.keys(req.files).length > 0) {
        let sent_images = req.files.images;
        let images = [];
        for (let index = 0; index < sent_images.length; index++) {
          let imageInfo = sent_images[index];
          let imagePath = imageInfo.path + "";
          let path = imagePath.substring(7, imagePath.length);
          images.push(path);
        }
        data.images = images;
      }
      let salon = await DataBaseService.createSalon(data);

      return res.status(201).json({
        statusCode: res.statusCode,
        message: "salon created",
        data: salon,
      });
    } catch (e) {
      next(e);
    }
  }
  async getAllSalons(req, res, next) {
    // page and limit from query
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
      });
    } catch (e) {
      next(e);
    }
  }
  async getSingleSalon(req, res, next) {
    try {
      let id = req.params.id;
      let salon = await DataBaseService.getSingleSalon(id);
      if (!salon) return next({ status: 404, message: "salon not found" });
      console.log(salon);
      return res.status(200).json({
        statusCode: res.statusCode,
        data: salon,
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteSalon(req, res, next) {
    try {
      let salonId = req.body.id;
      await DataBaseService.deleteSalonById(salonId);
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "salon deleted",
      });
    } catch (e) {
      next(e);
    }
  }
  async updateSalonInfo(req, res, next) {
    try {
      let data = req.body;
      let features = req.body.features;
      console.log(data);
      let salon_id = data.id;
      delete data.id;
      console.log(data);
      let salon_features = [];
      if (features) {
        console.log(features);
        for (let description of JSON.parse(features)) {
          let feature = await DataBaseService.createFeatureData({
            description,
          });
          console.log(feature);
          salon_features.push(feature);
        }
        data.features = salon_features;
      }
      data.features = salon_features;
      let updatedSalon = await DataBaseService.updateSalonInfo(salon_id, data);
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "salon info updated",

        updatedSalon,
      });
    } catch (e) {
      next(e);
    }
  }
  async updateSalonImages() {
    try {
    } catch (e) {}
  }
  async updateSalonImages(req, res, next) {
    try {
      let salon_id = req.body.id;
      let images = [];
      if (Object.keys(req.files).length > 0) {
        let sent_images = req.files.images;
        for (let index = 0; index < sent_images.length; index++) {
          let imageInfo = sent_images[index];
          let imagePath = imageInfo.path + "";
          let path = imagePath.substring(7, imagePath.length);
          images.push(path);
        }
      }
      console.log(images);
      let updatedSalon = await DataBaseService.updateSalonImages(
        salon_id,
        images
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "salon images updated",
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteSalonImage(req, res, next) {
    try {
      let data = req.body;
      let salon_id = data.id;
      delete data.id;
      console.log(data.images);
      let deleteSalonImage = await DataBaseService.deleteSalonImages(
        salon_id,
        data.images
      );
      // TODO SHOULD DELETE THE PHOTO FROM THE PRODUCTION STORAGE SERVER
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "salon images deleted",
      });
    } catch (e) {
      next(e);
    }
  }
  async createOrder(req, res, next) {
    try {
      // deconstruct data from body
      let {
        salon_id,
        user_id,
        reserve_days,
        coupon_code,
        payment_method,
        payment_amount,
      } = req.body;
      let applied_coupon_discount;
      // check if user exists
      let user = await DataBaseService.getUserById(user_id);
      if (!user) return next({ status: 404, message: "user not found" });
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
      let salon_reserved_days_length = JSON.parse(reserve_days).length;
      // calculate total cost
      let total_count = salon_rent_cost * salon_reserved_days_length;

      // create order model
      let orderData = {
        user: user_id,
        salon: salon_id,
        total_count,
      };
      if (applied_coupon_discount) {
        orderData.applied_coupon_discount = applied_coupon_discount;
      }

      if (payment_method && payment_method == "installment") {
        if (payment_amount >= total_count) {
          next({
            status: 400,
            message:
              "payment amount must not equal to total count or bigger when installment is payment method",
          });
        }
        orderData.payment_method = "installment";
        orderData.payment_amount = payment_amount;
        let remained_amount = total_count - payment_amount;
        orderData.remained_amount = remained_amount;
      }
      console.log(orderData);
      let order = await DataBaseService.createOrder(orderData);
      // for creating model which contains salon id and user id , iterate over and create data model
      let salon_reserved_days_data = [];
      for (let data of JSON.parse(reserve_days)) {
        data.reserver_id = user_id;
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
        message: "order created",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
  async getAllOrders(req, res, next) {
    try {
      let page = req.query.page || 0;
      let limit = req.query.limit || 10;
      let skip = page * limit;
      let orders;
      let metadata;
      let total_count;
      let status = req.query.status;
      if (status) {
        let queried_count = await DataBaseService.getOrderCountByStatus(status);
        console.log(queried_count);
        total_count = await DataBaseService.getOrderCount();
        metadata = generatePaginationInfo(total_count, limit, page);
        metadata.queried_count = queried_count;
        orders = await DataBaseService.getOrdersByStatus(status, skip, limit);
      } else {
        total_count = await DataBaseService.getOrderCount();
        metadata = generatePaginationInfo(total_count, limit, page);
        orders = await DataBaseService.getAllOrders(skip, limit);
      }
      return res.status(200).json({
        statusCode: res.statusCode,
        metadata,
        data: orders,
      });
    } catch (e) {
      next(e);
    }
  }
  async getSingleOrder(req, res, next) {
    try {
      let id = req.params.id;
      let order = await DataBaseService.getSingleOrderWithPopulate(id);
      if (!order) return next({ status: 404, message: "order not found" });
      let reserved_days = await DataBaseService.getReservedDaysByOrderId(
        order._id
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        data: {
          order,
          reserved_days,
        },
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteOrder(req, res, next) {
    try {
      let id = req.body.id;
      await DataBaseService.deleteOrderById(id);
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order deleted",
      });
    } catch (e) {
      next(e);
    }
  }
  async updateOrderStatus(req, res, next) {
    try {
      let { status, id } = req.body;
      let order = await DataBaseService.getSingleOrder(id);
      if (!order) {
        return next({ status: 404, message: "Order not found" });
      }
      // await DataBaseService.updateOrderStatus(id, status);
      order.status = status;
      await order.save();
      if (status === "completed") {
        let result = await DataBaseService.updateManyReserveDaysStatus(
          order._id,
          "full"
        );
        console.log(result);
      }
      if(status==='canceled'){
        let result= await DataBaseService.updateManyReserveDaysStatus(order._id,'canceled')
        console.log(result)
      }
      if(status==='pending'){
        let result= await DataBaseService.updateManyReserveDaysStatus(order._id,'reserved')
        console.log(result)
      }
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order status updated",
      });
    } catch (e) {
      next(e);
    }
  }
  async updateOrderReserveDays(req, res, next) {
    try {
      let { id, reserve_days, salon_id } = req.body;
      let order = await DataBaseService.getSingleOrder(id);
      let salon = await DataBaseService.getSingleSalon(salon_id);
      if (!salon) {
        return next({ status: 404, message: "salon not found" });
      }
      if (!order) {
        return next({ status: 404, message: "order not found" });
      }
      let salon_reserved_days_length = JSON.parse(reserve_days).length;
      let updated_total_count = salon.rent_cost * salon_reserved_days_length;
      order.total_count = updated_total_count;
      await order.save();
      let salon_reserved_days_data = [];
      for (let data of JSON.parse(reserve_days)) {
        data.reserver_id = order.user;
        data.salon_id = salon._id;
        data.order_id = order._id;
        salon_reserved_days_data.push(data);
      }
      let salon_reserved_days = await DataBaseService.createManyReservedTime(
        salon_reserved_days_data
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order reserved days updated",
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteOrderReservedTimes(req, res, next) {
    try {
      let { id, reserve_days } = req.body;
      let order = await DataBaseService.getSingleOrder(id);
      if (!order) {
        return next({ status: 404, message: "order not found" });
      }
      let result = await DataBaseService.deleteManyOrderReservedTimesByOrderId(
        JSON.parse(reserve_days)
      );
      // rent of salon, if coupon applied we should subtract it
      let salon_real_rent;
      if (order.applied_coupon_discount) {
        salon_real_rent = order.total_count - order.applied_coupon_discount;
      } else {
        salon_real_rent = order.total_count;
      }
      // the length of days sent to remove
      let removing_days_length = JSON.parse(reserve_days).length;
      // the count which is going to subtract
      let subtracted_count = salon_real_rent * removing_days_length;
      // subtracting the count
      order.total_count = order.total_count - subtracted_count;
      await order.save();
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order reserved days deleted",
      });
    } catch (e) {
      next(e);
    }
  }
  async updateOrderPayment(req, res, next) {
    try {
      let { id, payment_method, payment_amount } = req.body;
      let order = await DataBaseService.getSingleOrder(id);
      if (!order) next({ status: 404, message: "order not found" });
      if (payment_amount > order.total_count) {
        next({
          status: 400,
          message: "payment amount is greater than order total count",
        });
      }
      if (payment_method) {
        order.payment_method = payment_method;
      }
      let remained_amount = order.total_count - payment_amount;
      order.remained_amount = remained_amount;
      order.payment_amount = payment_amount;
      await order.save();
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "order payment updated",
      });
    } catch (e) {
      next(e);
    }
  }
  async deleteSalonFeatures(req, res, next) {
    try {
      let { features_id } = req.body;
      let deleted_features = await DataBaseService.deleteSalonFeature(
        JSON.parse(features_id)
      );
      return res.status(200).json({
        statusCode: res.statusCode,
        message: "salon features deleted",
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  AdminController: new AdminController(),
};
