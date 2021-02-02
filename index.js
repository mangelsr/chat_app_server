const express = require('express');
const path = require('path');
require('dotenv').config();

// DB Config
const { dbConnection } = require('./db/config');
dbConnection();

const app = express();


// Body read & parsing
app.use(express.json());

// Node Server
const server = require('http').createServer(app);
module.exports.io = require('socket.io')(server);

const serverPort = process.env.PORT;

// Public Path
const publicPath = path.resolve(__dirname, 'public');
app.use(express.static(publicPath));

// Backend Routes
app.use('/api/auth', require('./routes/auth'));


server.listen(serverPort, (err) => {
    if (err) throw new Error(err);
    console.log(`Server running on port ${serverPort}`);
});