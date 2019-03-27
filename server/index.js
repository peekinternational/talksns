let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;
const ip = '';

io.on('connection', (socket) => {
    socket.on('new-post', (post) => {
        io.emit('new-post', post)
    });

    socket.on('add-friend', (friendrequest) => {
        io.emit('addfriend', friendrequest);
    });

    socket.on('set-likes',(like) => {
        io.emit('set-likes', like);
    });

    socket.on('set-comments',(like) => {
        io.emit('set-comments', like);
    });

    socket.on('set-replies',(like) => {
        io.emit('set-replies', like);
    });
});

server.listen(port , () => {
    console.log(`started on port: ${ip} : ${port}`);
});
