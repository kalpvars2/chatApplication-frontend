import React from 'react';
import './ChatList.css';
import {ReactComponent as NotificationSVG} from '../../assets/svg/notification.svg';

const ChatList = ( {history, socket, selectChat, setContactListVisible, newChatBtnClicked, userEmail, chats, selectedChatIndex}) => {
	const userIsSender = (chat) => chat.messages[chat.messages.length-1].sender === userEmail;

	const signOut = () => {
		localStorage.removeItem('chatAppToken');
		if(socket !== undefined)
			socket.emit('disconnects', {email: userEmail});
		history.push('/login');
	}

	if(chats.length > 0){
		return (
			<article className="ba chatList b--black-10 shadow-5">
				<main className="pa4 black-80">
				  <div className="measure">
					  <div className="flex buttonContainer">
					    <div>
					      <input onClick={newChatBtnClicked} className="b ph3 pv2 br4 input-reset ba button grow pointer f6 dib button" type="button" value="New Chat" />
					    </div>
					    <div>
					      <input onClick={signOut} className="b ph3 pv2 button br4 input-reset ba button grow pointer f6 dib button" type="button" value="Sign Out" />
					    </div>
					  </div>
					 <div className="messageList">
					    <ul className="list pl0">
						  {
						  	chats.map((chat, index) => {
						  		return (
						  			<li key={index} onClick={() => selectChat(index)} className="br3 flex pointer grow">
									    <div>
										    <div className="chatIcon f3 pt1">{chat.users.filter(_user => _user !== userEmail)[0][0]}</div>
										</div>
										<div className="chatContent">
											<div className="b">{chat.users.filter(_user => _user !== userEmail)[0].substring(0, 20)}</div>
											<div className="chatMessage">{chat.messages[chat.messages.length-1].message.substring(0, 30)+"..."}</div>
										</div>
										{
											(chat.receiverHasRead === false && !userIsSender(chat)) ?
												<NotificationSVG className="unreadMessage" /> :
												null
										}
									</li>
						  		)
						  	})
						  }
						</ul>
					</div>
				  </div>
				</main>
			</article>
		);
	}
	else
		return (
			<article className="ba chatList b--black-10 shadow-5">
				<main className="pa4 black-80">
				  <div className="measure">
					  <div className="flex buttonContainer">
					    <div>
					      <input onClick={newChatBtnClicked} className="b ph3 pv2 br4 input-reset ba button grow pointer f6 dib button" type="button" value="New Chat" />
					    </div>
					    <div>
					      <input onClick={signOut} className="b ph3 pv2 button br4 input-reset ba button grow pointer f6 dib button" type="button" value="Sign Out" />
					    </div>
					  </div>
				  </div>
				</main>
			</article>
		);
}

export default ChatList;