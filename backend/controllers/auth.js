const User = require('../models/user')
const bcrypt = require('bcryptjs')
//const nodemailer = require('nodemailer')
//const axios = require('axios')
const {validationResult} = require('express-validator') ;

exports.getlogin = (req,res,next)=>{
    let errorMessage = req.flash('error');
    if(errorMessage.length>0)
        {
            errorMessage = errorMessage[0];
        }
        else
        {
            errorMessage = null ;
        }
     res.render('auth/login',{
        pageTitle:'login' ,
        path:'/login',
        loggedIn:req.session.loggedIn,
        error:errorMessage 
     })
}

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        
        req.session.save(err => {
          res.status(401).json({ success: false, message: "Invalid email or password" });
        });
        return ;
      }

     
      bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) {
            
            req.session.save(err => {
              res.status(401).json({ success: false, message: "Invalid email or password" });
            });
            return ;
          }

         
          req.session.loggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            if (err) {
              console.log(err);
              res.status(500).json({ success: false, message: "Session error" });
              return ;
            }

            res.status(200).json({
              success: true,
              message: "Login successful",
              user: {
                id: user._id,
                email: user.email,
              },
            });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    });
};


exports.postlogOut = (req,res,next)=>{
    req.session.destroy((err)=>{
        if(err) {console.log(err) ; res.status(500) ;}
        res.json({success:true}) ;
    })
}

exports.getsignup = (req,res,next)=>{
    let errorMessage = req.flash('error') ;
    if(errorMessage.length>0)
        {
            errorMessage = errorMessage[0] ;
        }
        else
        {
            errorMessage = null ;
        }
    res.render('auth/signup',{
        pageTitle:"Sign Up",
        path:'/signup',
        loggedIn:req.session.loggedIn,
        error : errorMessage
    })
}



exports.postsignup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      error: errors.array()[0].msg,
    });
    return ;
  }

  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      error: "Password doesn't match (Confirmation failed)",
    });
    return ;
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        res.status(400).json({
          success: false,
          error: "Email already exists",
        });
        return ;
      }

      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const newUser = new User({
          email: email,
          password: hashedPassword,
          cart: { items: [] },
        });
        return newUser.save();
      });
    })
    .then((result) => {
      if (result) {
         res.status(201).json({
          success: true,
          message: "Signup successful! Please login.",
        });
        return ;
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    });
};


exports.getAuthStatus = (req, res) => {
  let email = "" ;
  if (req.session && req.session.loggedIn) {
    return res.json({ isLoggedIn: true, user: req.session.user });
  } else {
    return res.json({ isLoggedIn: false });
  }
};





