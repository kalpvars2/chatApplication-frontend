import React from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
	return (
		<Router>
			<div id="routing-container">
				<Switch>
				    <Route exact path="/" component={Dashboard}></Route>
				    <Route path="/login" component={Login}></Route>
				    <Route path="/signup" component={SignUp}></Route>
				</Switch>
			</div>
		</Router>
	);
}

export default App;