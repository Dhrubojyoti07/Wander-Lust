const Data=require("../models/Listings.js");
const review=require("../models/review.js");
module.exports.create=async(req,res)=>{
    let {id}=await req.params;
    let listing=await Data.findById(id);
    let newreview=new review(req.body);
    newreview.User=req.user._id;
    listing.review.push(newreview);
    await newreview.save();
    await listing.save();
    req.flash("success","review was added");
    res.redirect(`/view/${id}`);
};
module.exports.delete=async(req,res)=>{
    let {id,revid}=await req.params;
    await Data.findByIdAndUpdate(id,{$pull:{review:revid}});
    await review.findByIdAndDelete(revid);
    req.flash("success","review was deleted");
    res.redirect(`/view/${id}`);
};