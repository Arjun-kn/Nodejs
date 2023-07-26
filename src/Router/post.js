let express = require('express')
let jwt = require('jsonwebtoken')
let authenticateUser = require('../middleware/middle')

let Post = require('../model/postschema')
let app = express.Router()

let posts = [{
    title:"This is Raja Rai",
     body: "Do whatever you like", 
     image:"https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"
     

}]



app.get('/post', authenticateUser, (req, res) => {
//   let data = req.body
//     let userID = req.query.id
//      let filter = {}
   
    jwt.verify(req.userId,"Bond007",(err,auth)=>{
      if(err){
         res.status(404).json({Message:"Invalid token"})
      }else{
         Post.find({user:auth.id}).then(record=>{
            res.status(200).json({status:"Success", message:"Post data fetch successfully",
                         data:record })
         }).catch(err=>{
            res.status(500).json({ message: 'Failed to fetch posts' })
    
    })}

     
     })
   });

     app.post('/post',authenticateUser,(req,res)=>{
        
      jwt.verify(req.userId,"Bond007",(err,auth)=>{
         if(err){
            res.status(404).json({errdesc:"Authentication Failed"})
         }else{
            const post = new Post({
               title:req.body.title,
               body:req.body.body,
               image:req.body.image,
               user:auth.id
            })
      
      
            post.save()
            .then(result=>{
               res.status(201).json({status:"Success",Message:"Post crated successfully",data:result})
            }).catch(err=>{
              res.status(404).json({status:"Failed",Message:"Failed to post data",err})
            })
         }

      })
       
     })

      app.put('/post/:id',authenticateUser,(req,res)=>{
         jwt.verify(req.userId,"Bond007",(err,auth)=>{
            if(err){
               res.status(404).json({errdesc:"Authentication Failed"})
            }else{
              
               let updateContent = req.body
               Post.findOneAndUpdate({_id:req.params.id,user:auth.id},updateContent).then(response=>{
                  res.status(201).json({status:"success",Message:"Post update successfully",response})
                  .catch(err=>{
                     res.status(404).json({errdesc:"Failed to update the post"})
                  })
               })
               }})
         
      })


      app.delete('/post/:id',authenticateUser, (req,res)=>{
         jwt.verify(req.userId,"Bond007",(err,auth)=>{
            if(err){
               res.status(404).json({errdesc:"Authentication Failed"})
            }else{
               Post.findOneAndDelete({_id:req.params.id,user:auth.id}).then(response=>{
                  if(response.deletedCount!=0){
                     res.status(201).json({Message:"Post Deleted successfully"})
                  }else{
                     res.status(404).json({errDesc:"Failed to delete"})
                  }
               }).catch(err=>{
                  res.status(500).json({message:"Internal server issue"})
               })
            }
         
         })


         
      })




module.exports = app

  
    
   



