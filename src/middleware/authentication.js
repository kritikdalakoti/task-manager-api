const jwt=require('jsonwebtoken')
const User=require('../models/users')
const auth=async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,process.env.jwtsecret)
        
        const user=await User.findOne({_id:decoded._id,'tokens.token':token})//here we are finding a user having the same id as given and the same value of the token
        
        if(!user){
            throw new Error()
        }
        req.token=token
        req.user=user
        next()

    }catch(e){
        res.status(401).send('please authenticate!!')
    }
}

module.exports=auth













// app.use((req,res,next)=>{
//     if(req.method==='GET'){
//         res.send('get requests are disabled!!')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('the site is under maintainaence ,try again later!!')
// })