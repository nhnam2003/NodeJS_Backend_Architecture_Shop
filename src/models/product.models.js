const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    rating:{
        type:Number,
        default:0,
    },
    image:{
        type:String,
        required:true,
    },
}); 


//Export the model
module.exports = mongoose.model('Product', ProductSchema);