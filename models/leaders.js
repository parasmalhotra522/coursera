let mongoose = require("mongoose");
require('mongoose-currency').loadType(mongoose); //importing the currency type from the mongoose-currency module
const Currency = mongoose.Types.Currency; 

var leaderSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        unique : true,
        minlength :3
    }, 
    image : {
        type : String,
        required : true,
        unique : true          
    },
    designation :{
        type : String,
        required : true
    }, 
    abbr : {
        type : String,
    },
    featured : {
        type : Boolean,
        default : false
    },
    description : {
        type : String,
        required : true
    }
},{timestamps:true});

var Leaders = mongoose.model('Leaders',leaderSchema);
module.exports = Leaders;

