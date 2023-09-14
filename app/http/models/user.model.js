const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone_number: {
    type: String,
    required: true,
    unique:true
  },
  name: {
    type: String,
    default: "",
  },
  family_name: {
    type: String,
    default: "",
  },
  group_name: {
    type: String,
    default: "",
  },
  instagram_page_address: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  otp_code: {
    type: String,
    default: "",
  },
  coupon_code: {
    type: mongoose.Types.ObjectId,
    ref: "coupons",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

let UserModel = mongoose.model("user", userSchema);

module.exports = { UserModel };
