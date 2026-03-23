const mongoose= require("mongoose");
const reviewschema=new mongoose.Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    User:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
});
const review=mongoose.model("review",reviewschema);
module.exports=review;