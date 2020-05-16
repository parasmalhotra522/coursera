var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./models/user');

var jwtStrategy = require('passport-jwt').Strategy;
var extractJwt = require('passport-jwt').ExtractJwt;  
var jwt = require('jsonwebtoken');
var config = require('./config');

// as we want to use sessions for authentication so 
// we need to use serialize and deserialize the data
exports.local = passport.use(new LocalStrategy(Users.authenticate()));
passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());

// we are signing and issuing a token
exports.getToken = function(user){
    return jwt.sign(user, config.secretkey, 
        {expiresIn : 3600});
};

var opts = {};
opts.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken(); // this is the field where we will extract jwt and decide from which part it 
// will be extracted as it has a lot of features like extracting from head, body etc
opts.secretOrKey = config.secretkey;

// done is a callback function inside jwt passports
exports.jwtPassport = passport.use(new jwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        Users.findOne({_id : jwt_payload._id}, (err, user)=>{
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null,user);
            }
            else {
                return done (null, false);
            }
        } )
    }) );

exports.verifyUser = passport.authenticate('jwt',{session:false});

exports.verifyAdmin = function(req, resp, next){
    if ( req.user.admin == true ){
       // resp.statusCode = 200;
       // resp.statusCode = 200;
        resp.statusMessage = "Admin....";
       // resp.setHeader('Content-Type','application/json');
       // resp.json(req.user);
       return next();
        
    }else{
        var err = new Error("You are not authorized to perform this Operation!!")
        err.status = 403;
        resp.write("403 Unauthorized");
       return (err) => next(err);
    }

}

