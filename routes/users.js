var express = require('express');
var bodyParser = require('body-parser');
var Users = require('../models/user');
var passport = require('passport');
var router = express.Router();
router.use(bodyParser.json());
var authenticate = require('../authenticate');

/* GET users listing.
  It will respond for the /users page
*/
;

router.get('/',authenticate.verifyUser,authenticate.verifyAdmin,function(req, resp, next) {
  Users.find({})
  .then((users)=>{
    //resp.statusCode=200;
   // resp.setHeader('Content-type','text/html');
    console.log({usersArray:users});
    resp.render('users.ejs', {usersArray:users});
  } ,(err)=>next(err))
  .catch((err)=>next(err))
});
  
  //, function(err, users){
 /*   if(err){
      return done(err);
    }
    if(users){
      resp.render('users.ejs', { usersArray:users });
      console.log(usersArray);
    }
  })
  //res.send('respond with a resource');

});*/

// going to create signup for the user
router.post('/signup',function(req,resp,next){

  // we will search for the username in the database if found then return err if not then create new user
  Users.register(new Users({username : req.body.username}), 
  req.body.password, 
  function(err, user) {
    if(err) {
      resp.statusCode = 500;
      resp.setHeader('Content-Type', 'application/json');
      resp.json({err:err});
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
      
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      
      user.save((err,user) => {
        if (err) {
          resp.statusCode = 500;
          resp.setHeader('Content-Type', 'application/json');
          resp.json({err:err});
          return ;          
        }
        else{  
        passport.authenticate('local')(req,resp,()=>{
        resp.statusCode = 200;
        resp.setHeader('Content-Type','application/json');
        resp.json({success:true, status:"Registration Successful"}); 
        });
      
      }
    });
      
      }
    })
  });
  


router.post('/login', passport.authenticate('local'), function(req, resp, next){
  
  var token = authenticate.getToken({_id : req.user._id});// we can add many other fields but it will increase the size 
  resp.statusCode = 200;
  resp.setHeader('Content-Type','application/json');
  // sending a token back to the client where the client will extract the token fom the repsonse body
  resp.json({success : true, token : token, status : "You are successfully !! logged in"});

});

router.get('/logout', function(req, resp, next){
  req.logout();
  resp.status(200).json({
    status: 'Bye!'
  });
  /*if(req.session){
    req.session.destroy();
    resp.clearCookie('session-id');// clearing cookie named
    resp.redirect('/');
  }
  else{
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }*/
});

module.exports = router;
