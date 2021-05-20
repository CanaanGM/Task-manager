const express = require("express");
const User = require("../models/user")
const router = express.Router()

const auth = require("../middleware/auth")



router.post("/users/login", async (req, res ) => {

    try {
        const user = await User.finByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.send({user:user, token})
    } catch (e) {
        res.status(400).send()
    }

})


router.post("/users", async (req, res)=> {
    const user =   new User(
         {
             name:req.body.name,
             age: req.body.age,
             email:req.body.email,
             password:req.body.password
         }
     )
    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
       
    }
    catch(e){
        res.status(400).send()
    }
            
});



router.get("/users/me",auth ,async (req, res)=>   res.send(req.user)
) 

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
        
    }
})
router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        }) 
        
        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }

})

 //! doesn't send the error in relating to the password being weak unlike the PATCH operation ...
router.put("/users/me", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    
    if (!isValidOperation) 
        return res.status(400).send({ error: 'Invalid updates!' })

    try {
        // old()r
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        e=> res.status(500).send(e)
    }
    
})

    router.patch('/users/me', auth, async (req, res) => {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password', 'age']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' })
        }
    
        try {

            updates.forEach((update) => req.user[update] = req.body[update])

            await req.user.save()
            res.send(req.user)
        } catch (e) {
            res.status(400).send(e)
        }
    })

router.delete("/users/me", auth, async (req, res) =>{
    try{

        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        res.status(500).send("something went wrong")
    }
} )

// function old(){ //* for future reference 
        //     let oldUser = await
        //  User.findById(req.params.id).then(re=> re )
            
        //     if (oldUser == null || oldUser == {})
        //         return res.status(400).send("user not found ")
           
        //       return  await User.findByIdAndUpdate(
        //             req.params.id,
        //           req.body,
        //             {new:true})
        //             .then(result=> res.send(result))
// }

module.exports = router