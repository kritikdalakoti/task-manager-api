const express=require('express')
const multer=require('multer')
const User=require('../models/users')
const auth=require('../middleware/authentication')
const { sendwelcomeemail, sendcancelemail } = require('../emails/account')
//const sharp=require('sharp')
const router=new express.Router()
const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {//if(!(file.originalname.endsWith('.jpg')||file.originalname.endsWith('.jpeg')||file.originalname.endsWith('.png'))){
            return cb(new Error('only jpg,jpeg or png file supported!! '))
        }
        cb(undefined,true)
    }
})

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
    
    try{
        await user.save()
        //sendwelcomeemail(user.email,user.name) will use here
        const token=await user.generateauthtoken()
        res.send({user,token})
        
    // res.status(201).send(user)
    } catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login',async(req,res)=>{
    try{
        const user=await User.findbycredentials(req.body.email,req.body.password)
        
        const token=await user.generateauthtoken()

        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return req.token!=token.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutall',auth,async(req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
    
})

router.get('/users/me',auth,async (req,res)=>{
   
   res.send(req.user)//we had already put the particular user info in req.user in authentication file. 
})

router.patch('/users/me',auth,async(req,res)=>{
    // console.log(req.user,req.body)
    const updates= Object.keys(req.body)//would change the objects properties into arrays
    const allowedupdates=['name','email','password','age']
    const isvalidoperation=updates.every((update)=>  allowedupdates.includes(update))

    if(!isvalidoperation){
        return res.status(400).send('error:Invalid operation!!')
    }

    try{

        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})
router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        //sendcancelemail(user.email,user.name)
        res.send(req.user)
    }catch(e){
res.status(500).send(e)
    }
})
router.post('/users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{

    // const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar=req.file.buffer //here we are only able to access the uploaded file data coz we are not saving it locally via dest 
    await req.user.save()
    res.send()
},(error,req,res,next)=>{  //here its imp that for this 2 func we give this 4 parameters which will tell express that this is for error handling
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async (req,res)=>{
    try{
        const user =await User.findById(req.params.id)
        
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','img/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send()
    }
})
module.exports=router