import React, {useState, useRef, useEffect} from 'react';
import './NewChat.css';
const firebase = require('firebase');

const NewChat = ({userEmail, socket, newChatSubmitFn, goToChatFn}) => { 
	const [friendMail, setFriendMail] = useState('');
	const [message, setMessage] = useState('');
	const [newChatError, setNewChatError] = useState('');
	const checkUserExists = useRef(false);
	const checkChatExists = useRef(false);
	const messageRef = useRef();

	const onUserTyping = (type, event) => {
		switch(type){
			case 'email':
				setFriendMail(event.target.value);
				break;
			case 'message':
				setMessage(event.target.value);
				break;
			default:
		}
	}

	const buildDocKey = () => {
		return [userEmail, friendMail].sort().join(':');
	}

	const chatExists = async () => {
		const docKey = buildDocKey();
		await socket.emit('checkChatExists', {docKey: docKey}, ({result}) => {
			checkChatExists.current = result;
		});
		// const chat = await firebase.default
		// 				      .firestore()
		// 				      .collection('chats')
		// 				      .doc(docKey)
		// 				      .get();
		console.log("checkChatExists", Boolean(checkChatExists.current));
		return checkChatExists.current;
	}

	const userExists = async () => {
		await socket.emit('checkUserExists', {email: friendMail}, ({result}) => {
			checkUserExists.current = result;
		});
		// console.log("check");
		console.log("checkUserExists", Boolean(checkUserExists.current));
		return checkUserExists.current;
		// const usersSnapshot = await firebase.default
		// 								.firestore()
		// 								.collection('users')
		// 								.get()
		// const exists = usersSnapshot.docs
		// 					.map(doc => doc.data().email)
		// 					.includes(friendMail);
		// setServerError(!exists);
	}

	const onSubmitNewChat = async (event) => {
		event.preventDefault();
		const friendAlreadyExists = await userExists();
		if(friendAlreadyExists){
			const chatAlreadyExists = await chatExists();
			console.log("chatAlreadyExists", chatAlreadyExists);
			chatAlreadyExists ? goToChatFn(buildDocKey(), message) : newChatSubmitFn({ sendTo: friendMail, message: messageRef.current.value});
		} else {
			setNewChatError(`Entered e-mail doesn't exist.`);
		}
	}

	return (
		<article className="ba chatList b--black-10 shadow-5">
			<main className="pa4 black-80">
			  <div className="measure">
				  <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Friend's E-mail</label>
			        <input required onChange={(event) => onUserTyping('email', event)} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="message">Message</label>
			        <input required ref={messageRef} onChange={(event) => onUserTyping('message', event)} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="text" name="message"  id="message" />
			      </div>
			    </fieldset>
			    <span className="center red">{newChatError}</span>
			    <div className="flex submitNewChatDiv">
			      <input onClick={(event) => onSubmitNewChat(event)} className="b ph3 pv2 button br4 input-reset ba grow pointer f6 dib" type="button" value="Create Chat" />
			    </div>
			    {/*
			    	signInError 
			    	? <div><h5 className="error">{signInError}</h5></div>
			    	: null
			    */}
			  </div>
			</main>
		</article>
	);
}

export default NewChat;