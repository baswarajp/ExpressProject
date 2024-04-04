const express = require('express');
const Courses = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')
//mergeParams is for merging this route with other incoming route
const router = express.Router({mergeParams:true});
const {protect,authorize} = require('../middleware/auth');

const {getCourses,getCourse,UpdateCourse,DeleteCourse,addCourse} = require("../controllers/courses")

router.route('/')
.get(advancedResults(Courses,{
    path:'bootcamp',
    select:'name description'
}),getCourses)
.post(protect,addCourse)
router.route('/:id').get(getCourse)
router.route('/:id').put(protect,authorize('publisher','admin'),UpdateCourse)
router.route('/:id').delete(protect,authorize('publisher','admin'),DeleteCourse)

module.exports = router;
