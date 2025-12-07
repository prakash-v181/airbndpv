const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Load .env only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

// MongoDB connection
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// View engine and middlewares
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// Session store in Mongo
const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: "sessions",
  touchAfter: 24 * 3600, // 1 day
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + current user
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ✅ HOME ROUTE – fancy landing
app.get("/", (req, res) => {
  res.render("home");
});

// Routers
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// Port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate");
// const ExpressError = require("./utils/ExpressError.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo');
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");






// // if(process.env.NODE_ENV != "producation"){
// //   require("dotenv").config();
// // }

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }




// console.log(process.env.SECRET);



// const listingRouter = require("./routes/listing.js");
// const reviewRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");





// const dbUrl = process.env.ATLASDB_URL;

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(dbUrl);
// }

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride("_method"));
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));


// const store = MongoStore.create({
//   mongoUrl: dbUrl,
//   collectionName: "sessions",         // optional, but nice to name it
//   touchAfter: 24 * 3600,              // same as before (1 day)
// });

// store.on("error", (err) => {
//   console.log("ERROR in MONGO SESSION STORE", err);
// });


// // const store = MongoStore.create({
// //   mongoUrl: dbUrl,
// //   crypto: {
// //     secret: process.env.SECRET,
// //   },
// //   touchAfter: 24 * 3600,
// // });

// // store.on("error", () => {
// //   console.log("ERROR is MONGO SESSION STORE", err);
// // });


// const sessionOptions = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     httpOnly: true,
//   },
// };



// // const sessionOptions = {
// //   store,
// //   secret: process.env.SECRET,
// //   resave: false,
// //   saveUninitialized: true,
// //   cookie: {
// //     expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
// //     maxAge: 7 * 24 * 60 * 60 * 1000,
// //     httpOnly: true,
// //   },
// // };

// // app.get("/", (req, res) => {
// //   res.send("Hi, I am root");
// // });



// app.use(session(sessionOptions));
// app.use(flash());

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });




// app.use("/listings", listingRouter);
// app.use("/listings/:id/reviews", reviewRouter);
// app.use("/", userRouter);

// app.set("*", (req, res, next) =>  {
//   next(new ExpressError(404, "Page Not found!"));
// });

// app.use((err, req, res, next) =>{
//   let { statusCode=500, message = "something went wrong!" } = err;
//   res.status(statusCode).render("error.ejs", { message });
//   // res.status(statusCode).send(message);
// });

// // app.listen(8080, () => {
// //   console.log("server is listening to port 8080");
// // });

// const port = process.env.PORT || 8080;

// app.listen(port, () => {
//   console.log(`server is listening on port ${port}`);
// });


