const express = require("express")
const Task = require("../models/task")
const TaskRouter = new express.Router()
const auth = require("../middleware/auth")

TaskRouter.post("/tasks", auth, (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  })
  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((e) => {
      res.status(400).send(e)
      // res.status(400);
      // res.send(e);
    })
})
//Filtering tasks?status=true
//Pagination tasks?limit=10&skip=2
//Sorting tasks?sortBy=createdAt_descending
TaskRouter.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.status) {
    match.status = req.query.status === "true" //cute way to convert string to boolean
  }
  if (req.query.sortBy) {
    const arr = req.query.sortBy.split("_")
    sort[arr[0]] = arr[1] == "descending" ? -1 : 1
  }
  try {
    const user = req.user
    // console.log(match)
    await user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
        },
      })
      .execPopulate()
    res.status(201).send(user.tasks)
  } catch (e) {
    res.status(500).send()
  }
})

TaskRouter.get("/tasks/:id", auth, (req, res) => {
  const _id = req.params.id //req params
  Task.findOne({ _id, owner: req.user._id }) //we dont have to convert StringID into ObjectID as in native Mongodb(mongoose OP)
    .then((task) => {
      if (!task) return res.status(404).send()
      res.status(201).send(task)
    })
    .catch((e) => {
      res.status(500).send()
    })
})

TaskRouter.delete("/tasks/:id", auth, (req, res) => {
  const _id = req.params.id //req params
  Task.findOne({ _id, owner: req.user._id }) //we dont have to convert StringID into ObjectID as in native Mongodb(mongoose OP)
    .then((task) => {
      if (!task) return res.status(404).send()
      task.remove() //or use findOneAndDelete
      res.status(200).send(task)
    })
    .catch((e) => {
      res.status(500).send()
    })
})

module.exports = TaskRouter
