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
        coupons = await DataBaseService.getCouponByStatus(limit, skip, type);
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
      let coupon_id = req.params.id;
      let coupon = await DataBaseService.getSingleCoupon(coupon_id);
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
        data.features = features;
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
      console.log(data);
      let salon_id = data.id;
      delete data.id;
      console.log(data);
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
      let salon_id=req.body.id
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
      let updatedSalon=await DataBaseService.updateSalonImages(salon_id,images)
      return res.status(200).json({
        statusCode:res.statusCode,
        message:"salon images updated",
      })
    } catch (e) {
      next(e);
    }
  }
  async deleteSalonImage(req,res,next){
    try{
        let data=req.body
        let salon_id=data.id
        delete data.id
        console.log(data.images)
        let deleteSalonImage=await DataBaseService.deleteSalonImages(salon_id,data.images)
        // TODO SHOULD DELETE THE PHOTO FROM THE PRODUCTION STORAGE SERVER
        return res.status(200).json({
          statusCode:res.statusCode,
          message:"salon images deleted",
        })
    }catch(e){
      next(e)
    }
  }
}

module.exports = {
  AdminController: new AdminController(),
};
