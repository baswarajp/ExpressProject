const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')
const express = require('express');
const router = express.Router();
const {getBootcamps,getBootcamp,createBootcamp,UpdateBootcamp,DeleteBootcamp,GetBootcampsInRadius, bootcampPhotoUpload} = require("../controllers/bootcamps")

// Include other resourse routers
const courseRouter = require('./courses')

//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius);

router.route('/:id/photo').put(bootcampPhotoUpload);

router
.route('/')
.get(advancedResults(Bootcamp,"Courses"),getBootcamps)
.post(createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(UpdateBootcamp)
.delete(DeleteBootcamp);

module.exports = router;
