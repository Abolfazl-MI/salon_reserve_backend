const { DataBaseService } = require("../../database/mongo_db_client");
const { generateUserToken } = require("../../utils/functions");

class UserController {
  async authorizeUser(req, res, next) {
    try {
      let { phone, confirm_code } = req.body;
      let user = await DataBaseService.getUserByPhone(phone);
      if (!user) {
        return next({ status: 404, message: "user with phone number  not found" });
      }
      if (!user.otp_code) {
        return next({ status: 404, message: "user with phone number  not found" });
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
}

module.exports = {
  UserController: new UserController(),
};
