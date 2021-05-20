const express = require("express");
require("./db/mongoose")
const app = express();

const userRouter = require("../src/routers/user")
const taskRouter = require("../src/routers/task")

const port = process.env.PORT || 3500;
var morgan = require('morgan')


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(userRouter);
app.use(taskRouter)


app.listen(port, () => console.log(`E'vey metal at port ${port} ヽ(✿ﾟ▽ﾟ)ノ  ~!!`))





