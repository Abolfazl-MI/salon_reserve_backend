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
}

module.exports = {
  DataBaseService: new DatabaseService(),
};
