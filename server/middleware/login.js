const _ = require('lodash');

const { User } = require("./../models/user");

const login = (req, res, next) => {
  var body = _.pick(req.body, ["email", "password"]);
  User.findByCredentials(body.email, body.password)
    .then(user => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      next();
    })
    .catch(e => {
      res.status(400).send();
    });
};

module.exports = { login };
