import React, {useState, useEffect, createContext} from 'react';
import ChatList from '../ChatList/ChatList';
import ChatView from '../ChatView/ChatView';
import NewChat from '../NewChat/NewChat';
import {ReactComponent as ChatLogo} from '../../assets/svg/chat.svg';
import './Dashboard.css';
import io from 'socket.io-client';
import {apiURL} from '../../services/config.js';
export const submitMessageContext = createContext();
export const messageReadContext = createContext();

let socket;

const Dashboard = (props) => {
	const [selectedChat, setSelectedChat] = useState(null);
	const [newChatFormVisible, setNewChatFormVisible] = useState(false);
	const [email, setEmail] = useState('');
	const [chats, setChats] = useState([]);
	const [contactListVisible, setContactListVisible] = useState(true);
	const ENDPOINT = apiURL;

	useEffect(() => {
		const token = localStorage.getItem('chatAppToken');
		if(!token)
			props.history.push('/login');
		else{
			fetch(`${apiURL}/dashboard`, {
				method: 'get',
				headers: {
					'Content-Type' : 'application/json',
					'Authorization' : "Bearer " + token
				}
			})
			.then(response => response.json())
			.then(async (data) => {
				if(data.type === 'error' && data.value === "Invalid Token."){
					localStorage.removeItem('chatAppToken');
					props.history.push('/login');
				} else {
					setChats(data.value.chats);
					setEmail(data.value.email);
				}
			})
			setContactListVisible(true);
		}
		return async () => {
			await setChats([]);
			await setEmail('');
			await setSelectedChat(null);
			await setNewChatFormVisible(false);
		}
	}, []);

	useEffect(() => {
		if(email){
			socket = io(ENDPOINT);
			socket.emit('join', {email: email});
			socket.on('receiveUpdatedChats', ({updatedChats}) => setChats(updatedChats));
		}
	}, [email, ENDPOINT]);

	const newChatBtnClicked = () => {
		setNewChatFormVisible(true);
		setContactListVisible(false);
		setSelectedChat(null);
	};

	const selectChat = (chatIndex) => {
		setNewChatFormVisible(false);
		setContactListVisible(false);
		setSelectedChat(chatIndex);
		messageRead(chatIndex);
	};

	const buildDocKey = (friend) => {
		return [email, friend].sort().join(':');
	}
	
	const checkTextValid = (text) => {
		return text.replace(/\s/g, '');
	};

	const submitMessage = (msg) => {
		if(checkTextValid(msg)){
			if(socket){
				const receiverMail = chats[selectedChat].users.filter(user => user !== email)[0];
				const messageObject = {
					message: msg,
					sender: email,
					receiver: receiverMail
				};
				const chatObject = {
					docKey: [email, receiverMail].sort().join(":"),
					receiverHasRead: false,
					messages: [messageObject],
					users: [email, receiverMail]
				}
				socket.emit('submitMessage', {chatObject});
			}
		}
		const chatTextInput = document.getElementById("chatTextInput");
		if(chatTextInput !== null)
			chatTextInput.value = "";
	};

	const goToChat = (docKey, message) => {
		const chat = chats.filter(chat => chat.docKey === docKey)[0];
		const receiverMail = docKey.split(':').filter(user => user !== email)[0];
		const messageObject = {
			message: message,
			sender: email,
			receiver: docKey.split(':').filter(user => user !== email)[0]
		};
		const chatObject = {
			docKey: [email, receiverMail].sort().join(":"),
			receiverHasRead: false,
			messages: [messageObject],
			users: [email, receiverMail]
		};
		socket.emit('submitMessage', {chatObject});
		chats.filter((chat, index) => {
			if(chat.docKey === docKey)
				selectChat(index);
		});
	};

	useEffect(() => {
		if(selectedChat !== null && chats[chats.length-1].messages[chats[chats.length-1].messages.length-1].sender === email)
			selectChat(chats.length-1);
	}, [chats.length]);

	const newChatSubmit = (chatObj) => {
		const chatObject = {
			docKey: buildDocKey(chatObj.sendTo),
			users: [email, chatObj.sendTo],
			receiverHasRead: false,
			messages: [{
				message: chatObj.message,
				sender: email,
				receiver: chatObj.sendTo
			}]
		};
		if(socket){
			socket.emit('submitMessage', {chatObject});
			setNewChatFormVisible(false);
			selectChat(chats.length-1);
		};
	};

	const clickedChatWhereNotSender = (chatIndex) => chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email;

	const messageRead = (chatIndex = selectedChat) => {
		if(selectedChat === null)
			return;
		if(clickedChatWhereNotSender(chatIndex)){
			const docKey = buildDocKey(chats[chatIndex].users.filter(user => user !== email)[0]);
			if(socket){
				socket.emit('messageRead', {docKey});
			}
		}
	}

	if(window.innerWidth <= 650){
		if(contactListVisible){
			return (
			    <div className="dashboard">
					<div className="flex logoPart">
						<ChatLogo className="logo"/>
						<p className="f3 ml3 white">Vartalaap</p>
					</div>
					<div className="flex chatPart">
						<ChatList history={props.history}
						selectChat={selectChat}
						socket={socket}
						newChatBtnClicked={newChatBtnClicked}
						userEmail={email}
						setContactListVisible={setContactListVisible}
						chats={chats}
						selectedChatIndex={selectedChat}/>
					</div>
				</div>
			);
		} else {
			return (
				<div className="dashboard">
					<div className="flex logoPart">
						<ChatLogo className="logo"/>
						<p className="f3 ml3 white">Vartalaap</p>
					</div>
					<div className="flex chatPart">
						{
							newChatFormVisible ?
								<NewChat userEmail={email} socket={socket} goToChatFn={goToChat} newChatSubmitFn={newChatSubmit}/> :
								<submitMessageContext.Provider value = {submitMessage}>
									<messageReadContext.Provider value = {messageRead}>
										<ChatView id="chatViewContainer" className="chatViewComponent" setContactListVisible={setContactListVisible} user={email} chat={chats[selectedChat]} />
									</messageReadContext.Provider>
								</submitMessageContext.Provider>
						}
					</div>
				</div>
			);
		}
	} else {
		return (
			<div className="dashboard">
				<div className="flex logoPart">
					<ChatLogo className="logo"/>
					<p className="f3 ml3 white">Vartalaap</p>
				</div>
				<div className="flex chatPart">
					<ChatList history={props.history}
					selectChat={selectChat}
					newChatBtnClicked={newChatBtnClicked}
					userEmail={email}
					socket={socket}
					setContactListVisible={setContactListVisible}
					chats={chats}
					selectedChatIndex={selectedChat}/>
					{
						newChatFormVisible
						? <NewChat userEmail={email} socket={socket} goToChatFn={goToChat} newChatSubmitFn={newChatSubmit}/>
						: <submitMessageContext.Provider value = {submitMessage}>
							  <messageReadContext.Provider value = {messageRead}>
							  	  <ChatView id="chatViewContainer" className="chatViewComponent" setContactListVisible={setContactListVisible} user={email} chat={chats[selectedChat]} />
							  </messageReadContext.Provider>
						  </submitMessageContext.Provider>
					}
				</div>
			</div>
		);
	}
}

export default Dashboard;