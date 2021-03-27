require("./db/mongoose")
const express = require("express")
const UserRouter = require("./routers/UserRouter")
const TaskRouter = require("./routers/TaskRouter")

const app = express()
const port = process.env.port || 3000

app.use(express.json()) //incoming json requests to object
app.use(UserRouter)
app.use(TaskRouter)

app.listen(port, () => {
  console.log("Server running on " + port)
})
