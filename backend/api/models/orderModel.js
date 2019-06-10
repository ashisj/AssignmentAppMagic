var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema =new Schema({
  user : {type: Schema.Types.ObjectId, ref: 'User'},
  products : {type: Object, required: true},
  name : {type: String, required: true},
  paymentMode : {type: String, required: true},
  address : {type:String, required: true},
  paymentId : {type:String}
})

module.exports = mongoose.model('Order',schema);