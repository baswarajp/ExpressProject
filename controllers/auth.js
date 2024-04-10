const crypto = require('crypto')
const ErrorResponse = require('../utils/errorHandler')
const asyncHandler = require('../middleware/async')
const User = require('../models/User')
const sendEmail = require('../utils/sendEmail')

// @descr Register User
// @route post api/v1/auth/register
// @access public

exports.register = asyncHandler(async (req,res,next) =>{
    const {name,email,password,role} = req.body;

    //create user
    const user = await User.create({ 
        name,
        email,
        password,
        role
    })
    //create token
    sendTokenResponse(user,200,res)

})

// @descr Login User
// @route post api/v1/auth/login
// @access public

exports.login = asyncHandler(async (req,res,next) =>{
    const {email,password} = req.body;

   //validate email and password
   if(!email || !password){
    return next(new ErrorResponse('Please provide valid email and password',400))
   }

   //check for user
   const user = await User.findOne({email}).select('+password');
   if(!user){
    return next(new ErrorResponse('Invalid credentials',401))
   }

   //check if password matches
   const isMatch = await user.matchPassword(password)
   if(!isMatch){
    return next(new ErrorResponse('Invalid credentials',401))
   }

    //create token
    sendTokenResponse(user,200,res)
})

//Get token from model, create cookie and send response 
const sendTokenResponse = (user,statusCode,res) =>{
const token = user.getSignedJwtToken()

const options = {
    expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
    httpOnly:true
}
res
.status(statusCode)
.cookie('token',token,options)
.json({
    success:true,
    token
})

}

// @descr get current logged in user
// @route get api/v1/auth/me
// @access private

exports.getMe = asyncHandler(async function (req,res,next) {

    //here we have stored user data in req.user in auth middleware
    const user = await User.findById(req.user.id)
    res.status(200).json({
        succes:true,
        data:user
    })
})

// @descr update user details
// @route get api/v1/auth/updatedetails
// @access private

exports.updatedetails = asyncHandler(async function (req,res,next) {
const fieldsToUpdate = {
    name:req.body.name,
    email:req.body.email
}
    //here we have stored user data in req.user in auth middleware
    const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        succes:true,
        data:user
    })
})

// @descr update password
// @route get api/v1/auth/updatepassword
// @access private

exports.updatePassword = asyncHandler(async function (req,res,next) {
    console.log("req.body",req.body);
    const user = await User.findById(req.user.id).select('+password');
        //here we have stored user data in req.user in auth middleware
      if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('incorrect password',401))
      }
      user.password = req.body.newPassword;
      await user.save();
      sendTokenResponse(user,200,res)
    })

// @descr Forgot password
// @route get api/v1/auth/forgotPassword
// @access public

exports.forgotPassword = asyncHandler(async function (req,res,next) {

    const user = await User.findOne({email:req.body.email})

    //check whether email exists
    if(!user){
        return next(new ErrorResponse(`The user not found with email ${req.body.email}`,404))
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false})

    //create reset url
    const resetUrl =`${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;
    const message = `you are receivig this email because you or someone else requested for reset password.
    please make a put request to ${resetUrl}`

    try {
        await sendEmail({
            email:user.email,
            subject:'password reset token',
            message
        })
       res.status(200).json({
        success:true,
        data:'Email sent'
       }) 
    } catch (err) {
        console.log("err",err);
        user.resetPasswordToken= undefined;
        user.resetPassowrdExpire=undefined;
        await user.save({validateBeforeSave:false});

        return next( new ErrorResponse("email could not be sent",500))
    }
})

// @descr Reset Password
// @route get api/v1/auth/resetPassword
// @access public

exports.resetPassword = asyncHandler(async function (req,res,next) {
    //get hashed token
    const resetPasswordToken = crypto.createHash('sha-256').update(req.params.resetToken).digest('hex');
    //here we have stored user data in req.user in auth middleware
    const user = await User.findOne({
        resetPasswordToken,
        resetPassowrdExpire :{$gt:Date.now()}

    })

    if(!user){
        return next(new ErrorResponse('Invalid token',400))
    }

    //set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPassowrdExpire=undefined;
    await user.save();

    sendTokenResponse(user,200,res) //after setting new password we are saving new token and cookies

})