const mongoose = require("mongoose")

const Task = mongoose.model("task", {
  //mongoose automatically creates a collection with lowecase and pluralised
  name: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
  },
  owner: {},
})

module.exports = Task
