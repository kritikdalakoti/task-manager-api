const express=require('express')
const router =new express.Router()
const Task=require('../models/tasks')
const auth = require('../middleware/authentication')

router.post('/task',auth,async (req,res)=>{
    const task=new Task({
        ...req.body,//all properties of req.body will go in the object created
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})
//Get tasks?completed=
//Get tasks?limit&skip
//Get/tasks?sortby=createdAt:asc
router.get('/task',auth,async (req,res)=>{

    const match={}
    const sort={}
    if(req.query.completed){
        match.completed=req.query.completed==='true'
    }
    
    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'? -1 :1
    }

    try{
        
        //const task=await Task.find({owner:req.user._id}) can do this
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/task/:id',auth,async (req,res)=>{
    try{
        const _id=req.params.id
        
        const task=await Task.findOne({_id,owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send()
    }
})

router.patch('/task/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const canbeupdated=['description','completed']
    const isvalidoperation=updates.every(update=>canbeupdated.includes(update))
    if(!isvalidoperation){
        return res.status(400).send('error: is not a valid operation!!')
    }
    try{
        const _id=req.params.id
        // const task=await Task.findById(req.params.id)
        const task=await Task.findOne({_id,owner:req.user._id})
        updates.forEach(update=> task[update]=req.body[update])
        await task.save()

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
})
router.delete('/task/:id',auth,async(req,res)=>{
    try{
        const _id=req.params.id
        const task=await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
res.status(500).send(e)
    }

})

module.exports=router