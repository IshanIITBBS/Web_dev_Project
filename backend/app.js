const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Mongoose = require('mongoose') ;
 const session = require('express-session') ;
 const  MongoSessionConnect = require('connect-mongodb-session')
 const csruf = require('csurf')
const { doubleCsrf } = require('csrf-csrf'); 
const flash = require('connect-flash')
const errorController = require('./controllers/error');
 const Product=require('./models/product.js')
 const User = require('./models/user.js')
 const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth.js') ;
const app = express();
const cors = require("cors");
require("dotenv").config();



const FRONTEND_URL = process.env.FRONTEND_URL;

app.use((req,res,next)=>{
  console.log(req.headers.origin) ;
  console.log(FRONTEND_URL) ;
  const csrf = req.headers['CSRF-Token'] ;
  console.log(csrf) ;
  next() ;
})

// Correct CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000", FRONTEND_URL], // Combine all allowed origins here
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

  



const MongoUri = process.env.MONGO_URI ;
const Mongostore = MongoSessionConnect(session);
const store = new Mongostore({
    uri : MongoUri,
    collection:'sessions' 
})


const csrfProtection = csruf() ;





app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.json()); // parses application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store,
}));

app.use(csrfProtection) ;
app.use(flash()) ;


// in app.js (after csurf middleware is applied)
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  //console.log(req) ;
  next();
});


app.get("/get-csrf-token", (req, res) => {
  console.log("CSRF TOKEN GIVEN :- ",req.csrfToken()) ;
  res.json({ csrfToken: req.csrfToken() });
});

app.use((req,res,next)=>{
      if(!req.session.loggedIn)
        {
                next();
                return ;
        }
    User.findById(req.session.user._id)
    .then(user=>{
       req.user = user ;
       next();
    })
    .catch(err=>{
        console.log(err);
    })
})

app.use((req,res,next)=>{
    res.locals.loggedIn = req.session.loggedIn ;
    res.locals.csrfToken = req.csrfToken();
    next() ;
})





app.use('/admin', adminRoutes) ;
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
const PORT = process.env.PORT || 5000; // fallback to 5000 locally

Mongoose.connect(MongoUri)
.then(()=>{
    console.log('connected') ;
    app.listen(PORT) ;
})
.catch(err=>{
    console.log(err) ;
})

