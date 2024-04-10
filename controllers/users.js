const ErrorResponse = require('../utils/errorHandler')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const User = require('../models/User')

// @descr get all users
// @route get api/v1/auth/users
// @access private

exports.getUsers = asyncHandler(async (req,res,next) =>{
  res.status(200).json(res.advancedResults)

})

// @descr get single user
// @route get api/v1/auth/users/:id
// @access private

exports.getUser = asyncHandler(async (req,res,next) =>{
    const user = await User.findById(req.params.id)
    res.status(200).json({
        success:true,
        data:user
    })
  
  })

// @descr create user
// @route post api/v1/auth/users
// @access private

exports.createUser = asyncHandler(async (req,res,next) =>{
    const user = await User.create(req.body)
    res.status(201).json({
        success:true,
        data:user
    })
  
  })
// @descr update user
// @route put api/v1/auth/users/:id
// @access private

exports.updateUser = asyncHandler(async (req,res,next) =>{
    const user = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        data:user
    })
  
  })
// @descr delete user
// @route delete api/v1/auth/users/:id
// @access private
  exports.deleteUser = asyncHandler(async (req,res,next) =>{
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        data:{}
    })
  
  })
