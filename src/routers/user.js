const express = require("express");
const User = require("../models/user")

const router = express.Router()


//* users
//! crate user
router.post("/users", async (req, res)=> {
    return await  new User({name:req.body.name, age: req.body.age, email:req.body.email, password:req.body.password })
    .save()
    .then(result => res.send(result))
    .catch(e => res.status(400).send(e))
});
//! get all users
router.get("/users",async (req, res)=> await 
     User.find({})
        .then(result => result != []? res.send(result) : res.status(404).send())
        .catch(e => res.status(503).send(e))
) 
//! get user by id
router.get("/users/:id", async (req, res)=> User.findById(req.params.id )
        .then(result =>result? res.send(result) : res.status(404).send("user not found TT-TT")).catch(e => res.status(503).send(e)))

//! update single user
router.put("/users/:id", async (req, res) => {
    let oldUser = await
         User.findById(req.params.id).then(re=> re )
            
            if (oldUser == null || oldUser == {})
                return res.status(400).send("user not found ")
           
              return  await User.findByIdAndUpdate(
                    req.params.id,
                    {
                        name: req.body.name != null || req.body.name == "" ? req.body.name : oldUser.name ,
                        age: req.body.age != null ? req.body.age : oldUser.age,
                        email:req.body.email != null ? req.body.email : oldUser.email,
                        password:req.body.password != null ? req.body.password : oldUser.password
                    },
                    {new:true})
                    .then(result=> res.send(result)).catch(e=> res.status(500).send(e))}
    
    )
//! delete user
router.delete("/users/:id", async (req, res) => await User.findByIdAndDelete(req.params.id).then(re => res.send(`deleted the following user ${re.name}`).catch(e => res.send(e))))



module.exports = router