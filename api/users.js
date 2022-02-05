// api/users.js
require("dotenv").config();
const express = require('express');
const usersRouter = express.Router();
const { JWT_SECRET } = process.env
const jwt = require('jsonwebtoken');


usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  next(); // THIS IS DIFFERENT
});

// NEW
const { getAllUsers } = require('../db');

// UPDATE
usersRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.send({
    users
  });
});

const { getUserByUsername } = require('../db');

usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);

    if (user && user.password == password) {
      var token = jwt.sign({ user }, JWT_SECRET);
      // create token & return to user
      res.send({ message: "you're logged in!" , token});

    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

module.exports = usersRouter;