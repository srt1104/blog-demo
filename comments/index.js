const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require("crypto");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    const { id: postId } = req.params;

    res.send(commentsByPostId[postId] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    const { content } = req.body;
    const { id: postId } = req.params;
    const commentId = randomBytes(4).toString('hex');

    const comments = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content, status: 'pending' });
    commentsByPostId[postId] = comments;

    await axios.post('http://event-bus-srv:4005/events', {
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
    console.log('Received Event', req.body.type);

    const { type, data } = req.body;

    switch (type) {
        case 'CommentModerated': {
            const { id, postId, status, content } = data;
            const comments = commentsByPostId[postId];

            const comment = comments.find((comment) => comment.id === id);

            comment.status = status;

            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id,
                    status,
                    postId,
                    content
                }
            });
            break;
        }
        default: break;
    }

    res.send({});
});

app.listen(4001, () => {
    console.log("Listening on 4001");
});
