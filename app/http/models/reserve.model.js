let mongoose = require("mongoose");
let reserved_timeSchema = new mongoose.Schema({
    // day type-> dateTime
    day: {
        type: Date,
        required: true,
    },
    // times type-> String
    hours: {
        type: String,
        required: true,
    },
    // status enum reserved,full
    status: {
        type: String,
        enum: ["reserved", "full","canceled"],
        default: "reserved",
    },
    // reserver user 
    reserver_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    salon_id:{
        type:mongoose.Types.ObjectId,
        ref:"salon",
        required:true
    },
    order_id:{
        type:mongoose.Types.ObjectId,
        ref:"order",
        required:true
    }
    
    
})

let ReservedTimeModel = mongoose.model("reserved_time", reserved_timeSchema);

module.exports = {
    ReservedTimeModel
}