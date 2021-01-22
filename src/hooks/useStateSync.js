import {useState} from 'react';

export const useStateSync = (initialState = false) => {
	const [state, setState] = useState(initialState);
	return {state, setState};
};