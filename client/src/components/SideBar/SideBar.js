import React from "react";

import "./sidebar.css";
import onlineIcon from "../../icons/onlineIcon.png";

const SideBar = ({ users }) => {
	return (
		<div className="sidebar">
			<h1 className="headbar">Currently online {users.length}</h1>
			<div>
				{users
					? users.map(({ name }) => (
							<div key={name} className="listonline">
								<img src={onlineIcon} alt="online" />
								<h3>{name}</h3>
							</div>
					  ))
					: null}
			</div>
		</div>
	);
};

export default SideBar;
