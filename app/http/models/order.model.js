

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
        default:'pending'
    },
    remained_time:{
        type:Number,
    },
    payment_method:{
        type:String,
        enum:['one-time','installment'],
        default:'one-time'
    },
    remained_amount:{
        type:Number,
        default:0,
        // when the payment is installment would have the remained amount which customer should pay else is 0
    },
    order_date:{
        type:Date,
        default:Date.now,
    }
})

let OrderModel=mongoose.model('order',orderSchema)

module.exports={
    OrderModel
}