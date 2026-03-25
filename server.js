if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const exp=require("express");
const app=exp();
const mongoose=require("mongoose");
const port=6969;
const path=require("path");
const mo=require("method-override");
const ejsmate=require("ejs-mate");
const listingroutes=require("./routes/listing.js");
const reviewroutes=require("./routes/reviews.js");
const userroutes=require("./routes/user.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/User.js");
mongoose.connect(process.env.MONGODB_URL).then(()=>{console.log("mongodb is connected");}).catch((err)=>{console.log(err);});
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(exp.static(path.join(__dirname,"/public")));
app.use(mo("_method"));
app.use(exp.urlencoded({ extended: true }));
app.engine("ejs",ejsmate);
const store= MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    crypto: {
        secret: process.env.SECRET_KEY,
    },
    touchAfter: 24 * 3600,
 }
);
const sessionOptions = {
    store,
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 3600 * 1000),
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.previewurl = null;
    res.locals.search="";
    next();
})
app.use(listingroutes);
app.use(reviewroutes);
app.use(userroutes);
app.use((req, res) => {
    res.status(404).render("error.ejs", { err: { statusCode: 404, message: "Page Not Found" } });
});
app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.render("error.ejs",{err:{statusCode,message}});
});
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});


