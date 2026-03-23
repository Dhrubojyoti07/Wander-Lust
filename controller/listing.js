const Data=require("../models/Listings.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapToken });
module.exports.home=async(req,res)=>{
    await Data.find().then((d)=>{
        res.render("home.ejs",{data:d});
    })
};
module.exports.search=async(req,res)=>{
    let {q}=await req.query;
    await Data.find({$or:[{title:{$regex:q,$options:"i"}},{country:{$regex:q,$options:"i"}}]}).then((d)=>{
        res.render("home.ejs",{data:d,search:q});
    });
};

module.exports.category=async(req,res)=>{
    let {category}=await req.params;
    await Data.find({category}).then((d)=>{
        res.render("home.ejs",{data:d});
    });
    
};
module.exports.mylistings=async(req,res)=>{
    await Data.find({User:req.user._id}).then((d)=>{
        res.render("mylistings.ejs",{data:d});
    });
};
module.exports.renderCreateForm=async(req,res)=>{
        await res.render("new.ejs");  
};
module.exports.create=async(req,res)=>{
    const response = await geocoder.forwardGeocode({
        query: req.body.location.concat(", ", req.body.country  ),
        limit: 2
    }).send();
    const geometry = response.body.features[0].geometry;
    req.body.geometry=geometry;
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.User=req.user._id;
    req.body.image={url,filename};
    await Data.insertMany({...req.body}).then((d)=>{
        console.log(d);
        req.flash("success","new listing created");
        res.redirect("/home");
    })
};
module.exports.view=async(req,res)=>{
    let {id}=await req.params;
    await Data.findById(id).populate({path:"review",populate:{path:"User"}}).populate("User").then((d)=>{
        if(!d){
            req.flash("error","listing was not found");
            return res.redirect("/home");
        }
        res.render("show.ejs",{data:d});
    });
};
module.exports.renderEditForm=async(req,res)=>{
    let {id}=await req.params;
    await Data.findById(id).then((d)=>{
        if(!d){
            req.flash("error","listing was not found");
            return res.redirect("/home");
        }
        let originalUrl=d.image.url;
        originalUrl=originalUrl.replace("/upload/","/upload/w_200/");
        d.image.url=originalUrl;
        res.render("edit.ejs",{data:d});
    })
};
module.exports.update=async(req,res)=>{
    let {id}=await req.params;
    const response = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 2
    }).send();
    const geometry = response.body.features[0].geometry;
    req.body.geometry=geometry;
    if (req.file) {
  // user uploaded a new file
  let  url = req.file.path;
  let filename = req.file.filename;
  req.body.image = { url, filename };
} else {
  // no new file, keep the old one
  const listing = await Data.findById(id);
  let url = listing.image.url;
  let filename = listing.image.filename;
  req.body.image = { url, filename };
}
    await Data.findByIdAndUpdate(id,{...req.body}).then((d)=>{
        if(!d){
            req.flash("error","listing was not found");
            return res.redirect("/home");
        }
        req.flash("success","listing was updated");
        res.redirect(`/view/${id}`);
    });
};
module.exports.delete=async(req,res)=>{
    let {id}=await req.params;
    await Data.findByIdAndDelete(id).then((d)=>{
        if(!d){
            req.flash("error","listing was not found");
            return res.redirect("/home");
        }
        req.flash("success","listing was deleted");
        res.redirect(`/home`);
    })
};
