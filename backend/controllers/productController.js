const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js"); 
const ApiFeatures = require("../utils/apifeatures.js");
const cloudinary = require("cloudinary");

// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req,res,next)=>{
    let images=[];
    if(typeof req.body.images==="string"){
        images.push(req.body.images)
    }else{
        images=req.body.images;
    }

    const imagesLink=[];

    for(let i=0;i<images.length;i++){
        const result = await cloudinary.v2.uploader.upload(images[i],{
            folder:"products"
        })
        imagesLink.push({
            public_id:result.public_id,
            url:result.secure_url
        })
    }

    req.body.images=imagesLink;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})

// Get all products
exports.getAllProducts = catchAsyncErrors(async (req,res,next)=>{
    // return next(new ErrorHandler("This is my custom error",500))
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();
    const apiFeature = new ApiFeatures(Product.find(),req.query).search().filter();
    
    const products = await apiFeature.query;
    const filteredProductsCount = products.length;
    apiFeature.pagination(resultPerPage)
    res.status(200).json({
        success:true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
})

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    let product = await Product.findById(req.params.id);
    
    // images starts here 
    let images=[];
    if(typeof req.body.images==="string"){
        images.push(req.body.images)
    }else{
        images=req.body.images;
    }
    if(images!==undefined){
        
        // Deleting images from cloudinary
        for(let i=0;i<product.images.length;i++){
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const imagesLink=[];

        for(let i=0;i<images.length;i++){
            const result = await cloudinary.v2.uploader.upload(images[i],{
                folder:"products"
            })
            imagesLink.push({
                public_id:result.public_id,
                url:result.secure_url
            })
        }
        res.body.images=imagesLink
    }
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({
        success:true,
        product
    })
})

// Delete Product -- Admin
exports.deleteProduct = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);   
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    // Deleting images from cloudinary
    for(let i=0;i<product.images.length;i++){
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success:true,
        message:"Product deleted successfully!"
    })
})

// Get Product details
exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success:true,
        product
    })
})

// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    
    const {rating,comment,productId} = req.body;
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    const isReviewed = await product.reviews.find(rev=>rev.user.toString()===req.user._id.toString())
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString()){
            rev.rating=rating,
            rev.comment=comment
            }
        })
    }else{
        product.reviews.push(review);
        // console.log(product.reviews.length);
        product.numOfReviews = product.reviews.length;
    }
    let avg=0;
    product.reviews.forEach(rev=>{
        avg+=rev.rating
    })
    product.ratings=avg/product.reviews.length;

    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success:true
    })
    // next();
})

// Get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req,res,next)=>{
    console.log(req.query.id);
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString());

    let avg=0;
    reviews.forEach(rev=>{
        avg+=rev.rating
    })
    let ratings = 0;
    if(reviews.length === 0){
        ratings = 0;  
    }else{
        ratings = avg/reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{new:true,runValidators:true})

    res.status(200).json({
        success:true,

    })
})

// Get all products -- Admin
exports.getAdminProducts = catchAsyncErrors(async (req,res,next)=>{
    // return next(new ErrorHandler("This is my custom error",500))
    const products = await Product.find();
    res.status(200).json({
        success:true,
        products,
    })
})