const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    switch (type) {
        case 'CommentCreated': {
            const { id, postId, content } = data;

            const status = content.includes('orange') ? 'rejected' : 'approved';

            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: id,
                    postId: postId,
                    status,
                    content: content
                }
            });
            break;
        }
        default: break;
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});
