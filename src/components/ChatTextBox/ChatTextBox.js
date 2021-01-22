import React, {useState, useRef, useContext} from 'react';
import {ReactComponent as SendMessageSVG} from '../../assets/svg/sendMessage.svg';
import {submitMessageContext, messageReadContext} from '../Dashboard/Dashboard';
import './ChatTextBox.css';

const ChatTextBox = () => {
	const [chatText, setChatText] = useState('');
	const chatRef = useRef();
	const submitMessage = useContext(submitMessageContext);
	const messageRead = useContext(messageReadContext);
	const onUserTyping = (event) => {
		(event.keyCode === 13) ? submitMessage(chatRef.current.value) : setChatText(event.target.value);
	};

	const userClickedInput = () => messageRead();

	return (
		<div className="chatInput">
			<input ref={chatRef} required onFocus={userClickedInput} onKeyUp={(event) => onUserTyping(event)} className="pa2 br4 input-reset ba bg-transparent w-100" id="chatTextInput" placeholder="Enter message..."/>
			<SendMessageSVG onClick={() => submitMessage(chatRef.current.value)} className="pointer grow sendMessage" />
		</div>
	);
}

export default ChatTextBox;