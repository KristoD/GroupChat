var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
var messages = [];
var socket_id;

app.get('/', function(req, res) {
    res.render('index')
});

var server = app.listen(8000, function() {
    console.log('Server listening on port 8000...')
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
    console.log("Client conntected to the server");
    socket.on('new_user', function(data) {
        socket.broadcast.emit('broadcast_user', {username: data.username});
        socket.emit('previous_messages', {messages: messages});
    });
    socket.on('new_message', function(data) {
        messages.push(data.username + ": " + data.message);
        io.emit('broadcast_message', {response: data.username + ": " + data.message});
    });
    socket.on('disconnected', function(data) {
        socket.broadcast.emit('disconnected_user', {username: data.username});
    })
});