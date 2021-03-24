import React, { useRef, useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";

import "./chat.css";
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import Header from "../Header/Header";
import SideBar from "../SideBar/SideBar";

let socket;
var connectionOptions = {
	"force new connection": true,
	reconnectionAttempts: "Infinity",
	timeout: 10000,
	transports: ["websocket"],
};

const Chat = ({ location }) => {
	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [users, setUsers] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const endpoint = "localhost:5000";

	useEffect(() => {
		const { name, room } = queryString.parse(location.search);

		socket = io(endpoint, connectionOptions);

		setName(name);
		setRoom(room);
		socket.emit("join", { name, room }, (error) => {
			if (error) {
				alert(error);
			}
		});

		return function cleanup() {
			socket.emit("disconnect", () => {});
			socket.off();
		};
	}, [endpoint, location.search]);

	useEffect(() => {
		socket.on("message", (msg) => {
			setMessages([...messages, msg]);
		});
		socket.on("roomData", ({ users }) => {
			setUsers(users);
		});
	}, [messages]);
	const sendMessage = (e) => {
		e.preventDefault();

		if (message) {
			socket.emit("sendMessage", message, () => setMessage(""));
		}
	};
	return (
		<>
			<Header title={`Room  ${room}  `} />
			<div className="outerContainer">
				<SideBar users={users} />
				<div className="container">
					<InfoBar room={room} />
					<Messages messages={messages} name={name} />
					<Input
						message={message}
						setMessage={setMessage}
						sendMessage={sendMessage}
					/>
				</div>
			</div>
		</>
	);
};

export default Chat;
