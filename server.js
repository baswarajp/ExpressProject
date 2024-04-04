const path = require('path')
const express = require('express');
const dotenv = require('dotenv')
const logger = require('./middleware/logger')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')

//for checking the logger info like api request and response
const morgan = require('morgan')
//bootcamps files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')

const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')
//load env vars
dotenv.config({path:'./config/config.env'})
//using bootcamps api's
connectDB();
const app= express();
app.use(express.json())
app.use(cookieParser())

if(process.env.NODE_ENV ==='development')
{
    app.use(morgan("dev"));
}

app.use(logger)
app.use(fileupload())

// set static folder
app.use(express.static(path.join(__dirname,'public')))

app.use('/api/v1/bootcamps',bootcamps)
app.use('/api/v1/courses',courses)
app.use('/api/v1/auth',auth)

app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, ()=>{
    console.log(`Application running on ${process.env.NODE_ENV} environment on PORT ${PORT} `);
})
process.on('unhandledRejection',(err,promise) =>{
    console.log(`Error: ${err.message}`);
    server.close(()=>process.exit(1))
})