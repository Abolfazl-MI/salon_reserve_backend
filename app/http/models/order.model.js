

let orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    }, 
    salon:{
        type:mongoose.Types.ObjectId,
        ref:'salon',
        required:true
    },
    total_count:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','canceled','completed'],
    },
    remained_time:{
        type:Number,
    }
})

let OrderModel=mongoose.model('order',orderSchema)

module.exports={
    OrderModel
}