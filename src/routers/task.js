const express = require("express");
const Task = require("../models/task")

const router = express.Router()


//! create task
router.post("/tasks",async (req,res) =>  await new Task({
    description: req.body.description, completed : req.body.completed
    })
    .save()
    .then(result => res.status(200).send(result))
    .catch(e => res.status(400).send(e))
)

//! get all
router.get("/tasks", async (req, res) =>await
 Task.find({})
    .then( result =>result != []? res.send(result) : res.status(404).send("no tasks were found TT-TT"))
    .catch(e => res.status(503).send(e))
 )
//! get one by id
 router.get("/tasks/:id", async (req, res) => await Task.findById(req.params.id)
        .then(result => result ? res.send(result): res.status(404).send("task not found TT-TT") )
        .catch(e => res.send(e))
        )
//! update a task by id
router.put("/tasks/:id", async (req, res) => {
    let oldTask = await Task.findById(req.params.id).then(task => task)

    if(oldTask == null || oldTask == {})
       return  res.status(400).send("task not found")
    
   return await Task.findByIdAndUpdate(
        req.params.id,
        {
            description: req.body.description != null ? req.body.description : oldTask.description,
            completed: req.body.completed != null ? req.body.completed : oldTask.completed
        },
        {new:true})
        .then(result => res.send(result))
        .catch(e => res.status(500).send(e))
})
//! delete task
router.delete("/tasks/:id", async (req, res) => await Task.findByIdAndDelete(req.params.id).then(re => res.send(`deleted the following task ${re.description}`).catch(e => res.send(e))))






module.exports = router

