const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require('mongodb');

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
const { User } = require("./../models/user");
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe("PATCH /todos/:id",() => {
  it('should update the todo',(done) => {
    const id = todos[0]._id.toHexString();
    const text = "first todo completed";
    const completed =true;
    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it('should clear completedAt when tod is not completed',(done) => {
    const id = todos[1]._id.toHexString();
    const text = "Second todo incomplete";
    const completed = false;

    request(app)
      .patch(`/todos/${id}`)
      .send({ text, completed })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done); 
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get("/users/me")
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it("should return a 401 if not authenticated", done => {
    request(app)
      .get("/users/me")
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe("POST /users", () => {
  it("should create a user", (done) => {
    const email = 'exampgle1@dggd.com';
    const password = '123mhhns';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((e) => done(e)); 
      });
  });

  it("should return a validation error if request invalid", (done) => {
    const email = "exampleggd.com";
    const password = "123mn";

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);

  }); 

  it("should not create user if request email in use", (done) => {
    const password = "123msn";

    request(app)
      .post('/users')
      .send({email:users[0].email, password})
      .expect(400)
      .end(done);
    }); 
});

describe("POST /users/login", () => {
  it('should login user and return auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({ email:users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[0]).toInclude({
            access: "auth",
            token: res.headers["x-auth"]
          });
          done();
        }).catch((e) => done(e)); 
      });
  });

  it("should reject invalid login", (done) => {
    request(app)
      .post('/users/login')
      .send({ email:users[1].email, password: users[1].password+"6"})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e)); 
      });
  });
});

describe("DELETE /users/me/token",()=>{
  it("should remove auth token on logout", (done) => {
    request(app)
      .delete("/users/me/token")
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e)); 
      });
  });
});