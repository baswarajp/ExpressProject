const Course = require('../models/Course')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');
const Bootcamp = require('../models/Bootcamp');


// @descr get all Courses
// @route get api/v1/courses
// @route get api/v1/bootcamps/:bootcampId/Courses
// @access public

exports.getCourses = asyncHandler(async (req,res,next) =>{
    if(req.params.bootcampId){
        const courses = await Course.find({bootcamp:req.params.bootcampId})
         
        return res.status(200).json({
            status:true,
            count:courses.length,
            data:courses
        })
    }
    else{
        // populate allows you to populate reference fields in your MongoDB documents with actual document(s) from other collections.
        res.status(200).json(
            res.advancedResults
        )
    }
})

// @descr get single Course
// @route get api/v1/Courses/:bootcampId
// @access public

exports.getCourse = asyncHandler(async (req,res,next) =>{
   const course = await Course.findById(req.params.id).populate({
    path:'bootcamp',
    select:'name description'
   })

   if(!course){
    return next(
        new ErrorResponse(`No course with the id ${req.params.id}`,404)
    )
   }

    res.status(200).json({
        success:true,
        data:course
    })
})

// @descr Add single Course with bootcamp id
// @route POST api/v1/bootcamps/:bootcampId/Courses
// @access Private
exports.addCourse = asyncHandler(async (req,res,next) =>{
    req.body.bootcamp =  req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)

    if(!bootcamp){
     return next(
         new ErrorResponse(`No bootcamp with the id ${req.params.bootcampId}`,404)
     )
    }
    const course = await Course.create(req.body);
     res.status(200).json({
         success:true,
         data:course
     })
 })

// @descr update single Course
// @route PUT api/v1/Courses/:courseId
// @access public
exports.UpdateCourse = asyncHandler(async(req,res,next) =>{
    const course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    }).populate({
        path:'bootcamp',
        select:'name description'
       })
    if(!course){
        return next(
            new ErrorResponse(`course not found with the id ${req.params.id}`,404)
            )    }
    res.status(200).json({
        success:true,
        data:course
})

})

// @descr Delete single Course
// @route Delete api/v1/Courses/:courseId
// @access public
exports.DeleteCourse = asyncHandler(async(req,res,next) =>{
    const course = await Course.findById(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    if(!course){
        return next(
            new ErrorResponse(`course not found with the id ${req.params.id}`,404)
            )    }

    await course.deleteOne({ _id: req.params.id });   
    res.status(200).json({
        success:true,
        data:{}
})

})
