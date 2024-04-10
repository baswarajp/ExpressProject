const express = require('express');
const {register,login,getMe,forgotPassword,resetPassword,updatedetails,updatePassword} = require('../controllers/auth');
const {protect,authorize} = require('../middleware/auth')

const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.get('/me',protect,getMe)
router.put('/updatedetails',protect,updatedetails)
router.put('/updatepassword',protect,updatePassword)
router.get('/forgotpassword',forgotPassword)
router.put('/resetpassword/:resetToken',resetPassword)

module.exports= router;