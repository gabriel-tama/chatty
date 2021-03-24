const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on("connection", (socket) => {
	console.log("we have a socket connection");

	socket.on("join", ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });

		if (error) return callback(error);
		socket.join(user.room);

		socket.emit("message", {
			user: "admin",
			text: `${user.name}, welcome to the room ${user.room}`,
		});
		socket.broadcast.to(user.room).emit("message", {
			user: "admin",
			text: `${user.name} has joined chat !`,
		});

		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
		console.log(getUsersInRoom(user.room));
		callback();
	});

	socket.on("sendMessage", (msg, callback) => {
		const user = getUser(socket.id);
		io.to(user.room).emit("message", { user: user.name, text: msg });
		io.to(user.room).emit("roomData", {
			room: user.room,
			users: getUsersInRoom(user.room),
		});
		callback();
	});
	socket.on("disconnect", () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit("message", {
				user: "admin",
				text: `${user.name} has left.`,
			});
			io.to(user.room).emit("roomData", {
				room: user.room,
				users: getUsersInRoom(user.room),
			});
			console.log(`user ${user.name} disconected`);
		}
	});
});

server.listen(PORT, () => {
	console.log(`Server running on PORT ${PORT}`);
});
