require('dotenv').config({ patth: __dirname + '/.env' });
// require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

// import routes file
const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Information about connected users is lost every time server restarts. Do not use in production!
// For production, use a fast database that stores the connected users, eg Redis - database made for this! Non-relational, simple data
const connectedUsers = {};

// Anotate all logged in users
io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    // Create a relationship between socket.id and connected user (user_id stored in localStorage in frontend)
    connectedUsers[user_id] = socket.id;
});

// Make connectedUsers available to the entire application using express
// app.use() adds a functionality for any route, regardless of request type (GET, POST, PUT or DELETE)
// next = continue
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});


// parameters -> route, function (req, res). Req: gets any parameter sent by user through request;
// Res: response. res.send sends a text
// JSON (javascript object notation): data structure that is interpreted (understood and manipulated) by both frontend and backend 
// req.query -> access query params (for filtering)
// req.params -> access route params (for editing and deletion)
// req.body -> access request body (for creation and editing)

// install module to notify express that post will be in JSON format
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(routes)

// Make application available on localhost
server.listen(3333);
