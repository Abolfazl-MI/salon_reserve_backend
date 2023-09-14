const { default: mongoose } = require("mongoose");
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true, // Ensure uniqueness of the coupon code
    required: true,

  },
  discount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["fill", "free"], // free means not used , fill means used
    default: "free",
  },
});

const CouponModel = mongoose.model("coupon", couponSchema);

module.exports = { CouponModel };
