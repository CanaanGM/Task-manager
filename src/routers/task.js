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





router.get("/tasks", async (req, res) =>await
 Task.find({})
    .then( result =>result != []? res.send(result) : res.status(404).send("no tasks were found TT-TT"))
    .catch(e => res.status(503).send(e))
 )






 router.get("/tasks/:id", async (req, res) => await Task.findById(req.params.id)
        .then(result => result ? res.send(result): res.status(404).send("task not found TT-TT") )
        .catch(e => res.send(e))
        )





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





//* better way of doing updates
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const task = await Task.findById(req.params.id)

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/tasks/:id", async (req, res) => await Task.findByIdAndDelete(req.params.id).then(re => res.send(`deleted the following task ${re.description}`).catch(e => res.send(e))))






module.exports = router

