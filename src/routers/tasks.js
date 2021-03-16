const express = require("express");
const Task = require("../models/task");
const TaskRouter = new express.Router();

TaskRouter.get("/tasks", (req, res) => {
  Task.find({})
    .then((tasks) => {
      //method on Model
      res.status(201).send(tasks);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

TaskRouter.get("/tasks/:id", (req, res) => {
  const _id = req.params.id; //req params
  Task.findById(_id) //we dont have to convert StringID into ObjectID as in native Mongodb(mongoose OP)
    .then((task) => {
      if (!task) return res.status(404).send();
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

TaskRouter.post("/tasks", (req, res) => {
  const task = new Task(req.body);
  task
    .save()
    .then(() => res.status(201).send(task))
    .catch((e) => {
      res.status(400).send(e);
      // res.status(400);
      // res.send(e);
    });
});

module.exports = TaskRouter;
