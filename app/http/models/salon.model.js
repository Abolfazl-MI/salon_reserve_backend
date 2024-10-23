const { default: mongoose } = require("mongoose");

let feature_schema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
});

let salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    default: [],
  },
  features: {
    type: [mongoose.Types.ObjectId],
    ref:'feature'
  },
  rent_cost: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
});
let FeatureModel = mongoose.model("feature", feature_schema);
let SalonModel = mongoose.model("salon", salonSchema);

module.exports = {
  SalonModel,
  FeatureModel
};
