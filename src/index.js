const express = require("express");
const app = express();


app.use(express.json())

require("./db/mongoose")

var morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

const port = process.env.PORT || 3500;


const userRouter = require("../src/routers/user")
app.use(userRouter);

const taskRouter = require("../src/routers/task")
app.use(taskRouter)

app.listen(port, () => console.log(`E'vey metal at port ${port} ヽ(✿ﾟ▽ﾟ)ノ  ~!!`))