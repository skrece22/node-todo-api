const { ObjectID } = require("mongodb");
const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");
const { User } = require("./../server/models/user");

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({}).then(todo => {
//   console.log(todo);
// });

Todo.findByIdAndRemove("5a55da62dac1e50eb4beaff0").then(todo => {
  console.log(todo);
});