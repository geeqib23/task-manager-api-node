const express = require("express")
const User = require("../models/user")
const UserRouter = new express.Router()
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")

UserRouter.post("/users", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

UserRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

UserRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token != req.token)
    req.user.save()
    res.status(200).send()
  } catch (e) {
    res.status(500).send(e)
  }
})

UserRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    req.user.save()
    res.status(200).send()
  } catch (e) {
    res.status(500).send(e)
  }
})

UserRouter.get("/users/me", auth, async (req, res) => {
  try {
    const user = req.user
    res.status(201).send(user)
  } catch (e) {
    res.status(500).send()
  }
})

UserRouter.patch("/users/me", auth, async (req, res) => {
  //findByIdAndUpdate bypasses monggose(performs direct operation on database) into play therefore middleware funtions dont work
  //therefore using findById
  const updateFields = Object.keys(req.body)
  const validFields = ["name", "password", "email", "age"]
  if (updateFields.filter((update) => !validFields.includes(update)).length != 0) {
    res.status(400).send("Invalid update")
  }
  const _id = req.params.id //req params
  try {
    updateFields.forEach((update) => (req.user[update] = req.body[update]))
    await req.user.save()
    res.status(201).send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

UserRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(500).send(e)
  }
})

// User.findById(_id) //we dont have to convert StringID into ObjectID as in native Mongodb(mongoose OP)
//   .then((user) => {
//     if (!user) return res.status(404).send();
//     res.status(201).send(user);
//   })
//   .catch((e) => {
//     res.status(500).send();
//   });

module.exports = UserRouter
