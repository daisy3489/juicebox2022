
const express = require('express');
const postsRouter = express.Router();

const { requireUser } = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
  res.send({ message: 'under construction' });
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next(); // THIS IS DIFFERENT
});

// NEW
const { getAllPosts } = require('../db');

postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    // add authorId, title, content to postData object

    // const post = await createPost(postData);
    // this will create the post and the tags for us
    const posts = await createPost(postData);
    // if the post comes back, res.send({ post });
    // otherwise, next an appropriate error object 
    if (posts) {
      res.send({
        posts
      });
    }else {
      next({});
    }
    
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = postsRouter;