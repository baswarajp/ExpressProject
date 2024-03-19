const BootCamp = require('../models/Bootcamp')
const errorHandler = require('../middleware/error')
const ErrorResponse = require('../utils/errorHandler')
const asyncHandler = require('../middleware/async')
const GeoCoder = require('../utils/geoCoder')

// @descr get all bootcamps
// @route get api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
    let query;
    let queryString = JSON.stringify(req.query);
    queryString = queryString.replace(/\b(gt|gte|lt|lte\in)\b/g,match =>`$${match}`);
    query = BootCamp.find(JSON.parse(queryString));

        const bootcamps = await query
        res.status(200).json({
            success:true,
            count:bootcamps.length,
            data:bootcamps
        })
})

// @descr get a bootcamp
// @route get api/v1/bootcamp
//@access public
exports.getBootcamp = asyncHandler(async(req,res,next) =>{
    // res.status(200).send({"success":true,"msg":`Show a bootcamp ${req.params.id}`})
    console.log("req.params.id",req.params.id);
   
        const bootcamp = await BootCamp.findById(req.params.id)
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`,404)
                )
        }
        res.status(200).json({
            success:true,
            data:bootcamp
        })
})

// @descr create a bootcamp
// @route POST api/v1/bootcamp
//@access private
exports.createBootcamp = asyncHandler(async (req,res,next) =>{
        const bootcamp = await BootCamp.create(req.body)
        res.status(201).json({
         success:true,
         data:bootcamp
        }) 
})

// @descr update a bootcamp
// @route PUT api/v1/bootcamp/:id
//@access private
exports.UpdateBootcamp = asyncHandler(async(req,res,next) =>{

    const bootcamp = await BootCamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`,404)
            )    }
    res.status(200).json({
        success:true,
        data:bootcamp
})

})

// @descr Delete all bootcamp
// @route Delete api/v1/bootcamp/:id
//@access private
exports.DeleteBootcamp = asyncHandler(async(req,res,next) =>{ 
        const bootcamp = await BootCamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`,404)
                )
        }
        res.status(200).json({
            success:true,
            data:bootcamp
        })
})

// @descr Get Bootcamps within radius 
// @route Get api/v1/bootcamp/radius/:zipcode/:distance/:unit(if reuired)
// @access private
exports.GetBootcampsInRadius = asyncHandler(async(req,res,next) =>{ 
const {zipcode,distance} = req.params;
console.log("zipcode",zipcode);
const loc = await GeoCoder.geocode(zipcode)
console.log("loc",loc);
const lat = loc[0].latitude;
const long = loc[0].longitude;

//calculate radius using radians
//divide it by radius of earth
//Earth radius 3963 mi or 6378 km

const radius = distance/3963;
const Bootcamps = await BootCamp.find({
    location:{$geoWithin:{$centerSphere :[[long,lat],radius]}}
})
res.status(200).json({
    success:true,
    count:Bootcamps.length,
    data:Bootcamps
})
})
