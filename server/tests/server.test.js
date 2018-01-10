const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require('mongodb');

const { app } = require("./../server");
const { Todo } = require("./../models/todo");

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo"
  }
];

beforeEach((done) => {
    Todo.remove({}).then(() =>{
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    const text = "Test todo text";

    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res) =>{
          expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
            return done(err);
        }
        Todo.find().then((todos) => {
            expect(todos.length).toBe(3);
            expect(todos[2].text).toBe(text);
            done();
        }).catch((e) => done(e));
      });
  });

  it("should not create a new todo with invaild", (done) => {
    request(app)
      .post("/todos")
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
    it("should get all todos", (done) => {
        request(app)
         .get('/todos')
         .expect(200)
         .expect((res) => {
             expect(res.body.todos.length).toBe(2);
         })
         .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
          .get(`/todos/${todos[0]._id.toHexString()}`)
          .expect(200)
          .expect(res => {
            expect(res.body.todo).toInclude(todos[0]);
          })
          .end(done);
    });
    it('should return 404 if todo not found', (done) => {
        const id = new ObjectID().toHexString();
        request(app)
          .get(`/todos/${id}`)
          .expect(404)
          .end(done);
    });

    it('should return 404 for non object id', (done) => {
        request(app)
          .get(`/todos/4655fuy`)
          .expect(404)
          .end(done);
    });
});

describe("DELETE /todos/:id", () => {
  it("should remove a todo", done => {
    const hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        });
        
      });  
  });
  it("should return 404 if todo not found", done => {
    const id = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${id}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for object id incalid", done => {
    request(app)
      .delete(`/todos/4655fuy`)
      .expect(404)
      .end(done);
  });
});