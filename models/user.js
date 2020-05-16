var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocal = require('passport-local-mongoose');

/*  We are working on the authentication using passport-local-mongoose which provides authentication using very
    simple ways and thus helping us to login and create a user to the database it will not save the password as string
    but will store a password as a hash value in which we have the salt, which will uniquely used for encrypting the password
    the password once entered is encrypted and those 2 are matched for the similarity.
 */

 // we dont define username and password field as it is provided by passport-local-mongoose
var user_schema = new Schema({
   
    firstName : {
        type : String,
        default : ''
    },
    lastName : {
        type : String,
        default : ''
    },
    admin : {
        type : Boolean,
        default : false
    }
});

user_schema.plugin(passportLocal);
module.exports = mongoose.model('Users', user_schema);