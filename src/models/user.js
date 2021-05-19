const mongoose = require("mongoose")
const validator = require("validator")



 const User = mongoose.model("User", {

    name:{
        type: String,
        required: true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate(val){
            if (!validator.isEmail(val)) throw new Error("Enter a valid email")
        }
        ,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(val){
            if(val.includes("password")) throw new Error("password shouldn't be password u dumbass~!")
            if(validator.isStrongPassword(val, {minLength: 4, returnScore:true}) < 20)
             throw new Error(`too weak ! ${validator.isStrongPassword(val, {minLength: 4, returnScore:true})}`)

        }
    },
    age:{
        type:Number
    }
})

module.exports = User