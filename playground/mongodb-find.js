// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  const db = client.db("TodoApp");
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // db
  //   .collection("Users")
  //   .find({
  //       age: 22
  //    })
  //   .toArray()
  //   .then(
  //     docs => {
  //       console.log("Todos");
  //       console.log(JSON.stringify(docs, undefined, 2));
  //     },
  //     err => {}
  //   );

  //   db
  //     .collection("Todos")
  //     .find()
  //     .count()
  //     .then(
  //       (count) => {
  //         console.log(`Todos count: ${count}`);
  //       },
  //       err => {}
  //     );

  client.close();
});
