const { CouponModel } = require("../http/models/coupon.model");
const { UserModel } = require("../http/models/user.model");

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
  async getAllCoupons(limit,skip) {
    return CouponModel.find({}, { __v: false }).limit(limit).skip(skip);
  }
  // retrieve all coupons by status fill or free 
  async getCouponByStatus(limit,skip,status) {
    return CouponModel.find({status}, { __v: false }).limit(limit).skip(skip);
  }
  // get count of coupons
  async getCouponCount(){
    return CouponModel.countDocuments();
  }
  // get single coupon
  async getSingleCoupon(id){
    return CouponModel.findById(id);
  }
}

module.exports = {
  DataBaseService: new DatabaseService(),
};
