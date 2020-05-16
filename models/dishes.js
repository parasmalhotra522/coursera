//*// in this we are going to declare the schema 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose); //importing the currency type from the mongoose-currency module
const Currency = mongoose.Types.Currency; 

const commentSchema = new Schema({
    rating : {
        type : Number,
        min : 1,
        max : 5,
        required : true
    },
    comment : {
        type : String,
        required : true
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,  // if we are using the objectId like this we can easily relate the things or the fields to the other fields of the documents
        ref : 'Users' // using this we aare referring to the user schema  
        
    }
},
{
    timestamps : true
}
);

const dishSchema = new Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    description : {
        type : String,
        required : true 
    }, 
    label : {
        type : String,
        default : ''
    },
    price : {
        type : Currency,
        min : 0,
        required : true 
    },
    category : {
        type : String,
        required: true
    },
    featured : {
        type : Boolean,
        default : false
    },
    comments : [commentSchema] // we can even assign one schema to the other variable
}, {
        timestamps : true 
     // logging timestamps as true it will add the paarameters like added at 5:10 pm etc 
});
var Dishes = mongoose.model('Dish',dishSchema); // creating  a model
module.exports = Dishes;









