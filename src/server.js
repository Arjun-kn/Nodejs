let express = require('express')
let post = require('./Router/post')
let user = require('./Router/user')
let bodyparser = require('body-parser')
let mongoose = require('mongoose')
let app = express()

app.use(bodyparser.json())

mongoose.connect('mongodb://127.0.0.1:27017/database').then((data)=>{
    console.log('Db connected')
}).catch(err=>{
    console.log(err)
    
});

app.use('/user', user)
app.use('/user', post)

app.listen(6000,(req,res)=>{
    console.log("server is listening at port no 6000")
})
// app.use('/post',post)

module.exports = app