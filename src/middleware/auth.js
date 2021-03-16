const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "")
    const decoded = jwt.verify(token, "secretcode")
    const user = await User.findOne({ _id: decoded._id, "tokens.token": token }) //doubt in tokens.token

    if (!user) {
      throw new Error("not found")
    }

    req.token = token
    req.user = user
    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate.", e })
  }
}

module.exports = auth
