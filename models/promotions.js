let mongoose = require('mongoose');
var Schema = mongoose.Schema;


require('mongoose-currency').loadType(mongoose); //importing the currency type from the mongoose-currency module
const Currency = mongoose.Types.Currency; 

var promotionsSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            minlength : 3
        },
         image : {
            type : String,
            required : true, 
         },
         label : {
             type : String,
             default : '' 
         },
         price : {
             type : Currency,
             required : true,
             min : 0
         },
         featured : {
             type : Boolean,
             default : false 
         },
         description : {
             type : String,
             required : true,
             default : ''
         }
    }, { timestamps : true}
);

var Promotions = mongoose.model('Promotions', promotionsSchema);
module.exports = Promotions;



