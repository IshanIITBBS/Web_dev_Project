exports.logincheck = (req, res, next) => {
   // console.log(res.session.loggedIn)
    //return res.status(401).json({ message: "Not logged in" }); 
    //console.log("hehe") ;
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: "Not logged in" }); 
  }
  next();
};