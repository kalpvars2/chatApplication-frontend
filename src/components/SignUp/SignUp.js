import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';

const SignUp = (props) => {

	const [formData, setFormData] = useState({
		email: '',
		password: '',
		passwordConfirmation: ''
	});

	const [signUpError, setSignUpError] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('chatAppToken');
		if(token)
			props.history.push('/');
	}, []);

	const isFormValid = () => formData.password === formData.passwordConfirmation;

	const onSubmitSignUp = (event) => {
		event.preventDefault();
		if(!isFormValid()){
			setSignUpError('Passwords do not match. Try again!');
			return;
		}
		fetch("http://localhost:8000/register", {
			method: 'post',
			headers: {'Content-Type':'application/json'},
			body: JSON.stringify({
				email: formData.email,
				password: formData.password
			})
		})
		.then(response => response.json())
		.then(data => {
			if(data.type === "error")
				setSignUpError(data.value);
			else{
				setSignUpError('');
				localStorage.setItem('chatAppToken', data.value);
				props.history.push('/')
			}
		})
		.catch(err => setSignUpError(err))
	};

	const onUserTyping = (type, event) => {
		switch (type){
			case 'email':
				setFormData({...formData, email: event.target.value});
				break;
			case 'password':
				setFormData({...formData, password: event.target.value});
				break;
			case 'passwordConfirmation':
				setFormData({...formData, passwordConfirmation: event.target.value})
				break;
			default:
				console.log(formData.email);
		}
	};
	
	return (
		<article className="ba b--black-10 mv4
		 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Register</legend>
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
			        <input required onChange={(event) => onUserTyping('email', event)} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
			        <input required onChange={(event) => onUserTyping('password', event)} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" htmlFor="passwordConfirmation">Confirm Password</label>
			        <input required onChange={(event) => onUserTyping('passwordConfirmation', event)} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="passwordConfirmation"  id="passwordConfirmation" />
			      </div>
			    </fieldset>
			    <div style={{textAlign: 'center'}}>
			      <input onClick={(event) => onSubmitSignUp(event)} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign Up" />
			    </div>
			    {
			    	signUpError 
			    	? <div><h5 className="error">{signUpError}</h5></div>
			    	: null
			    }
			    <div style={{textAlign: "center", marginTop: '10px'}}>
				    <h5>Already have an account?</h5>
				    <Link to="/login" style={{textDecoration: "none", color: "black"}} className="b ph1 pv1 input-reset ba b--black bg-transparent grow pointer f6 dib">Sign In Instead</Link>
				</div>
			  </div>
			</main>
		</article>
	);
}

export default SignUp;
