const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const User = require('../Models/users')

router.post('/signup',(req,res,next)=> {
    User.find({email:req.body.email}).exec()
    .then(user=> {
        if(user.length >=1){
            return res.status(409).json({
                message:"user already exists"
            })
        } else {
            const user = new User( {
                email:req.body.email,
                password:md5(req.body.password)
            })
            user.save().then(result=> {
                res.status(201).json({
                    message:"user saved successfully"
                })
            })
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
});
//user login
router.post('/login',(req,res,next)=> {
    User.find({
        email:req.body.email,
    password:md5(req.body.password)
}).exec()
    .then(user=> {
        if(user.length< 1) {
            return res.status(401).json({
                message:"invalid credentials"
            })
        } else {
           const token =  jwt.sign({
                email:user[0].email,
                userId:user[0]._id
            },'secret',{
                expiresIn:"1h"
            })
         return res.status(200).json({
        message:"logged in successfully",
        token:token
                })
            }
})
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"technical error"
        })
    })
});

router.get('/userdetails',(req,res,next)=> {
    
    User.findOne({email:req.body.email}).exec()
    .then(doc => {
       
        if(doc){
            res.status(200).json({
                message:"user details fetched successfully"
            });
        } else {
            res.status(404).json({
                message:"user is not found"
            })
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            message:"internal error"
        })
    })
})

//delete user 
router.delete('/userdelete',(req,res,next)=> {
    User.findOne({email:req.body.email}).exec()
    .then(user=> {
        if(user.length< 1) {
            return res.status(401).json({
                message:"user is not exist"
            })
        }else {
            User.remove({email:req.body.email}).exec()
    .then(result => {
        res.status(200).json({
            message:"user deleted successfully"
        })
    })
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
          message:"technical error"
        })
    });
});

//update user
router.patch('/userupdate',(req,res,next)=> {
    
    User.findOne({email:req.body.email}).exec()
    .then(user=> {
        if(user.length< 1) {
            return res.status(401).json({
                message:"user is not exist"
            })
        }else {
            User.update({
            password:md5(req.body.password)
        }).exec()
    .then(result => {
        res.status(200).json({
            message:"user updated successfully"
        })
    })
        }
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
          message:"technical error"
        })
    });
});

module.exports = router;


