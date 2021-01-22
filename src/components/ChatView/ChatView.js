import React, {useEffect} from 'react';
import ChatTextBox from '../ChatTextBox/ChatTextBox';
import {ReactComponent as Back} from '../../assets/svg/back-button.svg';
import './ChatView.css';
import ReactEmoji from 'react-emoji';
const ChatView = ({setContactListVisible, user, chat}) => {

	useEffect(() => {
		if(chat !== undefined){
			const messageContainer = document.getElementById("messageBox");
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}, [chat]);

	if(chat === undefined){
		return (<main></main>);
	} else {
		return (
			<div className="outerMostContainer">
				<div>
					<article id="messageBox" className="ba b--black-10 messageBox shadow-5">
						<main className="pa2 black-80">
							<div>
								<div className="flex chatHeader ">
									<Back id="backButton" className="backButton pointer grow" onClick={() => setContactListVisible(true)}/>
									<div className="center b">{chat.users.filter(usr => usr !== user)[0]}</div>
								</div>
								<div className="messageContainer">
									{
										chat.messages.map((msg, index) => {
											return (
												<div key={index} className={msg.sender === user ? "right message" : "left message"}>
													<div><b>{msg.sender.split('@')[0]+":"}</b></div>
													<div>{ReactEmoji.emojify(msg.message)}</div>
												</div>
											);
										})
									}
								</div>
							</div>
						</main>
					</article>
					<article className="ba bg-transparent chatInput b--black-10 shadow-5">
						<main className="pa2 black-80">
							<ChatTextBox />
						</main>
					</article>
				</div>
			</div>
		);
	}
}

export default ChatView;