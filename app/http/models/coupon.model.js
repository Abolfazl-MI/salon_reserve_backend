const { default: mongoose } = require("mongoose");
const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    default: generateCouponCode, // Define a function to generate the code
    unique: true, // Ensure uniqueness of the coupon code
  },
  discount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["fill", "free"],
  },
});

const CouponModel = mongoose.model("coupon", couponSchema);

module.exports = {CouponModel};
