const path = require('path')
const BootCamp = require('../models/Bootcamp')
const errorHandler = require('../middleware/error')
const ErrorResponse = require('../utils/errorHandler')
const asyncHandler = require('../middleware/async')
const GeoCoder = require('../utils/geoCoder')
const Course = require('../models/Course')

// @descr get all bootcamps
// @route get api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req,res,next) =>{
   //here we are getting results from advanced results page as we have passed advancedResults module in the routes of getBootcamps
        res.status(200).json(res.advancedResults)
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
        const bootcamp = await BootCamp.findById(req.params.id)
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`,404)
                )
        }
       await bootcamp.deleteOne({ _id: req.params.id });
       //Deleting courses related to deleted bootcamp
       await Course.deleteMany({ bootcamp: req.params.id})
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


// @descr photo upload
// @route Delete api/v1/bootcamps/:id/photo
//@access private
exports.bootcampPhotoUpload = asyncHandler(async(req,res,next) =>{ 
    const bootcamp = await BootCamp.findById(req.params.id)
    if(!bootcamp){
        return next(
            new ErrorResponse(`Bootcamp not found with the id ${req.params.id}`,404)
            )
        }
        
        if(!req.files){
            return next(
                new ErrorResponse(`Please upload a photo`,400)
                )
        }
       
        const file = req.files.file;
        //check the file type
        if(!(file.mimetype.startsWith("image"))){
            return next(
            new ErrorResponse(`Please upload an image file`,400)
            )

        }
       
         //check file size
        if(file.size>process.env.MAX_FILE_UPLOAD){
            return next(
            new ErrorResponse(`Please upload an image of size below 1MB`,400)
            )
        }
        //create custom file name
        file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`  

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if(err){
                return next(
                    new ErrorResponse('problem with file upload',500)
                    )
            }

            await BootCamp.findByIdAndUpdate(req.params.id,{photo:file.name})

            res.status(200).json({
                success:true,
                data:file.name
            })
        })
})