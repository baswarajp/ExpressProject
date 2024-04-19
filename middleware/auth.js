const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorHandler');
const User = require('../models/User')

//protect routes
exports.protect = asyncHandler(async (req,res,next) =>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        //set token from bearer header
        token = req.headers.authorization.split(' ')[1];
        console.log("token",token);
    }
    //here we are setting token to a cookie please comment this code to not to use cookies
    // else if(req.cookies.token){
    //     token = req.cookies.token;
    // }
    if(!token){
        return next( new ErrorResponse("Not authorize to access this route",401))
    }
    try {
        //verify token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log('decoded',decoded);

        req.user = await User.findById(decoded.id);
    } catch (err) {
          return next( new ErrorResponse("Not authorize to access this route",401))

    }
    next()
})

//authorize routes as only admin or publisher can access some routes
exports.authorize = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next( new ErrorResponse(`Your role ${req.user.role} is not authorized to access this route`,403))
        }
        next()
    }
}
