import React, {useState, useEffect, createContext} from 'react';
import ChatList from '../ChatList/ChatList';
import ChatView from '../ChatView/ChatView';
import NewChat from '../NewChat/NewChat';
import {ReactComponent as ChatLogo} from '../../assets/svg/chat.svg';
import './Dashboard.css';
import io from 'socket.io-client';
export const submitMessageContext = createContext();
export const messageReadContext = createContext();
const firebase = require('firebase');

let socket;

const Dashboard = (props) => {
	const [selectedChat, setSelectedChat] = useState(null);
	const [newChatFormVisible, setNewChatFormVisible] = useState(false);
	const [email, setEmail] = useState('');
	const [chats, setChats] = useState([]);
	const [contactListVisible, setContactListVisible] = useState(true);
	const ENDPOINT = 'localhost:8000';

	useEffect(() => {
		const token = localStorage.getItem('chatAppToken');
		if(!token)
			props.history.push('/login');
		else{
			fetch("http://localhost:8000/dashboard", {
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
	}, [email]);

	const newChatBtnClicked = () => {
		setNewChatFormVisible(true);
		setContactListVisible(false);
		setSelectedChat(null);
		// console.log("newChatButtonClicked");
	};

	const selectChat = (chatIndex) => {
		// console.log("Select chat called with index : ", chatIndex);
		setNewChatFormVisible(false);
		setContactListVisible(false);
		setSelectedChat(chatIndex);
		messageRead(chatIndex);
	};

	// useEffect(() => {
	// 	if(selectedChat !== null)
	// 		messageRead();
	// }, [chats[selectedChat]]);

	const buildDocKey = (friend) => {
		return [email, friend].sort().join(':');
	}
	
	const checkTextValid = (text) => {
		return text.replace(/\s/g, '');
	};

	const submitMessage = (msg) => {
		// _ref = msgRef;
		// console.log(_ref.current);
		// const msg = msgRef.current === null ? msgRef : msgRef.current.value;
		if(checkTextValid(msg)){
			if(socket){
				const messageObject = {
					message: msg,
					sender: email,
					receiver: chats[selectedChat].users.filter(user => user !== email)[0]
				};
				socket.emit('submitMessage', {messageObject});
			}
			// firebase.default
			// 	.firestore()
			// 	.collection('chats')
			// 	.doc(docKey)
			// 	.update({
			// 		messages: firebase.default.firestore.FieldValue.arrayUnion({
			// 			sender: email,
			// 			message: msg
			// 		}),
			// 		receiverHasRead: false,
			// 		timestamp: Date.now()
			// 	})
		}
		const chatTextInput = document.getElementById("chatTextInput");
		if(chatTextInput !== null)
			chatTextInput.value = "";
		// if(_ref.current !== null)
		// 	_ref.current.value = "";
	}

	const goToChat = (docKey, message) => {
		const messageObject = {
			message: message,
			sender: email,
			receiver: docKey.split(':').filter(user => user !== email)[0]
		};
		socket.emit('submitMessage', {messageObject});
		chats.filter((chat, index) => {
			if(chat.docKey === docKey)
				selectChat(index);
		});
		// const usersInChat = docKey.split(':');
		// const chat = chats.find(_chat => usersInChat.every(_user => _chat.users.includes(_user)));
		// await selectChat(chats.indexOf(chat));
		// setTimeout(console.log(selectedChat), 2000);
		// setTimeout(submitMessage(message), 1000);
	};

	useEffect(() => {
		if(selectedChat !== null)
			selectChat(chats.length-1);
	}, [chats.length]);

	const newChatSubmit = async (chatObj) => {
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
			socket.emit('newChat', {chatObject});
		};
		// const messageObject = 
		// const docKey = buildDocKey(chatObj.sendTo);
		// await firebase.default
		// 	.firestore()
		// 	.collection('chats')
		// 	.doc(docKey)
		// 	.set({
		// 		receiverHasRead: false,
		// 		timestamp: Date.now(),
		// 		users: [email, chatObj.sendTo],
		// 		messages: [{
		// 			message: chatObj.message,
		// 			sender: email
		// 		}]
		// 	})
	};

	const clickedChatWhereNotSender = (chatIndex) => chats[chatIndex].messages[chats[chatIndex].messages.length - 1].sender !== email;

	const messageRead = (chatIndex = selectedChat) => {
		if(clickedChatWhereNotSender(chatIndex)){
			const docKey = buildDocKey(chats[chatIndex].users.filter(user => user !== email)[0]);
			if(socket){
				socket.emit('messageRead', {docKey});
			}
		}
	}


	// useEffect(() => {
	// 	firebase.default.auth().onAuthStateChanged(async _usr => {
	// 		if(!_usr)
	// 			props.history.push('/login');
	// 		else{
	// 			await firebase.default
	// 				.firestore()
	// 				.collection('chats')
	// 				.where('users', 'array-contains', _usr.email)
	// 				.onSnapshot(async result => {
	// 					const chats = result.docs.map(_doc => _doc.data());
	// 					await setEmail(_usr.email);
	// 					await setChats(chats);
	// 				})
	// 		}
	// 	});
	// 	return () => {
	// 		setChats([]);
	// 		setEmail('');
	// 		setSelectedChat(null);
	// 		setNewChatFormVisible(false);
	// 	}
	// }, []);

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