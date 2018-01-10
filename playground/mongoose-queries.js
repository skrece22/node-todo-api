const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
// const id = '5a555a76aafbce06bcd3369199';


// if(!ObjectID.isValid(id)) {
//     console.log('Id not valid')
// }
  // Todo.find({
  //   _id: id
  // }).then((todos) => {
  //   console.log("Todos", todos);
  // });

  // Todo.findOne({
  //   _id: id
  // }).then((todo) => {
  //   console.log("Todo", todo);
  // });

//   Todo.findById(id)
//     .then(todo => {
//       if (!todo) {
//         return console.log("Id not found");
//       }
//       console.log("Todo by ID", todo);
//     })
//     .catch(e => console.log(e));

const id = "5a54d42a0a25540c9ccf9bec";

  User.findById(id)
    .then((user) => {
      if (!user) {
        return console.log("Id not found");
      }
      console.log("User by ID", JSON.stringify(user, undefined, 2));
    })
    .catch(e => console.log(e));
