const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true,"Please add review title"],
        maxlength:100
    },
    text:{
        type: String,
        required:[true,"Please add some text"]
    },
    rating:{
        type: Number,
        min:1,
        max:10,
        required:[true,"Please add a rating between 1 and 10"]
    },
     createdAt:{
        type: Date,
        default:Date.now()
    },
    bootcamp:{
        type:mongoose.Schema.ObjectId,
        ref:'Bootcamp',
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    }
})

//prevent user from submitting more than one review per bootcamp
ReviewSchema.index({bootcamp:1,user:1},{unique:true})

//static method to get average of tuitions 
ReviewSchema.statics.getAvarageRating = async function(bootcampId){
    // console.log("calculating avg cost");
    
    const obj = await this.aggregate([
        {
            $match:{bootcamp:bootcampId}
        },{
            $group:{
                _id: '$bootcamp',
                avarageRating:{$avg: '$rating'}
            }
        }
    ])
    // console.log("tuition fee avg",obj);
    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId,{
            averageRating: obj[0].avarageRating
    
        })
    } catch (error) {
        console.log("Error",error);
    }
    }
    
    //call getAvaregCost after save
    ReviewSchema.post('save',function(){
        this.constructor.getAvarageRating(this.bootcamp)
    })
    
    //call getAvarageCost before remove
    
    ReviewSchema.pre('deleteOne',function(){
        console.log("course deleted");
       this.getAvarageRating(this.bootcamp)
    })
    

module.exports = mongoose.model('Review',ReviewSchema)