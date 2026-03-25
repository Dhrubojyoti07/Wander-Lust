const mongoose= require("mongoose");
const review = require("./review.js");
const listingSchema=new mongoose.Schema({
    title:String,
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    category:{
        type:String,
        enum:["Trending","Rooms","Camps","Beaches","Destinations","Cities","Mountains","Seas","Castles","Farmhouses","Arctic","Countryside","Others"]
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
    }],
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], // must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
  }

});
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await review.deleteMany({ _id:{$in:listing.review}});
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;