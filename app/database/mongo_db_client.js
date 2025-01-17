const { CouponModel } = require("../http/models/coupon.model");
const { ReservedTimeModel } = require("../http/models/reserve.model");
const { SalonModel, FeatureModel } = require("../http/models/salon.model");
const { UserModel } = require("../http/models/user.model");
const { OrderModel } = require("../http/models/order.model");
class DatabaseService {
  async createUserWithPhone(phone_number, otp_code) {
    return UserModel.create({
      phone_number,
      otp_code,
    });
  }
  async getUserById(userId) {
    return UserModel.findById(userId);
  }

  async getUserByPhone(phone_number) {
    return UserModel.findOne({ phone_number });
  }
  async createCouponCode(code, discount) {
    return CouponModel.create({
      discount,
      code,
    });
  }
  async usersTotalCount() {
    return UserModel.countDocuments();
  }
  async getAllUsers(limit, skip) {
    return UserModel.find({}, { __v: false }).limit(limit).skip(skip);
  }
  async getSingleUser(userId) {
    return UserModel.findById(userId);
  }
  async updateUserData(data, id) {
    return UserModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    );
  }
  async deleteUser(id) {
    return UserModel.findByIdAndDelete(id);
  }
  // retrieve all coupons
  async getAllCoupons(limit, skip) {
    return CouponModel.find({}, { __v: false }).limit(limit).skip(skip);
  }
  // retrieve all coupons by status fill or free
  async getCouponByStatus(limit, skip, status) {
    return CouponModel.find({ status }, { __v: false }).limit(limit).skip(skip);
  }
  // get count of coupons
  async getCouponCount(status) {
    if (status) {
      return CouponModel.countDocuments({ status });
    } else {
      return CouponModel.countDocuments();
    }
  }
  // get single coupon
  async getSingleCoupon(id) {
    return CouponModel.findById(id);
  }
  // update coupon  by its id
  async updateCoupon(id, data) {
    return CouponModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  async deleteCoupon(id) {
    return CouponModel.findByIdAndDelete(id);
  }

  async createSalon(data) {
    return SalonModel.create(data);
  }
  async getSalonsCount() {
    return SalonModel.countDocuments();
  }
  async getAllSalons(limit, skip) {
    return SalonModel.find({}, { __v: false })
      .limit(limit)
      .skip(skip)
      .populate("features", { __v: false });
  }
  async getSingleSalon(id) {
    return SalonModel.findById(id).populate("features", { __v: false });
  }
  async deleteSalonById(id) {
    return SalonModel.findByIdAndDelete(id);
  }
  async updateSalonInfo(id, data) {
    return SalonModel.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true }
    );
  }
  async updateSalonImages(id, data) {
    let salon = await SalonModel.findById(id);

    for (let image of data) {
      if (!salon.images.includes(image)) {
        salon.images.push(image);
      }
    }
    return salon.save();
  }
  async deleteSalonImages(id, data) {
    let salon = await SalonModel.findById(id);
    for (let item of data) {
      let index = salon.images.indexOf(item);
      salon.images.splice(index, 1);
    }
    return salon.save();
  }
  async createOrder(data) {
    return OrderModel.create(data);
  }
  async createReservedTime(data) {
    let result = await ReservedTimeModel.create(data);
    return result;
  }
  async createManyReservedTime(data) {
    return ReservedTimeModel.insertMany(data);
  }
  async getCouponByCode(code) {
    return CouponModel.findOne({ code });
  }
  async updateCouponStatus(id, status) {
    return CouponModel.findByIdAndUpdate(id, {
      $set: {
        status,
      },
    });
  }
  async getOrderCount() {
    return OrderModel.countDocuments();
  }
  async getOrdersByStatus(status, skip, limit) {
    return OrderModel.find({ status }, { __v: false })
      .populate({
        path: "salon",
        model: "salon",
        select: "-features",
      })
      .populate({
        path: "user",
        model: "user",
      })
      .skip(skip)
      .limit(limit);
  }
  async getAllOrders(skip, limit) {
    return OrderModel.find({}, { __v: false })
      .populate({
        path: "salon",
        model: "salon",
        select: "-features",
      })
      .populate({
        path: "user",
        model: "user",
      })
      .skip(skip)
      .limit(limit);
  }
  async getOrderCountByStatus(status) {
    return OrderModel.countDocuments({ status });
  }
  async getSingleOrder(id) {
    return OrderModel.findById(id);
  }
  async getSingleOrderWithPopulate(id) {
    return OrderModel.findById(id).populate({
      path: "salon",
      model: "salon",
      select: "-features",
    });
  }
  async deleteOrderById(id) {
    return OrderModel.findByIdAndDelete(id);
  }
  async updateOrderStatus(id, status) {
    return OrderModel.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
  }
  async updateOrderPaymentMethod(id, payment_method) {
    return OrderModel.findByIdAndUpdate(
      id,
      { $set: { payment_method } },
      { new: true }
    );
  }
  // list of id would provide to delete
  async deleteManyOrderReservedTimesByOrderId(days_id) {
    return ReservedTimeModel.deleteMany({
      _id: { $in: days_id },
    });
  }
  async getReservedDaysByOrderId(orderId, showIds = false) {
    if (showIds) {
      return ReservedTimeModel.find({ order_id: orderId });
    } else {
      return ReservedTimeModel.find(
        { order_id: orderId },
        {
          __v: false,
          reserver_id: false,
          salon_id: false,
          order_id: false,
        }
      );
    }
  }
  async getCouponByCode(code) {
    return CouponModel.findOne({ code });
  }
  async getUserByPhone(phone) {
    return UserModel.findOne({
      phone_number: phone,
    });
  }
  async getReserveDaysBySalonId(salon_id, showIds = false) {
    if (showIds) {
      return ReservedTimeModel.find({
        salon_id,
      });
    } else {
      return ReservedTimeModel.find(
        {
          salon_id,
        },
        {
          __v: false,
          // reserver_id: false,
          salon_id: false,
          order_id: false,
        }
      );
    }
  }
  async getUserOrdersWithPopulate(user_id, limit, skip) {
    return OrderModel.find({
      user: user_id,
    })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "salon",
        model: "salon",
        select: "-features",
      });
  }
  async getUserOrdersCount(user_id) {
    return OrderModel.countDocuments({ user: user_id });
  }
  async createFeatureData(data) {
    return FeatureModel.create(data);
  }
  async deleteSalonFeature(data) {
    return FeatureModel.deleteMany({ _id: { $in: data } });
  }
  async deleteReserveDaysByOrderId(orderId) {
    return ReservedTimeModel.deleteMany({
      order_id: orderId,
    });
  }
  async getAllReservedTimes() {
    return ReservedTimeModel.find(
      {},
      { __v: false, reserver_id: false, salon_id: false, order_id: false }
    );
  }
  async updateManyReserveDaysStatus(orderId, status) {
    return ReservedTimeModel.updateMany(
      {
        order_id: orderId,
      },
      {
        $set: {
          status,
        },
      },
      { new: true }
    );
  }
  async deleteManyReserveDaysByOrderId(orderId) {
    return ReservedTimeModel.deleteMany({
      order_id: orderId,
    });
  }
}

module.exports = {
  DataBaseService: new DatabaseService(),
};
