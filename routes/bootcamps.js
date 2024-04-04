const advancedResults = require('../middleware/advancedResults')
const Bootcamp = require('../models/Bootcamp')
const express = require('express');
const router = express.Router();
const {getBootcamps,getBootcamp,createBootcamp,UpdateBootcamp,DeleteBootcamp,GetBootcampsInRadius, bootcampPhotoUpload} = require("../controllers/bootcamps")

// Include other resourse routers
const courseRouter = require('./courses')

const {protect,authorize} = require('../middleware/auth');
//Re-route into other resource routers
router.use('/:bootcampId/courses',courseRouter)

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius);

router.route('/:id/photo').put(protect,authorize('publisher','admin'),bootcampPhotoUpload);

router
.route('/')
.get(advancedResults(Bootcamp,"Courses"),getBootcamps)
.post(protect,authorize('publisher','admin'),createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),UpdateBootcamp)
.delete(protect,authorize('publisher','admin'),DeleteBootcamp);

module.exports = router;
