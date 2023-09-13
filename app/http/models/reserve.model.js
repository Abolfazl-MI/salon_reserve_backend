
let reserved_timeSchema = new mongoose.Schema({
    // day type-> dateTime
    day: {
        type: Date,
        required: true,
    },
    // times type-> String
    times: {
        type: String,
        required: true,
    },
    // status enum reserved,full
    status: {
        type: String,
        enum: ["reserved", "full"],
        default: "reserved",
    },
    // reserver user 
    reserver_id: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    }
    
    
})

let ReservedTimeModel = mongoose.model("reserved_time", reserved_timeSchema);

module.exports = {
    ReservedTimeModel
}