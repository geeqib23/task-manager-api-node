const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) throw new Error("Age cant be negative")
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("invalid email")
    },
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (value.length < 6 || value.search("password") > -1) throw new Error("Invalid passsword")
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
})
UserSchema.pre("save", async function (next) {
  //middleware to hash password if its updated
  //dont use arrow function doesnt bind this
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8)
  }

  next() //called to tell that work's done
})

UserSchema.statics.findByCredentials = async (email, password) => {
  //method on the User model
  const user = await User.findOne({ email })

  if (!user) throw new Error("invalid email")

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) throw new error("incorrect password")

  return user
}

UserSchema.methods.generateAuthToken = async function () {
  //method on a user
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, "secretcode")
  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

UserSchema.methods.toJSON = function () {
  //JSON.stringify(which is called by res.send({}) ) looks for .toJSON
  const user = this
  userObject = user.toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

const User = mongoose.model("user", UserSchema)

module.exports = User
