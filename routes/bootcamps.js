const express = require('express');
const router = express.Router();
const {getBootcamps,getBootcamp,createBootcamp,UpdateBootcamp,DeleteBootcamp,GetBootcampsInRadius} = require("../controllers/bootcamps")

router.route('/radius/:zipcode/:distance').get(GetBootcampsInRadius);

router
.route('/')
.get(getBootcamps)
.post(createBootcamp);

router
.route('/:id')
.get(getBootcamp)
.put(UpdateBootcamp)
.delete(DeleteBootcamp);

module.exports = router;
