import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {apiURL} from '../../services/config.js';
import './Login.css';

const Login = (props) => {
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const [signInError, setSignInError] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('chatAppToken');
		if(token)
			props.history.push('/');
	}, []);

	const onSubmitSignIn = (event) => {
		event.preventDefault();
		fetch(`${apiURL}/login`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: formData.email,
				password: formData.password
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.type === 'error')
				setSignInError(data.value)
			else{
				setSignInError('');
				localStorage.setItem('chatAppToken', data.value);
				props.history.push('/');
			}
		})
	};

	const onUserTyping = (type, event) => {
		switch (type){
			case 'email':
				setFormData({...formData, email: event.target.value});
				break;
			case 'password':
				setFormData({...formData, password: event.target.value});
				break;
			default:
				break;
		}
	};
	return (
		<article className="ba b--black-10 mv4  w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_in" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input required onChange={(event) => onUserTyping('email', event)} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input required onChange={(event) => onUserTyping('password', event)} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
			      </div>
			    </fieldset>
			    <div style={{textAlign: 'center'}}>
			      <input onClick={(event) => onSubmitSignIn(event)} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign In" />
			    </div>
			    {
			    	signInError 
			    	? <div><h5 className="error">{signInError}</h5></div>
			    	: null
			    }
			    <div style={{textAlign: "center", marginTop: '10px'}}>
				    <h5>Don't have an account?</h5>
				    <Link to="/signup" style={{textDecoration: "none", color: "black"}} className="b ph1 pv1 input-reset ba b--black bg-transparent grow pointer f6 dib">Sign Up Instead</Link>
				</div>
			  </div>
			</main>
		</article>
	);
}

export default Login;
