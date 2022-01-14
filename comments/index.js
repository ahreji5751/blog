const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const { randomBytes } = require('crypto');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const postId = req.params.id;
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: 'pending' });

  commentsByPostId[postId] = comments;

  axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated', 
    data: { 
      id: commentId, 
      content, 
      postId, 
      status: 'pending' 
    } 
  });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event: ', req.body.type);

  const { type, data: { postId, id, status, content } } = req.body;

  if (type === 'CommentModerated') {
    const comments = commentsByPostId[postId];
    commentsByPostId[postId] = comments.map(comment => comment.id === id ? { ...comment, status } : comment);

    await axios.post('http://event-bus-srv:4005/events', { type: 'CommentUpdated', data: { id, postId, status, content } });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});