const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");

// Create new order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    });
    res.status(201).json({
        success:true,
        order
    })
});

// Get single order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email"); // .populate("user","name email") will fetch the name and email from user model by using the id which was stored inside order

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }
    res.status(200).json({
        success:true,
        order
    })
})

// Get logged in user orders
exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});
    if(!orders){
        return next(new ErrorHandler("Orders not found",404));
    }
    res.status(200).json({
        success:true,
        orders
    })
})

// Get all orders -- Admin
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order=>{
        totalAmount+=order.totalPrice;
    });

    if(!orders){
        return next(new ErrorHandler("Orders not found",404));
    }
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

// Update order status -- Admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);
    
    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Your have already delivered this order",404))
    }

    if(!order){
        return next(new ErrorHandler("Order not found",404));
    }
    if(req.body.status==="shipped"){
        order.orderItems.forEach(async(ord)=>{
            await updateStock(ord.product,ord.quantity);
        });
    }

    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now()
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
    })
})

async function updateStock(id,quantity){
    const product = await Product.findById(id);
    product.Stock -=quantity;
    await product.save({validateBeforeSave:true});
}

// Delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with the given id",404));
    }

    await order.remove()

    res.status(200).json({
        success:true,
    })
})

