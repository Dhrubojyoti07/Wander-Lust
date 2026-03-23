const mongoose=require("mongoose");
const data=require("./data.js");
const Listing=require("../models/Listings.js");
mongoose.connect("mongodb://127.0.0.1:27017/wander").then(()=>{console.log("mongodb is connected");}).catch((err)=>{console.log(err);});
const initdb=async()=>{
    await Listing.deleteMany();
    data.data=data.data.map((d)=>({
         ...d,User:"69b15d9fa14f447cf116b81a"})
    );
    await Listing.insertMany(data.data);
}
initdb();