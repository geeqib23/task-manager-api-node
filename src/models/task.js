const mongoose = require("mongoose")

const TaskSchema = new mongoose.Schema(
  {
    //mongoose automatically creates a collection with lowecase and pluralised
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
)

const Task = mongoose.model("Task", TaskSchema)

module.exports = Task
