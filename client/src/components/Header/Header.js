import React from "react";
import ReactEmoji from "react-emoji";

import "./header.css";

const Header = ({ title }) => {
	return (
		<div className="header">
			<h1>
				{title} {ReactEmoji.emojify("🤔")}
			</h1>
		</div>
	);
};

export default Header;
