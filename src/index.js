const app=require('./app')

const port=process.env.PORT

app.listen(port,()=>{
    console.log('server is up at '+ port)
})

// const errormiddleware=(req,res,next)=>{
//     throw new Error('from my middleware!!')
// }

// app.post('/upload',errormiddleware,(req,res)=>{//upload.single is a middleware by multer
//     res.send()
// })

