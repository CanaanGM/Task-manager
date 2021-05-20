const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Task = require("./task")


const userSchema = new mongoose.Schema({

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
        lowercase:true,
        unique: true
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
    },
    tokens: [{
        token:{
            type:String,
            required: true
        }
    }]
})

userSchema.pre('save',async function (next) {
    const user = this;
    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({owner: user._id})
    next();
})


userSchema.statics.finByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) throw new Error("user doesn't exist ...");

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error("unable to login ...");

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user.id.toString(), email:user.email}, "tigerMafia!")
    user.tokens = user.tokens.concat({token})
    await user.save()

    return token;
}

userSchema.methods.toJSON =  function () {
    const user = this

    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.__v
    delete userObject._id

    return userObject
}

const User = mongoose.model("User",userSchema )

module.exports = User