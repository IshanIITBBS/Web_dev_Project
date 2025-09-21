const express = require('express') ;
const authcontroller = require('../controllers/auth')
const logincheck = require('../middleware/logincheck').logincheck ;
const router = express.Router() ;
const {check} = require('express-validator') ;

router.get('/login',authcontroller.getlogin) ;
router.post('/login',authcontroller.postlogin) ;
router.post('/logOut',logincheck,authcontroller.postlogOut) ;
router.get('/signup',authcontroller.getsignup) ;
router.post('/signup',[
                        check('email')
                        .isEmail()
                        .withMessage('Please Enter a valid email')
                        .normalizeEmail()
                    ],
                    authcontroller.postsignup)

router.get("/auth/status", authcontroller.getAuthStatus);
module.exports = router ;