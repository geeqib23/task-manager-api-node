const mongoose = require("mongoose")
const validator = require("validator")

const connectionURL = "mongodb+srv://geek23:231002Mas@cluster0.lnlmh.mongodb.net/TaskManagerNode?retryWrites=true&w=majority" //we dont use dataBasename variable in mongoose(specify it in the variable itself)
mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true })

// const task = mongoose.model("task", {
//   //mongoose automatically creates a collection with lowecase and pluralised
//   name: {
//     type: String,
//   },
//   status: {
//     type: Boolean,
//   },
// });

// const dinner = new task({
//   name: "Have dinner",
//   status: 23,
// });

// dinner
//   .save()
//   .then(() => console.log(dinner))
//   .catch((error) => console.log("ERROR!", error));

// module.exports = mongoose;     //wrong
