const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//load env vars

dotenv.config({path:'./config/config.env'});

//load models

const Bootcamp = require('./models/Bootcamp');
const { argv } = require('process');

mongoose.connect(process.env.MONGO_URI);

//Read Json files

const Bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));

//Import into DB
const importData = async() =>{
    try {
        await Bootcamp.create(Bootcamps)
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