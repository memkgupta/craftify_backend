import Order from "../models/orderModel.js";
import ErrorHandler from "../utils/ErrorHandler.js"
import Artisan from "../models/artisanModel.js"
import { validCreateOrderRequest } from "../utils/validations.js";
import OrderItem from "../models/orderItem.model.js";
import Product from "../models/productModel.js"
import Payment from "../models/paymentModel.js";
import { sendOrderPlacedEmail } from "../utils/mail.js";
export const createOrder = async(req,res,next)=>{
    
    const {error} = validCreateOrderRequest(req.body);
    if(error){
        return next(new ErrorHandler(error.message,401));
    }
const {artisan_id,date,payment_method,items,address} = req.body;

const artisan = await Artisan.findById(artisan_id);
if(!artisan){
    return next(new ErrorHandler("Artisan not found",401))
}

const order = await Order.create({
    user_id:req.user._id,
    artisan_id:artisan._id,
    date:date,
    paymentMethod:payment_method,
    address:address
});
let total_amount = 0;
let orderItems = []
items.forEach(async(item) => {
    const product = await Product.findById(item.p_id);
    if(!product){
        await order.deleteOne();
        return next(new ErrorHandler("Bad request invalid product",401));
    }
    total_amount += product.price*item.qty;
  const orderItem =   await OrderItem.create({
        order_id:order._id,
        product_id:product._id,
        quantity:item.qty,
        price:product.price,
        date:date,
    })
    orderItems.push({name:product.name,quantity:item.qty});
});
order.total_amount = total_amount;
order.items = orderItems;
await order.save();
res.status(200).json({success:true,message:"Order created complete payment",order_id:order._id});
}
export const completeOrder = async(req,res,next)=>{
    const {order_id,payment_id} = req.body;
    const order = await Order.findById(order_id);
    if(!order){
        return next(new ErrorHandler("Bad request",403));
    }
    const payment = await Payment.findById(payment_id);
    if(!payment){
        return next(new ErrorHandler("Bad request",403));
    }
    if(payment.payment_status=="completed"){
order.payment_id =payment._id;
order.status = 'processing'
await order.save();
// await sendOrderPlacedMail()
if(req.user.email){
    await sendOrderPlacedEmail(req.user.email)
}
res.status(200).json({success:true,message:"Order placed successfully",order_id:order._id});
    }
    else{
        return next(new ErrorHandler("Payment not completed yet",403));
    }
}