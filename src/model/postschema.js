let mongoose = require('mongoose')
const postschema = new mongoose.Schema({
    title:String,
    body:String,
    image:String,
    user:{type: mongoose.Schema.Types.ObjectId,ref:'User'}
})

const postmodel = mongoose.model('Post',postschema);

module.exports = postmodel