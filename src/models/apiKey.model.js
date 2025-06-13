'use strict'

const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        default:false,
    },
    permissions:{
        type:[String],
        required:true,
        enum:['0000','1111','2222']
    }
},{
    timestamps: true,
    collection: 'ApiKey'
}); 

//Export the model
module.exports = mongoose.model('ApiKey', apiKeySchema);