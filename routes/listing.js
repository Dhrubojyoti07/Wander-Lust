const app=require("express");
const router=app.Router();
const Data=require("../models/Listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const flash=require("connect-flash");
const {listingschema,reviewschema}=require("../schema.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const listingcontroller=require("../controller/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
router.get("/home",   
listingcontroller.home
);
router.get("/search/",wrapAsync(
    listingcontroller.search
));
router.get("/category/:category",wrapAsync(
    listingcontroller.category
));
router.get("/mylistings/",isLoggedIn,wrapAsync(
    listingcontroller.mylistings
));
router.get("/new",isLoggedIn,
    listingcontroller.renderCreateForm
);
router.post("/new/create",isLoggedIn,upload.single("listing_image"),validatelisting,wrapAsync( 
    listingcontroller.create
));
router.get("/view/:id",wrapAsync(
    listingcontroller.view
 ));
router.get("/edit/:id",isLoggedIn,isOwner,wrapAsync(
    listingcontroller.renderEditForm
));
router.put("/update/:id",isLoggedIn,isOwner,upload.single("listing_image"),validatelisting,wrapAsync(
    listingcontroller.update
));
router.delete("/delete/:id",isLoggedIn,isOwner,wrapAsync(
    listingcontroller.delete
));
module.exports=router;