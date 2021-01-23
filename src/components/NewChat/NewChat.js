import React, {useState, useRef, useEffect} from 'react';
import './NewChat.css';
const firebase = require('firebase');

const NewChat = ({userEmail, socket, newChatSubmitFn, goToChatFn}) => { 
	const [friendMail, setFriendMail] = useState('');
	const [message, setMessage] = useState('');
    const [newChatError, setNewChatError] = useState('');
    const [checkUserExists, setCheckUserExists] = useState()
    const [checkChatExists, setCheckChatExists]  = useState()
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
		return new Promise((resolve, reject)=>{
			const docKey = buildDocKey();
			socket.emit('checkChatExists', {docKey: docKey}, ({result}) => {
				setCheckChatExists(result)
				resolve(result);
			});
		})
	}

	const userExists = () => {
		return new Promise((resolve, reject)=>{
			socket.emit('checkUserExists', {email: friendMail}, ({result}) => {
				setCheckUserExists(result)
				resolve(result)
			});
		})
	}

	const onSubmitNewChat = async (event) => {
		event.preventDefault();
        const friendAlreadyExists = await userExists();
		if(friendAlreadyExists){
            setNewChatError(``)
			const chatAlreadyExists = await chatExists();
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
			  </div>
			</main>
		</article>
	);
}

export default NewChat;