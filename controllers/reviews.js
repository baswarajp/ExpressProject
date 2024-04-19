const Review = require('../models/Review')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');
const Bootcamp = require('../models/Bootcamp');

// @descr get all Reviews
// @route get api/v1/reviews
// @route get api/v1/bootcamps/:bootcampId/reviews
// @access public

exports.getReviews = asyncHandler(async (req,res,next) =>{
    if(req.params.bootcampId){
        const reviews = await Review.find({bootcamp:req.params.bootcampId})
         
        return res.status(200).json({
            status:true,
            count:reviews.length,
            data:reviews
        })
    }
    else{
        res.status(200).json(
            res.advancedResults
        )
    }
})

// @descr get a Review
// @route get api/v1/reviews/:id
// @access public

exports.getReview = asyncHandler(async (req,res,next) =>{
    const review = await Review.findById(req.params.id).populate({
        path:'bootcamp',
        select:'name description'
    })

    if(!review){
        return next(new ErrorResponse(`Review not found with the id ${req.params.id}`,404))
    }
    res.status(200).json({
        success:true,
        data:review
    })
})

// @descr add a Review
// @route POST api/v1/bootcamps/:bootcampId/reviews
// @access private

exports.addReview = asyncHandler(async (req,res,next) =>{
    console.log("req",req);
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;   
    
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcmap not found with the id ${req.params.bootcampId}`,404))
    }

    const review = await Review.create(req.body)

    if(!review){
        return next(new ErrorResponse(`Review not added`,400))
    }
    res.status(201).json({
        success:true,
        data:review
    })
})

// @descr update a Review
// @route Update api/v1/reviews/:id
// @access private

exports.updateReview = asyncHandler(async (req,res,next) =>{
    console.log("req.user",req.user.id.toString());
    let review = await Review.findById(req.params.id)
    console.log("review",review.user.toString());

    if(!review){
        return next(new ErrorResponse(`Review not found with the id ${req.params.id}`,404))
    }

    //make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !=='admin'){
        return next(new ErrorResponse(`Not authorize to access this review `,401))
    }

    review = await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        data:review
    })
})

// @descr Delete a Review
// @route Update api/v1/reviews/:id
// @access private

exports.deleteReview = asyncHandler(async (req,res,next) =>{
    let review = await Review.findById(req.params.id)

    if(!review){
        return next(new ErrorResponse(`Review not found with the id ${req.params.id}`,404))
    }

    //make sure review belongs to user or user is admin
    if(review.user.toString() !== req.user.id && req.user.role !=='admin'){
        return next(new ErrorResponse(`Not authorize to access this review `,401))
    }
    review = await Review.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        data:{}
    })
})