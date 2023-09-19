const { default: mongoose } = require("mongoose");

let salonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  images:{
    type:[String],
    default:[]
  },
  features:{
    type:String,
    default:''
  },
  rent_cost:{
    type:Number,
    required:true
  },
  area:{
    type:Number,
    required:true
  }
});

let SalonModel=mongoose.model('salon',salonSchema)

module.exports={
    SalonModel
}