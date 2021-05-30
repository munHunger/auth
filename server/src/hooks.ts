import { logger } from '$lib/logger';
import { defaultState } from '$lib/store';
import { User } from '$lib/user/userBackend';
import * as cookie from 'cookie';
const auth_token = 'demo_token_for_example';
const userDetails = { name: 'Deb', age: 45 };

export async function handle({ request, render }) {
	const headers = request.headers;
	const cookies = cookie.parse(headers.cookie || '');
	request.locals.token = cookies['token'];
	if (request.locals.token) {
		let user = User.validate(request.locals.token);
		request.locals.authenticated = user !== undefined;
	}
	const response = await render(request);
	return {
		...response
	};
}

export const getSession = async (req) => {
	let initialState = { ...defaultState };
	let token = req.locals.token;
	if (token) {
		let user = User.validate(token);
		logger.info(`authenticated user=${user.email}`);
		initialState.authenticated = user !== undefined;
		initialState.token = token;
	}
	return initialState;
};
