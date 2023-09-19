const { CouponModel } = require("../http/models/coupon.model");
const { ReservedTimeModel } = require("../http/models/reserve.model");
const { SalonModel } = require("../http/models/salon.model");
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
  async getCouponCount() {
    return CouponModel.countDocuments();
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
    return SalonModel.find({}, { __v: false }).limit(limit).skip(skip);
  }
  async getSingleSalon(id) {
    return SalonModel.findById(id);
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
    return OrderModel.find({ status }, { __v: false }).skip(skip).limit(limit);
  }
  async getAllOrders(skip, limit) {
    return OrderModel.find({}, { __v: false }).skip(skip).limit(limit);
  }
  async getOrderCountByStatus(status) {
    return OrderModel.countDocuments({ status });
  }
  async getSingleOrder(id){
    return OrderModel.findById(id);
  }
  async deleteOrderById(id){
    return OrderModel.findByIdAndDelete(id);
  }
}

module.exports = {
  DataBaseService: new DatabaseService(),
};
