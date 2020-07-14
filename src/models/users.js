const validator=require('validator')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const Task=require('./tasks')
 const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:true,
        validate(value) {
            if(value<0){
                throw new Error('age cant be negative!!')
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valid!!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('password should not be there!!')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
 },{
     timestamps:true
 })

 userschema.virtual('tasks',{
     ref:'Task',
     localField:'_id',
     foreignField:'owner'
 })

 userschema.methods.toJSON=function() {
    const user=this
    const userobject=user.toObject()
    delete userobject.password
    delete userobject.tokens
    delete userobject.avatar
    return userobject
 }
 //
userschema.methods.generateauthtoken=async function(){  //method function works on instances of a model such as a particular type of user so here we have access to this
    const user=this

    const token=jwt.sign({_id:user._id.toString()},process.env.jwtsecret)
    user.tokens=user.tokens.concat({token})
    await user.save()

    return token
}

//hash the password before saving
userschema.pre('save',async function(next){
    const user=this//this gives us access to the user which is just being saved
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)//this would hash the modified password and 8 is the no of rounds
    }

    next()
})

//find by credentials
userschema.statics.findbycredentials=async (email,password)=>{//statics->accessible to models only not a particular user
    const user=await User.findOne({email})

    if(!user){
        throw new Error ('unable to login!!') 
    }

    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error  ('Unable to login!!')
    }

    return(user)
}
//delete user tasks when user is deleted
userschema.pre('remove',async function(next){
    const user=this
    await Task.deleteMany({owner:user._id})
    next()
})

const User=mongoose.model('User',userschema)

module.exports=User