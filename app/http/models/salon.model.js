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
  reserved_times:{
    type:[mongoose.Types.ObjectId],
    // TODO the collection name should be same as model
    ref:'reserved_time'
  }
});

let SalonModel=mongoose.model('salon',salonSchema)

module.exports={
    SalonModel
}