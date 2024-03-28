const express = require('express');
const Courses = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')
//mergeParams is for merging this route with other incoming route
const router = express.Router({mergeParams:true});
const {getCourses,getCourse,UpdateCourse,DeleteCourse,addCourse} = require("../controllers/courses")

router.route('/')
.get(advancedResults(Courses,{
    path:'bootcamp',
    select:'name description'
}),getCourses)
.post(addCourse)
router.route('/:id').get(getCourse)
router.route('/:id').put(UpdateCourse)
router.route('/:id').delete(DeleteCourse)

module.exports = router;
