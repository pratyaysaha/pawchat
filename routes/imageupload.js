const express=require('express')
const multer=require('multer')
const aws=require('aws-sdk')
const { v4: uuidv4 } = require('uuid');
require('dotenv/config')
const router=express.Router()

const storage = multer.memoryStorage({  
    destination: function(req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')    

const S3= new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
})

router.post('/upload',upload,(req,res)=>{
    console.log(req.file)
    const filename= req.file.originalname.split('.')
    const filetype=filename[filename.length-1]
    const params={
        Bucket : process.env.AWS_BUCKET,
        Key : `${uuidv4()}.png`,
        Body : req.file.buffer,
        ACL: 'public-read'
    }
    S3.upload(params,(error, data)=> { 
        if(error)
            res.status(500).json({status : false, error : error})
        res.status(200).json({status : true, data})
    })
})

router.post('/testupload',upload,(req,res)=>{
    console.log(req.file)
    console.log(req.body)
})
module.exports=router