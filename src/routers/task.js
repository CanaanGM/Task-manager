const express = require("express");
const Task = require("../models/task")
const auth = require("../middleware/auth")
const router = express.Router()


router.post("/tasks", auth, async (req,res) => 
    {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        try {
            await task.save()
            res.status(201).send(task)
        } catch (error) {
            res.status(400).send(e)
        }
    })

//! skip -> skips the number of results provided, 
//! limit obviously limits the query size, 
//! completed shows completed depends on the boolean provided,
//! sortBy -> createdAt asc/desc ==>  /tasks?sortBy=createdAt:asc
router.get("/tasks", auth, async (req, res) =>

{
   const match ={};
   const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true';
    }   
    if(req.query.sortBy){
        const parts = req.query.sortBy.split("-")
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit ),
                skip:parseInt(req.query.skip ),
                sort
            }
        }).execPopulate()
        
        res.send(req.user.tasks)
    } catch (e) {
         res.status(500).send("screw u ")
    }
} )






 router.get("/tasks/:id",auth, async (req, res) =>{
    const _id = req.params.id
     try{
       const task =  await Task.findOne({ _id , owner: req.user._id})    
       
        if(!task) return res.status(404).send()

       return res.send(task)
    }catch(e) {
        res.status(500).send({error: e})
    }
    
})
        

// router.put("/tasks/:id", async (req, res) => {
//     let oldTask = await Task.findById(req.params.id).then(task => task)

//     if(oldTask == null || oldTask == {})
//        return  res.status(400).send("task not found")
    
//    return await Task.findByIdAndUpdate(
//         req.params.id,
//         {
//             description: req.body.description != null ? req.body.description : oldTask.description,
//             completed: req.body.completed != null ? req.body.completed : oldTask.completed
//         },
//         {new:true})
//         .then(result => res.send(result))
//         .catch(e => res.status(500).send(e))
// })





//* better way of doing updates
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        
        if (!task) {
            return res.status(404).send()
        }
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/tasks/:id", auth,  async (req, res) => {
    try{

        const task = await Task.findOneAndDelete( {_id:req.params.id , owner:req.user._id})

        if(!task) return  res.status(404).send()

        res.send(task)
    }
    catch(e) {
        res.send(500).send()
    }
})






module.exports = router

