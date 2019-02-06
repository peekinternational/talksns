let express = require('express')
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;
const ip = '';

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('new-message', (message) => {
        io.emit('new-message', message);
    });

    socket.on('new-post', (post) => {
        io.emit('new-post', post)
    });

    socket.on('new-like', (like) => {
        io.emit('new-like', like);
    });
});

server.listen(port , () => {
    console.log(`started on port: ${ip} : ${port}`);
});

// const cors = require('cors')

// var corsOptions = {
//   origin: 'cls',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
// }

// app.use(cors(corsOptions))
