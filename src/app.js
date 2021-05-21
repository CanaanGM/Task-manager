const express = require("express");
require("./db/mongoose")
const app = express();

const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")

var morgan = require('morgan')


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(userRouter);
app.use(taskRouter)




module.exports = app



