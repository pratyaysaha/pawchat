const express=require('express')
const router=express.Router()
const imageRoute=require('../routes/imageupload')
const userRouter=require('../routes/userapi')
router.use('/image',imageRoute)
router.use('/user',userRouter)

module.exports=router