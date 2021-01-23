import React, {useState, useContext} from 'react';
import {ReactComponent as SendMessageSVG} from '../../assets/svg/sendMessage.svg';
import {submitMessageContext, messageReadContext} from '../Dashboard/Dashboard';
import './ChatTextBox.css';

const ChatTextBox = () => {
	const [chatText, setChatText] = useState('');
	const submitMessage = useContext(submitMessageContext);
	const messageRead = useContext(messageReadContext);
	const onUserTyping = (event) => {
		(event.keyCode === 13) ? submitMessage(chatText) : setChatText(event.target.value);
	};

	const userClickedInput = () => messageRead();

	return (
		<div className="chatInput">
			<input required onFocus={userClickedInput} onKeyUp={(event) => onUserTyping(event)} className="pa2 br4 input-reset ba bg-transparent w-100" id="chatTextInput" placeholder="Enter message..."/>
			<SendMessageSVG onClick={() => submitMessage(chatText)} className="pointer grow sendMessage" />
		</div>
	);
}

export default ChatTextBox;