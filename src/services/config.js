const apiURL = 
	process.env.NODE_ENV === 'production'
	? 'https://chatapplication-backend.herokuapp.com'
	: 'http://localhost:8000';
export {apiURL};