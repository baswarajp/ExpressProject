const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env vars

dotenv.config({path:'./config/config.env'});

//load models

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course')
const User = require('./models/User')

const { argv } = require('process');

mongoose.connect(process.env.MONGO_URI);

//Read Json files

const Bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));

const Courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));

const Users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));


//Import into DB
const importData = async() =>{
    try {
        await Bootcamp.create(Bootcamps)
        await Course.create(Courses)
        await User.create(Users)


        console.log("Data Inserted");
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

//Delete data from db

const deleteData = async() =>{
    try {
        await Bootcamp.deleteMany() //it will delete all the data
        await Course.deleteMany() //it will delete all the data
        await User.deleteMany() //it will delete all the data

        console.log("Data Deleted");
        process.exit();
    } catch (err) {
        console.log(err)
    }
}

if(argv[2] === '-i'){
    importData()
}
else if(argv[2] === '-d'){
    deleteData()
}