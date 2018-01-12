const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require("./../../models/todo");
const { User } = require("./../../models/user");

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'santhosh@node.com',
    password: 'passOne',
    tokens: [{
        access: 'auth',
        token: jwt
                .sign({ _id: userOneId.toHexString(), access: 'auth' }, "abc123")
                .toString()
    }]
}, {
     _id: userTwoId,
    email: 'email2@node.com',
    password: 'passTwo'
}];

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 6456646
  }
];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
}

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}