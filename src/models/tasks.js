const mongoose=require('mongoose')
const taskschema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'//ref full form is reference and ref with the model name 
    }
},{
    timestamps:true
})


const Task=mongoose.model('Task',taskschema)

module.exports=Task