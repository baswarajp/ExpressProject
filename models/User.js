const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please add name"]
    },
    email:{
        type:String,
        required:[true,'please add an email'],
        unique:true,
        match:[
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,'Please add valid email'
        ]
    },
    role:{
        type:String,
        enum:['user','publisher'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'Please add a password'],
        minlength:6,
        select:false
    },
    resetPasswordToken:String,
    resetPassowrdExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
    });

    //Encrypt password using bcrypt
    UserSchema.pre('save', async function(next) {
        if(!this.isModified('password')){
            next();
        }
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt)
    })

    // Sign Jwt and return
    UserSchema.methods.getSignedJwtToken = function (){
        return jwt.sign({id:this._id},process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRE
        })
    }

    // match user entered password with hashed password in databse
    //if function is calling the direct schema then we use schema.statics if it is calling user then we use schema.methods
    UserSchema.methods.matchPassword = async function (enteredPassword){
         return await bcrypt.compare(enteredPassword,this.password)
    }

    //Genarate and has password token
    UserSchema.methods.getResetPasswordToken =  function (){
        //Genarate token
        const resetToken = crypto.randomBytes(20).toString('hex');

        //hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        //setExpire
        this.resetPassowrdExpire = Date.now()+10*60*1000;
        return resetToken;
    }
    module.exports=mongoose.model('User',UserSchema);