const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"Please add course title"]
    },
    description:{
        type: String,
        required:[true,"Please add  Description"]
    },
    weeks:{
        type: String,
        required:[true,"Please add number of Weeks"]
    },
    tuition:{
        type: Number,
        required:[true,"Please add a tuition cost"]
    },
    minimumSkill:{
        type: String,
        required:[true,"Please add minimum skill"],
        enum:['beginner','intermediate','advanced']
    },
    scholoshipAvailable:{   
        type: Boolean,
        default:false
     },
     createdAt:{
        type: Date,
        default:Date.now()
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    }
})

//static method to get average of tuitions 
CourseSchema.statics.getAvarageCost = async function(bootcampId){
// console.log("calculating avg cost");

const obj = await this.aggregate([
    {
        $match:{bootcamp:bootcampId}
    },{
        $group:{
            _id: '$bootcamp',
            avarageCost:{$avg: '$tuition'}
        }
    }
])
// console.log("tuition fee avg",obj);
try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
        averageCost: Math.ceil(obj[0].avarageCost)
        // averageCost: obj[0].avarageCost

    })
} catch (error) {
    console.log("Error",error);
}
}

//call getAvaregCost after save
CourseSchema.post('save',function(){
    this.constructor.getAvarageCost(this.bootcamp)
})

//call getAvarageCost before remove

// CourseSchema.pre('deleteOne',function(){
//     console.log("course deleted");
//    this.getAvarageCost(this.bootcamp)
// })

// this is not working
CourseSchema.pre('deleteOne', async function(next) {
    // console.log("course deleted");
    try {
        const courseId = this.getQuery()._id; // Assuming you're using deleteOne on Course model
        const course = await this.model.findById(courseId);
        if (course) {
            await course.constructor.getAvarageCost(this.bootcamp);
        }
    } catch (error) {
        console.log("Error", error);
    }
    next();
});

module.exports=mongoose.model('Course',CourseSchema)