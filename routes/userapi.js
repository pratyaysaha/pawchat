const express=require('express')
const router=express.Router()
const bcrypt=require('bcrypt')
const userModel=require('../models/users')
router.use(express.json())
router.post('/signup',async (req,res)=>{
    var hashPassword
    try{
        hashPassword=await bcrypt.hash(req.body.password,10)
    }
    catch(err){
        res.json({status: false, error : err})
    }
    var data=new userModel({
        name : req.body.name,
        username:req.body.username,
        gender:req.body.gender,
        email:req.body.email,
        password:hashPassword,
        isProfilePic:req.body.isProfilePic,
        imgLocation:req.body.imgLocation===undefined?null:req.body.imgLocation,
    })

    console.log(data)
    var result={}
    try{
        const dataStore=await data.save()
        result.status=true
        result.data=dataStore
    }
    catch(err){
        result.status=false
        result.error=err
    }
    res.json(result)
})

router.get('/search/username/:user',async(req,res)=>{
    try{
        const userPresent=await userModel.findOne({'username':req.params.user})
        if(userPresent===null)
            res.json({status : true, isValid: true})
        else
            res.json({status: true, isValid: false})
    }
    catch(err)
    {
        res.json({status:false, error : err})
    }
})
router.post('/login',async(req,res)=>{
    if(req.body.username===undefined || req.body.password===undefined) 
    {
        res.json({status: false, error : 'username or password not recieved'})
    }
    try{
        const userDetails=await userModel.findOne({'username' : req.body.username})
        if(userDetails===null)
        {
            res.json({status: false, error : 'Username not found', code : 101})
        }
        const passCheck= await bcrypt.compare(req.body.password, userDetails.password)
        if(passCheck===true)
        {
            req.session.islogged=true
            req.session.userDetails=userDetails
            console.log(req.session)
            res.json({status: true})
        }
        else
        {
            res.json({status: false, error: "Password not a match", code : 102})
        }
    }
    catch(err){
        res.json({status : false, error: err, code: 100 })
    }
})
router.get('/logout', (req,res)=>{
    delete req.session.userDetails
    req.session.islogged=false
    console.log(req.session)
    res.json({status : true, message : "Successfully Logged out"})
})
router.get('/users',async (req,res)=>{
    try{
        const allUser = await userModel.find()
        res.json({status : true, data: allUser})
    }
    catch(err)
    {
        res.json({status: false, error : err})
    }
})
module.exports=router