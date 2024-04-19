const ErrorResponse = require("../utils/errorHandler");

const errorHandler = (err,req,res,next) =>{
    let error = {...err}
    error.message= err.message
    console.log("err",err);
//Mangoose bad object id
    if(err.name === 'CastError'){
        const message = `Resource not found`;
        error= new ErrorResponse(message,404)  
    }
    //Mangoose duplicate key error
    if(err.code === 11000){
        const message ="Duplicate field value entered";
        error= new ErrorResponse(message,400)  
    }
    //Validation error like mandatory fields
    if(err.name === "ValidationError"){
    const messages = Object.values(err.errors).map(val=>val.message)
    error = new ErrorResponse(messages,400)

    }
    res.status(error.statusCode||500).json({
        success:false,
        error:error.message||"Server Error"
    })
}

module.exports= errorHandler