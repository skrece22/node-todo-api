// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require("mongodb");

MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  const db = client.db("TodoApp");
  if (err) {
    return console.log("Unable to connect to MongoDB server");
  }
  console.log("Connected to MongoDB server");

  // db
  //   .collection("Todos")
  //   .findOneAndUpdate(
  //     {
  //       _id: ObjectID("5a549ea613a51d05f419a8d8")
  //     },
  //     {
  //       $set: {
  //         completed: true
  //       }
  //     },
  //     {
  //       returnOriginal: false
  //     }
  //   )
  //   .then((result) => {
  //     console.log(result);
  //   }, (err) => {
  //     if (err) {
  //      console.log('Unable to update');
  //     }
  //   });

  db
    .collection("Users")
    .findOneAndUpdate({ 
      _id: ObjectID("5a546260fb18611b9cbbc3fd") 
    }, { 
      $set: { 
        name: 'Santhosh Kumar' 
      },
      $inc:{
        age: 1
      } 
    }, { 
      returnOriginal: false 
    })
    .then(result => {
        console.log(result);
      }, err => {
        if (err) {
          console.log("Unable to update");
        }
      });
    

  client.close();
});
