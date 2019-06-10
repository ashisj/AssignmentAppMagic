const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    name  : {type:String,required:true},
    price : {type:Number,required:true}
})

module.exports = mongoose.model('Product',productSchema,'product')