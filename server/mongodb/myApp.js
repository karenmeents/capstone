const mongoose=require('mongoose')
const mongo = require('mongodb')
require('dotenv').config()
const {Schema } = mongoose;

console.log(process.env.MONGO_URI)
mongoose.connect("mongodb://127.0.0.1:27017/Customers", { useNewUrlParser: true, useUnifiedTopology: true }); 


var CustomerSchema = new Schema({
    date:String,
    firstname:String,
    lastname: String,
    username:String,
    email:String,
    address:String,
    city:String,
    state:String,
    zip:String,
    phone:String,
    cc:String,
    cctype:String,
    exp:String,
    recFirstname:String,
    recLastname:String,
    recAddress:String,
    recCity:String,
    recState:String,
    recZip:String,
    recPhone:String,
    card:[Object],
    newsletter:Boolean,
    password:String, 
    amt:String,
    order:[Object],
    comments:[Object],
    deldate:String
  });

  var CustomerModel = new mongoose.model('Customer', CustomerSchema);


module.exports=CustomerModel