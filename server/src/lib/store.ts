import { Writable, writable } from 'svelte/store';
import type { User } from './user/user';

export interface stateType {
	authenticated: boolean;
	token: string;
	user: User;
}
export const defaultState: stateType = {
	authenticated: false,
	token: null,
	user: null
};

export default class Store {
	state: Writable<stateType>;
	constructor(initialState: stateType = defaultState) {
		this.state = writable({ ...initialState });
	}
	changeAuthenticationState = (token: string) => {
		this.state.update((obj) => {
			console.log('setting auth state ' + token);
			if (obj) {
				console.log('previous ' + JSON.stringify(obj));
			}
			//logger.info('setting auth state');
			return {
				...obj,
				authenticated: !obj.authenticated,
				token
			};
		});
	};
}
