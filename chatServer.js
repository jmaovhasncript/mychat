var express = require('express'); // got express

var app = express(); // created instance for express
var http = require('http').Server(app);// create http server and pass express as parameter
var io = require('socket.io')(http);// create socket io and upgrade http to socket connection
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket){
	console.log("one user conected");
	socket.on('userName' ,function(name){
		console.log(name);
		socket.name = name;
		socket.broadcast.emit("userName",name);
	});

	socket.on('chatMessage',function(msg){
		console.log(socket.name +" : "+ msg );
		var chatObj = {
			"name" :socket.name,
			msg : msg
		}

		socket.broadcast.emit("chatMsg",chatObj);
	});

	socket.on("typing" ,function(status){
		console.log(socket.name +" is typing")
		if(status){
			socket.broadcast.emit("typing",socket.name);
		}
	})
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});