const mongoose = require('mongoose')

let userschema = new mongoose.Schema({
    name:String,
    email:{type:String,unique:true,required:true},
    password:String
})

const usermodel= mongoose.model('User',userschema)
module.exports = usermodel