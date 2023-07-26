const express = require('express');
let bcrypt = require('bcrypt')
let jwt = require('jsonwebtoken')
let  User = require('../model/userschema');

const userRouter = express.Router();
// User = [{
//   name:"Raja Rai",
//   email:"rajarai@gmail.com",
//   password:"rajarai@gmail.com"

// }]

userRouter.post('/register', (req, res) => {
  let userdata = req.body;
  bcrypt.hash(userdata.password,10).then(encryptPassword=>{
    const user = new User({
      name: userdata.name,
      email: userdata.email,
      password: encryptPassword,
      
    });
  
    user.save()
      .then((record) => {
        res.status(200).json({
          message: 'User data posted successfully',
          data: record,
        });
      })
      .catch((err) => {
        res.status(401).json({
          message: 'Failed to register user',
          err: err,
        });
      });
  }).catch(err=>{
    res.status(500).json("Internal server error")
  })

});


userRouter.post('/login',(req,res)=>{
  let userdata = req.body
 User.findOne({email:userdata.email}).then(user=>{
  if(user){
    bcrypt.compare(userdata.password,user.password).then(authstate=>{
      if(authstate){
        let jwtToken=jwt.sign({
          name:user.name,
          email:user.email,
          id: user._id
          
        },
        "Bond007",
        {expiresIn:'1h'},
       
        )
       
         res.status(200).json({
          message:"Authentication successfull",
          data:jwtToken
        })

      }else{
        res.status(403).json({message:"Authentication failed"})
      }
    }).catch(err=>{
      res.status(500).json("Internal server error")
    })

  }else{
    res.status(404).json({
      status:"Failure",message:"Invalid email or password"
    })
  }
 
 
 }).catch(err=>{
   res.status(500).json({
    status:"Failure",message:"Failed to login"
   })
 })
})

module.exports = userRouter;
