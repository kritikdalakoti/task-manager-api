const express=require('express')
require('./db/mongoose.js')//mongoose connects with database
const userrouter=require('./router/user')
const taskrouter=require('./router/task')
const app=express()


app.use(express.json())//would automatically parse incoming data.
app.use(userrouter)
app.use(taskrouter)

module.exports=app
// const errormiddleware=(req,res,next)=>{
//     throw new Error('from my middleware!!')
// }

// app.post('/upload',errormiddleware,(req,res)=>{//upload.single is a middleware by multer
//     res.send()
// })

