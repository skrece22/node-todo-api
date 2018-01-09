// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  const db = client.db("TodoApp");
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  //deleteMany

  //   db.collection('Todos').deleteMany({ text: 'Eating Lunch'}).then((result) => {
  //       console.log(result);
  //   });

  //deleteOne
  //   db.collection('Todos').deleteOne({ text: 'Something today'}).then((result) => {
  //       console.log(result);
  //   });

  //findAndDeleteOne
  //   db.collection('Todos').findOneAndDelete({ completed: false}).then((result) => {
  //       console.log(result);
  //   });

  //Users

  //deleteMany

//   db
//     .collection("Users")
//     .deleteMany({ name: "Kumar" })
//     .then(result => {
//       console.log(result);
//     });

  //findAndDeleteOne

//   db
//     .collection("Users")
//     .findOneAndDelete({ _id: ObjectID('5a54624fa0dbd404686b345c') })
//     .then(result => {
//       console.log(result);
//     });

  client.close();
});
