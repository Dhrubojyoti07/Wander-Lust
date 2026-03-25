const mongoose= require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose");
const passportLocalMongoosePlugin = passportLocalMongoose && passportLocalMongoose.default ? passportLocalMongoose.default : passportLocalMongoose;
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
});
userSchema.plugin(passportLocalMongoosePlugin);
const User=mongoose.model("User",userSchema);
module.exports=User;