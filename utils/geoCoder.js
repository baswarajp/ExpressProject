const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const GeoCoder = require('node-geocoder')

const options= {
    provider: process.env.GEOCODER_PROVIDER,
    apiKey:process.env.GEOCODER_API_KEY,
    httpAdapter:'https',
    formatter: null
}

const geocoder = GeoCoder(options);
module.exports= geocoder;