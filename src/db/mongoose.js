const mongoose=require('mongoose')
mongoose.connect(process.env.mongodburl,{
useNewUrlParser:true,
useUnifiedTopology: true ,
useCreateIndex:true,//will create indices in mongoose database so we can access things easily
useFindAndModify:false
})



