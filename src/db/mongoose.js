const mongoose = require("mongoose")


mongoose.connect(process.env.MANGA_STORE_YUM ,  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
